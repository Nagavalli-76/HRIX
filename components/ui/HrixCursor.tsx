"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Desktop-only cursor: a small solid dot with a larger trailing ring.
 * Scales up over anything interactive, and elements marked
 * data-cursor="magnetic" (primary CTAs) gently pull the ring toward
 * themselves. Falls back to the native cursor entirely on touch devices
 * and when the visitor prefers reduced motion — this never replaces the
 * native pointer, only augments it, and never intercepts pointer events.
 */
export function HrixCursor() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 300, damping: 30, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 300, damping: 30, mass: 0.4 });

  const magnetTarget = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch || reduceMotion) return;
    setEnabled(true);
    document.body.classList.add("hrix-cursor-active");

    function onMove(e: PointerEvent) {
      const magnetic = (e.target as HTMLElement)?.closest<HTMLElement>('[data-cursor="magnetic"]');
      if (magnetic) {
        const rect = magnetic.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        x.set(cx + (e.clientX - cx) * 0.35);
        y.set(cy + (e.clientY - cy) * 0.35);
        magnetTarget.current = magnetic;
      } else {
        x.set(e.clientX);
        y.set(e.clientY);
        magnetTarget.current = null;
      }

      const interactive = (e.target as HTMLElement)?.closest("a, button, input, textarea, [role='button']");
      setHovering(Boolean(interactive));
    }

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.body.classList.remove("hrix-cursor-active");
    };
  }, [reduceMotion, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[300] h-1.5 w-1.5 rounded-full bg-violet-soft mix-blend-screen"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[300] rounded-full border border-violet/50 shadow-glow-violet mix-blend-screen"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: hovering ? 44 : 28,
          height: hovering ? 44 : 28,
          opacity: hovering ? 0.9 : 0.55,
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
