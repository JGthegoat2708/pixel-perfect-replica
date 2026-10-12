import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const diagnostics = [
  { at: 5, text: "Initialising neural core" },
  { at: 25, text: "Calibrating star charts" },
  { at: 45, text: "Activating particle field" },
  { at: 65, text: "Engine ignition sequence" },
  { at: 85, text: "All systems nominal" },
];

export function Loader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce ? 400 : 2600;
    const start = performance.now();
    let raf = 0;
    document.documentElement.style.overflow = "hidden";
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setPct(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          setDone(true);
          document.documentElement.style.overflow = "";
        }, 350);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          role="status"
          aria-label={`Loading ${pct}%`}
          className="zone-dark fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void"
          exit={{ opacity: 0, scale: 1.08, filter: "blur(12px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative flex h-40 w-40 items-center justify-center">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute rounded-full border border-glass-border"
                style={{ width: 70 + i * 40, height: 70 + i * 40 }}
                animate={{ rotate: i % 2 ? -360 : 360, scale: [1, 1.05, 1] }}
                transition={{ rotate: { duration: 6 + i * 2, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
              >
                <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary-glow shadow-glow" />
              </motion.span>
            ))}
            <motion.div
              className="h-12 w-12 rounded-full bg-gradient-primary shadow-glow"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <span className="absolute font-display text-sm font-bold text-primary-foreground">JG</span>
          </div>

          <p className="mt-10 font-display text-6xl font-bold tabular-nums text-glow">{pct}%</p>
          <ul className="mt-6 h-32 space-y-1.5 font-mono text-xs text-zone-muted">
            {diagnostics
              .filter((d) => pct >= d.at)
              .map((d) => (
                <motion.li key={d.text} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <span className="text-primary-glow">▸</span> {d.text}
                  <span className="ml-2 text-primary-glow">OK</span>
                </motion.li>
              ))}
          </ul>
          <div className="absolute bottom-12 h-px w-64 overflow-hidden bg-glass-border">
            <motion.div className="h-full bg-gradient-primary" style={{ width: `${pct}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
