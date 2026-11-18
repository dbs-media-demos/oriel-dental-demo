/*
 * Who gets live 3D, and when. Tiny and three.js-free: every page imports this, phones included.
 *
 * Live 3D only on a big screen with a mouse, without reduced motion or Save-Data, in a browser that
 * can draw WebGL from a worker, on a machine whose processor keeps up. Anything else keeps the stills
 * that are in the server HTML. A scene that fails later calls `goStill()`: every scene on the page
 * fades back to its still. No proper graphics chip (`"gpu"`) keeps the stills for the rest of the
 * visit at once; running slow (`"slow"`: the frame watch or the CPU check) is counted once per page
 * load (sessionStorage) and keeps them only after 2 slow loads. On 18 Nov one slow start on a
 * refresh (the GPU's first draw) kept a fast PC on the stills for the whole tab.
 */

/** Same as the `pin` variant in globals.css. */
const DESK_3D = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
const KEY = "oriel:3d";
const SLOW = "oriel:3d-slow";
const SLOW_LIMIT = 2;
// This page load ran slow: the scenes after it on this page stay stills too (counted once per load)
let slowHere = false;
/** Fired on window when the 3D is off for this visit; mounted scenes fade back to their stills. */
export const FX_OFF = "oriel:3d-off";

export function stillOnly() {
  if (slowHere) return true;
  try {
    // only "gpu" counts under the old key: a tab's old "still" (one slow start) doesn't hold any more
    return sessionStorage.getItem(KEY) === "gpu" || Number(sessionStorage.getItem(SLOW) || 0) >= SLOW_LIMIT;
  } catch {
    return false;
  }
}

export function goStill(why: "gpu" | "slow", reason: string) {
  try {
    if (why === "gpu") sessionStorage.setItem(KEY, "gpu");
    else if (!slowHere) sessionStorage.setItem(SLOW, String(Number(sessionStorage.getItem(SLOW) || 0) + 1));
  } catch {}
  if (why === "slow") slowHere = true;
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
    if (best > CPU_LIMIT_MS) goStill("slow", "cpu");
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
