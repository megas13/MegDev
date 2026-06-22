import { NextResponse } from "next/server"

export async function GET() {
  const secret = process.env.NHOST_ADMIN_SECRET
  const url = "https://qoiiuebjfveqekkrpcrm.graphql.eu-central-1.nhost.run/v1"
  const query = `{ blog_posts(order_by: {created_at: desc}) { id title } }`

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": secret || "",
      },
      body: JSON.stringify({ query }),
    })
    const text = await res.text()
    return NextResponse.json({ secret: secret ? "exists" : "missing", status: res.status, body: text.slice(0, 200) })
  } catch (e: any) {
    return NextResponse.json({ error: e.message })
  }
}
