'use client';

import { useTranslations } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface QuoteFiltersProps {
  status: string;
  serviceType: string;
  search: string;
  onStatusChange: (status: string) => void;
  onServiceTypeChange: (type: string) => void;
  onSearchChange: (search: string) => void;
}

const statusOptions = [
  { value: '', labelKey: 'allStatuses' },
  { value: 'PENDING', labelKey: 'statusPending' },
  { value: 'QUOTED', labelKey: 'statusQuoted' },
  { value: 'ACCEPTED', labelKey: 'statusAccepted' },
  { value: 'EXPIRED', labelKey: 'statusExpired' },
  { value: 'CANCELLED', labelKey: 'statusCancelled' },
];

const serviceOptions = [
  { value: '', label: 'All Services', labelKey: 'allServices' },
  { value: 'AIR_FREIGHT', label: 'Air Freight' },
  { value: 'OCEAN_FCL', label: 'Ocean FCL' },
  { value: 'OCEAN_LCL', label: 'Ocean LCL' },
  { value: 'PROJECT_CARGO', label: 'Project Cargo' },
];

export default function QuoteFilters({
  status,
  serviceType,
  search,
  onStatusChange,
  onServiceTypeChange,
  onSearchChange,
}: QuoteFiltersProps) {
  const t = useTranslations('quotes');

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Status pills */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onStatusChange(opt.value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
              status === opt.value
                ? 'bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/20'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
            )}
          >
            {t(opt.labelKey)}
          </button>
        ))}
      </div>

      {/* Service type pills */}
      <div className="flex flex-wrap gap-2">
        {serviceOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onServiceTypeChange(opt.value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
              serviceType === opt.value
                ? 'bg-white/15 text-white border border-white/20'
                : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70 border border-transparent'
            )}
          >
            {opt.labelKey ? t(opt.labelKey) : opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
