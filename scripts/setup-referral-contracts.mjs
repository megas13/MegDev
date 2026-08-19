import { existsSync, readFileSync } from "node:fs"

const env = existsSync(".env.local") ? Object.fromEntries(
  readFileSync(".env.local", "utf8").split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => { const separator = line.indexOf("="); return [line.slice(0, separator), line.slice(separator + 1)] }),
) : {}

const adminSecret = process.env.NHOST_ADMIN_SECRET || env.NHOST_ADMIN_SECRET
if (!adminSecret) throw new Error("NHOST_ADMIN_SECRET bulunamadı")

const base = "qoiiuebjfveqekkrpcrm.hasura.eu-central-1.nhost.run"
const headers = { "Content-Type": "application/json", "x-hasura-admin-secret": adminSecret }
async function call(path, body) {
  const response = await fetch(`https://${base}${path}`, { method: "POST", headers, body: JSON.stringify(body) })
  const result = await response.json()
  if (!response.ok || result.error) throw new Error(result.error || JSON.stringify(result))
  return result
}

await call("/v2/query", { type: "run_sql", args: { source: "default", sql: `
CREATE TABLE IF NOT EXISTS public.referral_contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent','active','termination_pending','terminated','cancelled')),
  provider_name TEXT NOT NULL,
  provider_address TEXT NOT NULL,
  provider_tax_no TEXT,
  representative_name TEXT NOT NULL,
  representative_email TEXT NOT NULL,
  representative_phone TEXT,
  scope TEXT NOT NULL,
  commission_type TEXT NOT NULL CHECK (commission_type IN ('percentage','fixed')),
  commission_value NUMERIC(14,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'TRY',
  start_date DATE NOT NULL,
  end_date DATE,
  payment_terms TEXT NOT NULL,
  special_terms TEXT,
  contract_version TEXT NOT NULL,
  contract_hash TEXT NOT NULL,
  contract_text TEXT NOT NULL,
  accepted_at TIMESTAMPTZ,
  accepted_ip TEXT,
  accepted_user_agent TEXT,
  email_verified BOOLEAN NOT NULL DEFAULT false,
  termination_effective_date DATE,
  termination_reason TEXT,
  termination_settlement TEXT,
  termination_version TEXT,
  termination_hash TEXT,
  termination_text TEXT,
  termination_requested_at TIMESTAMPTZ,
  termination_accepted_at TIMESTAMPTZ,
  termination_ip TEXT,
  termination_user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS referral_contracts_status_idx ON public.referral_contracts(status);
CREATE INDEX IF NOT EXISTS referral_contracts_email_idx ON public.referral_contracts(representative_email);

CREATE TABLE IF NOT EXISTS public.referral_verification_codes (
  contract_id UUID PRIMARY KEY REFERENCES public.referral_contracts(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL CHECK (purpose IN ('acceptance','termination')),
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);` } })

for (const name of ["referral_contracts", "referral_verification_codes"]) {
  try {
    await call("/v1/metadata", { type: "pg_track_table", args: { source: "default", table: { schema: "public", name } } })
  } catch (error) {
    if (!String(error).includes("already tracked")) throw error
  }
}
console.log("Müşteri bulma sözleşmesi tabloları hazır.")
