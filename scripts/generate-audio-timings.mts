/**
 * Generate per-word timings for a narrated blog post using ElevenLabs Forced
 * Alignment, so the post page can highlight each word as the audio plays.
 *
 * Usage (PowerShell):
 *   $env:ELEVENLABS_API_KEY="sk_..."; npm run gen:timings
 *   $env:ELEVENLABS_API_KEY="sk_..."; npm run gen:timings -- <slug>
 *
 * Runs on Node 22.18+ (native TypeScript type stripping), no extra deps.
 * Reads the post's audio + transcript, calls Forced Alignment, and writes
 * `public/<post.audio.words>` as an array of { text, start, end } in reading
 * order. The web app never calls ElevenLabs; only this committed JSON is used.
 */

import { readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { site } from "../src/data/site.ts";
import { tokenizePost, type TranscriptToken } from "../src/lib/post-tokens.ts";

const FORCED_ALIGNMENT_URL = "https://api.elevenlabs.io/v1/forced-alignment";

type ApiChar = { text?: string; start: number; end: number };
type CharTime = { ch: string; start: number; end: number };
type WordTiming = { text: string; start: number; end: number };

function fail(message: string): never {
  console.error(`\n[gen:timings] ${message}\n`);
  process.exit(1);
}

const round = (n: number): number => Math.round(n * 1000) / 1000;

/**
 * Flatten the API character stream to a per-character sequence with timings,
 * dropping whitespace. This makes mapping resilient to whether the API includes
 * spaces and to minor whitespace differences, since forced alignment does not
 * normalize the transcript we send.
 */
function flattenChars(apiChars: ApiChar[]): CharTime[] {
  const seq: CharTime[] = [];
  for (const c of apiChars) {
    for (const ch of c.text ?? "") {
      if (/\s/.test(ch)) continue;
      seq.push({ ch, start: c.start, end: c.end });
    }
  }
  return seq;
}

function mapTokensDirect(
  transcript: string,
  tokens: readonly TranscriptToken[],
  apiChars: ApiChar[],
): WordTiming[] | null {
  if (apiChars.length !== transcript.length) return null;
  // Spot-check that the character stream matches the transcript 1:1.
  for (let i = 0; i < transcript.length; i += Math.max(1, Math.floor(transcript.length / 50))) {
    const txt = apiChars[i]?.text ?? "";
    if (txt !== transcript[i]) return null;
  }
  return tokens.map((t) => ({
    text: t.text,
    start: round(apiChars[t.start].start),
    end: round(apiChars[t.end - 1].end),
  }));
}

/** Fallback: consume matching non-whitespace characters in order per token. */
function mapTokensBySequence(
  tokens: readonly TranscriptToken[],
  apiChars: ApiChar[],
): { timings: WordTiming[]; unmatched: number } {
  const seq = flattenChars(apiChars);
  let p = 0;
  let lastEnd = 0;
  let unmatched = 0;
  const timings: WordTiming[] = [];

  for (const token of tokens) {
    const wanted = [...token.text].filter((ch) => !/\s/.test(ch));
    if (wanted.length === 0) {
      timings.push({ text: token.text, start: round(lastEnd), end: round(lastEnd) });
      continue;
    }
    let matched = 0;
    let start: number | null = null;
    let end: number | null = null;
    let guard = 0;
    while (p < seq.length && matched < wanted.length && guard < wanted.length + 8) {
      const want = wanted[matched];
      const got = seq[p];
      if (got.ch === want || got.ch.toLowerCase() === want.toLowerCase()) {
        if (matched === 0) start = got.start;
        end = got.end;
        matched += 1;
        p += 1;
      } else {
        p += 1;
        guard += 1;
      }
    }
    if (start === null || end === null || matched < wanted.length) {
      unmatched += 1;
      timings.push({ text: token.text, start: round(lastEnd), end: round(lastEnd) });
    } else {
      lastEnd = end;
      timings.push({ text: token.text, start: round(start), end: round(end) });
    }
  }
  return { timings, unmatched };
}

/** Clamp to monotonic non-decreasing times so playback highlighting is stable. */
function enforceMonotonic(timings: WordTiming[]): WordTiming[] {
  let prev = 0;
  return timings.map((t) => {
    const start = Math.max(t.start, prev);
    const end = Math.max(t.end, start);
    prev = start;
    return { text: t.text, start, end };
  });
}

async function main(): Promise<void> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) fail("Set ELEVENLABS_API_KEY in your environment.");

  const slug = process.argv[2] ?? "distributing-intelligence";
  const post = site.posts.items.find((p) => p.slug === slug);
  if (!post) fail(`No post found with slug "${slug}".`);
  if (!post.audio?.src) fail(`Post "${slug}" has no audio.src.`);
  if (!post.audio.words) fail(`Post "${slug}" has no audio.words output path.`);

  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const audioPath = path.join(root, "public", post.audio.src.replace(/^\/+/, ""));
  const outPath = path.join(root, "public", post.audio.words.replace(/^\/+/, ""));

  try {
    await access(audioPath);
  } catch {
    fail(`Audio file not found at ${audioPath}.`);
  }

  const { transcript, tokens } = tokenizePost(post.title, post.body);
  console.log(`[gen:timings] Post "${slug}": ${tokens.length} tokens, ${transcript.length} chars.`);

  const audioBuf = await readFile(audioPath);
  const form = new FormData();
  form.append(
    "file",
    new Blob([new Uint8Array(audioBuf)], { type: "audio/mpeg" }),
    path.basename(audioPath),
  );
  form.append("text", transcript);

  console.log("[gen:timings] Calling ElevenLabs Forced Alignment...");
  const res = await fetch(FORCED_ALIGNMENT_URL, {
    method: "POST",
    headers: { "xi-api-key": apiKey },
    body: form,
  });
  if (!res.ok) {
    fail(`ElevenLabs returned ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as { characters?: ApiChar[]; loss?: number };
  const apiChars = data.characters;
  if (!Array.isArray(apiChars) || apiChars.length === 0) {
    fail("Forced Alignment response had no `characters` array.");
  }

  let timings = mapTokensDirect(transcript, tokens, apiChars);
  if (timings) {
    console.log("[gen:timings] Mapped via direct 1:1 character offsets.");
  } else {
    const result = mapTokensBySequence(tokens, apiChars);
    timings = result.timings;
    console.log(
      `[gen:timings] Mapped via sequence matcher (${result.unmatched} token(s) approximated).`,
    );
  }

  const finalTimings = enforceMonotonic(timings);
  await writeFile(outPath, `${JSON.stringify(finalTimings)}\n`, "utf8");

  const last = finalTimings[finalTimings.length - 1];
  console.log(
    `[gen:timings] Wrote ${finalTimings.length} timings to ${outPath} (ends ~${last?.end ?? 0}s).`,
  );
  if (typeof data.loss === "number") {
    console.log(`[gen:timings] Alignment loss: ${data.loss} (lower is better).`);
  }
}

main().catch((err) => fail(err instanceof Error ? err.stack ?? err.message : String(err)));
