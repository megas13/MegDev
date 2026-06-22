import { createNhostClient } from "@nhost/nhost-js"

export const nhost = createNhostClient({
  subdomain: "qoiiuebjfveqekkrpcrm",
  region: "eu-central-1",
})

const NHOST_ADMIN_SECRET = process.env.NHOST_ADMIN_SECRET

const NHOST_GRAPHQL_URL =
  "https://qoiiuebjfveqekkrpcrm.graphql.eu-central-1.nhost.run/v1"

export async function adminRequest(query: string, variables?: Record<string, unknown>) {
  const res = await fetch(NHOST_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": NHOST_ADMIN_SECRET!,
    },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data
}
