import type { CSSProperties } from "react";

/*
 * The /v2 hero's centrepiece: an upper dental arch seen from below, the way a dentist charts it.
 * Fourteen teeth (second molar to second molar) with their real proportions, placed along an arch
 * form and numbered like a chart (Universal 2-15). All geometry is worked out here on the server, so
 * the browser receives finished SVG paths and does no maths at all; the drawing itself is CSS (see
 * .chart-* in globals.css): the arch form draws, each tooth's outline traces from the front teeth
 * back, the porcelain fills in, the grooves land, then the light moves slowly across the enamel.
 */

type Kind = "incisor" | "lateral" | "canine" | "premolar" | "molar";
type P = [number, number];

// Mesiodistal width x buccolingual depth, in mm (typical adult upper teeth), front to back
const TEETH: { kind: Kind; w: number; d: number }[] = [
  { kind: "incisor", w: 8.6, d: 7.1 },
  { kind: "lateral", w: 6.6, d: 6.2 },
  { kind: "canine", w: 7.6, d: 8.1 },
  { kind: "premolar", w: 7.0, d: 9.0 },
  { kind: "premolar", w: 6.6, d: 8.9 },
  { kind: "molar", w: 10.2, d: 11.2 },
  { kind: "molar", w: 9.2, d: 10.8 },
];
const GAP = 0.35;

// The arch form's right half (mm, y downward from the incisors), smoothed with Catmull-Rom
const FORM: P[] = [
  [0, 0],
  [7.8, 1.3],
  [14, 4.6],
  [18.6, 9.4],
  [21.6, 15.4],
  [23.9, 22.4],
  [25.7, 30.2],
  [27, 38.4],
  [27.9, 46.5],
];

const f = (n: number) => (Math.round(n * 10) / 10).toString();

