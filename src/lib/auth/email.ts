import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_missing_key');

const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export async function sendVerificationEmail(email: string, token: string, name: string) {
  const verifyUrl = `${baseUrl}/auth/verify?token=${token}`;

  await resend.emails.send({
    from: process.env.CONTACT_EMAIL_FROM || 'noreply@goodmangls.com',
    to: email,
    subject: '[GOODMAN GLS] Verify Your Email Address',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #070612 0%, #1a1a2e 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; color: #FF6B35; font-weight: 600; }
            .content { background: #f8f9fa; padding: 40px 30px; border-radius: 0 0 12px 12px; }
            .button { display: inline-block; padding: 16px 32px; background: #FF6B35; color: white !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .button:hover { background: #E05A2B; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .note { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>GOODMAN GLS</h1>
              <p>Partner Portal</p>
            </div>
            <div class="content">
              <h2 style="margin-top: 0;">Welcome, ${name}!</h2>
              <p>Thank you for registering with GOODMAN GLS Partner Portal. Please verify your email address to complete your registration and access your partner dashboard.</p>

              <div style="text-align: center;">
                <a href="${verifyUrl}" class="button">Verify Email Address</a>
              </div>

              <div class="note">
                <strong>Note:</strong> This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
              </div>

              <p style="margin-top: 30px;">If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666; font-size: 14px;">${verifyUrl}</p>

              <div class="footer">
                <p>GOODMAN Global Logistics Service<br>
                Your Strategic Partner in Korea & Beyond</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string, name: string) {
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: process.env.CONTACT_EMAIL_FROM || 'noreply@goodmangls.com',
    to: email,
    subject: '[GOODMAN GLS] Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #070612 0%, #1a1a2e 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; color: #FF6B35; font-weight: 600; }
            .content { background: #f8f9fa; padding: 40px 30px; border-radius: 0 0 12px 12px; }
            .button { display: inline-block; padding: 16px 32px; background: #FF6B35; color: white !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .note { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>GOODMAN GLS</h1>
              <p>Partner Portal</p>
            </div>
            <div class="content">
              <h2 style="margin-top: 0;">Password Reset Request</h2>
              <p>Hi ${name || 'there'},</p>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>

              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>

              <div class="note">
                <strong>Note:</strong> This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
              </div>

              <div class="footer">
                <p>GOODMAN Global Logistics Service<br>
                Your Strategic Partner in Korea & Beyond</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  const portalUrl = `${baseUrl}/portal`;

  await resend.emails.send({
    from: process.env.CONTACT_EMAIL_FROM || 'noreply@goodmangls.com',
    to: email,
    subject: '[GOODMAN GLS] Welcome to the Partner Portal!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #070612 0%, #1a1a2e 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; color: #FF6B35; font-weight: 600; }
            .content { background: #f8f9fa; padding: 40px 30px; border-radius: 0 0 12px 12px; }
            .button { display: inline-block; padding: 16px 32px; background: #FF6B35; color: white !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .feature { display: flex; align-items: center; gap: 15px; margin: 15px 0; padding: 15px; background: white; border-radius: 8px; }
            .feature-icon { font-size: 24px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome!</h1>
              <p>Your account is verified</p>
            </div>
            <div class="content">
              <h2 style="margin-top: 0;">Welcome to GOODMAN GLS, ${name}!</h2>
              <p>Your email has been verified and your partner account is now active. Here's what you can do:</p>

              <div class="feature">
                <span class="feature-icon">📋</span>
                <div>
                  <strong>Request Quotes</strong><br>
                  <span style="color: #666;">Get competitive rates for your shipments</span>
                </div>
              </div>

              <div class="feature">
                <span class="feature-icon">📊</span>
                <div>
                  <strong>Track Shipments</strong><br>
                  <span style="color: #666;">Monitor your cargo in real-time</span>
                </div>
              </div>

              <div class="feature">
                <span class="feature-icon">📈</span>
                <div>
                  <strong>Market Insights</strong><br>
                  <span style="color: #666;">Access Korea trade intelligence reports</span>
                </div>
              </div>

              <div style="text-align: center;">
                <a href="${portalUrl}" class="button">Go to Partner Portal</a>
              </div>

              <p>If you have any questions, our team is here to help. Contact us at <a href="mailto:contact@goodmangls.com">contact@goodmangls.com</a></p>

              <div class="footer">
                <p>GOODMAN Global Logistics Service<br>
                Your Strategic Partner in Korea & Beyond</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}
