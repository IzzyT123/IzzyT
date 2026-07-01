"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { PostBlock } from "@/lib/post-tokens";

export type WordTiming = {
  readonly text: string;
  readonly start: number;
  readonly end: number;
};

const SPEEDS = [1, 1.25, 1.5, 1.75, 2] as const;

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Largest index whose start time is at or before `t` (the word being spoken). */
function findActive(words: readonly WordTiming[], t: number): number {
  let lo = 0;
  let hi = words.length - 1;
  let res = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (words[mid].start <= t) {
      res = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return res;
}

const BlockView = memo(function BlockView({
  blocks,
}: {
  blocks: readonly PostBlock[];
}) {
  return (
    <>
      {blocks.map((block, bi) => {
        const content = block.tokens.map((token, ti) => (
          <span key={token.i}>
            {ti > 0 ? " " : null}
            <span className="word-token" data-wi={token.i}>
              {token.text}
            </span>
          </span>
        ));

        if (block.type === "h2") {
          return (
            <h2
              key={bi}
              className="mt-8 font-[family-name:var(--font-fraunces)] text-xl font-semibold"
            >
              {content}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3 key={bi} className="mt-6 font-semibold">
              {content}
            </h3>
          );
        }
        return (
          <p key={bi} className="mt-4">
            {content}
          </p>
        );
      })}
    </>
  );
});

export function PostAudioReader({
  src,
  words,
  blocks,
}: {
  src: string;
  words: readonly WordTiming[] | null;
  blocks: readonly PostBlock[];
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const activeRef = useRef<number>(-1);
  const lastScrollRef = useRef<number>(0);
  const reducedRef = useRef<boolean>(false);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState<number>(1);

  const prefersReduced = usePrefersReducedMotion();
  useEffect(() => {
    reducedRef.current = prefersReduced;
  }, [prefersReduced]);

  const maybeScroll = useCallback((el: Element) => {
    if (reducedRef.current) return;
    const now = performance.now();
    if (now - lastScrollRef.current < 300) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.top < vh * 0.2 || rect.bottom > vh * 0.8) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
      lastScrollRef.current = now;
    }
  }, []);

  const applyActive = useCallback(
    (index: number) => {
      if (index === activeRef.current) return;
      const container = bodyRef.current;
      if (!container) return;
      if (activeRef.current >= 0) {
        container
          .querySelector(`[data-wi="${activeRef.current}"]`)
          ?.classList.remove("word-active");
      }
      if (index >= 0) {
        const el = container.querySelector(`[data-wi="${index}"]`);
        if (el) {
          el.classList.add("word-active");
          maybeScroll(el);
        }
      }
      activeRef.current = index;
    },
    [maybeScroll],
  );

  const syncActive = useCallback(
    (t: number) => {
      if (!words || words.length === 0) return;
      applyActive(findActive(words, t));
    },
    [words, applyActive],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const stopLoop = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const tick = () => {
      const t = audio.currentTime;
      setCurrentTime(t);
      syncActive(t);
      rafRef.current = requestAnimationFrame(tick);
    };

    const onPlay = () => {
      setPlaying(true);
      stopLoop();
      rafRef.current = requestAnimationFrame(tick);
    };
    const onPause = () => {
      setPlaying(false);
      stopLoop();
      setCurrentTime(audio.currentTime);
      syncActive(audio.currentTime);
    };
    const onEnded = () => {
      setPlaying(false);
      stopLoop();
    };
    const onDuration = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };
    const onSeeked = () => syncActive(audio.currentTime);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadedmetadata", onDuration);
    audio.addEventListener("durationchange", onDuration);
    audio.addEventListener("seeked", onSeeked);
    onDuration();

    return () => {
      stopLoop();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadedmetadata", onDuration);
      audio.removeEventListener("durationchange", onDuration);
      audio.removeEventListener("seeked", onSeeked);
    };
  }, [syncActive]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play();
    } else {
      audio.pause();
    }
  }, []);

  const onSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current;
      if (!audio) return;
      const t = Number(e.target.value);
      audio.currentTime = t;
      setCurrentTime(t);
      syncActive(t);
    },
    [syncActive],
  );

  const wordsEnd = words && words.length > 0 ? words[words.length - 1].end : 0;
  const effectiveDuration = duration > 0 ? duration : wordsEnd;

  const cycleSpeed = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = SPEEDS[(SPEEDS.indexOf(rate as (typeof SPEEDS)[number]) + 1) % SPEEDS.length];
    audio.playbackRate = next;
    setRate(next);
  }, [rate]);

  return (
    <div>
      <div className="mb-8 flex items-center gap-3 border border-border bg-surface px-3 py-3 sm:px-4">
        <audio ref={audioRef} src={src} preload="metadata" />
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause narration" : "Play narration"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition hover:opacity-90"
        >
          {playing ? (
            <Pause className="h-4 w-4" aria-hidden fill="currentColor" />
          ) : (
            <Play className="ml-0.5 h-4 w-4" aria-hidden fill="currentColor" />
          )}
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              Listen
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={effectiveDuration || 0}
            step={0.1}
            value={Math.min(currentTime, effectiveDuration || 0)}
            onChange={onSeek}
            aria-label="Seek narration"
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-border accent-foreground"
          />
        </div>

        <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted">
          {formatTime(currentTime)} / {formatTime(effectiveDuration)}
        </span>

        <button
          type="button"
          onClick={cycleSpeed}
          aria-label={`Playback speed ${rate}x`}
          className="shrink-0 border border-border px-2 py-1 font-mono text-[11px] tabular-nums text-muted transition hover:text-foreground"
        >
          {rate}x
        </button>
      </div>

      <div
        ref={bodyRef}
        className="text-base leading-relaxed text-foreground [&_h2]:font-[family-name:var(--font-fraunces)]"
      >
        <BlockView blocks={blocks} />
      </div>
    </div>
  );
}
