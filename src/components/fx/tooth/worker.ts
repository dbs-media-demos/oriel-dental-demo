/// <reference lib="webworker" />
import { createTooth, type ToothScene } from "./scene";
import { createScan, type ScanScene } from "./scan";
import type { ToWorker, FromWorker } from "./live";

/*
 * The 3D's own thread. Both scenes (the hero's room and the exam's scan) are built and drawn here on
 * OffscreenCanvases, so meshing the teeth, baking the light, compiling shaders and every frame stay off
 * the page's thread: scrolling and the page's own motion never wait for the 3D. The page sends the
 * scroll, the pointer, sizes and visibility; this sends back "ready" (the first frame is on the
 * hidden canvas) and the verdict of the frame watch.
 */

const post = (m: FromWorker) => (self as unknown as DedicatedWorkerGlobalScope).postMessage(m);

/** A graphics chip that can carry the scene: hardware WebGL 2, not a software rasteriser. */
function gpuOk() {
  const gl = new OffscreenCanvas(1, 1).getContext("webgl2", { failIfMajorPerformanceCaveat: true, powerPreference: "high-performance" });
  if (!gl) return false;
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const name = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  gl.getExtension("WEBGL_lose_context")?.loseContext();
  return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
}
let gpu: boolean | undefined;

/** The first 2 s of frames on screen: about 45 fps on average, and no frame over 100 ms. */
const WATCH_MS = 2000;
const MIN_FPS = 45;
const MAX_FRAME = 100;
const WARM = 4; // first frames after (re)starting the loop are not judged

type Watch = { on: boolean; done: boolean; prev: number; skip: number; run: number; frames: number; worst: number };

const scenes = new Map<string, { scene: ToothScene | ScanScene; watch: Watch }>();
const dead = new Set<string>();
/** Calls that arrive while a scene is still being built, replayed in order once it's there. */
const early = new Map<string, ToWorker[]>();

function onFrame(id: string, now: number, fresh: boolean) {
  const w = scenes.get(id)?.watch;
  if (!w || !w.on || w.done) return;
  if (fresh || !w.prev) {
    w.prev = now;
    w.skip = WARM;
    return;
  }
  const d = now - w.prev;
  w.prev = now;
  if (w.skip > 0) {
    w.skip--;
    return;
  }
  w.run += d;
  w.frames++;
  w.worst = Math.max(w.worst, d);
  if (w.worst > MAX_FRAME || w.run >= WATCH_MS) {
    w.done = true;
    const fps = (w.frames * 1000) / w.run;
    post({ type: "verdict", id, ok: w.worst <= MAX_FRAME && fps >= MIN_FPS, fps: Math.round(fps), worst: Math.round(w.worst) });
  }
}

self.onmessage = (e: MessageEvent<ToWorker>) => void handle(e.data);

async function handle(m: ToWorker) {
  if (m.type === "init") {
    try {
      gpu ??= gpuOk();
      if (!gpu) throw new Error("no hardware WebGL");
      const watch: Watch = { on: false, done: false, prev: 0, skip: WARM, run: 0, frames: 0, worst: 0 };
      const opts = { size: m.size, onFrame: (now: number, fresh: boolean) => onFrame(m.id, now, fresh) };
      const scene = m.kind === "tooth" ? await createTooth(m.canvas, opts) : await createScan(m.canvas, opts);
      if (dead.has(m.id)) return scene.dispose();
      scenes.set(m.id, { scene, watch });
      early.get(m.id)?.forEach(handle);
      early.delete(m.id);
      // the hidden frame has been handed to the compositor by the next frame
      requestAnimationFrame(() => post({ type: "ready", id: m.id }));
    } catch (err) {
      post({ type: "fail", id: m.id, reason: String((err as Error)?.message ?? err) });
    }
    return;
  }
  if (m.type === "dispose") {
    dead.add(m.id);
    early.delete(m.id);
    scenes.get(m.id)?.scene.dispose();
    scenes.delete(m.id);
    return;
  }
  const s = scenes.get(m.id);
  if (!s) {
    if (!dead.has(m.id)) early.set(m.id, [...(early.get(m.id) ?? []), m]);
    return;
  }
  if (m.type === "watch") {
    s.watch.on = true;
    return;
  }
  // a call on the scene: scroll, pointer, clip, intro, resize, setVisible, progress
  const fn = (s.scene as unknown as Record<string, (...a: unknown[]) => void>)[m.fn];
  fn?.(...m.args);
}
