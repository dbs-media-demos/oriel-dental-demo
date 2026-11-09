import {
  CanvasTexture,
  ClampToEdgeWrapping,
  Color,
  DoubleSide,
  Group,
  HemisphereLight,
  LatheGeometry,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  OrthographicCamera,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  SpotLight,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
  type BufferGeometry,
  type Material,
  type Texture,
} from "three";
import { molarGeometry } from "./molar";

/*
 * "In a better light": a porcelain molar turning slowly above a travertine plinth, in a plaster room
 * lit by one low sun through an arched window. The window and the olive branches outside it are a
 * light cookie on the sun (a small texture drawn every frame), so their shadows fall across the wall
 * AND wrap around the tooth; the tooth and the plinth cast real soft shadows of their own.
 *
 * Desktop only: it runs in a worker on an OffscreenCanvas (fx/tooth/worker.ts), started after the
 * checks in fx/guard.ts, so phones never download three.js and building or drawing it never holds up
 * the page. The same scene renders the stills (scripts/render-tooth.mjs).
 */

/** The still is rendered at this size; the live camera crops it exactly like `object-fit: cover`. */
export const REF = { w: 1600, h: 1000 };
/** `object-position` of the still: keeps the tooth inside the arch on any screen shape. */
export const POS = { x: 0.8, y: 0.45 };

const TOOTH = new Vector3(2.6, 0.02, 2.4);
const TOOTH_SCALE = 1.04;
const PLINTH_TOP = -1.5;
const PLINTH_R = 1.08;
const SUN = new Vector3(-10, 9, 11);
const SUN_AIM = new Vector3(3.3, -0.3, 0);
const CAM = { pos: new Vector3(0, 0.35, 17), look: new Vector3(0, 0, 0), fov: 26 };