function catmull(pts: P[], steps: number): P[] {
  const out: P[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const [p1, p2] = [pts[i], pts[i + 1]];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      const c = (a: number, b: number, cc: number, d: number) => 0.5 * (2 * b + (-a + cc) * t + (2 * a - 5 * b + 4 * cc - d) * t2 + (-a + 3 * b - 3 * cc + d) * t3);
      out.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/** A closed, smooth path through the points (Catmull-Rom as cubic Béziers). */
function closed(pts: P[]) {
  const n = pts.length;
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + "Z";
}

const open = (pts: P[]) => pts.map((p, i) => `${i ? "L" : "M"}${f(p[0])} ${f(p[1])}`).join("");
/** A gentle curve a → b bowing by `bow` (as a fraction of its length) to the left of its direction. */
function curve(a: P, b: P, bow = 0.12) {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const nx = -(b[1] - a[1]) * bow;
  const ny = (b[0] - a[0]) * bow;
  return `M${f(a[0])} ${f(a[1])}Q${f(mx + nx)} ${f(my + ny)} ${f(b[0])} ${f(b[1])}`;
}

/**
 * The occlusal outline in tooth space: x along the arch (mesial +), y outward (buccal +).
 * Superellipses shaped per kind: incisors are shovels, wide at the lip and narrowing to the
 * cingulum; the canine comes to a point; premolars are buccolingual ovals; molars rhomboid.
 */
function outline(kind: Kind, w: number, d: number): P[] {
  const n = { incisor: 2.6, lateral: 2.4, canine: 2.1, premolar: 2.4, molar: 3.0 }[kind];
  const pts: P[] = [];
  const N = 24;
  for (let i = 0; i < N; i++) {
    const th = (i / N) * Math.PI * 2;
    const c = Math.cos(th);
    const s = Math.sin(th);
    let x = (w / 2) * Math.sign(c) * Math.abs(c) ** (2 / n);
    let y = (d / 2) * Math.sign(s) * Math.abs(s) ** (2 / n);
    const v = y / (d / 2); // -1 palate … 1 cheek
    if (kind === "incisor" || kind === "lateral") {
      x *= 1 - 0.5 * Math.max(0, -v) ** 1.15; // narrows to the cingulum
      if (v > 0) y *= 0.7; // a flatter labial face
    } else if (kind === "canine") {
      x *= 1 - 0.34 * Math.max(0, -v) ** 1.1;
      y += 0.1 * d * Math.max(0, v) * (1 - Math.abs(x) / (w / 2));
    } else if (kind === "premolar") {
      x *= 1 - 0.12 * Math.max(0, -v);
      x *= 1 - 0.06 * Math.cos(th * 2) ** 2 * (Math.abs(v) < 0.5 ? 1 : 0); // a waist at the central groove
    } else {
      const r = 1 + 0.045 * Math.cos(4 * th + Math.PI / 4);
      x = x * r + 0.13 * y; // rhomboid
      y *= r;
      x *= 1 - 0.08 * Math.max(0, -v);
    }
    pts.push([x, y]);
  }
  return pts;
}

/** Fissures and ridges in tooth space. */
function details(kind: Kind, w: number, d: number): string {
  if (kind === "incisor" || kind === "lateral")
    return curve([-w * 0.3, -d * 0.02], [-w * 0.06, -d * 0.3], 0.1) + curve([w * 0.3, -d * 0.02], [w * 0.06, -d * 0.3], -0.1);
  if (kind === "canine") return open([[-w * 0.3, d * 0.04], [0, d * 0.22], [w * 0.3, d * 0.04]]) + curve([0, d * 0.12], [0, -d * 0.26], 0.06);
  if (kind === "premolar") return curve([-w * 0.3, -d * 0.03], [w * 0.3, -d * 0.01], 0.1) + curve([-w * 0.3, -d * 0.03], [-w * 0.38, d * 0.12], 0) + curve([w * 0.3, -d * 0.01], [w * 0.38, d * 0.12], 0);
  return (
    curve([-w * 0.36, d * 0.02], [w * 0.36, d * 0.0], 0.05) + // central fissure
    curve([-w * 0.02, d * 0.01], [w * 0.04, d * 0.42], 0.1) + // buccal groove
    curve([w * 0.06, -d * 0.02], [-w * 0.3, -d * 0.36], 0.08) // distolingual groove, behind the oblique ridge
  );
}

/** Cusp tips (tooth space, radius): where the light catches. */
function cusps(kind: Kind, w: number, d: number): [number, number, number][] {
  if (kind === "incisor" || kind === "lateral") return [[0, d * 0.16, w * 0.34]];
  if (kind === "canine") return [[0, d * 0.16, w * 0.3]];
  if (kind === "premolar") return [[0, d * 0.23, w * 0.27], [0, -d * 0.24, w * 0.22]];
  return [
    [w * 0.21, d * 0.24, w * 0.19],
    [-w * 0.2, d * 0.22, w * 0.17],
    [w * 0.14, -d * 0.2, w * 0.21],
    [-w * 0.27, -d * 0.26, w * 0.13],
  ];
}

type Tooth = { id: number; body: string; lines: string; cusps: [number, number, number][]; num: P; order: number };

function build() {
  const line = catmull(FORM, 24);
  const cum = [0];
  for (let i = 1; i < line.length; i++) cum.push(cum[i - 1] + Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]));
  const at = (s: number): { p: P; t: P } => {
    let i = cum.findIndex((c) => c >= s);
    if (i < 1) i = 1;
    const k = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
    const a = line[i - 1];
    const b = line[i];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return { p: [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k], t: [(b[0] - a[0]) / len, (b[1] - a[1]) / len] };
  };

  const teeth: Tooth[] = [];
  const reach = TEETH.reduce((a, t) => a + t.w + GAP, 0);
  // the right half only: the left is the same teeth mirrored (<use>), so each path is sent once
  for (const side of [1]) {
    let s = GAP / 2;
    TEETH.forEach((tt, i) => {
      const { p, t } = at(s + tt.w / 2);
      s += tt.w + GAP;
      // tooth space → page: x towards the midline (mesial), y outward (buccal); the left half mirrors the right
      const nrm: P = [t[1], -t[0]];
      const pl = (q: P): P => [(p[0] - q[0] * t[0] + q[1] * nrm[0]) * side, p[1] - q[0] * t[1] + q[1] * nrm[1]];
      const pts = outline(tt.kind, tt.w, tt.d).map(pl);
      const lines = details(tt.kind, tt.w, tt.d).replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, a, b) => {
        const q = pl([+a, +b]);
        return `${f(q[0])} ${f(q[1])}`;
      });
      const id = 9 + i;
      const tips = cusps(tt.kind, tt.w, tt.d).map(([x, y, r]): [number, number, number] => [...pl([x, y]), r]);
      teeth.push({ id, body: closed(pts), lines, cusps: tips, num: pl([0, tt.d / 2 + 3.4]), order: i });
    });
  }
  // the arch form the teeth sit on, from one second molar to the other
  const half = line.filter((_, i) => cum[i] <= reach - 4);
  const form = [...half.slice().reverse().map(([x, y]) => [-x, y] as P), ...half.slice(1)];
  const formPath = form.map((p, i) => `${i ? "L" : "M"}${f(p[0])} ${f(p[1])}`).join("");
  return { teeth, formPath };
}

