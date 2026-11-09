import { BufferAttribute, BufferGeometry } from "three";

/*
 * A lower first molar, sculpted as a signed distance field and meshed with surface nets: a crown with
 * five rounded cusps and the grooves between them, a waist at the gum line, a short root trunk and two
 * roots that curve gently towards the back. Units: about 1 = 1 cm; the gum line is at y = 0, the cusps
 * reach y ≈ 1.05 and the root tips y ≈ -1.4. No downloaded model: this file is the model.
 */

export const smin = (a: number, b: number, k: number) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};
export const smax = (a: number, b: number, k: number) => -smin(-a, -b, k);

/** Ellipsoid (approximate distance, good near the surface). */
export function ell(x: number, y: number, z: number, rx: number, ry: number, rz: number) {
  const k0 = Math.hypot(x / rx, y / ry, z / rz);
  const k1 = Math.hypot(x / (rx * rx), y / (ry * ry), z / (rz * rz));
  return k1 === 0 ? -Math.min(rx, ry, rz) : (k0 * (k0 - 1)) / k1;
}

export function roundBox(x: number, y: number, z: number, bx: number, by: number, bz: number, r: number) {
  const qx = Math.abs(x) - bx;
  const qy = Math.abs(y) - by;
  const qz = Math.abs(z) - bz;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r;
}

