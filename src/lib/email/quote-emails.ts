import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_missing_key');

const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

const emailStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background: linear-gradient(135deg, #070612 0%, #1a1a2e 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
  .header h1 { margin: 0; font-size: 28px; }
  .header p { margin: 10px 0 0 0; opacity: 0.9; color: #FF6B35; font-weight: 600; }
  .content { background: #f8f9fa; padding: 40px 30px; border-radius: 0 0 12px 12px; }
  .button { display: inline-block; padding: 16px 32px; background: #FF6B35; color: white !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
  .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  .detail-row { display: flex; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
  .detail-label { font-weight: 600; color: #1a365d; min-width: 140px; }
  .detail-value { color: #333; }
  .info-box { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0; }
  .rate-box { background: #f0fff4; border: 2px solid #38a169; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
  .rate-amount { font-size: 32px; font-weight: 700; color: #38a169; }
`;

interface QuoteDetails {
  id: string;
  serviceType: string;
  shipmentType: string;
  origin: string;
  destination: string;
  cargoDetails: string;
  weight?: number | null;
  commodity?: string | null;
}

const formatServiceType = (type: string) =>
  type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

function quoteDetailsHtml(quote: QuoteDetails) {
  return `
    <div class="info-box">
      <div class="detail-row">
        <span class="detail-label">Quote ID:</span>
        <span class="detail-value">${quote.id}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Service:</span>
        <span class="detail-value">${formatServiceType(quote.serviceType)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Shipment:</span>
        <span class="detail-value">${formatServiceType(quote.shipmentType)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Route:</span>
        <span class="detail-value">${quote.origin} → ${quote.destination}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Cargo:</span>
        <span class="detail-value">${quote.cargoDetails}</span>
      </div>
      ${quote.weight ? `
      <div class="detail-row">
        <span class="detail-label">Weight:</span>
        <span class="detail-value">${quote.weight} kg</span>
      </div>` : ''}
      ${quote.commodity ? `
      <div class="detail-row">
        <span class="detail-label">Commodity:</span>
        <span class="detail-value">${quote.commodity}</span>
      </div>` : ''}
    </div>
  `;
}

/**
 * Notify admin when a new quote request is submitted
 */
export async function sendQuoteRequestNotification(
  quote: QuoteDetails & { requesterName: string; requesterEmail: string; requesterCompany?: string | null; isGuest: boolean }
) {
  const adminUrl = `${baseUrl}/portal/admin/quotes/${quote.id}`;

  await resend.emails.send({
    from: process.env.CONTACT_EMAIL_FROM || 'noreply@goodmangls.com',
    to: process.env.CONTACT_EMAIL_TO || 'contact@goodmangls.com',
    subject: `[GOODMAN GLS] New Quote Request - ${formatServiceType(quote.serviceType)} (${quote.origin} → ${quote.destination})`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>${emailStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Quote Request</h1>
              <p>${quote.isGuest ? 'Public Inquiry' : 'Partner Portal'}</p>
            </div>
            <div class="content">
              <h2 style="margin-top: 0;">A new rate quote has been requested</h2>

              <div class="info-box" style="background: #fff3cd; border-color: #ffc107;">
                <strong>Requester:</strong> ${quote.requesterName}<br>
                <strong>Email:</strong> <a href="mailto:${quote.requesterEmail}">${quote.requesterEmail}</a><br>
                ${quote.requesterCompany ? `<strong>Company:</strong> ${quote.requesterCompany}<br>` : ''}
                <strong>Type:</strong> ${quote.isGuest ? '🌐 Public Guest' : '🔐 Registered Partner'}
              </div>

              ${quoteDetailsHtml(quote)}

              <div style="text-align: center;">
                <a href="${adminUrl}" class="button">Review & Respond</a>
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

/**
 * Send confirmation to the requester (partner or guest) after submission
 */
export async function sendQuoteConfirmation(
  email: string,
  name: string,
  quote: QuoteDetails
) {
  const portalUrl = `${baseUrl}/portal/quotes/${quote.id}`;

  await resend.emails.send({
    from: process.env.CONTACT_EMAIL_FROM || 'noreply@goodmangls.com',
    to: email,
    subject: `[GOODMAN GLS] Quote Request Received - ${quote.id.slice(-6).toUpperCase()}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>${emailStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>GOODMAN GLS</h1>
              <p>Quote Request Received</p>
            </div>
            <div class="content">
              <h2 style="margin-top: 0;">Thank you, ${name}!</h2>
              <p>We've received your rate quote request and our team will review it shortly. You can expect a response within 24 business hours.</p>

              ${quoteDetailsHtml(quote)}

              <div style="text-align: center;">
                <a href="${portalUrl}" class="button">View Quote Status</a>
              </div>

              <p style="color: #666; font-size: 14px;">If you have any questions, feel free to reply to this email or contact us at <a href="mailto:contact@goodmangls.com">contact@goodmangls.com</a></p>

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

/**
 * Notify partner/guest when admin responds with a rate
 */
export async function sendQuoteResponseNotification(
  email: string,
  name: string,
  quote: QuoteDetails & { quotedRate: number; currency: string; validUntil: string; notes?: string | null }
) {
  const portalUrl = `${baseUrl}/portal/quotes/${quote.id}`;
  const validDate = new Date(quote.validUntil).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  await resend.emails.send({
    from: process.env.CONTACT_EMAIL_FROM || 'noreply@goodmangls.com',
    to: email,
    subject: `[GOODMAN GLS] Your Rate Quote is Ready - ${quote.id.slice(-6).toUpperCase()}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>${emailStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>GOODMAN GLS</h1>
              <p>Rate Quote Ready</p>
            </div>
            <div class="content">
              <h2 style="margin-top: 0;">Hi ${name}, your quote is ready!</h2>
              <p>Our team has reviewed your shipment request and prepared a competitive rate for you.</p>

              <div class="rate-box">
                <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Quoted Rate</div>
                <div class="rate-amount">${quote.currency} ${quote.quotedRate.toLocaleString()}</div>
                <div style="font-size: 14px; color: #666; margin-top: 5px;">Valid until ${validDate}</div>
              </div>

              ${quoteDetailsHtml(quote)}

              ${quote.notes ? `
              <div class="info-box">
                <strong>Notes from our team:</strong><br>
                ${quote.notes.replace(/\n/g, '<br>')}
              </div>` : ''}

              <div style="text-align: center;">
                <a href="${portalUrl}" class="button">Review & Accept Quote</a>
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
