"use client";

import { useRef, useState, type PointerEvent } from "react";

/**
 * Decorative 3D images scattered across the page. Each image floats slowly on
 * its own and can be dragged around with the mouse or touch. The layer itself
 * ignores pointer events so it never blocks the page; only the images react.
 */

interface DecorItem {
  src: string;
  alt: string;
  size: number;
  left: string;
  top: string;
  duration: string;
  delay: string;
}

const ITEMS: DecorItem[] = [
  { src: "/hover/decor-1.png", alt: "", size: 168, left: "3%", top: "6%", duration: "21s", delay: "0s" },
  { src: "/hover/decor-2.png", alt: "", size: 136, left: "86%", top: "20%", duration: "25s", delay: "-4s" },
  { src: "/hover/decor-3.png", alt: "", size: 152, left: "5%", top: "44%", duration: "19s", delay: "-8s" },
  { src: "/hover/decor-4.png", alt: "", size: 128, left: "88%", top: "58%", duration: "27s", delay: "-2s" },
  { src: "/hover/decor-5.png", alt: "", size: 180, left: "7%", top: "76%", duration: "23s", delay: "-11s" },
  { src: "/hover/decor-6.png", alt: "", size: 144, left: "85%", top: "90%", duration: "20s", delay: "-6s" },
];

export function FloatingDecor() {
  const layerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ index: number; offsetX: number; offsetY: number } | null>(
    null,
  );
  const [positions, setPositions] = useState(
    ITEMS.map((item) => ({ left: item.left, top: item.top })),
  );
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  function handlePointerDown(event: PointerEvent<HTMLImageElement>, index: number) {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    dragState.current = {
      index,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
    setDraggingIndex(index);
    element.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLImageElement>, index: number) {
    const drag = dragState.current;
    const layer = layerRef.current;
    if (!drag || drag.index !== index || !layer) {
      return;
    }

    const bounds = layer.getBoundingClientRect();
    const left = event.clientX - bounds.left - drag.offsetX;
    const top = event.clientY - bounds.top - drag.offsetY;

    setPositions((current) =>
      current.map((position, i) =>
        i === index ? { left: `${left}px`, top: `${top}px` } : position,
      ),
    );
  }

  function handlePointerUp(event: PointerEvent<HTMLImageElement>, index: number) {
    if (dragState.current?.index === index) {
      dragState.current = null;
      setDraggingIndex(null);
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 hidden overflow-hidden md:block"
    >
      {ITEMS.map((item, index) => {
        const isDragging = draggingIndex === index;

        return (
          <img
            key={item.src}
            src={item.src}
            alt={item.alt}
            draggable={false}
            onPointerDown={(event) => handlePointerDown(event, index)}
            onPointerMove={(event) => handlePointerMove(event, index)}
            onPointerUp={(event) => handlePointerUp(event, index)}
            onPointerCancel={(event) => handlePointerUp(event, index)}
            style={{
              left: positions[index].left,
              top: positions[index].top,
              width: item.size,
              height: item.size,
              animationDuration: item.duration,
              animationDelay: item.delay,
            }}
            className={`pointer-events-auto absolute select-none object-contain drop-shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition-transform ${
              isDragging
                ? "z-30 scale-105 cursor-grabbing"
                : "animate-drift cursor-grab hover:scale-105"
            }`}
          />
        );
      })}
    </div>
  );
}
