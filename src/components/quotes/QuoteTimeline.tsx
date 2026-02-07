'use client';

import { motion } from 'framer-motion';
import { useTranslations } from '@/contexts/LanguageContext';

interface QuoteTimelineProps {
  quote: {
    status: string;
    createdAt: string;
    respondedAt?: string | null;
    respondedBy?: string | null;
    updatedAt: string;
  };
}

const stepIcons: Record<string, React.ReactNode> = {
  PENDING: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  QUOTED: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1" />
    </svg>
  ),
  ACCEPTED: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
};

export default function QuoteTimeline({ quote }: QuoteTimelineProps) {
  const t = useTranslations('quotes');

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const statusOrder = ['PENDING', 'QUOTED', 'ACCEPTED'];
  const currentIndex = statusOrder.indexOf(quote.status);
  const isCancelled = quote.status === 'CANCELLED';
  const isExpired = quote.status === 'EXPIRED';

  const events = [
    {
      status: 'PENDING',
      date: formatDate(quote.createdAt),
      label: t('timelineSubmitted'),
      description: t('timelineSubmittedDesc'),
      isActive: quote.status === 'PENDING',
      isCompleted: currentIndex > 0 || isCancelled || isExpired,
    },
    {
      status: 'QUOTED',
      date: quote.respondedAt ? formatDate(quote.respondedAt) : '',
      label: t('timelineQuoted'),
      description: quote.respondedBy
        ? `${t('timelineRespondedBy')} ${quote.respondedBy}`
        : t('timelineQuotedDesc'),
      isActive: quote.status === 'QUOTED',
      isCompleted: currentIndex > 1,
    },
    {
      status: 'ACCEPTED',
      date: quote.status === 'ACCEPTED' ? formatDate(quote.updatedAt) : '',
      label: t('timelineAccepted'),
      description: t('timelineAcceptedDesc'),
      isActive: quote.status === 'ACCEPTED',
      isCompleted: false,
    },
  ];

  return (
    <div className="relative">
      {events.map((event, index) => {
        let dotColor = 'bg-white/20 border-white/10';
        let lineColor = 'bg-white/10';
        let iconColor = 'text-white/30';

        if (event.isCompleted) {
          dotColor = 'bg-green-500 border-green-500';
          lineColor = 'bg-green-500/50';
          iconColor = 'text-white';
        } else if (event.isActive) {
          dotColor = 'bg-[#FF6B35] border-[#FF6B35]';
          iconColor = 'text-white';
        }

        return (
          <motion.div
            key={event.status}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            className="flex gap-4 pb-8 last:pb-0"
          >
            {/* Timeline dot + line */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className={`w-8 h-8 rounded-full border-2 ${dotColor} z-10 flex items-center justify-center ${iconColor}`}>
                  {stepIcons[event.status]}
                </div>
                {/* Pulse for active step */}
                {event.isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-[#FF6B35]/30"
                  />
                )}
              </div>
              {index < events.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: index * 0.15 + 0.2, duration: 0.4 }}
                  className={`w-0.5 flex-1 mt-1 origin-top ${lineColor}`}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 -mt-0.5">
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-semibold text-sm ${event.isActive || event.isCompleted ? 'text-white' : 'text-white/40'}`}>
                  {event.label}
                </span>
              </div>
              {event.date && (
                <p className="text-white/40 text-xs mb-1">{event.date}</p>
              )}
              {event.description && (
                <p className="text-white/50 text-sm">{event.description}</p>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Cancelled/Expired terminal state */}
      {(isCancelled || isExpired) && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex gap-4"
        >
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className={`w-8 h-8 rounded-full border-2 ${isCancelled ? 'bg-red-500 border-red-500' : 'bg-gray-500 border-gray-500'} z-10 flex items-center justify-center text-white`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute inset-0 rounded-full ${isCancelled ? 'bg-red-500/30' : 'bg-gray-500/30'}`}
              />
            </div>
          </div>
          <div className="flex-1 -mt-0.5">
            <span className={`font-semibold text-sm ${isCancelled ? 'text-red-400' : 'text-gray-400'}`}>
              {isCancelled ? t('timelineCancelled') : t('timelineExpired')}
            </span>
            <p className="text-white/40 text-xs">{formatDate(quote.updatedAt)}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
