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
        className={`flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground transition hover:bg-foreground hover:text-background ${className ?? ""}`}
      >
        {playing ? (
          <Pause className="h-4 w-4" aria-hidden fill="currentColor" />
        ) : (
          <Play className="ml-0.5 h-4 w-4" aria-hidden fill="currentColor" />
        )}
      </button>
    </>
  );
}
