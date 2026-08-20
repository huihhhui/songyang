/** Generate a reference-image preview through the project's image API. */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

function readEnv(text) {
  return Object.fromEntries(
    text
      .split(/\r?\n/)
      .filter((line) => line.trim() && !line.trim().startsWith('#') && line.includes('='))
      .map((line) => {
        const index = line.indexOf('=')
        return [line.slice(0, index).trim(), line.slice(index + 1).trim()]
      }),
  )
}

const args = process.argv.slice(2)
const value = (name) => args[args.indexOf(name) + 1]
const promptFile = value('--prompt-file')
const inputFile = value('--input')
const outputFile = value('--out')
const size = value('--size') ?? '1024x1024'
const quality = value('--quality') ?? 'low'

if (!promptFile || !inputFile || !outputFile) {
  throw new Error('Usage: --prompt-file <file> --input <image> --out <image>')
}

const projectRoot = resolve(import.meta.dirname, '..')
const env = readEnv(await readFile(resolve(projectRoot, '.env.image.local'), 'utf8'))
const prompt = await readFile(promptFile, 'utf8')
const imageBytes = await readFile(inputFile)
const form = new FormData()
form.set('model', env.IMAGE_MODEL ?? 'gpt-image-2')
form.set('prompt', prompt)
form.set('n', '1')
form.set('size', size)
form.set('quality', quality)
form.set('response_format', 'b64_json')
form.set('image', new Blob([imageBytes], { type: inputFile.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg' }), 'reference.jpg')

const baseUrl = (env.IMAGE_API_BASE_URL ?? '').replace(/\/$/, '')
const endpoint = baseUrl.endsWith('/v1') ? `${baseUrl}/images/edits` : `${baseUrl}/v1/images/edits`
let lastError
for (let attempt = 0; attempt < 2; attempt += 1) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.IMAGE_API_KEY}` },
      body: form,
    })
    if (!response.ok) throw new Error(`Image API ${response.status}: ${await response.text()}`)
    const body = await response.json()
    const result = body?.data?.[0]
    const data = result?.b64_json
      ? Buffer.from(result.b64_json, 'base64')
      : result?.url
        ? Buffer.from(await (await fetch(result.url)).arrayBuffer())
        : null
    if (!data) throw new Error('Image API response contains neither b64_json nor url')
    await mkdir(dirname(outputFile), { recursive: true })
    await writeFile(outputFile, data)
    console.log(`Wrote ${outputFile}`)
    process.exit(0)
  } catch (error) {
    lastError = error
    if (attempt === 0) await new Promise((done) => setTimeout(done, 3000))
  }
}
throw lastError