const ART = build();

/** The chart, as SVG. Decorative: the hero's words carry the meaning. */
export function ArchChart({ caption }: { caption: [string, string] }) {
  const { teeth: right, formPath } = ART;
  // Universal numbering: the patient's right (the viewer's left) second molar is 2, its mirror 15
  const teeth = [...right.map((t) => ({ ...t, n: 17 - t.id, m: true })).reverse(), ...right.map((t) => ({ ...t, n: t.id, m: false }))];
  const mirror = (m: boolean) => (m ? "scale(-1 1)" : undefined);
  // the line in two, at the space nearest its middle, so it fits inside the arch
  const words = caption[1].split(" ");
  let cut = 1;
  for (let k = 1, n = 0; k < words.length; k++) {
    n += words[k - 1].length + 1;
    if (Math.abs(n - caption[1].length / 2) < Math.abs(words.slice(0, cut).join(" ").length - caption[1].length / 2)) cut = k;
  }
  return (
    <svg viewBox="-40 -9 80 66" className="chart block h-auto w-full overflow-visible" aria-hidden focusable="false">
      <defs>
        <radialGradient id="chart-enamel" cx="0.36" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#fffefb" />
          <stop offset="0.45" stopColor="#f6f0e6" />
          <stop offset="0.8" stopColor="#e6dac6" />
          <stop offset="1" stopColor="#cfbc9e" />
        </radialGradient>
        <radialGradient id="chart-enamel-m" href="#chart-enamel" cx="0.64" />
        <radialGradient id="chart-cusp">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#fffdf8" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fffdf8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="chart-glint" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="chart-shadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0.25" dy="0.45" stdDeviation="0.35" floodColor="#4b3d28" floodOpacity="0.28" />
          <feDropShadow dx="1.6" dy="2.6" stdDeviation="1.8" floodColor="#5c4a30" floodOpacity="0.2" />
        </filter>
        {right.map((t) => (
          <path key={t.id} id={`ct${t.id}`} d={t.body} pathLength={1} />
        ))}
        <clipPath id="chart-teeth">
          {teeth.map((t) => (
            <use key={t.n} href={`#ct${t.id}`} transform={mirror(t.m)} />
          ))}
        </clipPath>
      </defs>

      {/* The arch form, drawn first */}
      <path d={formPath} pathLength={1} className="chart-form" />

      {/* Porcelain, with layered shadows */}
      <g filter="url(#chart-shadow)">
        {teeth.map((t) => (
          <g key={t.n} transform={mirror(t.m)}>
            <g className="chart-tooth" style={{ "--i": t.order } as CSSProperties}>
              <use href={`#ct${t.id}`} fill={t.m ? "url(#chart-enamel-m)" : "url(#chart-enamel)"} />
              {t.cusps.map(([x, y, r], k) => (
                <circle key={k} cx={f(x + (t.m ? r : -r) * 0.12)} cy={f(y - r * 0.18)} r={f(r)} fill="url(#chart-cusp)" />
              ))}
            </g>
          </g>
        ))}
      </g>

      {/* The light crossing the enamel */}
      <g clipPath="url(#chart-teeth)">
        <rect className="chart-glint" x="-60" y="-12" width="18" height="80" fill="url(#chart-glint)" />
      </g>

      {/* Grooves and ridges */}
      {teeth.map((t) => (
        <path key={t.n} d={t.lines} transform={mirror(t.m)} className="chart-groove" style={{ "--i": t.order } as CSSProperties} />
      ))}

      {/* The pen: each outline traced, front teeth first */}
      {teeth.map((t) => (
        <use key={t.n} href={`#ct${t.id}`} transform={mirror(t.m)} className="chart-pen" style={{ "--i": t.order } as CSSProperties} />
      ))}

      {/* Chart numbers */}
      {teeth.map((t) => (
        <text key={t.n} x={f(t.m ? -t.num[0] : t.num[0])} y={f(t.num[1])} className="chart-num" style={{ "--i": t.order } as CSSProperties}>
          {t.n}
        </text>
      ))}

      <text x="0" y="23" className="chart-caption">
        <tspan className="chart-caption-eyebrow">{caption[0]}</tspan>
        <tspan x="0" dy="5.2" className="chart-caption-line">
          {words.slice(0, cut).join(" ")}
        </tspan>
        <tspan x="0" dy="4.1" className="chart-caption-line">
          {words.slice(cut).join(" ")}
        </tspan>
      </text>
    </svg>
  );
}

