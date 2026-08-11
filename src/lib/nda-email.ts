function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

export function buildNdaVerificationEmail({
  customerName,
  projectTitle,
  code,
  contractUrl,
  expiresInMinutes,
}: {
  customerName: string
  projectTitle: string
  code: string
  contractUrl: string
  expiresInMinutes: number
}) {
  const safeName = escapeHtml(customerName)
  const safeProject = escapeHtml(projectTitle)
  const safeCode = escapeHtml(code)
  const safeUrl = escapeHtml(contractUrl)

  return {
    subject: `${code} · Gizlilik sözleşmesi doğrulama kodunuz`,
    text: `Merhaba ${customerName},\n\n${projectTitle} projesine ait gizlilik sözleşmesi doğrulama kodunuz: ${code}\n\nKod ${expiresInMinutes} dakika geçerlidir.\nSözleşmeye dön: ${contractUrl}\n\nBu işlemi siz başlatmadıysanız bu e-postayı dikkate almayın.`,
    html: `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Gizlilik sözleşmesi doğrulama kodu</title>
  </head>
  <body style="margin:0;padding:0;background:#0b0b09;color:#f7f3ea;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#0b0b09;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:#171713;border:1px solid #302f28;border-radius:24px;overflow:hidden;">
            <tr>
              <td style="height:6px;background:linear-gradient(90deg,#d7ff43,#39d0c2);font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:34px 34px 14px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td>
                      <div style="font-size:24px;font-weight:900;letter-spacing:-0.5px;color:#f7f3ea;">MEG<span style="color:#d7ff43;">DEV</span></div>
                      <div style="margin-top:5px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#39d0c2;">Güvenli sözleşme doğrulaması</div>
                    </td>
                    <td align="right" valign="top">
                      <div style="display:inline-block;padding:8px 12px;border:1px solid #34452b;border-radius:999px;background:#1d2718;color:#d7ff43;font-size:11px;font-weight:700;">GÜVENLİ İŞLEM</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 34px 34px;">
                <h1 style="margin:0;font-size:28px;line-height:1.2;color:#f7f3ea;">Doğrulama kodunuz hazır</h1>
                <p style="margin:16px 0 0;font-size:15px;line-height:1.7;color:#b8afa1;">Merhaba <strong style="color:#f7f3ea;">${safeName}</strong>,</p>
                <p style="margin:8px 0 0;font-size:15px;line-height:1.7;color:#b8afa1;"><strong style="color:#f7f3ea;">${safeProject}</strong> projesine ait gizlilik sözleşmesini kabul etmek için aşağıdaki kodu kullanın.</p>

                <div style="margin:28px 0;padding:24px;border:1px solid #3d4430;border-radius:18px;background:#10100d;text-align:center;">
                  <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#817b70;">Tek kullanımlık kod</div>
                  <div style="margin-top:10px;font-family:'Courier New',monospace;font-size:42px;font-weight:900;letter-spacing:12px;color:#d7ff43;">${safeCode}</div>
                  <div style="margin-top:12px;font-size:12px;color:#817b70;">Kod ${expiresInMinutes} dakika boyunca geçerlidir.</div>
                </div>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td align="center">
                      <a href="${safeUrl}" style="display:inline-block;padding:14px 24px;border-radius:12px;background:#d7ff43;color:#10100d;text-decoration:none;font-size:14px;font-weight:800;">Sözleşmeye geri dön &rarr;</a>
                    </td>
                  </tr>
                </table>

                <div style="margin-top:28px;padding:15px 17px;border-left:3px solid #39d0c2;border-radius:8px;background:#14211f;color:#9ebbb6;font-size:12px;line-height:1.6;">
                  Güvenliğiniz için bu kodu kimseyle paylaşmayın. Meg Dev ekibi sizden telefon, mesaj veya e-posta yoluyla bu kodu istemez.
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 34px;border-top:1px solid #302f28;background:#12120f;text-align:center;">
                <p style="margin:0;font-size:11px;line-height:1.6;color:#6f6a61;">Bu işlemi siz başlatmadıysanız e-postayı dikkate almayabilirsiniz.</p>
                <p style="margin:6px 0 0;font-size:11px;color:#6f6a61;">Meg Dev · Profesyonel Yazılım ve Danışmanlık Hizmetleri</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  }
}
