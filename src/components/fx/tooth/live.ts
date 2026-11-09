import { goStill } from "@/components/fx/guard";

/*
 * The page's side of the 3D worker (worker.ts). Imported with `await import()` only after the checks
 * in fx/guard.ts pass, and it starts the worker, which alone downloads three.js.
 */

export type Size = { w: number; h: number; dpr: number };
export type ToWorker =
  | { type: "init"; id: string; kind: "tooth" | "scan"; canvas: OffscreenCanvas; size: Size }
  | { type: "call"; id: string; fn: string; args: unknown[] }
  | { type: "watch"; id: string }
  | { type: "dispose"; id: string };
export type FromWorker =
  | { type: "ready"; id: string }
  | { type: "fail"; id: string; reason: string }
  | { type: "verdict"; id: string; ok: boolean; fps: number; worst: number };

let worker: Worker | null = null;
const handlers = new Map<string, (m: FromWorker) => void>();
let seq = 0;

function getWorker() {
  if (!worker) {
    worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (e: MessageEvent<FromWorker>) => handlers.get(e.data.id)?.(e.data);
    worker.onerror = () => goStill("worker");
  }
  return worker;
}

export type LiveScene = {
  call: (fn: string, ...args: unknown[]) => void;
  /**
   * The canvas has faded in: judge the first 2 s of frames drawn while `running()` (on screen, tab
   * showing). The worker times its frames; this thread's own frames over the same time count too.
   */
  watch: (running: () => boolean) => void;
  dispose: () => void;
};

export function mount(
  kind: "tooth" | "scan",
  canvas: HTMLCanvasElement,
  size: Size,
  on: { ready: () => void; settled?: () => void },
): LiveScene {
  const id = `${kind}-${++seq}`;
  const w = getWorker();
  const off = canvas.transferControlToOffscreen();
  let page = { raf: 0, prev: 0, run: 0, frames: 0 };
  const stopPage = () => {
    cancelAnimationFrame(page.raf);
    page.raf = 0;
  };

  handlers.set(id, (m) => {
    if (m.type === "ready") {
      performance.mark(`fx:${kind}:ready`);
      on.ready();
    } else if (m.type === "fail") {
      performance.mark(`fx:${kind}:fail`, { detail: m.reason });
      goStill(`${kind}: ${m.reason}`);
      on.settled?.();
    } else if (m.type === "verdict") {
      stopPage();
      const pageFps = page.run > 0 ? (page.frames * 1000) / page.run : 60;
      const ok = m.ok && pageFps >= 45;
      performance.mark(`fx:${kind}:verdict`, { detail: { ok, fps: m.fps, worst: m.worst, pageFps: Math.round(pageFps) } });
      if (!ok) goStill(`${kind}: ${m.fps} fps, worst frame ${m.worst} ms, page ${Math.round(pageFps)} fps`);
      on.settled?.();
    }
  });
  w.postMessage({ type: "init", id, kind, canvas: off, size } satisfies ToWorker, [off]);

  return {
    call(fn, ...args) {
      w.postMessage({ type: "call", id, fn, args } satisfies ToWorker);
    },
    watch(running) {
      w.postMessage({ type: "watch", id } satisfies ToWorker);
      const tick = (now: number) => {
        if (running() && page.prev) {
          page.run += now - page.prev;
          page.frames++;
        }
        page.prev = running() ? now : 0;
        page.raf = requestAnimationFrame(tick);
      };
      page.raf = requestAnimationFrame(tick);
    },
    dispose() {
      stopPage();
      page = { raf: 0, prev: 0, run: 0, frames: 0 };
      handlers.delete(id);
      w.postMessage({ type: "dispose", id } satisfies ToWorker);
      // the last scene gone (a page without 3D, or the stills for good): the worker and its contexts go too
      if (!handlers.size && worker === w) {
        const doomed = w;
        worker = null;
        window.setTimeout(() => doomed.terminate(), 1000);
      }
    },
  };
}