/** A capsule from a to b whose radius runs from r1 to r2 (round cone). */
export function cone(px: number, py: number, pz: number, a: number[], b: number[], r1: number, r2: number) {
  const bax = b[0] - a[0];
  const bay = b[1] - a[1];
  const baz = b[2] - a[2];
  const l2 = bax * bax + bay * bay + baz * baz;
  const rr = r1 - r2;
  const a2 = l2 - rr * rr;
  const il2 = 1 / l2;
  const pax = px - a[0];
  const pay = py - a[1];
  const paz = pz - a[2];
  const y = pax * bax + pay * bay + paz * baz;
  const z = y - l2;
  const cx = pax * l2 - bax * y;
  const cy = pay * l2 - bay * y;
  const cz = paz * l2 - baz * y;
  const x2 = cx * cx + cy * cy + cz * cz;
  const y2 = y * y * l2;
  const z2 = z * z * l2;
  const k = Math.sign(rr) * rr * rr * x2;
  if (Math.sign(z) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - r2;
  if (Math.sign(y) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - r1;
  return (Math.sqrt(x2 * a2 * il2) + y * rr) * il2 - r1;
}

function capsule(px: number, py: number, pz: number, a: number[], b: number[], r: number) {
  const bax = b[0] - a[0];
  const bay = b[1] - a[1];
  const baz = b[2] - a[2];
  const pax = px - a[0];
  const pay = py - a[1];
  const paz = pz - a[2];
  const h = Math.max(0, Math.min(1, (pax * bax + pay * bay + paz * baz) / (bax * bax + bay * bay + baz * baz)));
  return Math.hypot(pax - bax * h, pay - bay * h, paz - baz * h) - r;
}

// x runs front to back of the jaw (mesial − / distal +), z cheek (+) to tongue (−)
const CUSPS: [number, number, number, number][] = [
  [-0.3, 0.8, 0.25, 0.25], // mesio-buccal
  [0.1, 0.8, 0.29, 0.23], // disto-buccal
  [0.42, 0.77, 0.16, 0.18], // distal
  [-0.27, 0.83, -0.24, 0.26], // mesio-lingual
  [0.22, 0.83, -0.25, 0.24], // disto-lingual
];
const GROOVES: [number[], number[], number][] = [
  [[-0.52, 1.03, 0.01], [0.5, 1.02, -0.01], 0.075], // central
  [[-0.08, 1.02, 0.02], [-0.06, 0.9, 0.62], 0.045], // buccal
  [[0.28, 1.0, 0.0], [0.33, 0.9, 0.55], 0.035], // disto-buccal
  [[0.0, 1.03, -0.02], [0.02, 0.92, -0.62], 0.045], // lingual
];
const ROOT_M = { a: [-0.26, -0.12, 0], b: [-0.36, -1.36, 0.02], r1: 0.27, r2: 0.12 };
const ROOT_D = { a: [0.26, -0.12, 0], b: [0.34, -1.24, -0.02], r1: 0.26, r2: 0.12 };

export function molar(x: number, y: number, z: number): number {
  // Crown: a soft box that bulges a little at the height of contour and narrows to the waist
  const taper = 1 + 0.22 * Math.max(0, Math.min(1, (0.42 - y) / 0.42)) ** 1.6;
  const bulge = 1 - 0.035 * Math.exp(-(((y - 0.42) / 0.22) ** 2));
  const cx = x * taper * bulge;
  const cz = z * taper * bulge;
  let d = roundBox(cx, y - 0.52, cz, 0.33, 0.18, 0.27, 0.29);
  for (const [px, py, pz, r] of CUSPS) d = smin(d, ell(x - px, y - py, z - pz, r, r * 0.8, r), 0.16);
  for (const [a, b, r] of GROOVES) d = smax(d, -capsule(x, y, z, a, b, r), 0.08);

  // Root trunk under the waist, then two roots, flatter front-to-back than cheek-to-tongue
  const trunk = ell(x, y + 0.08, z, 0.41, 0.27, 0.36);
  d = smin(d, trunk, 0.18);
  const rx = x * 1.28;
  const rz = z * 0.92;
  // the roots lean back as they go down
  const lean = 0.05 * Math.max(0, -y - 0.1) ** 2;
  const m = cone(rx - lean, y, rz, [ROOT_M.a[0] * 1.28, ROOT_M.a[1], 0], [ROOT_M.b[0] * 1.28, ROOT_M.b[1], ROOT_M.b[2]], ROOT_M.r1, ROOT_M.r2) / 1.12;
  const dr = cone(rx - lean, y, rz, [ROOT_D.a[0] * 1.28, ROOT_D.a[1], 0], [ROOT_D.b[0] * 1.28, ROOT_D.b[1], ROOT_D.b[2]], ROOT_D.r1, ROOT_D.r2) / 1.12;
  d = smin(d, smin(m, dr, 0.12), 0.2);
  return d;
}

export type Bounds = { x: readonly [number, number]; y: readonly [number, number]; z: readonly [number, number] };

/** Bounds of the molar with a margin, for the grid. */
const MOLAR_BOUNDS: Bounds = { x: [-0.78, 0.8], y: [-1.5, 1.14], z: [-0.72, 0.72] };

/** Hands the main thread back between slices, so meshing is never one long task. */
const pause = () => new Promise<void>((r) => setTimeout(r, 0));

/** The molar, meshed: `cell` 0.022 gives about 45k triangles. */
export const molarGeometry = (cell = 0.022) => meshSdf(molar, MOLAR_BOUNDS, cell);

/**
 * Meshes a distance field with naive surface nets (one vertex per cell the surface crosses, quads
 * across every crossing edge), with normals from the field's gradient so porcelain shades smoothly.
 */
export async function meshSdf(sdf: (x: number, y: number, z: number) => number, bounds: Bounds, cell: number): Promise<BufferGeometry> {
  const [x0, x1] = bounds.x;
  const [y0, y1] = bounds.y;
  const [z0, z1] = bounds.z;
  const nx = Math.ceil((x1 - x0) / cell) + 1;
  const ny = Math.ceil((y1 - y0) / cell) + 1;
  const nz = Math.ceil((z1 - z0) / cell) + 1;
  const field = new Float32Array(nx * ny * nz);
  const at = (i: number, j: number, k: number) => i + nx * (j + ny * k);

  let t = performance.now();
  for (let k = 0; k < nz; k++) {
    const z = z0 + k * cell;
    for (let j = 0; j < ny; j++) {
      const y = y0 + j * cell;
      for (let i = 0; i < nx; i++) field[at(i, j, k)] = sdf(x0 + i * cell, y, z);
    }
    if (performance.now() - t > 12) {
      await pause();
      t = performance.now();
    }
  }

  // One vertex per crossing cell, at the average of its edge crossings
  const cells = new Int32Array((nx - 1) * (ny - 1) * (nz - 1)).fill(-1);
  const cat = (i: number, j: number, k: number) => i + (nx - 1) * (j + (ny - 1) * k);
  const pos: number[] = [];
  const corner = new Float32Array(8);
  const EDGES = [
    [0, 1], [2, 3], [4, 5], [6, 7],
    [0, 2], [1, 3], [4, 6], [5, 7],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];
  for (let k = 0; k < nz - 1; k++) {
    for (let j = 0; j < ny - 1; j++) {
      for (let i = 0; i < nx - 1; i++) {
        let mask = 0;
        for (let c = 0; c < 8; c++) {
          const v = field[at(i + (c & 1), j + ((c >> 1) & 1), k + ((c >> 2) & 1))];
          corner[c] = v;
          if (v < 0) mask |= 1 << c;
        }
        if (mask === 0 || mask === 255) continue;
        let sx = 0;
        let sy = 0;
        let sz = 0;
        let n = 0;
        for (const [a, b] of EDGES) {
          const fa = corner[a];
          const fb = corner[b];
          if (fa < 0 === fb < 0) continue;
          const s = fa / (fa - fb);
          sx += (a & 1) + ((b & 1) - (a & 1)) * s;
          sy += ((a >> 1) & 1) + (((b >> 1) & 1) - ((a >> 1) & 1)) * s;
          sz += ((a >> 2) & 1) + (((b >> 2) & 1) - ((a >> 2) & 1)) * s;
          n++;
        }
        cells[cat(i, j, k)] = pos.length / 3;
        pos.push(x0 + (i + sx / n) * cell, y0 + (j + sy / n) * cell, z0 + (k + sz / n) * cell);
      }
    }
    if (performance.now() - t > 12) {
      await pause();
      t = performance.now();
    }
  }

  // A quad across every grid edge the surface crosses, wound so it faces outwards
  const idx: number[] = [];
  const quad = (a: number, b: number, c: number, d: number, flip: boolean) => {
    if (a < 0 || b < 0 || c < 0 || d < 0) return;
    if (flip) idx.push(a, c, b, a, d, c);
    else idx.push(a, b, c, a, c, d);
  };
  for (let k = 1; k < nz - 1; k++) {
    for (let j = 1; j < ny - 1; j++) {
      for (let i = 1; i < nx - 1; i++) {
        const inside = field[at(i, j, k)] < 0;
        if (inside !== field[at(i + 1, j, k)] < 0) quad(cells[cat(i, j - 1, k - 1)], cells[cat(i, j, k - 1)], cells[cat(i, j, k)], cells[cat(i, j - 1, k)], !inside);
        if (inside !== field[at(i, j + 1, k)] < 0) quad(cells[cat(i - 1, j, k - 1)], cells[cat(i - 1, j, k)], cells[cat(i, j, k)], cells[cat(i, j, k - 1)], !inside);
        if (inside !== field[at(i, j, k + 1)] < 0) quad(cells[cat(i - 1, j - 1, k)], cells[cat(i, j - 1, k)], cells[cat(i, j, k)], cells[cat(i - 1, j, k)], !inside);
      }
    }
    if (performance.now() - t > 12) {
      await pause();
      t = performance.now();
    }
  }

  // Normals from the field's gradient (tetrahedral differences): smooth porcelain, no facets
  const nrm = new Float32Array(pos.length);
  const e = cell * 0.5;
  for (let v = 0; v < pos.length; v += 3) {
    const x = pos[v];
    const y = pos[v + 1];
    const z = pos[v + 2];
    const a = sdf(x + e, y - e, z - e);
    const b = sdf(x - e, y - e, z + e);
    const c = sdf(x - e, y + e, z - e);
    const d = sdf(x + e, y + e, z + e);
    const gx = a - b - c + d;
    const gy = -a - b + c + d;
    const gz = -a + b - c + d;
    const l = Math.hypot(gx, gy, gz) || 1;
    nrm[v] = gx / l;
    nrm[v + 1] = gy / l;
    nrm[v + 2] = gz / l;
  }

  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
  g.setAttribute("normal", new BufferAttribute(nrm, 3));
  g.setIndex(idx);
  g.computeBoundingSphere();
  return g;
}
