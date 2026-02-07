'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/contexts/LanguageContext';
import QuoteCard from '@/components/quotes/QuoteCard';
import QuoteFilters from '@/components/quotes/QuoteFilters';
import { PageTransition, StaggerContainer, StaggerItem, FadeIn } from '@/components/portal/PortalAnimations';

interface Quote {
  id: string;
  serviceType: string;
  shipmentType: string;
  origin: string;
  destination: string;
  status: 'PENDING' | 'QUOTED' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';
  quotedRate: number | null;
  currency: string | null;
  createdAt: string;
  isGuest: boolean;
  user: { name: string | null; email: string };
  company: { name: string } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function QuotesListPage() {
  const t = useTranslations('quotes');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [search, setSearch] = useState('');

  const fetchQuotes = useCallback(async (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '10' });
    if (status) params.set('status', status);
    if (serviceType) params.set('serviceType', serviceType);
    if (search) params.set('search', search);

    try {
      const res = await fetch(`/api/quotes?${params}`);
      const data = await res.json();
      if (res.ok) {
        setQuotes(data.quotes);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch quotes:', err);
    } finally {
      setLoading(false);
    }
  }, [status, serviceType, search]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchQuotes(1), 300);
    return () => clearTimeout(debounce);
  }, [fetchQuotes]);

  return (
    <PageTransition>
      <div className="px-6 py-8">
        {/* Header */}
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{t('myQuotes')}</h1>
              <p className="text-white/60">
                {pagination.total} {t('totalQuotes')}
              </p>
            </div>
            <Link
              href="/portal/quotes/new"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#FF6B35] hover:bg-[#E05A2B] text-white font-medium rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('newQuote')}
            </Link>
          </div>
        </FadeIn>

        {/* Filters */}
        <FadeIn delay={0.1}>
          <div className="mb-6">
            <QuoteFilters
              status={status}
              serviceType={serviceType}
              search={search}
              onStatusChange={setStatus}
              onServiceTypeChange={setServiceType}
              onSearchChange={setSearch}
            />
          </div>
        </FadeIn>

        {/* Quotes grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-1/3 mb-3" />
                <div className="h-5 bg-white/10 rounded w-2/3 mb-4" />
                <div className="h-3 bg-white/10 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : quotes.length === 0 ? (
          <FadeIn>
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-white/50 mb-4">{t('noQuotes')}</p>
              <Link
                href="/portal/quotes/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6B35] hover:bg-[#E05A2B] text-white font-medium rounded-lg transition-colors"
              >
                {t('createFirst')}
              </Link>
            </div>
          </FadeIn>
        ) : (
          <>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4" delay={0.15}>
              {quotes.map((quote) => (
                <StaggerItem key={quote.id}>
                  <QuoteCard
                    quote={quote}
                    href={`/portal/quotes/${quote.id}`}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => fetchQuotes(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {t('previous')}
                </button>
                <span className="text-white/50 text-sm">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchQuotes(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {t('next')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}
