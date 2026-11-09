/*
 * Who gets live 3D, and when. Tiny and three.js-free: every page imports this, phones included.
 *
 * Live 3D only on a big screen with a mouse, without reduced motion or Save-Data, in a browser that
 * can draw WebGL from a worker, on a machine whose processor keeps up. Anything else keeps the stills
 * that are in the server HTML. A scene that fails later (no proper graphics chip, or under ~45 fps in
 * its first 2 s) calls `goStill()`: every scene fades back to its still and stays that way for the
 * rest of the visit (sessionStorage).
 */

/** Same as the `pin` variant in globals.css. */
const DESK_3D = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
const KEY = "oriel:3d";
/** Fired on window when the 3D is off for this visit; mounted scenes fade back to their stills. */
export const FX_OFF = "oriel:3d-off";

export function stillOnly() {
  try {
    return sessionStorage.getItem(KEY) === "still";
  } catch {
    return false;
  }
}

export function goStill(reason: string) {
  try {
    sessionStorage.setItem(KEY, "still");
  } catch {}
  performance.mark("fx:still", { detail: reason });
  window.dispatchEvent(new CustomEvent(FX_OFF, { detail: reason }));
}

export function canLive3D() {
  if (stillOnly()) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (!window.matchMedia(DESK_3D).matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches || conn?.saveData) return false;
  return typeof Worker !== "undefined" && typeof OffscreenCanvas !== "undefined" && "transferControlToOffscreen" in HTMLCanvasElement.prototype;
}

export const idle = (timeout: number) =>
  new Promise<void>((r) => (window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 120)))(() => r(), { timeout }));

export const afterLoad = () =>
  new Promise<void>((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", () => r(), { once: true })));

/**
 * A short, fixed piece of arithmetic like the scenes' own (about 1.6 ms on the studio's desktop, 7 ms
 * with Chrome's 4x CPU slowdown), timed a few times in idle moments; the fastest run counts. A
 * processor more than ~2.8x slower than that desktop keeps the stills: on it the page itself needs
 * every bit of the main thread.
 */
const CPU_LIMIT_MS = 4.5;
let cpu: Promise<boolean> | undefined;
export const cpuFast = () =>
  (cpu ??= (async () => {
    let best = Infinity;
    for (let k = 0; k < 5; k++) {
      await idle(500);
      const t = performance.now();
      let s = 0;
      for (let i = 0; i < 40000; i++) {
        const x = (i % 97) * 0.031 - 1.5;
        const y = ((i * 7) % 89) * 0.029 - 1.3;
        const z = ((i * 13) % 83) * 0.027 - 1.1;
        s += Math.hypot(x / 0.8, y / 1.1, z / 0.7) - Math.sqrt(Math.abs(Math.sin(x * y) + z * z));
      }
      best = Math.min(best, performance.now() - t + (s > 1e12 ? 1 : 0));
    }
    performance.mark("fx:cpu", { detail: Math.round(best * 10) / 10 });
    if (best > CPU_LIMIT_MS) goStill("cpu");
    return best <= CPU_LIMIT_MS;
  })());

/**
 * The hero warms up alone; scenes further down start warming when it has passed its frame watch (or
 * isn't there), so two scenes never build at once and nothing builds when the visitor reaches it.
 */
let first: Promise<void> | null = null;
export function holdFirst() {
  let release!: () => void;
  first = new Promise<void>((r) => (release = r));
  return release;
}
export const afterFirst = () => first ?? Promise.resolve();
