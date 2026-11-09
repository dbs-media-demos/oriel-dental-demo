import {
  ACESFilmicToneMapping,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
  type Material,
  type Texture,
} from "three";
import { cone, ell, meshSdf, molarGeometry, roundBox, smin } from "./molar";
import { MAX_DPR } from "./scene";

/*
 * The new-patient exam's 3D scan: a lower arch (incisors, canines, premolars, molars, gums) as the
 * intraoral scanner builds it. Ahead of the scan line the teeth are only a cloud of points; the line
 * passes in a soft sage glow and leaves solid porcelain behind. Scroll drives the scan. It is cut flat
 * underneath, the way a real scan stops at the gums.
 *
 * Desktop only, in the same worker as the hero (fx/tooth/worker.ts); the same scene renders the stills.
 */

/** Square reference frame: the live camera crops it like the still's `object-fit: cover`. */
export const SCAN_REF = 1000;

const PARA = { a: 1.45, b: 0.44 }; // the arch: z = a - b·x², front teeth at +z
const CENTER_Z = -0.55; // the scan sweeps by angle around this point
const TH_MAX = 2.2; // the back molars' angle
const GAP = 0.02;

type Kind = "incisor" | "canine" | "premolar" | "molar";
// From the midline outwards: widths in model units (1 ≈ 1 cm)
const TEETH: { kind: Kind; w: number }[] = [
  { kind: "incisor", w: 0.5 },
  { kind: "incisor", w: 0.55 },
  { kind: "canine", w: 0.66 },
  { kind: "premolar", w: 0.7 },
  { kind: "premolar", w: 0.72 },
  { kind: "molar", w: 1.06 },
  { kind: "molar", w: 1.0 },
];

function canine(x: number, y: number, z: number) {
  let d = cone(x, y, z * 1.25, [0, 0.12, 0], [0, 0.98, 0.04], 0.3, 0.045);
  d = smin(d, ell(x, y - 0.45, z, 0.33, 0.4, 0.27), 0.16);
  return smin(d, cone(x, y, z, [0, 0.1, 0], [0, -1.5, 0], 0.24, 0.07), 0.15);
}

function incisor(x: number, y: number, z: number) {
  // 0 at the neck, 1 at the biting edge: narrow at the neck, a convex face, a thin edge
  const t = Math.max(0, Math.min(1, (y - 0.05) / 0.9));
  const xs = x / (0.7 + 0.3 * Math.sqrt(t));
  const zz = (z - 0.05 * Math.sin(t * Math.PI)) / (1 - 0.5 * t);
  const d = roundBox(xs, y - 0.5, zz, 0.16, 0.34, 0.07, 0.11);
  return smin(d, cone(x, y, z * 1.3, [0, 0.1, 0], [0, -1.15, 0], 0.17, 0.05), 0.12);
}

/** Point on the arch at arc length s from the midline (s ≥ 0, right half). */
function archPoint(s: number) {
  // invert the parabola's arc length numerically: fine steps, done once per tooth
  let x = 0;
  let len = 0;
  const dx = 0.002;
  while (len < s) {
    const k = 2 * PARA.b * (x + dx / 2);
    len += dx * Math.sqrt(1 + k * k);
    x += dx;
  }
  const p = new Vector3(x, 0, PARA.a - PARA.b * x * x);
  const t = new Vector3(1, 0, -2 * PARA.b * x).normalize();
  return { p, t };
}

/** A room for the glaze to reflect: soft overhead panels in the dark. */
function studio(renderer: WebGLRenderer): Texture {
  const room = new Scene();
  room.background = new Color(0.06, 0.08, 0.07);
  const panel = (w: number, h: number, rgb: [number, number, number], pos: [number, number, number]) => {
    const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: new Color(...rgb), side: DoubleSide }));
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    room.add(m);
  };
  panel(6, 3, [3.2, 3.2, 3.0], [0, 7, 2]);
  panel(2, 5, [1.2, 1.4, 1.3], [-6, 3, 2]);
  panel(2, 5, [1.0, 1.15, 1.05], [6, 3, -1]);
  const pmrem = new PMREMGenerator(renderer);
  const env = pmrem.fromScene(room, 0.03).texture;
  pmrem.dispose();
  room.traverse((o) => {
    if (o instanceof Mesh) {
      o.geometry.dispose();
      (o.material as Material).dispose();
    }
  });
  return env;
}

