import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validations/contact';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_missing_key');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const result = contactFormSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid form data', issues: result.error.issues },
        { status: 400 }
      );
    }

    const { name, email, message } = result.data;

    // Send email using Resend
    const emailData = await resend.emails.send({
      from: process.env.CONTACT_EMAIL_FROM || 'noreply@goodmangls.com',
      to: process.env.CONTACT_EMAIL_TO || 'contact@goodmangls.com',
      subject: `[GOODMAN GLS] New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
              .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
              .field { margin-bottom: 20px; }
              .label { font-weight: 600; color: #1a365d; margin-bottom: 5px; }
              .value { background: white; padding: 12px; border-radius: 4px; border-left: 3px solid #2563eb; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">🌐 New Contact Form Submission</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">GOODMAN Global Logistics Service</p>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Name / 이름:</div>
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <div class="label">Email / 이메일:</div>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>
                <div class="field">
                  <div class="label">Message / 메시지:</div>
                  <div class="value">${message.replace(/\n/g, '<br>')}</div>
                </div>
                <div class="footer">
                  <p>📧 Sent via GOODMAN GLS Contact Form<br>
                  🕒 ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul', timeZoneName: 'short' })} (KST)</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log('Email sent successfully:', emailData);

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
