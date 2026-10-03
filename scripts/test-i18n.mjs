import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import ts from 'typescript'

async function moduleFromSource(file) {
  const source = await fs.readFile(file,'utf8')
  const {outputText} = ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}})
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
}
const {localizedHref,basePath,preferredLocale} = await moduleFromSource('src/lib/i18n/config.ts')
const {translate} = await moduleFromSource('src/lib/i18n/translate.ts')
const en = JSON.parse(await fs.readFile('src/lib/i18n/en.json','utf8'))
const de = JSON.parse(await fs.readFile('src/lib/i18n/de.json','utf8'))
assert.deepEqual(Object.keys(en).sort(),Object.keys(de).sort(),'Both languages must cover the same strings')
for (const [href,locale,expected] of [
  ['/','en','/en'], ['/about','de','/de/about'], ['/de/about','en','/en/about'], ['/en/about','tr','/about'],
  ['/services?q=crm#details','de','/de/services?q=crm#details'], ['/api/track/test','de','/api/track/test'],
  ['/downloads/subtrack.apk','en','/downloads/subtrack.apk'], ['/downloads','en','/en/downloads'],
  ['https://example.com','de','https://example.com'], ['//cdn.example.com/file','en','//cdn.example.com/file'],
  ['#services','de','#services'], ['mailto:destek@megdev.info','en','mailto:destek@megdev.info'],
  ['/en?project=test#quote','de','/de?project=test#quote'], ['/de/api/projects','en','/api/projects'],
]) assert.equal(localizedHref(href,locale),expected)
assert.equal(basePath('/de/admin/projects'),'/admin/projects')
for (const [header,saved,expected] of [
  ['en-US,en;q=0.9,tr;q=0.8',undefined,'en'],
  ['de-DE,de;q=0.9,en;q=0.8',undefined,'de'],
  ['tr-TR,en;q=0.8',undefined,'tr'],
  ['fr-FR,fr;q=0.9',undefined,'tr'],
  ['fr-FR,de;q=0.8,en;q=0.9',undefined,'en'],
  ['en;q=0,de;q=0.8',undefined,'de'],
  ['en;q=invalid,de;q=0.5',undefined,'de'],
  ['EN-gb;q=0.7,DE-at;q=0.9',undefined,'de'],
  ['en;q=0.8,de;q=0.8',undefined,'en'],
  ['de-DE','tr','tr'],
  ['tr-TR','en','en'],
  ['en-US','de','de'],
  ['en-US','invalid','en'],
  [null,undefined,'tr'],
  ['*',undefined,'tr'],
]) assert.equal(preferredLocale(header,saved),expected)
assert.equal(translate('İletişim',en),'Contact')
assert.equal(translate('Hakkımızda',de),'Über uns')
assert.equal(translate(' İletişim ',en),' Contact ')
assert.equal(translate('5 yıldız',de),'5 Sterne')
assert.equal(translate('6 haneli kod demo@example.com adresine gönderildi.',en),'A six-digit code has been sent to demo@example.com.')
assert.equal(translate('CUSTOMER MESSAGE\nLeave this unchanged',en),'CUSTOMER MESSAGE\nLeave this unchanged')
assert.equal(translate('Arbitrary project',{}),'Arbitrary project')
console.log(`PASS: route handling, interpolation, customer content preservation and ${Object.keys(en).length} bilingual strings`)

// Optional read-only HTTP smoke checks against a running local Next server.
const origin = process.env.I18N_TEST_ORIGIN
if (origin) {
  const cases = [
    ['/','tr','Fikirleriniz için'], ['/en','en','Your ideas.'], ['/de','de','Ihre Ideen.'],
    ['/en/about','en','About us'], ['/de/services','de','Unsere Leistungen'],
    ['/en/contact','en','Full name'], ['/de/kvkk','de','Verantwortlicher'],
    ['/en/kosullar','en','Terms of use'], ['/de/subtrack','de','Ihre Abonnements'],
    ['/en/subtrack-hesap-silme','en','Send verification code'],
    ['/de/subtrack-gizlilik-sozlesmesi','de','Datenschutzerklärung'],
    ['/de/gizlilik-sozlesmesi','de','Geheimhaltungsvereinbarung'],
    ['/en/services/kurumsal-web-sitesi','en','Corporate website'],
    ['/de/admin','de','Sprache'],
  ]
  for (const [route,language,expected] of cases) {
    const response = await fetch(origin+route)
    assert.equal(response.status,200,route)
    const html = await response.text()
    assert.ok(html.includes(`<html lang="${language}"`),`${route}: HTML language`)
    const rendered = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/g,'')
    assert.ok(rendered.includes(expected),`${route}: translated SSR content`)
    console.log('PASS:',route)
  }
}
