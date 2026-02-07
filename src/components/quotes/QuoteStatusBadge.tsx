'use client';

import { motion } from 'framer-motion';
import { useTranslations } from '@/contexts/LanguageContext';

type QuoteStatus = 'PENDING' | 'QUOTED' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';

const statusConfig: Record<QuoteStatus, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  QUOTED: { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-400' },
  ACCEPTED: { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-400' },
  EXPIRED: { bg: 'bg-gray-500/20', text: 'text-gray-400', dot: 'bg-gray-400' },
  CANCELLED: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400' },
};

interface QuoteStatusBadgeProps {
  status: QuoteStatus;
  size?: 'sm' | 'md';
}

export default function QuoteStatusBadge({ status, size = 'sm' }: QuoteStatusBadgeProps) {
  const t = useTranslations('quotes');
  const config = statusConfig[status] || statusConfig.PENDING;

  const sizeClasses = size === 'sm'
    ? 'px-3 py-1 text-xs'
    : 'px-3.5 py-1.5 text-sm';

  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeClasses} ${config.bg} ${config.text} rounded-full font-medium`}>
      <span className="relative flex-shrink-0">
        <span className={`${dotSize} ${config.dot} rounded-full block`} />
        {status === 'PENDING' && (
          <motion.span
            animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`absolute inset-0 ${dotSize} ${config.dot} rounded-full`}
          />
        )}
      </span>
      {t(`status${status.charAt(0) + status.slice(1).toLowerCase()}`)}
    </span>
  );
}
