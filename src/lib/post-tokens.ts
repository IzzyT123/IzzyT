/**
 * Shared, deterministic tokenizer for narrated posts.
 *
 * Both the timing-generation script and the on-page reader call this with the
 * same inputs, so the word order they produce is identical. That is what makes
 * word-by-word highlighting line up exactly: `words.json[i]` always refers to
 * the token whose global index is `i` here.
 *
 * The narration starts with the title, so title tokens come first and body
 * tokens follow. `titleTokenCount` lets the reader (which renders only the
 * body) offset into the global timing array correctly.
 */

export type WordToken = {
  /** Global index across title + body, matching the timings array. */
  readonly i: number;
  readonly text: string;
};

export type PostBlock = {
  readonly type: "p" | "h2" | "h3";
  readonly tokens: readonly WordToken[];
};

export type TranscriptToken = {
  readonly i: number;
  readonly text: string;
  /** Char offset (inclusive) of this token within `transcript`. */
  readonly start: number;
  /** Char offset (exclusive) of this token within `transcript`. */
  readonly end: number;
};

export type TokenizedPost = {
  /** Plain-text narration script (title first), tokens joined by single spaces. */
  readonly transcript: string;
  /** Every token (title + body) with its char range in `transcript`. */
  readonly tokens: readonly TranscriptToken[];
  /** Number of leading tokens that belong to the title. */
  readonly titleTokenCount: number;
  /** Body content grouped into renderable blocks; tokens carry global indices. */
  readonly blocks: readonly PostBlock[];
};

const WHITESPACE = /\s+/;

function stripInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\([^)]+\)/g, "$1");
}

function splitWords(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  return trimmed.split(WHITESPACE);
}

export function tokenizePost(title: string, body: string): TokenizedPost {
  const blocks: PostBlock[] = [];
  const tokens: TranscriptToken[] = [];
  let transcript = "";
  let globalIndex = 0;

  const pushToken = (text: string): TranscriptToken => {
    if (transcript.length > 0) transcript += " ";
    const start = transcript.length;
    transcript += text;
    const token: TranscriptToken = {
      i: globalIndex,
      text,
      start,
      end: transcript.length,
    };
    tokens.push(token);
    globalIndex += 1;
    return token;
  };

  for (const word of splitWords(stripInline(title))) {
    pushToken(word);
  }
  const titleTokenCount = globalIndex;

  for (const raw of body.split(/\n{2,}/)) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    let type: PostBlock["type"] = "p";
    let text = trimmed;
    if (trimmed.startsWith("### ")) {
      type = "h3";
      text = trimmed.slice(4);
    } else if (trimmed.startsWith("## ")) {
      type = "h2";
      text = trimmed.slice(3);
    }

    text = stripInline(text).replace(/\s+/g, " ").trim();
    const words = splitWords(text);
    if (words.length === 0) continue;

    const blockTokens: WordToken[] = words.map((word) => {
      const token = pushToken(word);
      return { i: token.i, text: token.text };
    });
    blocks.push({ type, tokens: blockTokens });
  }

  return { transcript, tokens, titleTokenCount, blocks };
}
