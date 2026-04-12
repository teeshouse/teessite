/**
 * Regenerate favicon assets from the Sanity-hosted logo.
 *
 * Run:  node scripts/generate-favicons.mjs
 *
 * Writes:
 *   src/app/icon.png        (32x32)  — modern browsers
 *   src/app/apple-icon.png  (180x180) — iOS home screen
 *   src/app/favicon.ico     (16+32)  — legacy browsers
 *
 * Next 14 auto-serves anything named icon.*, apple-icon.*, or favicon.ico
 * directly from src/app/ with correct headers. No layout.tsx metadata
 * block needed for icons anymore — keep it clean.
 */
import sharp from "sharp"
import pngToIco from "png-to-ico"
import { writeFile, mkdir } from "node:fs/promises"
import { dirname, resolve } from "node:path"

const SRC = "https://cdn.sanity.io/images/zbeb0ctt/production/44f842016c7584b95a281fcfdba5ec79a837304b-612x612.png"
const OUT_DIR = resolve("src/app")

async function fetchSource() {
  const res = await fetch(SRC)
  if (!res.ok) throw new Error(`Failed to fetch source logo: ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

async function write(path, buf) {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, buf)
  console.log("wrote", path, `(${buf.length} bytes)`)
}

async function main() {
  console.log("fetching", SRC)
  const src = await fetchSource()

  // icon.png — 32x32 for <link rel="icon"> in modern browsers
  const icon32 = await sharp(src).resize(32, 32, { fit: "contain", background: { r:0,g:0,b:0,alpha:0 } }).png({ compressionLevel: 9 }).toBuffer()
  await write(resolve(OUT_DIR, "icon.png"), icon32)

  // apple-icon.png — 180x180 for iOS home screen bookmarks
  const apple = await sharp(src).resize(180, 180, { fit: "contain", background: { r:0,g:0,b:0,alpha:0 } }).png({ compressionLevel: 9 }).toBuffer()
  await write(resolve(OUT_DIR, "apple-icon.png"), apple)

  // favicon.ico — multi-resolution .ico with 16 and 32 for legacy browsers
  const ico16 = await sharp(src).resize(16, 16, { fit: "contain", background: { r:0,g:0,b:0,alpha:0 } }).png().toBuffer()
  const icoBuf = await pngToIco([ico16, icon32])
  await write(resolve(OUT_DIR, "favicon.ico"), icoBuf)

  console.log("done")
}

main().catch(err => { console.error(err); process.exit(1) })
