'use client';

import DisplayLines from './DisplayLines';
import { useLanguage } from '@/contexts/LanguageContext';

const pillarKeys = ['sales', 'capacity', 'intelligence', 'digital'];

export default function WhyGSSASection() {
  const { t } = useLanguage();
  return (
    <section id="services" className="bg-canvas section-spacing">
      <div className="container-wide">
        <div className="max-w-3xl mb-16">
          <p className="eyebrow mb-6">{t('home.why.eyebrow')}</p>
          <DisplayLines
            as="h2"
            lines={[t('home.why.titleLine1'), t('home.why.titleLine2')]}
            className="display-lg text-ink mb-8"
          />
          <p className="body-default text-muted max-w-2xl">
            {t('home.why.lead')}
          </p>
        </div>

        <div className="feature-stack max-w-4xl">
          {pillarKeys.map((key) => (
            <div key={key} className="feature-stack-item">
              <h3 className="headline text-ink mb-3">{t(`home.why.pillars.${key}.title`)}</h3>
              <p className="body-default text-muted">{t(`home.why.pillars.${key}.description`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
