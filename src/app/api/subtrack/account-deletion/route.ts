const SUPABASE_URL =
  process.env.SUBTRACK_SUPABASE_URL?.trim() ||
  "https://zlqibagmfzapmpqquwzc.supabase.co"

const SUPABASE_PUBLISHABLE_KEY =
  process.env.SUBTRACK_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  "sb_publishable_xe4J1FToQlKaZhsgFznrjA_UzfngCLq"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CODE_PATTERN = /^\d{6,8}$/

type RequestBody = {
  action?: unknown
  email?: unknown
  code?: unknown
  website?: unknown
}

function json(message: string, status = 200) {
  return Response.json(
    { message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  )
}

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : ""
}

function supabaseHeaders(accessToken?: string) {
  return {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${accessToken || SUPABASE_PUBLISHABLE_KEY}`,
    "Content-Type": "application/json",
  }
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0)

  if (contentLength > 4096) {
    return json("İstek boyutu geçersiz.", 413)
  }

  let body: RequestBody

  try {
    body = (await request.json()) as RequestBody
  } catch {
    return json("Geçersiz istek.", 400)
  }

  if (body.website) {
    return json("İstek alınamadı.", 400)
  }

  const email = normalizeEmail(body.email)

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return json("Geçerli bir e-posta adresi girin.", 400)
  }

  if (body.action === "send-code") {
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/otp`, {
        method: "POST",
        headers: supabaseHeaders(),
        body: JSON.stringify({
          email,
          create_user: false,
        }),
        cache: "no-store",
      })

      if (response.status === 429) {
        return json(
          "Çok fazla doğrulama isteği gönderildi. Lütfen daha sonra tekrar deneyin.",
          429,
        )
      }

      if (response.status >= 500) {
        console.error("[subtrack-account-deletion] OTP service failed", {
          status: response.status,
        })
        return json("Doğrulama kodu şu anda gönderilemiyor.", 502)
      }

      // Hesabın var olup olmadığını açıklamamak için istemciye aynı yanıt verilir.
      return json(
        "Bu e-posta SubTrack hesabıyla eşleşiyorsa doğrulama kodu gönderildi.",
      )
    } catch (error) {
      console.error("[subtrack-account-deletion] OTP request failed", {
        error: String(error),
      })
      return json("Doğrulama kodu şu anda gönderilemiyor.", 502)
    }
  }

  if (body.action === "verify-and-delete") {
    const code = typeof body.code === "string" ? body.code.trim() : ""

    if (!CODE_PATTERN.test(code)) {
      return json("Geçerli doğrulama kodunu girin.", 400)
    }

    try {
      const verifyResponse = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
        method: "POST",
        headers: supabaseHeaders(),
        body: JSON.stringify({
          email,
          token: code,
          type: "email",
        }),
        cache: "no-store",
      })

      const verification = (await verifyResponse.json().catch(() => null)) as
        | { access_token?: string }
        | null

      if (!verifyResponse.ok || !verification?.access_token) {
        return json(
          "Doğrulama kodu geçersiz veya süresi dolmuş. Yeni kod isteyin.",
          400,
        )
      }

      const deleteResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/delete_my_account`,
        {
          method: "POST",
          headers: supabaseHeaders(verification.access_token),
          body: "{}",
          cache: "no-store",
        },
      )

      if (!deleteResponse.ok) {
        console.error("[subtrack-account-deletion] Delete RPC failed", {
          status: deleteResponse.status,
        })
        return json(
          "Hesap silinemedi. Lütfen destek@megdev.info adresinden destek alın.",
          502,
        )
      }

      return json(
        "SubTrack hesabınız ve ilişkili kullanıcı verileriniz kalıcı olarak silindi.",
      )
    } catch (error) {
      console.error("[subtrack-account-deletion] Delete request failed", {
        error: String(error),
      })
      return json(
        "İşlem tamamlanamadı. Lütfen destek@megdev.info adresinden destek alın.",
        502,
      )
    }
  }

  return json("Geçersiz işlem.", 400)
}
