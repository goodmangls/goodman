import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { quoteStatusUpdateSchema } from '@/lib/validations/quote';

// GET /api/quotes/[id] — Get quote detail
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

    const quote = await prisma.quoteRequest.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        company: { select: { name: true } },
      },
    });

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    // Non-admin users can only view their own quotes
    if (!isAdmin && quote.userId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Auto-expire: if status is QUOTED and validUntil has passed
    if (quote.status === 'QUOTED' && quote.validUntil && new Date(quote.validUntil) < new Date()) {
      const updated = await prisma.quoteRequest.update({
        where: { id },
        data: { status: 'EXPIRED' },
        include: {
          user: { select: { name: true, email: true } },
          company: { select: { name: true } },
        },
      });
      return NextResponse.json({ quote: updated });
    }

    return NextResponse.json({ quote });
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 });
  }
}

// PATCH /api/quotes/[id] — Partner accept or cancel a quote
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const result = quoteStatusUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', issues: result.error.issues },
        { status: 400 }
      );
    }

    const quote = await prisma.quoteRequest.findUnique({ where: { id } });

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    // Only the quote owner can accept/cancel
    if (quote.userId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { status: newStatus } = result.data;

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      PENDING: ['CANCELLED'],
      QUOTED: ['ACCEPTED', 'CANCELLED'],
    };

    const allowed = validTransitions[quote.status];
    if (!allowed || !allowed.includes(newStatus)) {
      return NextResponse.json(
        { error: `Cannot transition from ${quote.status} to ${newStatus}` },
        { status: 400 }
      );
    }

    // Check expiration before accepting
    if (newStatus === 'ACCEPTED' && quote.validUntil && new Date(quote.validUntil) < new Date()) {
      await prisma.quoteRequest.update({
        where: { id },
        data: { status: 'EXPIRED' },
      });
      return NextResponse.json(
        { error: 'This quote has expired and can no longer be accepted' },
        { status: 400 }
      );
    }

    const updated = await prisma.quoteRequest.update({
      where: { id },
      data: { status: newStatus },
    });

    return NextResponse.json({ success: true, quote: { id: updated.id, status: updated.status } });
  } catch (error) {
    console.error('Error updating quote:', error);
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}
