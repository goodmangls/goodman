'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from '@/contexts/LanguageContext';
import { quoteRequestSchema, publicQuoteRequestSchema } from '@/lib/validations/quote';
import type { QuoteRequestFormData, PublicQuoteRequestFormData } from '@/lib/validations/quote';
import { cn } from '@/lib/utils';

interface QuoteFormProps {
  mode: 'authenticated' | 'public';
  variant?: 'dark' | 'light';
  onSuccess?: (quoteId: string) => void;
  onCancel?: () => void;
  className?: string;
}

export default function QuoteForm({ mode, variant, onSuccess, onCancel, className }: QuoteFormProps) {
  const t = useTranslations('quotes');
  const tModal = useTranslations('rateInquiryModal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Default: dark for authenticated (portal), light for public (modal)
  const v = variant ?? (mode === 'authenticated' ? 'dark' : 'light');
  const isDark = v === 'dark';

  const schema = mode === 'authenticated' ? quoteRequestSchema : publicQuoteRequestSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuoteRequestFormData | PublicQuoteRequestFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: QuoteRequestFormData | PublicQuoteRequestFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const endpoint = mode === 'authenticated' ? '/api/quotes' : '/api/quotes/public';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Something went wrong');
        return;
      }

      setSuccess(true);
      reset();
      onSuccess?.(result.quote.id);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={className}>
        <div className="text-center py-8">
          <div className={cn(
            'w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center',
            isDark ? 'bg-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]' : 'bg-green-100'
          )}>
            <svg className={cn('w-8 h-8', isDark ? 'text-green-400' : 'text-green-600')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className={cn('text-xl font-bold mb-2', isDark ? 'text-white' : 'text-[#070612]')}>{t('submitSuccess')}</h3>
          <p className={cn('mb-6', isDark ? 'text-white/50' : 'text-gray-600')}>{t('submitSuccessDesc')}</p>
          <button
            onClick={() => { setSuccess(false); reset(); }}
            className="px-6 py-2 bg-[#FF6B35] text-white font-medium rounded-xl hover:bg-[#E05A2B] transition-colors"
          >
            {t('submitAnother')}
          </button>
        </div>
      </div>
    );
  }

  const inputClass = isDark
    ? 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all'
    : 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all bg-gray-50';
  const labelClass = isDark
    ? 'block text-sm font-semibold mb-2 text-white/80'
    : 'block text-sm font-semibold mb-2 text-gray-700';
  const errorClass = isDark
    ? 'text-red-400 text-xs mt-1'
    : 'text-red-500 text-xs mt-1';

  return (
    <div className={className}>
      {error && (
        <div className={cn(
          'mb-4 p-3 rounded-xl text-sm',
          isDark ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-red-50 border border-red-200 text-red-700'
        )}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Service + Shipment Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>{tModal('serviceType')}</label>
            <select {...register('serviceType')} className={inputClass}>
              <option value="">{t('selectServiceType')}</option>
              <option value="AIR_FREIGHT">{tModal('airFreight')}</option>
              <option value="OCEAN_FCL">Ocean FCL</option>
              <option value="OCEAN_LCL">Ocean LCL</option>
              <option value="PROJECT_CARGO">{tModal('projectCargo')}</option>
            </select>
            {errors.serviceType && <p className={errorClass}>{errors.serviceType.message}</p>}
          </div>

          <div>
            <label className={labelClass}>{tModal('shipmentType')}</label>
            <select {...register('shipmentType')} className={inputClass}>
              <option value="">{t('selectShipmentType')}</option>
              <option value="IMPORT">{tModal('import')}</option>
              <option value="EXPORT">{tModal('export')}</option>
              <option value="CROSS_TRADE">Cross Trade</option>
            </select>
            {errors.shipmentType && <p className={errorClass}>{errors.shipmentType.message}</p>}
          </div>
        </div>

        {/* Origin + Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>{tModal('origin')}</label>
            <input
              type="text"
              {...register('origin')}
              className={inputClass}
              placeholder={tModal('cityCountryPlaceholder')}
            />
            {errors.origin && <p className={errorClass}>{errors.origin.message}</p>}
          </div>

          <div>
            <label className={labelClass}>{tModal('destination')}</label>
            <input
              type="text"
              {...register('destination')}
              className={inputClass}
              placeholder={tModal('cityCountryPlaceholder')}
            />
            {errors.destination && <p className={errorClass}>{errors.destination.message}</p>}
          </div>
        </div>

        {/* Cargo Details */}
        <div>
          <label className={labelClass}>{tModal('cargoDetails')}</label>
          <textarea
            {...register('cargoDetails')}
            className={inputClass}
            rows={3}
            placeholder={tModal('cargoPlaceholder')}
          />
          {errors.cargoDetails && <p className={errorClass}>{errors.cargoDetails.message}</p>}
        </div>

        {/* Weight + Commodity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>{t('weight')} (kg)</label>
            <input
              type="number"
              step="0.01"
              {...register('weight', { valueAsNumber: true })}
              className={inputClass}
              placeholder={t('weightPlaceholder')}
            />
            {errors.weight && <p className={errorClass}>{errors.weight.message}</p>}
          </div>

          <div>
            <label className={labelClass}>{t('commodity')}</label>
            <input
              type="text"
              {...register('commodity')}
              className={inputClass}
              placeholder={t('commodityPlaceholder')}
            />
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <label className={labelClass}>{t('dimensions')}</label>
          <input
            type="text"
            {...register('dimensions')}
            className={inputClass}
            placeholder={t('dimensionsPlaceholder')}
          />
        </div>

        {/* Guest-only fields */}
        {mode === 'public' && (
          <>
            <hr className={isDark ? 'border-white/10' : 'border-gray-200'} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>{tModal('yourName')}</label>
                <input
                  type="text"
                  {...register('guestName' as keyof PublicQuoteRequestFormData)}
                  className={inputClass}
                />
                {'guestName' in errors && (errors as Record<string, { message?: string }>).guestName && (
                  <p className={errorClass}>{(errors as Record<string, { message?: string }>).guestName?.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>{tModal('company')}</label>
                <input
                  type="text"
                  {...register('guestCompany' as keyof PublicQuoteRequestFormData)}
                  className={inputClass}
                />
                {'guestCompany' in errors && (errors as Record<string, { message?: string }>).guestCompany && (
                  <p className={errorClass}>{(errors as Record<string, { message?: string }>).guestCompany?.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  {...register('guestEmail' as keyof PublicQuoteRequestFormData)}
                  className={inputClass}
                />
                {'guestEmail' in errors && (errors as Record<string, { message?: string }>).guestEmail && (
                  <p className={errorClass}>{(errors as Record<string, { message?: string }>).guestEmail?.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>{tModal('phone')}</label>
                <input
                  type="tel"
                  {...register('guestPhone' as keyof PublicQuoteRequestFormData)}
                  className={inputClass}
                />
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-4 bg-[#FF6B35] text-white font-bold rounded-xl hover:bg-[#E05A2B] transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('submitting') : tModal('submitInquiry')}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                'px-6 py-4 font-medium rounded-xl transition-colors',
                isDark
                  ? 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {t('cancel')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
