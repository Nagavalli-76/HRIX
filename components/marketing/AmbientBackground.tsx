/**
 * Sitewide atmospheric background: two soft accent glows and a very faint
 * grid, fixed behind all content. Kept to CSS only (no canvas/WebGL) so it
 * costs nothing on scroll or on low-end mobile devices. Never intended to
 * reduce text contrast — opacity is kept low deliberately.
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-50 overflow-hidden bg-canvas"
    >
      <div className="absolute -top-1/4 left-1/2 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.08),transparent)]" />
      <div className="absolute bottom-0 right-0 h-[700px] w-[700px] translate-x-1/4 translate-y-1/4 rounded-full bg-[radial-gradient(closest-side,rgba(79,124,255,0.07),transparent)]" />
      <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:34px_34px]" />
    </div>
  );
}
