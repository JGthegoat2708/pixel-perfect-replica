import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { setLenis, spaceState } from "@/lib/scroll";
import { sections } from "@/lib/portfolio";

/** Lenis smooth scroll + scroll-driven background colour voyage. */
export function SmoothScroll() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    let raf = 0;

    const update = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      spaceState.progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

      // Interpolate between section colour stops placed at each section centre.
      const center = y + window.innerHeight / 2;
      const stops = sections
        .map((s) => {
          const el = document.getElementById(s.id);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { c: r.top + y + r.height / 2, zone: s.zone };
        })
        .filter(Boolean) as { c: number; zone: number }[];
      let from = stops[0]?.zone ?? 0;
      let to = from;
      let t = 0;
      for (let i = 0; i < stops.length - 1; i++) {
        const a = stops[i]!;
        const b = stops[i + 1]!;
        if (center >= a.c && center < b.c) {
          from = a.zone;
          to = b.zone;
          t = (center - a.c) / (b.c - a.c);
        }
      }
      const last = stops[stops.length - 1];
      if (last && center >= last.c) {
        from = to = last.zone;
      }
      const el = bgRef.current;
      if (el) {
        el.style.setProperty("--voyage-from", `var(--voyage-${from})`);
        el.style.setProperty("--voyage-to", `var(--voyage-${to})`);
        el.style.setProperty("--voyage-t", t.toFixed(4));
      }
    };

    if (!reduce) {
      lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.9 });
      setLenis(lenis);
      lenis.on("scroll", update);
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();

    const onMove = (e: PointerEvent) => {
      spaceState.mx = (e.clientX / window.innerWidth) * 2 - 1;
      spaceState.my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      setLenis(null);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <div ref={bgRef} aria-hidden className="voyage-bg fixed inset-0 z-0" />;
}
