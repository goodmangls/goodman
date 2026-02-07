'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from '@/contexts/LanguageContext';
import QuoteStatusBadge from '@/components/quotes/QuoteStatusBadge';
import QuoteTimeline from '@/components/quotes/QuoteTimeline';
import AdminQuoteResponse from '@/components/quotes/AdminQuoteResponse';
import { PageTransition, FadeIn } from '@/components/portal/PortalAnimations';
import { useToast } from '@/contexts/ToastContext';

interface QuoteDetail {
  id: string;
  serviceType: string;
  shipmentType: string;
  origin: string;
  destination: string;
  cargoDetails: string;
  weight: number | null;
  dimensions: string | null;
  commodity: string | null;
  status: 'PENDING' | 'QUOTED' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';
  quotedRate: number | null;
  currency: string | null;
  validUntil: string | null;
  notes: string | null;
  respondedAt: string | null;
  respondedBy: string | null;
  isGuest: boolean;
  guestName: string | null;
  guestEmail: string | null;
  guestCompany: string | null;
  guestPhone: string | null;
  createdAt: string;
  updatedAt: string;
  user: { name: string | null; email: string };
  company: { name: string } | null;
}

const serviceTypeLabels: Record<string, string> = {
  AIR_FREIGHT: 'Air Freight',
  OCEAN_FCL: 'Ocean FCL',
  OCEAN_LCL: 'Ocean LCL',
  PROJECT_CARGO: 'Project Cargo',
};

export default function AdminQuoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations('adminQuotes');
  const tq = useTranslations('quotes');
  const { toast } = useToast();
  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuote = useCallback(async () => {
    try {
      const res = await fetch(`/api/quotes/${id}`);
      const data = await res.json();
      if (res.ok) {
        setQuote(data.quote);
      }
    } catch (err) {
      console.error('Failed to fetch quote:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  if (loading) {
    return (
      <div className="px-6 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/10 rounded w-1/3" />
          <div className="h-64 bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="px-6 py-8 text-center">
        <p className="text-white/50">{tq('quoteNotFound')}</p>
        <Link href="/portal/admin/quotes" className="text-[#FF6B35] hover:underline mt-2 inline-block">
          {t('backToQuotes')}
        </Link>
      </div>
    );
  }

  const requesterName = quote.isGuest ? quote.guestName : quote.user.name;
  const requesterEmail = quote.isGuest ? quote.guestEmail : quote.user.email;
  const requesterCompany = quote.isGuest ? quote.guestCompany : quote.company?.name;

  return (
    <PageTransition>
      <div className="px-6 py-8 max-w-5xl">
        {/* Header */}
        <FadeIn>
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">
                  {quote.origin} → {quote.destination}
                </h1>
                <QuoteStatusBadge status={quote.status} size="md" />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-white/50 font-mono">ID: {quote.id}</span>
                {quote.isGuest && (
                  <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs font-medium">
                    {tq('guest')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Requester Info */}
            <FadeIn delay={0.1}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">{t('requesterInfo')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/50 text-sm">{t('name')}</p>
                    <p className="text-white font-medium">{requesterName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">{t('email')}</p>
                    <a href={`mailto:${requesterEmail}`} className="text-[#FF6B35] hover:underline font-medium">
                      {requesterEmail || '-'}
                    </a>
                  </div>
                  {requesterCompany && (
                    <div>
                      <p className="text-white/50 text-sm">{t('company')}</p>
                      <p className="text-white font-medium">{requesterCompany}</p>
                    </div>
                  )}
                  {quote.isGuest && quote.guestPhone && (
                    <div>
                      <p className="text-white/50 text-sm">{t('phone')}</p>
                      <p className="text-white font-medium">{quote.guestPhone}</p>
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>

            {/* Shipment Details */}
            <FadeIn delay={0.15}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">{tq('shipmentDetails')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/50 text-sm">{tq('serviceType')}</p>
                    <p className="text-white font-medium">{serviceTypeLabels[quote.serviceType] || quote.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">{tq('shipmentType')}</p>
                    <p className="text-white font-medium">{quote.shipmentType.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">{tq('origin')}</p>
                    <p className="text-white font-medium">{quote.origin}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">{tq('destination')}</p>
                    <p className="text-white font-medium">{quote.destination}</p>
                  </div>
                  {quote.weight && (
                    <div>
                      <p className="text-white/50 text-sm">{tq('weight')}</p>
                      <p className="text-white font-medium">{quote.weight} kg</p>
                    </div>
                  )}
                  {quote.commodity && (
                    <div>
                      <p className="text-white/50 text-sm">{tq('commodity')}</p>
                      <p className="text-white font-medium">{quote.commodity}</p>
                    </div>
                  )}
                  {quote.dimensions && (
                    <div className="col-span-2">
                      <p className="text-white/50 text-sm">{tq('dimensions')}</p>
                      <p className="text-white font-medium">{quote.dimensions}</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-white/50 text-sm mb-1">{tq('cargoDetails')}</p>
                  <p className="text-white">{quote.cargoDetails}</p>
                </div>
              </div>
            </FadeIn>

            {/* Response form (only for PENDING status) */}
            {quote.status === 'PENDING' && (
              <FadeIn delay={0.2}>
                <AdminQuoteResponse
                  quoteId={quote.id}
                  onSuccess={() => {
                    toast(t('responseSubmitted') || 'Response submitted successfully', 'success');
                    fetchQuote();
                  }}
                />
              </FadeIn>
            )}

            {/* Existing response */}
            {quote.quotedRate && (
              <FadeIn delay={0.2}>
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">{t('responseDetails')}</h3>
                  <div className="text-center py-4">
                    <div className="text-4xl font-bold text-green-400">
                      {quote.currency || 'USD'} {quote.quotedRate.toLocaleString()}
                    </div>
                    {quote.validUntil && (
                      <p className="text-white/50 mt-2">
                        Valid until: {new Date(quote.validUntil).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                  {quote.notes && (
                    <div className="mt-4 pt-4 border-t border-green-500/20">
                      <p className="text-white/50 text-sm mb-1">{t('notes')}</p>
                      <p className="text-white">{quote.notes}</p>
                    </div>
                  )}
                  {quote.respondedBy && (
                    <p className="text-white/40 text-xs mt-4">
                      {t('respondedBy')}: {quote.respondedBy} on{' '}
                      {quote.respondedAt && new Date(quote.respondedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </FadeIn>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <FadeIn delay={0.15}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">{tq('timeline')}</h3>
                <QuoteTimeline quote={quote} />
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-white/50 mb-3">{tq('quoteInfo')}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/40">{tq('created')}</span>
                    <span className="text-white/80">
                      {new Date(quote.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">{tq('lastUpdated')}</span>
                    <span className="text-white/80">
                      {new Date(quote.updatedAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">{t('source')}</span>
                    <span className="text-white/80">
                      {quote.isGuest ? t('publicForm') : t('partnerPortal')}
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
