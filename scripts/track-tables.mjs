const ADMIN_SECRET = process.env.NHOST_ADMIN_SECRET
const METADATA_URL = "https://qoiiuebjfveqekkrpcrm.hasura.eu-central-1.nhost.run/v1/metadata"

async function trackTable(name) {
  const res = await fetch(METADATA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-hasura-admin-secret": ADMIN_SECRET },
    body: JSON.stringify({
      type: "pg_track_table",
      args: { source: "default", table: { name, schema: "public" } },
    }),
  })
  const text = await res.text()
  console.log(name, "->", text.length > 100 ? text.slice(0, 100) : text)
}

const tables = ["blog_posts", "portfolio_projects", "contact_messages"]
for (const t of tables) {
  await trackTable(t)
}
console.log("Done!")
