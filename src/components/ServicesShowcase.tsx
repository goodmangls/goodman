'use client';

import DisplayLines from './DisplayLines';
import { useLanguage } from '@/contexts/LanguageContext';

const serviceKeys = ['air', 'ocean', 'land', 'customs', 'warehouse', 'project'];

export default function ServicesShowcase() {
  const { t } = useLanguage();
  return (
    <section
      aria-labelledby="services-showcase-heading"
      className="section-surface-obsidian section-spacing"
    >
      <div className="container-wide">
        <div className="max-w-3xl mb-16">
          <p className="eyebrow mb-6">{t('home.services.eyebrow')}</p>
          <DisplayLines
            as="h2"
            id="services-showcase-heading"
            lines={[t('home.services.titleLine1'), t('home.services.titleLine2')]}
            className="display-lg text-canvas-white mb-8"
          />
          <p className="body-lg text-canvas-white/75 max-w-2xl">
            {t('home.services.lead')}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="feature-stack max-w-4xl">
            {serviceKeys.map((key) => (
              <div key={key} className="feature-stack-item">
                <h3 className="headline text-canvas-white mb-2">{t(`home.services.items.${key}.name`)}</h3>
                <p className="caption text-canvas-white/50 mb-4">{t(`home.services.items.${key}.tagline`)}</p>
                <p className="body-default text-canvas-white/75">{t(`home.services.items.${key}.description`)}</p>
              </div>
            ))}
          </div>

          <aside
            aria-label="Integrated logistics service map"
            className="rounded-[32px] border border-canvas-white/15 bg-canvas-white/[0.06] p-6 shadow-2xl shadow-obsidian/30"
          >
            <p className="caption text-canvas-white/45">SERVICE MAP</p>
            <div className="mt-6 space-y-4">
              {['Air freight', 'Ocean freight', 'Customs', 'Warehouse', 'Last mile'].map((label, index) => (
                <div key={label} className="flex items-center gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-desert-sienna/60 text-sm font-bold text-canvas-white">
                    {index + 1}
                  </span>
                  <div className="h-px flex-1 bg-canvas-white/15" />
                  <span className="min-w-28 rounded-full bg-obsidian/60 px-3 py-2 text-right text-sm font-semibold text-canvas-white/80">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <p className="body-sm mt-7 text-canvas-white/60">
              One accountable operating desk connects every physical handoff from pickup to delivery.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