/** Ahead of the scan line: points only. On it: a sage glow. Behind it: the material as it is. */
function scanned<M extends Material>(m: M, uniforms: { uScan: { value: number }; uYaw: { value: number } }) {
  m.onBeforeCompile = (s) => {
    s.uniforms.uScan = uniforms.uScan;
    s.uniforms.uYaw = uniforms.uYaw;
    // in the arch's own frame, so turning it never moves the scan line across the teeth
    s.vertexShader = s.vertexShader
      .replace("void main() {", "uniform float uYaw;\nvarying vec3 vScanW;\nvoid main() {")
      .replace(
        "#include <project_vertex>",
        `#include <project_vertex>
        vec3 scanW = (modelMatrix * vec4(transformed, 1.0)).xyz;
        vScanW = vec3(cos(uYaw) * scanW.x - sin(uYaw) * scanW.z, scanW.y, sin(uYaw) * scanW.x + cos(uYaw) * scanW.z);`,
      );
    s.fragmentShader = s.fragmentShader
      .replace("void main() {", "uniform float uScan;\nvarying vec3 vScanW;\nvoid main() {")
      .replace(
        "#include <clipping_planes_fragment>",
        `#include <clipping_planes_fragment>
        float scanA = clamp(atan(vScanW.x, vScanW.z - (${CENTER_Z.toFixed(3)})) / ${TH_MAX.toFixed(3)} * 0.5 + 0.5, 0.0, 1.0);
        float scanEdge = uScan * 1.08 - 0.04 - scanA;
        if (scanEdge < 0.0) {
          vec3 g = fract(vScanW * 15.0) - 0.5;
          if (length(g) > 0.2) discard;
        }`,
      )
      .replace(
        "#include <opaque_fragment>",
        `#include <opaque_fragment>
        if (scanEdge < 0.0) gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.62, 0.78, 0.68), 0.8);
        gl_FragColor.rgb += vec3(0.5, 0.8, 0.62) * smoothstep(0.045, 0.0, abs(scanEdge)) * 0.75;`,
      );
  };
  return m;
}

export type ScanScene = {
  /** How far the scan has come: 0 (nothing) … 1 (the whole arch). */
  progress: (p: number) => void;
  setVisible: (v: boolean) => void;
  resize: (w?: number, h?: number, dpr?: number) => void;
  onReady: (cb: () => void) => void;
  dispose: () => void;
};

const pause = () => new Promise<void>((r) => setTimeout(r, 0));

type ScanOptions = {
  still?: boolean;
  at?: number;
  size?: { w: number; h: number; dpr: number };
  onFrame?: (now: number, fresh: boolean) => void;
};

