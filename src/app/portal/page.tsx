'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from '@/contexts/LanguageContext';
import QuoteStatusBadge from '@/components/quotes/QuoteStatusBadge';
import { PageTransition, StaggerContainer, StaggerItem, FadeIn } from '@/components/portal/PortalAnimations';

interface RecentQuote {
  id: string;
  origin: string;
  destination: string;
  serviceType: string;
  status: 'PENDING' | 'QUOTED' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';
  createdAt: string;
  quotedRate: number | null;
  currency: string | null;
}

export default function PortalDashboard() {
  const { user } = useAuth();
  const t = useTranslations('portal');
  const [recentQuotes, setRecentQuotes] = useState<RecentQuote[]>([]);
  const [quotesLoading, setQuotesLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentQuotes() {
      try {
        const res = await fetch('/api/quotes?limit=5');
        const data = await res.json();
        if (res.ok) {
          setRecentQuotes(data.quotes || []);
        }
      } catch {
        // Dashboard still works
      } finally {
        setQuotesLoading(false);
      }
    }
    fetchRecentQuotes();
  }, []);

  // Compute stats from recent quotes
  const totalQuotes = recentQuotes.length;
  const pendingCount = recentQuotes.filter(q => q.status === 'PENDING').length;
  const acceptedCount = recentQuotes.filter(q => q.status === 'ACCEPTED').length;
  const quotedCount = recentQuotes.filter(q => q.status === 'QUOTED').length;

  const statCards = [
    { label: t('totalQuotes') || 'Total Quotes', value: totalQuotes, color: 'from-blue-500 to-cyan-500' },
    { label: t('pendingQuotes') || 'Pending', value: pendingCount, color: 'from-yellow-500 to-orange-500' },
    { label: t('quotedLabel') || 'Quoted', value: quotedCount, color: 'from-purple-500 to-pink-500' },
    { label: t('acceptedLabel') || 'Accepted', value: acceptedCount, color: 'from-green-500 to-emerald-500' },
  ];

  const quickActions = [
    {
      title: t('requestQuote'),
      description: t('requestQuoteDesc'),
      href: '/portal/quotes/new',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'from-orange-500 to-red-500',
    },
    {
      title: t('trackShipment'),
      description: t('trackShipmentDesc'),
      href: '/portal/tracking',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: t('viewRates'),
      description: t('viewRatesDesc'),
      href: '/portal/rates',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: t('marketInsights'),
      description: t('marketInsightsDesc'),
      href: '/portal/insights',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <PageTransition>
      <div className="px-6 py-8 relative">
        {/* Subtle gradient mesh */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF6B35]/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Welcome Section */}
        <FadeIn>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {t('welcome')}, {user?.name?.split(' ')[0] || t('partner')}!
            </h2>
            <p className="text-white/60">{t('dashboardSubtitle')}</p>
          </div>
        </FadeIn>

        {/* Stat Cards */}
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10" delay={0.1}>
          {statCards.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${stat.color} opacity-10 rounded-bl-full`} />
                <p className="text-white/50 text-sm mb-1">{stat.label}</p>
                <motion.p
                  className="text-3xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {quotesLoading ? '-' : stat.value}
                </motion.p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Quick Actions */}
        <FadeIn delay={0.2}>
          <h3 className="text-xl font-semibold text-white mb-6">{t('quickActions')}</h3>
        </FadeIn>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12" delay={0.25}>
          {quickActions.map((action) => (
            <StaggerItem key={action.href}>
              <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                <Link
                  href={action.href}
                  className="block group bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {action.icon}
                  </div>
                  <h4 className="text-white font-semibold mb-2">{action.title}</h4>
                  <p className="text-white/50 text-sm">{action.description}</p>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Recent Activity & Account Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Quotes */}
          <FadeIn delay={0.35} className="lg:col-span-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">{t('recentQuotes')}</h3>
                <Link href="/portal/quotes" className="text-[#FF6B35] hover:underline text-sm font-medium">
                  {t('viewAll')}
                </Link>
              </div>

              {quotesLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : recentQuotes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-white/50 mb-4">{t('noQuotesYet')}</p>
                  <Link
                    href="/portal/quotes/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6B35] hover:bg-[#E05A2B] text-white font-medium rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t('requestFirstQuote')}
                  </Link>
                </div>
              ) : (
                <StaggerContainer className="space-y-2" delay={0.4}>
                  {recentQuotes.map((q) => (
                    <StaggerItem key={q.id}>
                      <Link
                        href={`/portal/quotes/${q.id}`}
                        className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-white/40 text-xs font-mono">#{q.id.slice(-6).toUpperCase()}</span>
                          <span className="text-white text-sm font-medium">{q.origin} → {q.destination}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {q.quotedRate && (
                            <span className="text-[#FF6B35] font-semibold text-sm">
                              {q.currency || 'USD'} {q.quotedRate.toLocaleString()}
                            </span>
                          )}
                          <QuoteStatusBadge status={q.status} />
                        </div>
                      </Link>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}
            </div>
          </FadeIn>

          {/* Account Info */}
          <FadeIn delay={0.4}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">{t('accountInfo')}</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-white/50 text-sm">{t('memberSince')}</p>
                  <p className="text-white font-medium">
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>

                <div>
                  <p className="text-white/50 text-sm">{t('accountStatus')}</p>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    {t('active')}
                  </span>
                </div>

                <div>
                  <p className="text-white/50 text-sm">{t('accountType')}</p>
                  <p className="text-white font-medium">{t('partnerAccount')}</p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Link
                    href="/portal/settings"
                    className="flex items-center gap-2 text-[#FF6B35] hover:underline text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {t('manageAccount')}
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Help Section */}
        <FadeIn delay={0.45}>
          <div className="mt-8 bg-gradient-to-r from-[#FF6B35]/10 to-[#FF6B35]/5 border border-[#FF6B35]/20 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FF6B35]/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold">{t('needHelp')}</h4>
                  <p className="text-white/60 text-sm">{t('needHelpDesc')}</p>
                </div>
              </div>
              <a
                href="mailto:contact@goodmangls.com"
                className="px-6 py-2.5 bg-[#FF6B35] hover:bg-[#E05A2B] text-white font-medium rounded-lg transition-colors whitespace-nowrap"
              >
                {t('contactSupport')}
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
