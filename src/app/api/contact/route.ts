import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactFormSchema } from '@/lib/validations/contact';
import {
  assertAllowedOrigin,
  enforceRateLimit,
  getClientIp,
} from '@/lib/api-guards';

export async function POST(request: Request) {
  const originCheck = assertAllowedOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 });
  }

  const ip = getClientIp(request);
  const rate = enforceRateLimit(ip);
  if (!rate.ok) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfterSec: rate.retryAfterSec },
      {
        status: 429,
        headers: { 'Retry-After': String(rate.retryAfterSec) },
      },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const result = contactFormSchema.safeParse(payload);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: result.error.issues },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const emailTo = process.env.CONTACT_EMAIL_TO;
  const emailFrom = process.env.CONTACT_EMAIL_FROM;
  if (!apiKey || !emailTo || !emailFrom) {
    return NextResponse.json(
      { error: 'Email service not configured' },
      { status: 500 },
    );
  }

  const { name, email, message } = result.data;
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: emailFrom,
    to: emailTo,
    replyTo: email,
    subject: `New contact from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  if (error) {
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
