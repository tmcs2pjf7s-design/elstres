import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function enviarEmailVerificacion(
  email: string,
  nombre: string,
  token: string,
  baseUrl: string
) {
  const enlace = `${baseUrl}/verificar?token=${token}`

  await transporter.sendMail({
    from: `"Frankfurt Els Tr3s" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: '✅ Confirma tu cuenta — Frankfurt Els Tr3s',
    html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
    <div style="background:#e85d04;padding:32px 40px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:900;letter-spacing:-0.5px;">Frankfurt Els Tr3s</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,.8);font-size:14px;">Passeig de Lluís Muncunill, 9 · Terrassa</p>
    </div>
    <div style="padding:40px;">
      <h2 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#111;">¡Hola, ${nombre}! 👋</h2>
      <p style="margin:0 0 24px;color:#6b7280;line-height:1.6;font-size:15px;">
        Gracias por registrarte. Para activar tu cuenta y empezar a pedir,
        confirma tu dirección de correo haciendo clic en el botón:
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${enlace}"
          style="background:#e85d04;color:#fff;text-decoration:none;padding:16px 36px;border-radius:16px;font-weight:700;font-size:16px;display:inline-block;">
          ✅ Confirmar mi cuenta
        </a>
      </div>
      <p style="margin:0 0 8px;color:#9ca3af;font-size:12px;text-align:center;">
        Este enlace es válido durante <strong>24 horas</strong>.
      </p>
      <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
        Si no has creado esta cuenta, ignora este correo.
      </p>
      <hr style="border:none;border-top:1px solid #f3f4f6;margin:32px 0;">
      <p style="margin:0;color:#d1d5db;font-size:11px;text-align:center;">
        © 2026 Frankfurt Els Tr3s · <a href="${baseUrl}" style="color:#d1d5db;">frankfurtels3s</a>
      </p>
    </div>
  </div>
</body>
</html>
    `,
  })
}
