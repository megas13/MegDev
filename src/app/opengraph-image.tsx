import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const alt = "Meg Dev — Yazılım Geliştirme ve Dijital Çözümler"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
  const [regular, bold] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/NotoSans-Regular.ttf")),
    readFile(join(process.cwd(), "public/fonts/NotoSans-Bold.ttf")),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c110b",
          color: "#f7f3ea",
          padding: "72px",
          position: "relative",
          fontFamily: "Noto Sans",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-180px",
            right: "-120px",
            width: "620px",
            height: "620px",
            borderRadius: "9999px",
            background: "#1e4a37",
            opacity: 0.55,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-260px",
            left: "-140px",
            width: "520px",
            height: "520px",
            borderRadius: "9999px",
            background: "#33450f",
            opacity: 0.5,
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            letterSpacing: "0.18em",
            color: "#d7ff43",
          }}
        >
          <span>MEG DEV</span>
          <span style={{ color: "#8f8a7f", letterSpacing: "0.12em" }}>KAYSERİ · TÜRKİYE</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 82, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            <span>Dijital ürünler,</span>
            <span style={{ color: "#d7ff43" }}>geleceğe hazır.</span>
          </div>
          <div style={{ display: "flex", marginTop: 30, fontSize: 30, color: "#b8afa1" }}>
            Web · Mobil · Yapay Zeka · Özel Yazılım
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(247, 243, 234, 0.18)",
            paddingTop: 28,
            fontSize: 26,
          }}
        >
          <span style={{ color: "#d7ff43" }}>megdev.com.tr</span>
          <span style={{ color: "#8f8a7f" }}>Yazılım Geliştirme ve Dijital Çözümler</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Noto Sans", data: regular, weight: 400, style: "normal" },
        { name: "Noto Sans", data: bold, weight: 700, style: "normal" },
      ],
    },
  )
}
