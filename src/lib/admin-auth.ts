import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

export const ADMIN_COOKIE = "meg_admin_session"

export function adminSessionValue() {
  const password = process.env.ADMIN_PASSWORD || "admin123"
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.NHOST_ADMIN_SECRET || password
  return createHmac("sha256", secret).update(`meg-admin:${password}`).digest("hex")
}

export async function isAdminRequest() {
  const value = (await cookies()).get(ADMIN_COOKIE)?.value || ""
  const expected = adminSessionValue()
  const left = Buffer.from(value)
  const right = Buffer.from(expected)
  return left.length === right.length && timingSafeEqual(left, right)
}
