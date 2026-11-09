/**
 * Renders the stills of the hero's porcelain tooth from the live three.js scene
 * (src/components/fx/tooth/scene.ts), so everyone without the live canvas (phones, tablets, reduced
 * motion, Save-Data) sees exactly what the desktop canvas draws on its first frame.
 *
 *   PLAYWRIGHT=<path to a playwright package> node scripts/render-tooth.mjs [png-dir]
 *
 * Needs Google Chrome (CHROME=<path> if it isn't in the usual place). Nothing is served: the page,
 * the scene and three.js are answered by the browser's own request interception. Writes
 * public/images/tooth/*.avif and *.webp; with a png-dir it also leaves the full-size PNGs there.
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const req = createRequire(path.join(ROOT, "package.json"));
const ts = req("typescript");
const pw = await import(pathToFileURL(createRequire(import.meta.url).resolve(process.env.PLAYWRIGHT || "playwright")).href);
const { chromium } = pw.default ?? pw;
const OUT = path.join(ROOT, "public/images/tooth");
const PNG = process.argv[2];
const FX = path.join(ROOT, "src/components/fx/tooth");

const tsToJs = (file) =>
  ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;

// name, render size, options, then the sizes to write
const shots = [
  { name: "room", w: 2400, h: 1500, opts: {}, sizes: [2400, 1600], quality: 74, avif: 50 },
  { name: "cameo", w: 600, h: 760, opts: { cameo: true }, sizes: [300], quality: 72, avif: 52 },
  // the exam's 3D scan, finished: the journey's window on desktop before the canvas, and phones' card
  { name: "scan", module: "scan", fn: "createScan", w: 1400, h: 1400, opts: {}, sizes: [1400, 900], quality: 74, avif: 52 },
  ...(process.env.DEBUG_SCAN ? [{ name: "scan-mid", module: "scan", fn: "createScan", w: 1000, h: 1000, opts: { at: 0.55 }, sizes: [1000], quality: 80, avif: 60 }] : []),
];

const browser = await chromium.launch({
  executablePath: process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: ["--ignore-gpu-blocklist", "--enable-gpu", "--use-angle=d3d11"],
});
fs.mkdirSync(OUT, { recursive: true });
for (const shot of shots) {
  const page = await browser.newPage({ viewport: { width: shot.w, height: shot.h }, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => console.error(e.message));
  page.on("console", (m) => m.type() === "error" && console.error(m.text()));
  const html = `<!doctype html><html><head><style>html,body{margin:0}canvas{width:${shot.w}px;height:${shot.h}px;display:block}</style>
<script type="importmap">{"imports":{"three":"http://still.local/three.module.js"}}</script></head><body><canvas id=c></canvas>
<script type="module">
import { ${shot.fn || "createTooth"} as create } from "http://still.local/${shot.module || "scene"}.js";
await create(document.getElementById("c"), ${JSON.stringify({ still: true, ...shot.opts })});
window.png = document.getElementById("c").toDataURL("image/png");
</script></body></html>`;
  await page.route("http://still.local/**", (route) => {
    const f = new URL(route.request().url()).pathname.slice(1);
    if (f === "index.html") return route.fulfill({ body: html, contentType: "text/html" });
    if (f === "scene.js" || f === "scan.js") return route.fulfill({ body: tsToJs(path.join(FX, f.replace(".js", ".ts"))), contentType: "text/javascript" });
    // the scene's own imports ("./molar") arrive without an extension
    if (!path.extname(f)) return route.fulfill({ body: tsToJs(path.join(FX, `${f}.ts`)), contentType: "text/javascript" });
    return route.fulfill({ path: path.join(ROOT, "node_modules/three/build", f), contentType: "text/javascript" });
  });
  await page.goto("http://still.local/index.html");
  const url = await page.waitForFunction(() => window.png, null, { timeout: 120000 }).then((h) => h.jsonValue());
  const png = Buffer.from(url.split(",")[1], "base64");
  if (PNG) fs.writeFileSync(path.join(PNG, `${shot.name}.png`), png);
  for (const size of shot.sizes) {
    const base = path.join(OUT, shot.sizes.length > 1 ? `${shot.name}-${size}` : shot.name);
    await sharp(png).resize(size).avif({ quality: shot.avif, effort: 7 }).toFile(`${base}.avif`);
    await sharp(png).resize(size).webp({ quality: shot.quality, effort: 6, smartSubsample: true }).toFile(`${base}.webp`);
    for (const ext of ["avif", "webp"]) console.log(path.relative(ROOT, `${base}.${ext}`), `${(fs.statSync(`${base}.${ext}`).size / 1024).toFixed(1)} KB`);
  }
  await page.close();
}
await browser.close();
