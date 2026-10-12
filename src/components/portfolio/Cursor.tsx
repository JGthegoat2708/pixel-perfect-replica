import { motion, useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { useEffect, useState } from "react";

function TrailDot({ x, y, i }: { x: MotionValue<number>; y: MotionValue<number>; i: number }) {
  const cfg = { stiffness: 260 - i * 26, damping: 22 + i * 2, mass: 0.4 + i * 0.12 };
  const sx = useSpring(x, cfg);
  const sy = useSpring(y, cfg);
  const size = 8 - i * 0.7;
  return (
    <motion.span
      className="pointer-events-none fixed left-0 top-0 z-[90] rounded-full bg-primary-glow"
      style={{ x: sx, y: sy, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, opacity: 0.5 - i * 0.05, filter: `blur(${i * 0.4}px)` }}
    />
  );
}

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<"idle" | "hover" | "card">("idle");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 32, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 32, mass: 0.5 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("orb-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-cursor='card']")) setMode("card");
      else if (t.closest("a, button, input, textarea, [data-cursor='hover']")) setMode("hover");
      else setMode("idle");
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("mouseover", over);
    return () => {
      document.documentElement.classList.remove("orb-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!enabled) return null;
  const scale = mode === "hover" ? 2.4 : mode === "card" ? 3.4 : 1;

  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <TrailDot key={i} x={x} y={y} i={i} />
      ))}
      <motion.div className="pointer-events-none fixed left-0 top-0 z-[95]" style={{ x: sx, y: sy }} aria-hidden>
        <motion.div
          className="-ml-3 -mt-3 h-6 w-6 rounded-full bg-gradient-primary shadow-glow"
          animate={{ scale, opacity: mode === "card" ? 0.35 : 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        <motion.div
          className="absolute -left-6 -top-6 h-12 w-12"
          animate={{ rotate: 360, scale: scale * 0.9 }}
          transition={{ rotate: { duration: 3, repeat: Infinity, ease: "linear" }, scale: { type: "spring", stiffness: 200, damping: 18 } }}
        >
          <span className="absolute left-1/2 top-0 h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="absolute bottom-1 left-1 h-1 w-1 rounded-full bg-primary-glow" />
          <span className="absolute bottom-2 right-0 h-1 w-1 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </>
  );
}
