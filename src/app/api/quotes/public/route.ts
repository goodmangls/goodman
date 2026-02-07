import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { publicQuoteRequestSchema } from '@/lib/validations/quote';
import { sendQuoteRequestNotification, sendQuoteConfirmation } from '@/lib/email/quote-emails';

// Simple in-memory rate limiter: 5 requests per hour per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return false;
  }

  if (entry.count >= 5) {
    return true;
  }

  entry.count++;
  return false;
}

// Periodic cleanup to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000); // Clean every 10 minutes

// GUEST_USER_ID: we look up or create a system guest user on first use
let guestUserId: string | null = null;

async function getGuestUserId(): Promise<string> {
  if (guestUserId) return guestUserId;

  const guestEmail = 'guest@goodmangls.com';
  let guestUser = await prisma.user.findUnique({ where: { email: guestEmail } });

  if (!guestUser) {
    guestUser = await prisma.user.create({
      data: {
        email: guestEmail,
        name: 'Guest User',
        role: 'PARTNER',
        status: 'ACTIVE',
        emailVerified: new Date(),
      },
    });
  }

  guestUserId = guestUser.id;
  return guestUserId;
}

// POST /api/quotes/public — Create a quote (unauthenticated guests)
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = publicQuoteRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid form data', issues: result.error.issues },
        { status: 400 }
      );
    }

    const { guestName, guestEmail, guestCompany, guestPhone, ...shipmentData } = result.data;

    const userId = await getGuestUserId();

    const quote = await prisma.quoteRequest.create({
      data: {
        ...shipmentData,
        userId,
        isGuest: true,
        guestName,
        guestEmail,
        guestCompany,
        guestPhone: guestPhone || null,
      },
    });

    // Send emails (non-blocking)
    try {
      await Promise.all([
        sendQuoteRequestNotification({
          ...quote,
          weight: quote.weight,
          commodity: quote.commodity,
          requesterName: guestName,
          requesterEmail: guestEmail,
          requesterCompany: guestCompany,
          isGuest: true,
        }),
        sendQuoteConfirmation(guestEmail, guestName, quote),
      ]);
    } catch (emailError) {
      console.error('Failed to send public quote emails:', emailError);
    }

    return NextResponse.json(
      { success: true, quote: { id: quote.id } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating public quote:', error);
    return NextResponse.json({ error: 'Failed to create quote request' }, { status: 500 });
  }
}
