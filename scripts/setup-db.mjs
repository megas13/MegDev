const HASURA_URL = "https://qoiiuebjfveqekkrpcrm.graphql.eu-central-1.nhost.run/v2/query"
const ADMIN_SECRET = process.env.NHOST_ADMIN_SECRET

async function runSQL(sql) {
  const res = await fetch(HASURA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-hasura-admin-secret": ADMIN_SECRET },
    body: JSON.stringify({ type: "run_sql", args: { sql } }),
  })
  const json = await res.json()
  if (json.error) throw new Error(json.error)
  return json
}

async function setup() {
  console.log("Creating tables...")

  await runSQL(`
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
  `)
  console.log("  ✓ blog_posts")

  await runSQL(`
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
  `)
  console.log("  ✓ portfolio_projects")

  await runSQL(`
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
  `)
  console.log("  ✓ contact_messages")

  console.log("\nAll tables created! Now tracking in Hasura...")

  for (const table of ["blog_posts", "portfolio_projects", "contact_messages"]) {
    await runSQL(`SELECT add_evolved_table('${table}');`)
  }

  console.log("Done! Restart your Next.js dev server and go to /admin")
}

setup().catch(console.error)
