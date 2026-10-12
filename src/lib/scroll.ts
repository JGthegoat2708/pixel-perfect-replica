import type Lenis from "lenis";

// Shared mutable state read by the 3D scene each frame (no React re-renders).
export const spaceState = { progress: 0, mx: 0, my: 0 };

let lenisRef: Lenis | null = null;
export function setLenis(l: Lenis | null) {
  lenisRef = l;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisRef) lenisRef.scrollTo(el, { offset: -20, duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
}
