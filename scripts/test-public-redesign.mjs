import assert from 'node:assert/strict'
import fs from 'node:fs/promises'

const home = await fs.readFile('src/app/page.tsx', 'utf8')
const theme = await fs.readFile('src/components/layout/theme-customizer.tsx', 'utf8')
assert.ok(home.includes('<MegdevLanding />'), 'The cube hero remains')
assert.ok(!home.includes('LaptopScroll'), 'No laptop animation on the homepage')
assert.ok(!theme.includes('PublicThemeCustomizer'), 'The public palette is fixed')
assert.ok(home.includes('hidden={!calculatorOpen}'), 'The calculator starts collapsed')
assert.ok(!home.includes('portfolioItems'), 'No hardcoded example projects on the homepage')

const origin = process.env.I18N_TEST_ORIGIN
if (origin) {
  for (const [route, label] of [['/', 'İşinize uygun.'], ['/en', 'Built for your business.'], ['/de', 'Für Ihr Unternehmen.']]) {
    const response = await fetch(origin + route)
    assert.equal(response.status, 200, route)
    const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
    assert.ok(html.includes(label), route + ': new localized homepage')
    assert.ok(html.includes('glass-cube-canvas'), route + ': cube preserved')
    assert.ok(!/<video\b/.test(html), route + ': no video or scroll scrubbing')
    assert.ok(/id="home-project-calculator" hidden/.test(html), route + ': calculator collapsed')
    assert.ok(!html.includes('public-theme-panel'), route + ': no palette switcher')
  }
}
console.log('PASS: single public theme, cube preserved, no laptop, collapsed calculator, localized homepage')
