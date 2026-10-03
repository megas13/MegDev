export type Dictionary = Record<string, string>
const patterns = new WeakMap<Dictionary, Array<{ pattern: RegExp; replacement: string }>>()
export function translate(value: string, dictionary: Dictionary): string {
  const normalized = value.replace(/\s+/g, " ").trim()
  const translated = dictionary[normalized]
  if (translated !== undefined) {
    return `${/^\s/.test(value) ? " " : ""}${translated}${/\s$/.test(value) ? " " : ""}`
  }
  // Preserve punctuation around translated UI labels without touching user content.
  const match = normalized.match(/^(.+?)([:.!?])$/)
  if (match && dictionary[match[1]]) return dictionary[match[1]] + match[2]
  // Only explicit product templates are interpolated; arbitrary customer text
  // remains unchanged. Cache compiled patterns for frequently rendered labels.
  let templates = patterns.get(dictionary)
  if (!templates) {
    templates = Object.entries(dictionary).filter(([key]) => key.includes("{value}")).map(([key,replacement]) => ({
      pattern: new RegExp("^" + key.split("{value}").map(part => part.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("(.+?)") + "$"), replacement,
    }))
    patterns.set(dictionary,templates)
  }
  for (const { pattern, replacement } of templates) {
    const values = normalized.match(pattern)
    if (values) return replacement.replace("{value}",values[1])
  }
  return value
}
