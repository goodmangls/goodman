'use client';

import Link from 'next/link';
import DisplayLines from './DisplayLines';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NetworkManifesto() {
  const { t } = useLanguage();
  return (
    <section className="bg-canvas section-spacing">
      <div className="container-wide">
        <div className="section-surface-obsidian rounded-[var(--radius-feature)] p-12 md:p-16 lg:p-20 max-w-4xl">
          <p className="eyebrow mb-8">{t('home.network.eyebrow')}</p>
          <DisplayLines
            as="h2"
            lines={[t('home.network.titleLine1'), t('home.network.titleLine2')]}
            className="display-lg text-canvas-white mb-10"
          />
          <p className="body-lg text-canvas-white/75 max-w-2xl mb-12">
            {t('home.network.lead')}
          </p>
          <Link href="/network" className="btn-pill-primary">
            {t('home.network.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
