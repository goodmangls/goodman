import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { quoteRequestSchema, quoteListQuerySchema } from '@/lib/validations/quote';
import { sendQuoteRequestNotification, sendQuoteConfirmation } from '@/lib/email/quote-emails';

// POST /api/quotes — Create a quote (authenticated partners)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const result = quoteRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid form data', issues: result.error.issues },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { company: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const quote = await prisma.quoteRequest.create({
      data: {
        ...result.data,
        userId: user.id,
        companyId: user.company?.id || null,
        isGuest: false,
      },
    });

    // Send emails (non-blocking)
    try {
      await Promise.all([
        sendQuoteRequestNotification({
          ...quote,
          weight: quote.weight,
          commodity: quote.commodity,
          requesterName: user.name || 'Partner',
          requesterEmail: user.email,
          requesterCompany: user.company?.name,
          isGuest: false,
        }),
        sendQuoteConfirmation(user.email, user.name || 'Partner', quote),
      ]);
    } catch (emailError) {
      console.error('Failed to send quote emails:', emailError);
    }

    return NextResponse.json(
      { success: true, quote: { id: quote.id, status: quote.status } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json({ error: 'Failed to create quote request' }, { status: 500 });
  }
}

// GET /api/quotes — List quotes for the authenticated user (or all for admin)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryResult = quoteListQuerySchema.safeParse(Object.fromEntries(searchParams));

    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', issues: queryResult.error.issues },
        { status: 400 }
      );
    }

    const { page, limit, status, serviceType, search } = queryResult.data;
    const skip = (page - 1) * limit;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

    // Build where clause
    const where: Record<string, unknown> = {};

    // Non-admin users can only see their own quotes
    if (!isAdmin) {
      where.userId = session.user.id;
    }

    if (status) where.status = status;
    if (serviceType) where.serviceType = serviceType;
    if (search) {
      where.OR = [
        { origin: { contains: search, mode: 'insensitive' } },
        { destination: { contains: search, mode: 'insensitive' } },
        { commodity: { contains: search, mode: 'insensitive' } },
        { guestName: { contains: search, mode: 'insensitive' } },
        { guestCompany: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [quotes, total] = await Promise.all([
      prisma.quoteRequest.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          company: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.quoteRequest.count({ where }),
    ]);

    return NextResponse.json({
      quotes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}
