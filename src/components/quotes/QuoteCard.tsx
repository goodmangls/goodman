'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from '@/contexts/LanguageContext';
import QuoteStatusBadge from './QuoteStatusBadge';

interface QuoteCardProps {
  quote: {
    id: string;
    serviceType: string;
    shipmentType: string;
    origin: string;
    destination: string;
    status: 'PENDING' | 'QUOTED' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';
    quotedRate?: number | null;
    currency?: string | null;
    createdAt: string;
    isGuest?: boolean;
    guestName?: string | null;
    guestCompany?: string | null;
    user?: { name: string | null; email: string };
    company?: { name: string } | null;
  };
  href: string;
  showRequester?: boolean;
}

const serviceTypeLabels: Record<string, string> = {
  AIR_FREIGHT: 'Air Freight',
  OCEAN_FCL: 'Ocean FCL',
  OCEAN_LCL: 'Ocean LCL',
  PROJECT_CARGO: 'Project Cargo',
};

export default function QuoteCard({ quote, href, showRequester }: QuoteCardProps) {
  const t = useTranslations('quotes');

  const requesterName = quote.isGuest
    ? quote.guestName
    : quote.user?.name;
  const requesterCompany = quote.isGuest
    ? quote.guestCompany
    : quote.company?.name;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Link
        href={href}
        className="block bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,107,53,0.05)]"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-white/40 text-xs font-mono">
              #{quote.id.slice(-6).toUpperCase()}
            </span>
            <h4 className="text-white font-semibold mt-1">
              {quote.origin} → {quote.destination}
            </h4>
          </div>
          <QuoteStatusBadge status={quote.status} />
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-white/60 text-xs">
            {serviceTypeLabels[quote.serviceType] || quote.serviceType}
          </span>
          <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-white/60 text-xs">
            {quote.shipmentType.replace(/_/g, ' ')}
          </span>
        </div>

        {quote.quotedRate && (
          <div className="mb-3">
            <span className="text-[#FF6B35] font-bold text-lg">
              {quote.currency || 'USD'} {quote.quotedRate.toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-white/40">
          <span>
            {new Date(quote.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          {showRequester && requesterName && (
            <span className="flex items-center gap-1">
              {quote.isGuest && (
                <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded text-[10px]">
                  {t('guest')}
                </span>
              )}
              {requesterName}
              {requesterCompany && ` · ${requesterCompany}`}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