/** A seeded random, so the stills and the live scene draw the same leaves and plaster. */
function rng(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** A 2D canvas for the textures: an OffscreenCanvas in the worker, a plain one for the stills. */
export function canvas2d(w: number, h: number) {
  if (typeof document === "undefined") {
    const c = new OffscreenCanvas(w, h);
    const ctx = c.getContext("2d")!;
    // the far branches are blurred; a context that can't blur would draw a different room
    if (!("filter" in ctx)) throw new Error("no canvas filter");
    return [c, ctx] as const;
  }
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

/** Value noise in a few octaves: limewash plaster and travertine both start here. */
function noiseField(w: number, h: number, seed: number, octaves: [number, number][]) {
  const r = rng(seed);
  const out = new Float32Array(w * h);
  for (const [cells, amp] of octaves) {
    const gw = cells + 1;
    const gh = Math.round((cells * h) / w) + 1;
    const g = Array.from({ length: gw * gh }, r);
    // wrap the lattice so the texture tiles
    for (let y = 0; y < gh; y++) g[y * gw + gw - 1] = g[y * gw];
    for (let x = 0; x < gw; x++) g[(gh - 1) * gw + x] = g[x];
    for (let y = 0; y < h; y++) {
      const fy = (y / h) * (gh - 1);
      const y0 = Math.floor(fy);
      const ty = fy - y0;
      const sy = ty * ty * (3 - 2 * ty);
      for (let x = 0; x < w; x++) {
        const fx = (x / w) * (gw - 1);
        const x0 = Math.floor(fx);
        const tx = fx - x0;
        const sx = tx * tx * (3 - 2 * tx);
        const a = g[y0 * gw + x0];
        const b = g[y0 * gw + x0 + 1];
        const c = g[(y0 + 1) * gw + x0];
        const d = g[(y0 + 1) * gw + x0 + 1];
        out[y * w + x] += (a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy) * amp;
      }
    }
  }
  return out;
}

function grey(w: number, h: number, value: (i: number, x: number, y: number) => number): Texture {
  const [c, ctx] = canvas2d(w, h);
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const v = Math.max(0, Math.min(255, value(i, x, y) * 255));
      img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
      img.data[i * 4 + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  return t;
}

/** Limewash: broad cloudy trowel marks and a fine tooth, for the sun to rake across. */
function plaster(): Texture {
  const n = noiseField(256, 256, 11, [[3, 0.5], [9, 0.28], [32, 0.14], [96, 0.08]]);
  return grey(256, 256, (i) => n[i]);
}

/** Travertine: soft horizontal strata with small pits along them. */
function travertine(): { map: Texture; bump: Texture } {
  const w = 512;
  const h = 256;
  const n = noiseField(w, h, 5, [[4, 0.4], [16, 0.3], [64, 0.3]]);
  const r = rng(23);
  const bands = Array.from({ length: h }, (_, y) => 0.5 + 0.5 * Math.sin(y * 0.19 + Math.sin(y * 0.031) * 4) * (0.6 + r() * 0.4));
  const pits = new Float32Array(w * h);
  for (let p = 0; p < 900; p++) {
    const cx = Math.floor(r() * w);
    const cy = Math.floor(r() * h);
    const len = 2 + Math.floor(r() * 9);
    for (let k = 0; k < len; k++) pits[cy * w + ((cx + k) % w)] = 0.5 + r() * 0.5;
  }
  const map = grey(w, h, (i, x, y) => 0.95 + 0.04 * bands[y] * (0.6 + n[i] * 0.5) + (n[i] - 0.5) * 0.04 - pits[i] * 0.1);
  map.colorSpace = SRGBColorSpace;
  const bump = grey(w, h, (i, x, y) => 0.75 + bands[y] * 0.05 + n[i] * 0.1 - pits[i] * 0.4);
  return { map, bump };
}

/** Olive sprigs as soft silhouettes (alpha only); two of these, at two distances, make the dapple. */
function sprigs(seed: number, count: number, blur: number, size: number): Texture {
  const S = 512;
  const [c, ctx] = canvas2d(S, S);
  const r = rng(seed);
  ctx.filter = `blur(${blur}px)`;
  ctx.fillStyle = "#000";
  ctx.strokeStyle = "#000";
  ctx.lineCap = "round";
  for (let k = 0; k < count; k++) {
    // each sprig enters from the upper-left and arcs down to the right
    let x = -20 + r() * 260;
    let y = 520 - r() * 220;
    let a = -0.35 - r() * 0.7;
    const len = 26 + Math.floor(r() * 16);
    const bend = (r() - 0.5) * 0.06;
    ctx.lineWidth = 2.6 * size;
    for (let i = 0; i < len; i++) {
      const step = 9 * size;
      const nx = x + Math.cos(a) * step;
      const ny = y + Math.sin(a) * step;
      ctx.beginPath();
      ctx.moveTo(x, S - y);
      ctx.lineTo(nx, S - ny);
      ctx.stroke();
      x = nx;
      y = ny;
      a += bend;
      ctx.lineWidth = Math.max(0.8, ctx.lineWidth * 0.97);
      if (i % 2 === 1) {
        for (const side of [-1, 1]) {
          if (r() < 0.12) continue;
          const la = a + side * (0.55 + r() * 0.45);
          const L = (30 + r() * 18) * size * (1 - (i / len) * 0.35);
          const W = (5.5 + r() * 2.5) * size;
          ctx.save();
          ctx.translate(x + Math.cos(la) * L * 0.5, S - (y + Math.sin(la) * L * 0.5));
          ctx.rotate(-la);
          ctx.beginPath();
          ctx.ellipse(0, 0, L / 2, W / 2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }
  }
  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = ClampToEdgeWrapping;
  t.minFilter = LinearFilter;
  t.generateMipmaps = false;
  return t;
}

/**
 * The sun's cookie: the arched window (a centre mullion and two glazing bars) with the olive
 * branches outside it. Redrawn when the branches move; the sun's colour is multiplied by it.
 */
function goboMaterial(near: Texture, far: Texture) {
  return new ShaderMaterial({
    uniforms: {
      uNear: { value: near },
      uFar: { value: far },
      uOffNear: { value: new Vector2() },
      uOffFar: { value: new Vector2() },
    },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D uNear, uFar;
      uniform vec2 uOffNear, uOffFar;
      float box(vec2 p, vec2 c, vec2 h) { vec2 d = abs(p - c) - h; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0); }
      void main() {
        vec2 p = vUv;
        // the opening: a round-topped window, springing at y = 0.6
        float hw = 0.215;
        vec2 c = vec2(0.5, 0.6);
        float d = min(box(p, vec2(0.5, 0.33), vec2(hw, 0.27)), length(p - c) - hw);
        float win = smoothstep(0.012, -0.012, d);
        // the frame's bars: a centre mullion, the springing line and one lower glazing bar
        float bars = smoothstep(0.016, 0.006, abs(p.x - 0.5));
        bars = max(bars, smoothstep(0.014, 0.005, abs(p.y - 0.6)));
        bars = max(bars, smoothstep(0.011, 0.004, abs(p.y - 0.37)) * step(p.y, 0.6));
        float near = texture2D(uNear, p * 1.05 - vec2(0.02, 0.0) + uOffNear).a;
        float far = texture2D(uFar, p * 0.85 + vec2(0.1, 0.06) + uOffFar).a;
        float light = win * (1.0 - bars * 0.94) * (1.0 - near * 0.9) * (1.0 - far * 0.55);
        gl_FragColor = vec4(vec3(light), 1.0);
      }`,
    depthTest: false,
    depthWrite: false,
  });
}

/** A turned travertine plinth with a softly eased top edge. */
function plinthGeometry(): BufferGeometry {
  const r = PLINTH_R;
  const pts: Vector2[] = [new Vector2(0, 0)];
  const e = 0.06;
  pts.push(new Vector2(r - e, 0));
  for (let i = 1; i <= 6; i++) {
    const a = (i / 6) * (Math.PI / 2);
    pts.push(new Vector2(r - e + Math.sin(a) * e, -e + Math.cos(a) * e));
  }
  pts.push(new Vector2(r, -9));
  // bottom to top, so the faces point outwards
  const g = new LatheGeometry(pts.reverse(), 96);
  // Lathe UVs stretch the long side over one row; run the stone's strata by height instead
  const pos = g.getAttribute("position");
  const uv = g.getAttribute("uv");
  for (let i = 0; i < uv.count; i++) uv.setY(i, -pos.getY(i) * 0.16 + Math.hypot(pos.getX(i), pos.getZ(i)) * 0.05);
  return g;
}

/** A room for the glaze to reflect: one bright window upper-left in a dim room, so it adds highlights, not fill. */
function studio(renderer: WebGLRenderer): Texture {
  const room = new Scene();
  room.background = new Color(0.16, 0.15, 0.135);
  const panel = (w: number, h: number, rgb: [number, number, number], pos: [number, number, number]) => {
    const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: new Color(...rgb), side: DoubleSide }));
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    room.add(m);
  };
  panel(3.2, 5, [7, 6.3, 5.2], [-6, 4.5, 6]); // the window
  panel(12, 12, [0.42, 0.4, 0.37], [0, 9, 0]); // ceiling
  panel(14, 8, [0.86, 0.82, 0.75], [0, 1, -8]); // the wall behind, lit like the real one
  panel(3, 8, [0.9, 0.86, 0.8], [8, 2, 3]); // a pale bounce, right
  panel(16, 16, [0.3, 0.27, 0.23], [0, -6, 0]); // travertine floor
  const pmrem = new PMREMGenerator(renderer);
  const env = pmrem.fromScene(room, 0.04).texture;
  pmrem.dispose();
  room.traverse((o) => {
    if (o instanceof Mesh) {
      o.geometry.dispose();
      (o.material as Material).dispose();
    }
  });
  return env;
}

export type ToothScene = {
  /** Pointer across the page, -1…1 on both axes. */
  pointer: (x: number, y: number) => void;
  /** Progress through the pinned hero (0…1, already smoothed by the scroll timeline). */
  scroll: (progress: number) => void;
  /** The part of the canvas the arch shows (CSS px insets); nothing outside it is drawn. */
  clip: (inset: { t: number; r: number; b: number; l: number } | null) => void;
  /** The opening move: a breath of wind through the branches and a quicker turn that settles. */
  intro: () => void;
  /** The canvas's CSS size and the screen's pixel ratio (the worker can't measure them itself). */
  resize: (w?: number, h?: number, dpr?: number) => void;
  /** Called once the first frame is on the canvas. */
  onReady: (cb: () => void) => void;
  /** On screen and the tab showing: frames run only while this is true. */
  setVisible: (v: boolean) => void;
  dispose: () => void;
};

export type ToothOptions = {
  /** Render once into a readable buffer (scripts/render-tooth.mjs). */
  still?: boolean;
  /** The phones' cameo: close on the tooth and the plinth's top. */
  cameo?: boolean;
  /** The canvas's CSS size and pixel ratio, where the canvas can't be measured (OffscreenCanvas). */
  size?: { w: number; h: number; dpr: number };
  /** Every live frame's time; `fresh` when the loop has just (re)started. For the frame watch. */
  onFrame?: (now: number, fresh: boolean) => void;
};

/** Never more pixels than this per CSS pixel: the room looks the same and costs far less on a 2x screen. */
export const MAX_DPR = 1.5;

/** Hands the main thread back between setup steps, so building the scene is never one long task. */
const pause = () => new Promise<void>((r) => setTimeout(r, 0));

export async function createTooth(canvas: HTMLCanvasElement | OffscreenCanvas, opts: ToothOptions = {}): Promise<ToothScene> {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
    // live: no context at all rather than a software or blocklisted one (the still stays)
    failIfMajorPerformanceCaveat: !opts.still,
    preserveDrawingBuffer: !!opts.still,
  });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  scene.background = new Color(0xe4ded4);
  const camera = new PerspectiveCamera(CAM.fov, REF.w / REF.h, 1, 60);

  await pause();
  const geo = await molarGeometry(0.022);
  await pause();
  const env = studio(renderer);
  const wallBump = plaster();
  wallBump.repeat.set(5, 3);
  const trav = travertine();
  trav.map.repeat.set(2, 3);
  trav.bump.repeat.set(2, 3);
  await pause();

  // ── the sun's cookie ──
  const near = sprigs(3, 7, 1.1, 1);
  const far = sprigs(8, 6, 7, 1.5);
  const gobo = new WebGLRenderTarget(512, 512, { depthBuffer: false, generateMipmaps: false });
  const goboMat = goboMaterial(near, far);
  const goboScene = new Scene();
  goboScene.add(new Mesh(new PlaneGeometry(2, 2), goboMat));
  const goboCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // ── the room ──
  const wall = new Mesh(
    new PlaneGeometry(44, 26),
    // the emissive is the room's bounce light: it lifts the wall's shade without flattening the tooth
    new MeshStandardMaterial({ color: new Color("#ebe6dd"), emissive: new Color("#a29b8f"), roughness: 1, bumpMap: wallBump, bumpScale: 1.4 }),
  );
  wall.receiveShadow = true;
  scene.add(wall);

  const plinth = new Mesh(
    plinthGeometry(),
    new MeshStandardMaterial({ color: new Color("#f3ebde"), emissive: new Color("#7d766a"), map: trav.map, roughness: 0.8, bumpMap: trav.bump, bumpScale: 1.6 }),
  );
  plinth.position.set(TOOTH.x, PLINTH_TOP, TOOTH.z);
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  scene.add(plinth);

  // A soft occlusion pool on the plinth's top, under the floating tooth
  const [pc, pctx] = canvas2d(128, 128);
  const grad = pctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(0,0,0,0.5)");
  grad.addColorStop(0.5, "rgba(0,0,0,0.18)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  pctx.fillStyle = grad;
  pctx.fillRect(0, 0, 128, 128);
  const poolTex = new CanvasTexture(pc);
  const pool = new Mesh(new PlaneGeometry(1.7, 1.7), new MeshBasicMaterial({ map: poolTex, color: 0x3a2e22, transparent: true, depthWrite: false, opacity: 0.4 }));
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(TOOTH.x, PLINTH_TOP + 0.004, TOOTH.z);
  scene.add(pool);

  // ── the tooth ──
  const porcelain = new MeshPhysicalMaterial({
    color: new Color("#f2efe9"),
    roughness: 0.38,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    sheen: 0.6,
    sheenColor: new Color("#fff1de"),
    sheenRoughness: 0.55,
    specularIntensity: 0.6,
    envMap: env,
    envMapIntensity: 0.85,
    // porcelain carries a little light into its own shade
    emissive: new Color("#2b241c"),
  });
  const pivot = new Group();
  pivot.position.copy(TOOTH);
  scene.add(pivot);
  // tilted towards the camera so the cusps show, spinning about its own long axis
  const spin = new Group();
  pivot.add(spin);
  const tooth = new Mesh(geo, porcelain);
  tooth.scale.setScalar(TOOTH_SCALE);
  tooth.position.y = 0.2 * TOOTH_SCALE;
  tooth.castShadow = true;
  tooth.receiveShadow = true;
  spin.add(tooth);

  // ── light ──
  const sun = new SpotLight(0xfff3e2, 8, 0, 0.3, 0.2, 0);
  sun.position.copy(SUN);
  sun.target.position.copy(SUN_AIM);
  sun.map = gobo.texture;
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.radius = 5;
  sun.shadow.bias = -0.0003;
  sun.shadow.normalBias = 0.02;
  sun.shadow.camera.near = 8;
  sun.shadow.camera.far = 32;
  scene.add(sun, sun.target);
  const sky = new HemisphereLight(0xfffbf3, 0xeee4d4, 1.5);
  scene.add(sky);

  // ── motion ──
  const s = {
    t: 0,
    yaw: 0.55,
    spin: 0.11, // rad/s, the turntable
    wind: 1,
    px: 0,
    py: 0,
    tx: 0,
    ty: 0,
    progress: 0,
  };
  let visible = true;
  let raf = 0;
  let last = 0;
  let ready: (() => void) | null = null;
  let drawn = false;
  let clip: { t: number; r: number; b: number; l: number } | null = null;
  let css = opts.size;
  const size = new Vector2();

  const sunWarm = new Color(0xfff3e2);
  const sunLow = new Color(0xffe4c2);
  const place = () => {
    const p = s.progress;
    const e = p * p * (3 - 2 * p);
    // camera: steps back and a little left as the arch opens into the room
    if (opts.cameo) {
      camera.position.set(TOOTH.x - 1.2, 1.3, TOOTH.z + 12.6);
      camera.lookAt(TOOTH.x - 0.05, 0.05, TOOTH.z);
    } else {
      camera.position.set(CAM.pos.x - e * 0.9 + s.px * 0.25, CAM.pos.y + s.py * 0.12, CAM.pos.z + e * 2.2);
      camera.lookAt(CAM.look.x - e * 0.9, CAM.look.y, CAM.look.z);
    }
    // the sun follows the pointer a little, and sinks and warms with the scroll
    sun.position.set(SUN.x + s.px * 0.9 + e * 1.6, SUN.y - s.py * 0.6 - e * 2.4, SUN.z);
    sun.color.copy(sunWarm).lerp(sunLow, e);
    // the tooth: a slow turn, a breath of a float, and a lean towards the pointer
    pivot.rotation.set(0.28 + s.py * 0.06, 0, -0.1 - s.px * 0.04);
    spin.rotation.y = s.yaw + s.px * 0.35;
    pivot.position.y = TOOTH.y + Math.sin(s.t * 0.7) * 0.035;
    const lift = pivot.position.y - TOOTH.y;
    (pool.material as MeshBasicMaterial).opacity = 0.4 - lift * 2;
    pool.scale.setScalar(1 + lift * 1.5);
    // the branches sway; a gust carries them further
    const w = s.wind;
    const t = s.t;
    goboMat.uniforms.uOffNear.value.set(
      (Math.sin(t * 0.63) * 0.006 + Math.sin(t * 1.71 + 1.3) * 0.0022) * w,
      (Math.cos(t * 0.52) * 0.004 + Math.sin(t * 1.3) * 0.0015) * w,
    );
    goboMat.uniforms.uOffFar.value.set((Math.sin(t * 0.37 + 2) * 0.01 + Math.sin(t * 1.1) * 0.003) * w, Math.cos(t * 0.31 + 0.4) * 0.006 * w);
  };

  const draw = () => {
    place();
    renderer.setRenderTarget(gobo);
    renderer.render(goboScene, goboCam);
    renderer.setRenderTarget(null);
    renderer.getSize(size);
    if (clip && !opts.still) {
      // a wide margin: the arch's clip-path moves on the page's thread, this canvas on the worker's
      const m = 64;
      const x = Math.max(0, clip.l - m);
      const y = Math.max(0, clip.b - m);
      const w = Math.max(1, size.x - x - Math.max(0, clip.r - m));
      const h = Math.max(1, size.y - y - Math.max(0, clip.t - m));
      renderer.setScissorTest(true);
      renderer.setScissor(x, y, w, h);
    } else renderer.setScissorTest(false);
    renderer.render(scene, camera);
    if (!drawn) {
      drawn = true;
      ready?.();
    }
  };

  const step = (dt: number) => {
    s.t += dt;
    s.wind += (1 - s.wind) * Math.min(1, dt * 0.55);
    s.spin += (0.11 - s.spin) * Math.min(1, dt * 0.6);
    s.yaw += s.spin * dt;
    s.px += (s.tx - s.px) * Math.min(1, dt * 2.4);
    s.py += (s.ty - s.py) * Math.min(1, dt * 2.4);
  };

  // Always something moving (the branches, the turn), so frames run while the hero is on screen and
  // the tab is visible, and stop the moment it isn't
  const frame = (now: number) => {
    const dt = Math.min(1 / 30, last ? (now - last) / 1000 : 1 / 60);
    opts.onFrame?.(now, !last);
    last = now;
    step(dt);
    draw();
    raf = visible ? requestAnimationFrame(frame) : 0;
    if (!raf) last = 0;
  };
  const wake = () => {
    if (!raf && visible && !opts.still) raf = requestAnimationFrame(frame);
  };

  const resize = (cw?: number, ch?: number, dpr?: number) => {
    if (cw && ch) css = { w: cw, h: ch, dpr: dpr ?? 1 };
    const el = canvas as HTMLCanvasElement;
    const w = css?.w ?? (el.clientWidth || canvas.width);
    const h = css?.h ?? (el.clientHeight || canvas.height);
    renderer.setPixelRatio(opts.still ? 1 : Math.min(css?.dpr ?? 1, MAX_DPR));
    renderer.setSize(w, h, false);
    if (opts.cameo) {
      camera.aspect = w / h;
      camera.clearViewOffset();
    } else {
      // Crop the reference frame exactly like the still's object-fit: cover
      const k = Math.max(w / REF.w, h / REF.h);
      const fw = REF.w * k;
      const fh = REF.h * k;
      camera.aspect = REF.w / REF.h;
      camera.setViewOffset(fw, fh, (fw - w) * POS.x, (fh - h) * POS.y, w, h);
    }
    camera.updateProjectionMatrix();
    draw();
  };
  // Shaders compile in parallel where the GPU driver allows it; then one frame is drawn while the
  // canvas is still hidden, which builds the shadow map's and the cookie's programs too
  place();
  await renderer.compileAsync(scene, camera);
  await renderer.compileAsync(goboScene, goboCam);
  await pause();
  resize();

  return {
    pointer(x, y) {
      s.tx = x;
      s.ty = y;
    },
    scroll(progress) {
      s.progress = progress;
      wake();
    },
    clip(inset) {
      clip = inset;
    },
    intro() {
      s.wind = 3.2;
      s.spin = 0.55;
      wake();
    },
    resize,
    onReady(cb) {
      if (drawn) cb();
      else ready = cb;
    },
    setVisible(vis) {
      visible = vis;
      if (vis) wake();
    },
    dispose() {
      cancelAnimationFrame(raf);
      scene.traverse((o) => {
        if (o instanceof Mesh) {
          o.geometry.dispose();
          (o.material as Material).dispose();
        }
      });
      goboScene.traverse((o) => {
        if (o instanceof Mesh) o.geometry.dispose();
      });
      for (const t of [env, wallBump, trav.map, trav.bump, near, far, poolTex]) t.dispose();
      goboMat.dispose();
      gobo.dispose();
      sun.shadow.map?.dispose();
      renderer.dispose();
      if (!opts.still) renderer.forceContextLoss();
    },
  };
}
