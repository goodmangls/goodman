'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/contexts/LanguageContext';
import QuoteForm from '@/components/quotes/QuoteForm';
import { PageTransition, FadeIn } from '@/components/portal/PortalAnimations';
import { useToast } from '@/contexts/ToastContext';

export default function NewQuotePage() {
  const router = useRouter();
  const t = useTranslations('quotes');
  const { toast } = useToast();

  return (
    <PageTransition>
      <div className="px-6 py-8 max-w-3xl mx-auto">
        {/* Header */}
        <FadeIn>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{t('newQuoteTitle')}</h1>
            <p className="text-white/60">{t('newQuoteSubtitle')}</p>
          </div>
        </FadeIn>

        {/* Form - dark variant for portal */}
        <FadeIn delay={0.15}>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <QuoteForm
              mode="authenticated"
              variant="dark"
              onSuccess={(quoteId) => {
                toast(t('submitSuccess'), 'success');
                router.push(`/portal/quotes/${quoteId}`);
              }}
              onCancel={() => router.back()}
            />
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
