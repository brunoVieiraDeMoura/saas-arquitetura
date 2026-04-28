import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const { name, email, message, tenantSlug } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: tenant } = await admin
    .from('tenants')
    .select('id')
    .eq('slug', tenantSlug)
    .single()

  if (!tenant) return NextResponse.json({ error: 'Tenant não encontrado.' }, { status: 404 })

  const { data: settingsRows } = await admin
    .from('settings')
    .select('key, value')
    .eq('tenant_id', tenant.id)
    .in('key', ['gmail_user', 'gmail_app_password'])

  const getSetting = (key: string) => settingsRows?.find((r) => r.key === key)?.value ?? ''

  const gmailUser = getSetting('gmail_user') || process.env.GMAIL_USER
  const gmailPass = getSetting('gmail_app_password') || process.env.GMAIL_APP_PASSWORD

  if (!gmailUser || !gmailPass) {
    return NextResponse.json({ error: 'Serviço de email não configurado.' }, { status: 503 })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass },
  })

  try {
    await transporter.sendMail({
      from: `"${tenantSlug}" <${gmailUser}>`,
      to: gmailUser,
      replyTo: email,
      subject: `Contato pelo site — ${name}`,
      html: `<p><strong>Nome:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Mensagem:</strong></p><p style="white-space:pre-wrap">${message}</p>`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Erro ao enviar email.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
