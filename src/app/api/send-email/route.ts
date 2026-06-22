import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json()
    await transporter.sendMail({
      from: `"Meg Dev" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html,
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
