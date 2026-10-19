"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export function BlogPlayButton({
  src,
  title,
  className,
}: {
  src: string;
  title: string;
  className?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onStop = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onStop);
    audio.addEventListener("ended", onStop);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onStop);
      audio.removeEventListener("ended", onStop);
    };
  }, []);

  const toggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play();
    } else {
      audio.pause();
    }
  }, []);

  return (
    <>
      <audio ref={audioRef} src={src} preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause "${title}"` : `Listen to "${title}"`}
        className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition ${
          playing
            ? "border-accent bg-accent text-accent-foreground"
            : "border-border bg-surface text-foreground hover:border-accent hover:bg-accent hover:text-accent-foreground"
        } ${className ?? ""}`}
      >
        {playing ? (
          <>
            <Pause className="h-3 w-3" aria-hidden fill="currentColor" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <Play className="h-3 w-3" aria-hidden fill="currentColor" />
            <span>Listen</span>
          </>
        )}
      </button>
    </>
  );
}
