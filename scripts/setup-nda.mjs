import { readFileSync } from "node:fs"

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const separator = line.indexOf("=")
      return [line.slice(0, separator), line.slice(separator + 1)]
    }),
)

const adminSecret = process.env.NHOST_ADMIN_SECRET || env.NHOST_ADMIN_SECRET
if (!adminSecret) throw new Error("NHOST_ADMIN_SECRET bulunamadı")

const metadataUrl = "https://qoiiuebjfveqekkrpcrm.hasura.eu-central-1.nhost.run/v1/metadata"
const queryUrl = "https://qoiiuebjfveqekkrpcrm.hasura.eu-central-1.nhost.run/v2/query"
const headers = { "Content-Type": "application/json", "x-hasura-admin-secret": adminSecret }

async function metadata(body) {
  const response = await fetch(metadataUrl, { method: "POST", headers, body: JSON.stringify(body) })
  const result = await response.json()
  if (!response.ok || result.error) throw new Error(result.error || JSON.stringify(result))
  return result
}

async function runSql(sql) {
  const response = await fetch(queryUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({ type: "run_sql", args: { source: "default", sql } }),
  })
  const result = await response.json()
  if (!response.ok || result.error) throw new Error(result.error || JSON.stringify(result))
  return result
}

const sql = `
CREATE TABLE IF NOT EXISTS public.nda_acceptances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL UNIQUE REFERENCES public.projects(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  contract_version TEXT NOT NULL,
  contract_hash TEXT NOT NULL,
  contract_text TEXT NOT NULL,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_ip TEXT,
  user_agent TEXT,
  email_verified BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.nda_verification_codes (
  project_id UUID PRIMARY KEY REFERENCES public.projects(id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
`

await runSql(sql)
for (const name of ["nda_acceptances", "nda_verification_codes"]) {
  try {
    await metadata({ type: "pg_track_table", args: { source: "default", table: { schema: "public", name } } })
  } catch (error) {
    if (!String(error).includes("already tracked")) throw error
  }
}
console.log("NDA tabloları hazır.")
