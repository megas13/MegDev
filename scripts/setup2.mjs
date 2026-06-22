const ADMIN_SECRET = process.env.NHOST_ADMIN_SECRET
const HASURA_URL = "https://qoiiuebjfveqekkrpcrm.hasura.eu-central-1.nhost.run/v1/graphql"
const GRAPHQL_URL = "https://qoiiuebjfveqekkrpcrm.graphql.eu-central-1.nhost.run/v1"

async function gql(query, variables) {
  const res = await fetch(HASURA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-hasura-admin-secret": ADMIN_SECRET },
    body: JSON.stringify({ query, variables }),
  })
  return res.json()
}

const sql = `
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  author TEXT DEFAULT 'Meg Dev',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  image_url TEXT,
  category TEXT,
  technologies JSONB DEFAULT '[]',
  project_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
`

// Try /v1/metadata with run_sql
async function tryMetadata() {
  const url = "https://qoiiuebjfveqekkrpcrm.hasura.eu-central-1.nhost.run/v1/metadata"
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-hasura-admin-secret": ADMIN_SECRET },
    body: JSON.stringify({ type: "run_sql", args: { sql, source: "default" } }),
  })
  return res.text()
}

async function main() {
  console.log("Trying metadata API...")
  const result = await tryMetadata()
  console.log("Result:", result.slice(0, 200))
}

main().catch(console.error)
