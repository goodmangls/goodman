'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from '@/contexts/LanguageContext';
import QuoteStatusBadge from '@/components/quotes/QuoteStatusBadge';
import QuoteTimeline from '@/components/quotes/QuoteTimeline';
import { PageTransition, FadeIn } from '@/components/portal/PortalAnimations';
import { useToast } from '@/contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations('quotes');
  const { toast } = useToast();
  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'ACCEPTED' | 'CANCELLED' | null>(null);

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

  const handleStatusUpdate = async (newStatus: 'ACCEPTED' | 'CANCELLED') => {
    setConfirmAction(null);
    setActionLoading(true);
    try {
      const res = await fetch(`/api/quotes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast(
          newStatus === 'ACCEPTED' ? t('quoteAccepted') || 'Quote accepted!' : t('quoteCancelled') || 'Quote cancelled.',
          newStatus === 'ACCEPTED' ? 'success' : 'info'
        );
        fetchQuote();
      } else {
        const data = await res.json();
        toast(data.error || 'Failed to update', 'error');
      }
    } catch {
      toast('Network error', 'error');
    } finally {
      setActionLoading(false);
    }
  };

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
        <p className="text-white/50">{t('quoteNotFound')}</p>
        <Link href="/portal/quotes" className="text-[#FF6B35] hover:underline mt-2 inline-block">
          {t('backToQuotes')}
        </Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="px-6 py-8 max-w-4xl">
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
              <p className="text-white/50 text-sm font-mono">ID: {quote.id}</p>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <FadeIn delay={0.1}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">{t('shipmentDetails')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/50 text-sm">{t('serviceType')}</p>
                    <p className="text-white font-medium">{serviceTypeLabels[quote.serviceType] || quote.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">{t('shipmentType')}</p>
                    <p className="text-white font-medium">{quote.shipmentType.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">{t('origin')}</p>
                    <p className="text-white font-medium">{quote.origin}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">{t('destination')}</p>
                    <p className="text-white font-medium">{quote.destination}</p>
                  </div>
                  {quote.weight && (
                    <div>
                      <p className="text-white/50 text-sm">{t('weight')}</p>
                      <p className="text-white font-medium">{quote.weight} kg</p>
                    </div>
                  )}
                  {quote.commodity && (
                    <div>
                      <p className="text-white/50 text-sm">{t('commodity')}</p>
                      <p className="text-white font-medium">{quote.commodity}</p>
                    </div>
                  )}
                  {quote.dimensions && (
                    <div className="col-span-2">
                      <p className="text-white/50 text-sm">{t('dimensions')}</p>
                      <p className="text-white font-medium">{quote.dimensions}</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-white/50 text-sm mb-1">{t('cargoDetails')}</p>
                  <p className="text-white">{quote.cargoDetails}</p>
                </div>
              </div>
            </FadeIn>

            {/* Quoted Rate */}
            {quote.quotedRate && (
              <FadeIn delay={0.2}>
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">{t('quotedRate')}</h3>
                  <div className="text-center py-4">
                    <div className="text-4xl font-bold text-green-400">
                      {quote.currency || 'USD'} {quote.quotedRate.toLocaleString()}
                    </div>
                    {quote.validUntil && (
                      <p className="text-white/50 mt-2">
                        {t('validUntil')}: {new Date(quote.validUntil).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                  {quote.notes && (
                    <div className="mt-4 pt-4 border-t border-green-500/20">
                      <p className="text-white/50 text-sm mb-1">{t('adminNotes')}</p>
                      <p className="text-white">{quote.notes}</p>
                    </div>
                  )}
                </div>
              </FadeIn>
            )}

            {/* Actions */}
            {(quote.status === 'QUOTED' || quote.status === 'PENDING') && (
              <FadeIn delay={0.25}>
                <div className="flex gap-3">
                  {quote.status === 'QUOTED' && (
                    <button
                      onClick={() => setConfirmAction('ACCEPTED')}
                      disabled={actionLoading}
                      className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                      {t('acceptQuote')}
                    </button>
                  )}
                  <button
                    onClick={() => setConfirmAction('CANCELLED')}
                    disabled={actionLoading}
                    className={`${quote.status === 'QUOTED' ? '' : 'flex-1'} px-6 py-3 bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 text-white/60 hover:text-red-400 font-medium rounded-xl transition-colors disabled:opacity-50`}
                  >
                    {t('cancelQuote')}
                  </button>
                </div>
              </FadeIn>
            )}
          </div>

          {/* Sidebar — Timeline */}
          <div className="space-y-6">
            <FadeIn delay={0.15}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">{t('timeline')}</h3>
                <QuoteTimeline quote={quote} />
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-white/50 mb-3">{t('quoteInfo')}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/40">{t('created')}</span>
                    <span className="text-white/80">
                      {new Date(quote.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">{t('lastUpdated')}</span>
                    <span className="text-white/80">
                      {new Date(quote.updatedAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Confirm dialog overlay */}
      <AnimatePresence>
        {confirmAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmAction(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d0b1a] border border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {confirmAction === 'ACCEPTED' ? t('confirmAccept') : t('confirmCancel')}
              </h3>
              <p className="text-white/50 text-sm mb-6">
                {confirmAction === 'ACCEPTED'
                  ? t('confirmAcceptDesc') || 'This will accept the quoted rate.'
                  : t('confirmCancelDesc') || 'This will cancel your quote request.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white/60 font-medium rounded-xl hover:bg-white/10 transition-colors"
                >
                  {t('goBack') || 'Go Back'}
                </button>
                <button
                  onClick={() => handleStatusUpdate(confirmAction)}
                  className={`flex-1 py-2.5 font-bold rounded-xl transition-colors ${
                    confirmAction === 'ACCEPTED'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {confirmAction === 'ACCEPTED' ? t('acceptQuote') : t('cancelQuote')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
