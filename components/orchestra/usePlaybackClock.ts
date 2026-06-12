"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type PlaybackClock = {
  elapsedMs: number;
  playing: boolean;
  speed: number;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
};

export function usePlaybackClock(): PlaybackClock {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const speedRef = useRef(speed);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    if (!playing) return;
    let rafId: number;
    let last = performance.now();
    const tick = (now: number) => {
      setElapsedMs((prev) => prev + (now - last) * speedRef.current);
      last = now;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [playing]);

  const play = useCallback(() => setPlaying(true), []);
  const pause = useCallback(() => setPlaying(false), []);
  const reset = useCallback(() => {
    setPlaying(false);
    setElapsedMs(0);
  }, []);

  return { elapsedMs, playing, speed, play, pause, reset, setSpeed };
}
