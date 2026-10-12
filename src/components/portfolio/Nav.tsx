import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { sections } from "@/lib/portfolio";
import { scrollToId } from "@/lib/scroll";

export function Nav() {
  const [active, setActive] = useState("hero");
  const [shrunk, setShrunk] = useState(false);

  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <motion.header
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-3"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 3, type: "spring", stiffness: 80, damping: 16 }}
    >
      <motion.nav
        aria-label="Main"
        className="nav-glass flex items-center gap-1 rounded-full shadow-glow"
        animate={{ paddingTop: shrunk ? 6 : 10, paddingBottom: shrunk ? 6 : 10, paddingLeft: shrunk ? 8 : 14, paddingRight: shrunk ? 8 : 14 }}
        transition={{ type: "spring", stiffness: 160, damping: 22 }}
      >
        <button onClick={() => scrollToId("hero")} className="mr-2 hidden rounded-full bg-gradient-primary px-3 py-1.5 font-display text-xs font-bold text-primary-foreground sm:block" aria-label="Back to top">
          JG
        </button>
        <ul className="flex items-center">
          {sections.slice(1).map((s) => (
            <li key={s.id} className={s.id === "certifications" ? "hidden md:block" : ""}>
              <button
                onClick={() => scrollToId(s.id)}
                aria-current={active === s.id ? "true" : undefined}
                className="relative rounded-full px-2.5 py-1.5 text-[11px] font-medium tracking-wide opacity-80 transition-opacity hover:opacity-100 sm:px-3.5 sm:text-xs"
              >
                {active === s.id && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-primary/40" transition={{ type: "spring", stiffness: 300, damping: 28 }} />
                )}
                <span className="relative">{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </motion.nav>
    </motion.header>
  );
}
