'use client';

import DisplayLines from './DisplayLines';
import { useLanguage } from '@/contexts/LanguageContext';

const serviceKeys = ['air', 'ocean', 'project', 'aero'];

export default function ServicesShowcase() {
  const { t } = useLanguage();
  return (
    <section className="section-surface-obsidian section-spacing">
      <div className="container-wide">
        <div className="max-w-3xl mb-16">
          <p className="eyebrow mb-6">{t('home.services.eyebrow')}</p>
          <DisplayLines
            as="h2"
            lines={[t('home.services.titleLine1'), t('home.services.titleLine2')]}
            className="display-lg text-canvas-white mb-8"
          />
          <p className="body-lg text-canvas-white/75 max-w-2xl">
            {t('home.services.lead')}
          </p>
        </div>

        <div className="feature-stack max-w-4xl">
          {serviceKeys.map((key) => (
            <div key={key} className="feature-stack-item">
              <h3 className="headline text-canvas-white mb-2">{t(`home.services.items.${key}.name`)}</h3>
              <p className="caption text-canvas-white/50 mb-4">{t(`home.services.items.${key}.tagline`)}</p>
              <p className="body-default text-canvas-white/75">{t(`home.services.items.${key}.description`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
