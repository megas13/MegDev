import {
  MAX_MANIFEST_BYTES,
  validateDemoManifest,
  type DemoManifest,
} from "./demo-page-files"

const MANIFEST_PATTERN = /<!--MEGDEV-DEMO-FILES-V1:([A-Za-z0-9+/=]+)-->/
const MANIFEST_PATTERN_ALL = /<!--MEGDEV-DEMO-FILES-V1:([A-Za-z0-9+/=]+)-->/g

export function encodeDemoManifest(manifest: DemoManifest) {
  const json = JSON.stringify(manifest)
  const bytes = new TextEncoder().encode(json)
  let binary = ""
  const chunk = 0x8000
  for (let index = 0; index < bytes.length; index += chunk) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunk))
  }
  return `<!--MEGDEV-DEMO-FILES-V1:${btoa(binary)}-->`
}

export function decodeDemoManifest(encoded: string): DemoManifest | null {
  try {
    const binary = atob(encoded)
    const bytes = new Uint8Array(binary.length)
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index)
    }
    const json = new TextDecoder().decode(bytes)
    return validateDemoManifest(JSON.parse(json))
  } catch {
    return null
  }
}

export function stripDemoManifest(html: string) {
  return html.replace(MANIFEST_PATTERN_ALL, "")
}

export function readDemoPage(html: string) {
  const match = html.match(MANIFEST_PATTERN)
  const manifest = match ? decodeDemoManifest(match[1]) : null
  return {
    manifest,
    html: match ? stripDemoManifest(html) : html,
  }
}

export function embedDemoManifest(html: string, manifest: DemoManifest) {
  const comment = encodeDemoManifest(manifest)
  if (comment.length > MAX_MANIFEST_BYTES) {
    throw new Error("Site dosya listesi çok büyük.")
  }

  const clean = stripDemoManifest(html)
  return `${clean}${clean.endsWith("\n") ? "" : "\n"}${comment}`
}

function escapeHtmlAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

export function injectBaseHref(html: string, href: string) {
  if (/<base[\s>]/i.test(html)) return html

  const tag = `<base href="${escapeHtmlAttribute(href)}">`
  const head = html.match(/<head[^>]*>/i)
  if (head?.index !== undefined) {
    const at = head.index + head[0].length
    return html.slice(0, at) + tag + html.slice(at)
  }

  const doctype = html.match(/<!doctype[^>]*>/i)
  if (doctype?.index !== undefined) {
    const at = doctype.index + doctype[0].length
    return html.slice(0, at) + tag + html.slice(at)
  }

  return tag + html
}
