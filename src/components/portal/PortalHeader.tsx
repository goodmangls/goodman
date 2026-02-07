'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from '@/contexts/LanguageContext';

export default function PortalHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const t = useTranslations('portal');
  const tq = useTranslations('quotes');
  const tAdmin = useTranslations('adminQuotes');

  // Build breadcrumbs from pathname
  const segments = pathname?.split('/').filter(Boolean) || [];
  const breadcrumbs: { label: string; href: string }[] = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const href = '/' + segments.slice(0, i + 1).join('/');

    if (seg === 'portal') {
      breadcrumbs.push({ label: t('dashboard') || 'Dashboard', href });
    } else if (seg === 'quotes' && segments[i - 1] === 'admin') {
      breadcrumbs.push({ label: tAdmin('title') || 'Quote Management', href });
    } else if (seg === 'quotes') {
      breadcrumbs.push({ label: tq('quotes') || 'Quotes', href });
    } else if (seg === 'new') {
      breadcrumbs.push({ label: tq('newQuote') || 'New Quote', href });
    } else if (seg === 'admin') {
      breadcrumbs.push({ label: 'Admin', href });
    } else if (seg === 'tracking') {
      breadcrumbs.push({ label: t('trackShipment') || 'Tracking', href });
    } else if (seg === 'rates') {
      breadcrumbs.push({ label: t('viewRates') || 'Rates', href });
    } else if (seg === 'insights') {
      breadcrumbs.push({ label: t('marketInsights') || 'Insights', href });
    } else if (seg === 'settings') {
      breadcrumbs.push({ label: t('settings') || 'Settings', href });
    } else {
      // Likely a dynamic ID segment
      breadcrumbs.push({ label: `#${seg.slice(-6).toUpperCase()}`, href });
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070612]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && (
                <svg className="w-3.5 h-3.5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              {i === breadcrumbs.length - 1 ? (
                <span className="text-white font-medium">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-white/40 hover:text-white/70 transition-colors">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Notifications bell */}
          <button className="relative p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* User avatar - mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF6B35] to-orange-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
