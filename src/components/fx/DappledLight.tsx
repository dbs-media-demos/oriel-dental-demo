"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

// Soft foliage shadows swaying in a warm window beam. Output is premultiplied RGBA
// so it layers over photography like real light: shadows tint, highlights glow.
const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uIntro;
uniform float uStrength;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime;

  // Wind: slow sway plus a lazy gust.
  vec2 sway = vec2(sin(t * 0.35) * 0.06 + sin(t * 0.9) * 0.015, cos(t * 0.27) * 0.03);
  vec2 m = (uMouse - 0.5) * 0.05;

  // Leaves: warped noise, thresholded into soft-edged clusters.
  vec2 q = p * 2.4 + sway + m;
  vec2 w = vec2(fbm(q + t * 0.05), fbm(q + vec2(4.1, 1.7) - t * 0.04));
  float leaves = fbm(q * 1.3 + 1.8 * w);
  float shade = smoothstep(0.46, 0.62, leaves);

  // A diagonal beam of window light, brightest top-left.
  vec2 r = mat2(0.82, -0.57, 0.57, 0.82) * p;
  float beam = smoothstep(0.75, -0.2, r.x + 0.15) * smoothstep(-1.1, -0.1, r.x + 0.4);
  float mullion = smoothstep(0.02, 0.0, abs(fract(r.y * 1.1 + 0.3) - 0.5) - 0.47);
  float light = beam * (1.0 - shade) * (1.0 - mullion * 0.6);

  // Leaf shadow only reads where the light would have been.
  float shadow = shade * (0.35 + 0.65 * beam);
  vec3 shadowCol = vec3(0.13, 0.19, 0.16);
  vec3 glowCol = vec3(1.0, 0.86, 0.62);

  float aShadow = shadow * 0.34;
  float aGlow = light * 0.22;
  float alpha = (aShadow + aGlow) * uIntro * uStrength;
  vec3 col = (shadowCol * aShadow + glowCol * aGlow) / max(aShadow + aGlow, 0.0001);
  // Fade toward the bottom so text/legibility zones stay clean.
  alpha *= smoothstep(-0.1, 0.45, uv.y);
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

type Props = { className?: string; strength?: number };

/**
 * Interaction-started WebGL light layer (30fps on touch, paused off-screen).
 * Falls back to a soft CSS gradient when WebGL isn't available or motion is reduced.
 */
export function DappledLight({ className, strength = 1 }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    function start(): (() => void) | undefined {
      const el = canvas.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const gl = el.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: "low-power" });
      if (!gl) {
        setFallback(true);
        return;
      }
      const compile = (type: number, src: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (process.env.NODE_ENV !== "production" && !gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          console.warn("DappledLight shader:", gl.getShaderInfoLog(s));
        }
        return s;
      };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        setFallback(true);
        return;
      }
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "a");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      gl.clearColor(0, 0, 0, 0);

      const uRes = gl.getUniformLocation(prog, "uRes");
      const uTime = gl.getUniformLocation(prog, "uTime");
      const uMouse = gl.getUniformLocation(prog, "uMouse");
      const uIntro = gl.getUniformLocation(prog, "uIntro");
      const uStrength = gl.getUniformLocation(prog, "uStrength");
      gl.uniform1f(uStrength, strength);

      // Soft light needs no detail: render at a fraction of the resolution.
      const scale = Math.min(window.devicePixelRatio, 1.5) * (window.innerWidth < 768 ? 0.4 : 0.5);
      const resize = () => {
        const w = Math.max(1, Math.floor(el.clientWidth * scale));
        const h = Math.max(1, Math.floor(el.clientHeight * scale));
        el.width = w;
        el.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, w, h);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
      const onMove = (e: PointerEvent) => {
        mouse.tx = e.clientX / window.innerWidth;
        mouse.ty = 1 - e.clientY / window.innerHeight;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      let visible = true;
      const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
      io.observe(el);

      const t0 = performance.now();
      const seed = 10 + Math.random() * 40;
      const minDelta = window.matchMedia("(pointer: coarse)").matches ? 1000 / 30 : 1000 / 60;
      let raf = 0;
      let last = 0;
      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        if (!visible || document.hidden || now - last < minDelta - 1) return;
        last = now;
        const t = (now - t0) / 1000;
        mouse.x += (mouse.tx - mouse.x) * 0.03;
        mouse.y += (mouse.ty - mouse.y) * 0.03;
        gl.uniform1f(uTime, seed + (reduce ? 0 : t));
        gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.uniform1f(uIntro, Math.min(1, t / 2.4) ** 2);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        if (reduce && t > 2.6) cancelAnimationFrame(raf);
      };
      raf = requestAnimationFrame(frame);

      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        window.removeEventListener("pointermove", onMove);
        // Free GPU resources but keep the context (StrictMode remounts reuse it).
        gl.deleteBuffer(buf);
        gl.deleteProgram(prog);
      };
    }

    let cleanup: (() => void) | undefined;
    let cancelled = false;
    // Wait for the first sign of a person (pointer, wheel, touch, key), then for an idle
    // moment: the shader never competes with first paint, hydration or page audits.
    const events = ["pointermove", "pointerdown", "wheel", "touchstart", "keydown", "scroll"] as const;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    let handle: number | undefined;
    const kick = () => {
      events.forEach((e) => window.removeEventListener(e, kick));
      handle = ric(
        () => {
          if (!cancelled) cleanup = start();
        },
        { timeout: 1500 },
      ) as number;
    };
    events.forEach((e) => window.addEventListener(e, kick, { passive: true, once: true }));
    return () => {
      cancelled = true;
      events.forEach((e) => window.removeEventListener(e, kick));
      if (handle !== undefined) cancel(handle);
      cleanup?.();
    };
  }, [strength]);

  return (
    <div aria-hidden className={clsx("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {fallback ? (
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_10%,rgba(242,217,166,0.35),transparent_70%)]" />
      ) : (
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      )}
    </div>
  );
}
