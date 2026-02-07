'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from '@/contexts/LanguageContext';
import { quoteResponseSchema } from '@/lib/validations/quote';
import type { QuoteResponseFormData } from '@/lib/validations/quote';

interface AdminQuoteResponseProps {
  quoteId: string;
  onSuccess?: () => void;
}

export default function AdminQuoteResponse({ quoteId, onSuccess }: AdminQuoteResponseProps) {
  const t = useTranslations('adminQuotes');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const defaultValidUntil = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteResponseFormData>({
    resolver: zodResolver(quoteResponseSchema),
    defaultValues: {
      currency: 'USD',
      validUntil: defaultValidUntil,
    },
  });

  const onSubmit = async (data: QuoteResponseFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/quotes/${quoteId}/respond`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Failed to submit response');
        return;
      }

      setSuccess(true);
      setTimeout(() => onSuccess?.(), 1500);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent placeholder:text-white/30';
  const labelClass = 'block text-sm font-semibold mb-2 text-white/80';
  const errorClass = 'text-red-400 text-xs mt-1';

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-1">{t('respondTitle')}</h3>
      <p className="text-white/40 text-sm mb-6">{t('respondSubtitle') || 'Provide a rate quote for this shipment request.'}</p>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-14 h-14 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-400 font-semibold">{t('responseSubmitted') || 'Response submitted successfully!'}</p>
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0 }}>
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className={labelClass}>{t('quotedRate')}</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('quotedRate', { valueAsNumber: true })}
                    className={inputClass}
                    placeholder="0.00"
                  />
                  {errors.quotedRate && <p className={errorClass}>{errors.quotedRate.message}</p>}
                </div>

                <div>
                  <label className={labelClass}>{t('currency')}</label>
                  <select {...register('currency')} className={inputClass}>
                    <option value="USD">USD</option>
                    <option value="KRW">KRW</option>
                    <option value="EUR">EUR</option>
                    <option value="JPY">JPY</option>
                    <option value="CNY">CNY</option>
                  </select>
                  {errors.currency && <p className={errorClass}>{errors.currency.message}</p>}
                </div>

                <div>
                  <label className={labelClass}>{t('validUntil')}</label>
                  <input
                    type="date"
                    {...register('validUntil')}
                    className={inputClass}
                  />
                  {errors.validUntil && <p className={errorClass}>{errors.validUntil.message}</p>}
                </div>
              </div>

              <div>
                <label className={labelClass}>{t('notes')}</label>
                <textarea
                  {...register('notes')}
                  className={inputClass}
                  rows={3}
                  placeholder={t('notesPlaceholder')}
                />
                {errors.notes && <p className={errorClass}>{errors.notes.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#FF6B35] text-white font-bold rounded-xl hover:bg-[#E05A2B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {isSubmitting ? t('submitting') : t('submitResponse')}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
