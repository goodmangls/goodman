'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const partners = [
  { code: 'WS', name: 'WestJet Cargo' },
  { code: 'O3', name: 'ShunFeng Airlines' },
  { code: 'BX', name: 'Air Busan' },
  { code: 'M0', name: 'Aero Mongolia' },
  { code: 'SU', name: 'Aeroflot' },
  { code: 'F7', name: 'iFly Airlines' },
  { code: 'ZH', name: 'Shenzhen Airlines' },
  { code: '8Y', name: 'China Post' },
];

export default function GSASection() {
  const { t } = useLanguage();
  return (
    <section
      id="network"
      aria-labelledby="gsa-heading"
      className="bg-canvas section-spacing"
    >
      <div className="container-wide">
        <div className="max-w-4xl mb-16">
          <p className="eyebrow mb-6">{t('home.gsa.eyebrow')}</p>
          <h2 id="gsa-heading" className="display-lg text-ink mb-6">{t('home.gsa.title')}</h2>
          <p className="body-lg text-muted">
            {t('home.gsa.lead')}
          </p>
        </div>

        <div className="panel-bordered grid grid-cols-2 md:grid-cols-4 gap-px bg-hairline">
          {partners.map((partner) => (
            <div
              key={partner.code}
              className="bg-canvas p-8 flex flex-col justify-center items-center text-center min-h-[160px] group hover:bg-surface-soft transition-colors"
            >
              <span className="card-title mb-2 group-hover:scale-105 transition-transform">
                {partner.code}
              </span>
              <span className="caption text-muted">{partner.name}</span>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Link href="#contact" className="btn-pill-primary">
            {t('home.gsa.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
