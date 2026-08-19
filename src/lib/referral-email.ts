type VerificationEmailProps = {
  name: string
  code: string
  purpose: "acceptance" | "termination"
  url: string
  expiresInMinutes: number
}

export function buildReferralVerificationEmail(props: VerificationEmailProps) {
  const isTermination = props.purpose === "termination"
  const title = isTermination ? "Fesih formu doğrulama kodu" : "Sözleşme doğrulama kodu"
  const action = isTermination ? "fesih formunu onaylamak" : "müşteri bulma sözleşmesini kabul etmek"
  return {
    subject: `Meg Dev | ${title}`,
    text: `Merhaba ${props.name},\n\n${action} için kodunuz: ${props.code}\nKod ${props.expiresInMinutes} dakika geçerlidir.\n\nBelge: ${props.url}\n\nBu işlemi siz başlatmadıysanız kodu paylaşmayın.`,
    html: `<!doctype html><html><body style="margin:0;background:#10100d;font-family:Arial,sans-serif;color:#f7f3ea"><div style="max-width:560px;margin:0 auto;padding:40px 18px"><div style="border:1px solid #303028;border-radius:24px;background:#181814;padding:34px"><div style="color:#d7ff43;font-weight:800;letter-spacing:.12em;font-size:12px">MEG DEV · GÜVENLİ ONAY</div><h1 style="font-size:25px;margin:18px 0 8px">${title}</h1><p style="color:#b8afa1;line-height:1.65">Merhaba ${props.name}, ${action} için aşağıdaki tek kullanımlık kodu girin.</p><div style="margin:28px 0;padding:20px;border-radius:18px;background:#d7ff43;color:#10100d;font-size:34px;font-weight:900;letter-spacing:12px;text-align:center">${props.code}</div><p style="color:#b8afa1;font-size:13px">Kod ${props.expiresInMinutes} dakika geçerlidir ve kimseyle paylaşılmamalıdır.</p><a href="${props.url}" style="display:block;margin-top:22px;background:#39d0c2;color:#10100d;text-decoration:none;text-align:center;font-weight:800;padding:14px;border-radius:12px">Belgeyi aç</a></div></div></body></html>`,
  }
}
