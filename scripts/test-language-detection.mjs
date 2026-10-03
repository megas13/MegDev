import assert from 'node:assert/strict'

const origin = process.env.I18N_TEST_ORIGIN
if (!origin) throw new Error('Set I18N_TEST_ORIGIN to the running local Next server.')

for (const [path, language, cookie, expected] of [
  ['/', 'en-US,en;q=0.9', '', '/en'],
  ['/contact?subject=demo', 'de-DE,de;q=0.9', '', '/de/contact?subject=demo'],
  ['/portfolio', 'fr-FR,en;q=0.8,de;q=0.9', '', '/de/portfolio'],
  ['/', 'tr-TR,tr;q=0.9', 'megdev-language=en', '/en'],
  ['/', 'en-US', 'megdev-language=de', '/de'],
  ['/', 'de-DE', 'megdev-language=invalid', '/de'],
]) {
  const response = await fetch(origin+path,{redirect:'manual',headers:{'Accept-Language':language,Cookie:cookie}})
  assert.equal(response.status,307,path)
  assert.equal(new URL(response.headers.get('location'),origin).href,origin+expected,path)
  assert.ok(response.headers.get('vary').includes('Accept-Language'),path)
  assert.ok(response.headers.get('cache-control').includes('no-store'),path)
  assert.equal(response.headers.get('set-cookie'),null,'Automatic detection does not save a manual choice')
}

for (const [path, language, cookie, locale] of [
  ['/', 'tr-TR', '', 'tr'],
  ['/', 'fr-FR', '', 'tr'],
  ['/', 'de-DE', 'megdev-language=tr', 'tr'],
  ['/en/contact', 'de-DE', 'megdev-language=tr', 'en'],
  ['/de', 'en-US', 'megdev-language=en', 'de'],
  ['/tr/about', 'en-US', 'megdev-language=de', 'tr'],
]) {
  const response = await fetch(origin+path,{redirect:'manual',headers:{'Accept-Language':language,Cookie:cookie}})
  assert.equal(response.status,200,path)
  assert.ok((await response.text()).includes(`<html lang="${locale}"`),path)
}

for (const path of ['/favicon.png', '/fonts/GeistPixel-Circle.woff2', '/api/admin-session']) {
  const response = await fetch(origin+path,{redirect:'manual',headers:{'Accept-Language':'de-DE'}})
  assert.notEqual(response.status,307,path)
  assert.equal(response.headers.get('location'),null,path)
}
console.log('PASS: browser language redirects, manual choice, explicit URLs, query preservation and asset/API exclusions')
