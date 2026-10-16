"use client";

import { useEffect, useRef } from "react";

/** Hero background video, rotated and dimmed, playing at a slowed-down rate. */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 0.4;
    }
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 aspect-square min-h-full min-w-full max-w-none -translate-x-1/2 -translate-y-1/2 rotate-90 object-cover opacity-10"
    >
      <source src="/bg/hero-bg.mp4" type="video/mp4" />
    </video>
  );
}