/** Olive branches outside the window, as soft shadows on the wall (blurred once, then only moved). */
function branch(from: P, ctrl: P, to: P, leaves: number, seed: number): [string, string] {
  let r = seed;
  const rnd = () => ((r = (r * 16807) % 2147483647) / 2147483647);
  const q = (t: number): P => [
    (1 - t) ** 2 * from[0] + 2 * (1 - t) * t * ctrl[0] + t * t * to[0],
    (1 - t) ** 2 * from[1] + 2 * (1 - t) * t * ctrl[1] + t * t * to[1],
  ];
  const stem = `M${f(from[0])} ${f(from[1])}Q${f(ctrl[0])} ${f(ctrl[1])} ${f(to[0])} ${f(to[1])}`;
  let d = "";
  for (let i = 0; i < leaves; i++) {
    const t = 0.08 + (i / leaves) * 0.9;
    const [x, y] = q(t);
    const [x2, y2] = q(t + 0.01);
    const dir = Math.atan2(y2 - y, x2 - x);
    const a = dir + (i % 2 ? 1 : -1) * (0.55 + rnd() * 0.35);
    const L = 8 + rnd() * 4.5;
    const W = 1.15 + rnd() * 0.5;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const pt = (u: number, v: number) => `${f(x + u * ca - v * sa)} ${f(y + u * sa + v * ca)}`;
    d += `M${pt(0, 0)}Q${pt(L * 0.45, -W * 1.6)} ${pt(L, 0)}Q${pt(L * 0.45, W * 1.6)} ${pt(0, 0)}Z`;
  }
  return [stem, d];
}

const LEAVES = [branch([-8, 6], [30, 2], [64, 30], 15, 7), branch([104, 58], [86, 74], [58, 104], 11, 19), branch([20, -6], [36, 12], [40, 34], 7, 31)];

export function LeafShadow() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="block h-full w-full" aria-hidden focusable="false">
      <defs>
        <filter id="leaf-soft" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.7" />
        </filter>
      </defs>
      <g filter="url(#leaf-soft)" fill="#5f5a45">
        {LEAVES.map(([stem, d], i) => (
          <g key={i} className={i === 1 ? "arch-leaf-b" : "arch-leaf-a"}>
            <path d={stem} fill="none" stroke="#5f5a45" strokeWidth="0.4" strokeLinecap="round" />
            <path d={d} />
          </g>
        ))}
      </g>
    </svg>
  );
}
