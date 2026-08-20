import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { chromium } from '../node_modules/.pnpm/playwright@1.61.1/node_modules/playwright/index.mjs'

const root = resolve(import.meta.dirname, '..')
const out = resolve(root, 'output/imagegen/station-comparison-v7/photo-distill')
const entries = [
  ['bq-02-teacher', 'D:/codex_sy/sucai/28，27，14N 119，39，21E/18.jpg', 'person', 'right', 'red garment and woven collar'],
  ['bq-02-weaving', 'D:/codex_sy/sucai/28，27，14N 119，39，21E/17.jpg', 'hands', 'right', 'blue white black woven threads'],
  ['sz-01-peach', 'D:/codex_sy/sucai/28，27，5N 119，34，11E/9.jpg', 'stream', 'right', 'water, stones, orange peach cue'],
  ['sz-02-owner', 'D:/codex_sy/sucai/28，27，8N 119，34，13E/8.jpg', 'person', 'left', 'short hair and pale clothing'],
  ['sz-02-worktable', 'D:/codex_sy/sucai/28，27，8N 119，34，13E/3.jpg', 'table', 'center', 'wood, clay, paper and warm lamp'],
]
const html = (e) => {
  const [id, src, kind, anchor, material] = e
  const shapes = kind === 'stream'
    ? `<path d="M0 650 C260 590 420 700 620 610 S1040 500 1400 580"/><path d="M0 730 C260 660 430 790 720 690 S1100 620 1400 700"/><circle cx="1050" cy="530" r="74"/><circle cx="1160" cy="570" r="52"/>`
    : kind === 'hands'
      ? `<path d="M150 650 C330 520 470 470 650 560 S980 680 1320 440"/><path d="M110 720 C340 600 500 560 700 640 S1040 730 1390 520"/><circle cx="900" cy="510" r="90"/>`
      : kind === 'table'
        ? `<path d="M0 680 L1400 590 L1400 760 L0 850 Z"/><path d="M120 470 C420 390 760 430 1280 330"/><circle cx="720" cy="470" r="118"/>`
        : `<path d="M${anchor === 'right' ? 920 : 280} 250 C${anchor === 'right' ? 1040 : 360} 120 ${anchor === 'right' ? 1240 : 540} 180 ${anchor === 'right' ? 1320 : 720} 330"/><path d="M${anchor === 'right' ? 880 : 220} 430 C${anchor === 'right' ? 1080 : 360} 350 ${anchor === 'right' ? 1200 : 540} 480 ${anchor === 'right' ? 1320 : 720} 390"/>`
  return `<!doctype html><html><style>html,body{margin:0;background:#e9e3d5}.poster{width:1400px;height:933px;position:relative;overflow:hidden;background:#e9e3d5}.poster:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 20% 30%,#fff8 0 2%,transparent 35%),radial-gradient(circle at 80% 70%,#b9aa8a22,transparent 40%);mix-blend-mode:multiply}.photo{position:absolute;${anchor==='right'?'right:70px':anchor==='left'?'left:70px':'left:230px'};top:145px;width:520px;height:560px;object-fit:cover;filter:saturate(.72) contrast(1.08);mask-image:radial-gradient(ellipse at center,#000 0 48%,transparent 78%)}svg{position:absolute;inset:0;fill:none;stroke:#57524a;stroke-width:8;opacity:.62;mix-blend-mode:multiply}.accent{position:absolute;${anchor==='right'?'left:100px':'right:100px'};top:140px;width:360px;height:220px;background:#c96b3d22;filter:url(#rough)}.meta{position:absolute;left:70px;bottom:58px;font:14px monospace;letter-spacing:.14em;color:#756e62}.quiet{position:absolute;${anchor==='right'?'left:70px':'right:70px'};top:190px;width:360px;height:390px;border-top:1px solid #57524a44}</style><svg width="0" height="0"><defs><filter id="rough"><feTurbulence baseFrequency=".03" numOctaves="2"/><feDisplacementMap in="SourceGraphic" scale="9"/></filter></defs></svg><div class="poster"><div class="accent"></div><div class="quiet"></div><img class="photo" src="file:///${src}"/><svg viewBox="0 0 1400 933">${shapes}</svg><div class="meta">PHOTO DISTILL / ${id.toUpperCase()}<br>${material.toUpperCase()}</div></div></html>`
}
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ headless: true })
for (const e of entries) {
  const file = resolve(out, `${e[0]}.html`)
  await writeFile(file, html(e))
  const page = await browser.newPage({ viewport: { width: 1400, height: 933 }, deviceScaleFactor: 1 })
  await page.goto(`file:///${file.replaceAll('\\', '/')}`)
  await page.screenshot({ path: resolve(out, `${e[0]}.png`) })
  await page.close()
}
await browser.close()
console.log(`Wrote ${entries.length} photo-distill comparisons to ${out}`)
