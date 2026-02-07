import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { quoteResponseSchema } from '@/lib/validations/quote';
import { sendQuoteResponseNotification } from '@/lib/email/quote-emails';

// PATCH /api/quotes/[id]/respond — Admin responds with a rate
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check admin role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, name: true },
    });

    if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const result = quoteResponseSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid response data', issues: result.error.issues },
        { status: 400 }
      );
    }

    const quote = await prisma.quoteRequest.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    if (quote.status !== 'PENDING') {
      return NextResponse.json(
        { error: `Cannot respond to a quote with status ${quote.status}` },
        { status: 400 }
      );
    }

    const { quotedRate, currency, validUntil, notes } = result.data;

    const updated = await prisma.quoteRequest.update({
      where: { id },
      data: {
        status: 'QUOTED',
        quotedRate,
        currency,
        validUntil: new Date(validUntil),
        notes: notes || null,
        respondedAt: new Date(),
        respondedBy: user.name || session.user.id,
      },
    });

    // Determine recipient email and name
    const recipientEmail = quote.isGuest ? quote.guestEmail : quote.user.email;
    const recipientName = quote.isGuest ? (quote.guestName || 'Customer') : (quote.user.name || 'Partner');

    if (recipientEmail) {
      try {
        await sendQuoteResponseNotification(recipientEmail, recipientName, {
          ...quote,
          quotedRate,
          currency,
          validUntil,
          notes: notes || null,
        });
      } catch (emailError) {
        console.error('Failed to send quote response email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      quote: { id: updated.id, status: updated.status, quotedRate: updated.quotedRate },
    });
  } catch (error) {
    console.error('Error responding to quote:', error);
    return NextResponse.json({ error: 'Failed to respond to quote' }, { status: 500 });
  }
}
