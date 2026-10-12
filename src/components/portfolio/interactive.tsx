import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

/** Pulls its child toward the cursor with spring physics. */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 14, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 14, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** 3D tilt + glare + lift card. */
export function TiltCard({ children, className, max = 10 }: { children: ReactNode; className?: string; max?: number }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 180, damping: 18 });
  const gx = useTransform(mx, (v) => `${v * 100}%`);
  const gy = useTransform(my, (v) => `${v * 100}%`);
  const glare = useTransform([gx, gy], ([a, b]) => `radial-gradient(circle at ${a} ${b}, var(--glass-shine), transparent 55%)`);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  return (
    <motion.div
      data-cursor="card"
      className={cn("relative [transform-style:preserve-3d]", className)}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
    >
      {children}
      <motion.div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: glare }} />
    </motion.div>
  );
}

type BtnProps = {
  children: ReactNode;
  variant?: "primary" | "ghost";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  external?: boolean;
};

/** Magnetic button with spring ripple. */
export function GlowButton({ children, variant = "primary", href, onClick, type = "button", className, external }: BtnProps) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const base =
    "relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
  const styles =
    variant === "primary"
      ? "bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-[0_0_60px_-4px_var(--primary)]"
      : "glass text-zone hover:shadow-glow";
  const ripple = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((p) => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setRipples((p) => p.filter((q) => q.id !== id)), 700);
    onClick?.();
  };
  const inner = (
    <>
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="pointer-events-none absolute h-4 w-4 rounded-full bg-primary-foreground/50"
          style={{ left: r.x - 8, top: r.y - 8 }}
          initial={{ scale: 0, opacity: 0.7 }}
          animate={{ scale: 18, opacity: 0 }}
          transition={{ duration: 0.7 }}
        />
      ))}
      <span className="relative flex items-center gap-2">{children}</span>
    </>
  );
  return (
    <Magnetic>
      {href ? (
        <a href={href} onClick={ripple} className={cn(base, styles, className)} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
          {inner}
        </a>
      ) : (
        <button type={type} onClick={ripple} className={cn(base, styles, className)}>
          {inner}
        </button>
      )}
    </Magnetic>
  );
}

export function SectionHeading({ eyebrow, title, className }: { eyebrow: string; title: string; className?: string }) {
  return (
    <motion.div
      className={cn("mb-14", className)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 70, damping: 18 }}
    >
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-glow md:text-6xl">{title}</h2>
    </motion.div>
  );
}

export const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};
