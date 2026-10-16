"use client";

import { useEffect, useRef } from "react";

/**
 * Hero artwork: keeps the ambient CSS float on the image while the wrapper
 * gently parallaxes toward the mouse for a subtle interactive feel.
 */
export function HeroImage() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    const MAX = 22; // px of travel at the screen edges

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetX = nx * MAX;
      targetY = ny * MAX;
    };

    const tick = () => {
      // ease toward the target so the motion lags slightly behind the cursor
      curX += (targetX - curX) * 0.05;
      curY += (targetY - curY) * 0.05;
      wrap.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="will-change-transform">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero.png"
        alt="Person relaxing with a phone surrounded by playful 3D shapes"
        className="animate-float relative mx-auto w-full max-w-2xl rounded-lg object-cover"
      />
    </div>
  );
}