export async function createScan(canvas: HTMLCanvasElement | OffscreenCanvas, opts: ScanOptions = {}): Promise<ScanScene> {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
    failIfMajorPerformanceCaveat: !opts.still,
    preserveDrawingBuffer: !!opts.still,
  });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.localClippingEnabled = true;

  const scene = new Scene();
  scene.background = new Color("#1d2925");
  const camera = new PerspectiveCamera(28, 1, 0.5, 60);
  const look = new Vector3(0, -0.85, -0.45);

  const uniforms = { uScan: { value: opts.still ? (opts.at ?? 1) : 0 }, uYaw: { value: 0 } };
  const cut = [new Plane(new Vector3(0, 1, 0), 0.42)];
  const env = studio(renderer);
  const enamel = scanned(
    new MeshPhysicalMaterial({ color: new Color("#f1ede6"), roughness: 0.42, clearcoat: 0.55, clearcoatRoughness: 0.18, envMap: env, envMapIntensity: 0.7, clippingPlanes: cut }),
    uniforms,
  );
  const gum = scanned(new MeshStandardMaterial({ color: new Color("#bf948d"), roughness: 0.62, envMap: env, envMapIntensity: 0.3, clippingPlanes: cut }), uniforms);

  // ── the teeth ──
  await pause();
  const molar = await molarGeometry(0.03);
  const premolar = molar.clone();
  const canineGeo = await meshSdf(canine, { x: [-0.4, 0.4], y: [-1.62, 1.08], z: [-0.36, 0.36] }, 0.024);
  const incisorGeo = await meshSdf(incisor, { x: [-0.34, 0.34], y: [-1.25, 0.98], z: [-0.24, 0.24] }, 0.02);
  const geos: Record<Kind, BufferGeometry> = { molar, premolar, canine: canineGeo, incisor: incisorGeo };
  // native widths of each shape across the arch, and how each is fitted to its slot
  const fit: Record<Kind, (w: number) => Vector3> = {
    molar: (w) => new Vector3(w / 1.28, (w / 1.28) * 0.95, (w / 1.28) * 0.92),
    premolar: (w) => new Vector3(w / 1.28, 0.62, 0.66),
    canine: (w) => new Vector3(w / 0.66, 0.92, 0.95),
    incisor: (w) => new Vector3(w / 0.54, 0.86, 1),
  };

  const arch = new Group();
  scene.add(arch);
  const centres: number[] = [];
  let s = 0;
  for (const tooth of TEETH) {
    const c = s + tooth.w / 2;
    centres.push(c);
    s += tooth.w + GAP;
    const { p, t } = archPoint(c);
    const out = new Vector3(-t.z, 0, t.x); // buccal side
    for (const side of [1, -1]) {
      const m = new Mesh(geos[tooth.kind], enamel);
      const basis = new Matrix4().makeBasis(t, new Vector3(0, 1, 0), out).setPosition(p);
      const sc = fit[tooth.kind](tooth.w);
      basis.multiply(new Matrix4().makeScale(sc.x, sc.y, sc.z));
      // the left half is the right half in a mirror
      if (side < 0) basis.premultiply(new Matrix4().makeScale(-1, 1, 1));
      m.matrixAutoUpdate = false;
      m.matrix.copy(basis);
      arch.add(m);
    }
  }
  const half = s;

  // ── the gums: a ridge along the arch, scalloped between the teeth ──
  const pts: Vector3[] = [];
  for (let i = 40; i >= -40; i--) {
    const at = (Math.abs(i) / 40) * (half + 0.12);
    const { p } = archPoint(at);
    pts.push(new Vector3(i < 0 ? -p.x : p.x, -0.3, p.z));
  }
  const curve = new CatmullRomCurve3(pts);
  const gumGeo = new TubeGeometry(curve, 220, 0.5, 28, false);
  const pos = gumGeo.getAttribute("position");
  const nrm = gumGeo.getAttribute("normal");
  const segs = 221;
  for (let i = 0; i < pos.count; i++) {
    const along = Math.floor(i / 29) / (segs - 1); // 0…1 along the tube
    const sAbs = Math.abs(along * 2 - 1) * (half + 0.12);
    let k = 0;
    while (k < centres.length - 1 && Math.abs(centres[k + 1] - sAbs) < Math.abs(centres[k] - sAbs)) k++;
    const tt = Math.min(1, Math.abs(sAbs - centres[k]) / (TEETH[k].w / 2));
    const up = Math.max(0, nrm.getY(i));
    pos.setY(i, pos.getY(i) + (tt * tt - 0.4) * 0.17 * up);
  }
  gumGeo.computeVertexNormals();
  const gums = new Mesh(gumGeo, gum);
  arch.add(gums);
  const capGeo = new SphereGeometry(0.5, 28, 16);
  for (const end of [pts[0], pts[pts.length - 1]]) {
    const cap = new Mesh(capGeo, gum);
    cap.position.copy(end);
    arch.add(cap);
  }

  // ── light ──
  scene.add(new HemisphereLight(0xe4ece7, 0x1d2925, 1.1));
  const key = new DirectionalLight(0xfff6ea, 2.4);
  key.position.set(-3, 6, 4);
  scene.add(key);
  const rim = new DirectionalLight(0xb9cbbe, 1.6);
  rim.position.set(3, 2.5, -5);
  scene.add(rim);
  // the scanner's head: a small sage light that travels with the scan line
  const head = new PointLight(0xc9e6d4, 0, 3.2, 2);
  scene.add(head);

  // ── motion ──
  const st = { t: 0, p: uniforms.uScan.value, target: uniforms.uScan.value };
  let visible = false;
  let raf = 0;
  let last = 0;
  let ready: (() => void) | null = null;
  let drawn = false;
  let css = opts.size;

  const place = () => {
    const turn = Math.sin(st.t * 0.22) * 0.22 + (st.p - 0.5) * 0.5;
    arch.rotation.y = opts.still ? 0.12 : turn;
    uniforms.uYaw.value = arch.rotation.y;
    camera.position.set(0, 14.4, 12.6);
    camera.lookAt(look);
    uniforms.uScan.value = st.p;
    // where the line is now, in the arch's own turn
    const a = (st.p * 1.08 - 0.04) * 2 - 1;
    const th = a * TH_MAX;
    const r = 2.3;
    const hx = Math.sin(th) * r;
    const hz = CENTER_Z + Math.cos(th) * r;
    const cy = Math.cos(arch.rotation.y);
    const sy = Math.sin(arch.rotation.y);
    head.position.set(hx * cy + hz * sy, 1.1, -hx * sy + hz * cy);
    head.intensity = st.p > 0.02 && st.p < 0.98 ? 6 : 0;
  };
  const draw = () => {
    place();
    renderer.render(scene, camera);
    if (!drawn) {
      drawn = true;
      ready?.();
    }
  };
  const frame = (now: number) => {
    const dt = Math.min(1 / 30, last ? (now - last) / 1000 : 1 / 60);
    opts.onFrame?.(now, !last);
    last = now;
    st.t += dt;
    st.p += (st.target - st.p) * Math.min(1, dt * 6);
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
    // crop the square reference frame like object-fit: cover, centred
    const k = Math.max(w, h) / SCAN_REF;
    const f = SCAN_REF * k;
    camera.aspect = 1;
    camera.setViewOffset(f, f, (f - w) / 2, (f - h) / 2, w, h);
    camera.updateProjectionMatrix();
    draw();
  };
  // compiled in parallel, then one frame drawn while the canvas is still hidden
  place();
  await renderer.compileAsync(scene, camera);
  await pause();
  resize();

  return {
    progress(p) {
      st.target = Math.max(0, Math.min(1, p));
      wake();
    },
    setVisible(v) {
      visible = v;
      if (v) wake();
    },
    resize,
    onReady(cb) {
      if (drawn) cb();
      else ready = cb;
    },
    dispose() {
      cancelAnimationFrame(raf);
      for (const g of [molar, premolar, canineGeo, incisorGeo, gumGeo, capGeo]) g.dispose();
      enamel.dispose();
      gum.dispose();
      env.dispose();
      renderer.dispose();
      if (!opts.still) renderer.forceContextLoss();
    },
  };
}
