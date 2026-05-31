'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import DisplayLines from '@/components/DisplayLines';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NetworkPage() {
  const { t } = useLanguage();

  const airlines = [
    { name: "Korean Air Cargo", routes: "Seoul-LAX, Seoul-JFK, Seoul-FRA" },
    { name: "Asiana Cargo", routes: "Seoul-SFO, Seoul-ORD, Seoul-CDG" },
    { name: "Air China Cargo", routes: "Seoul-PEK, PEK-LAX, PEK-FRA" },
    { name: "Singapore Airlines Cargo", routes: "Seoul-SIN, SIN-AMS, SIN-NYC" },
  ];

  const networks = [
    { id: "mpl", name: "MPL", featureKeys: ['mplF1', 'mplF2', 'mplF3'] },
    { id: "ean", name: "EAN", featureKeys: ['eanF1', 'eanF2', 'eanF3'] },
  ];

  return (
    <main className="bg-canvas min-h-screen">
      {/* Header */}
      <section
        aria-labelledby="network-hero-heading"
        className="page-hero"
      >
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl"
          >
            <span className="eyebrow mb-6">{t('pages.network.heroEyebrow')}</span>
            <DisplayLines
              as="h1"
              id="network-hero-heading"
              lines={[t('pages.network.heroTitle1'), t('pages.network.heroTitle2')]}
              className="display-xl text-ink mb-10 leading-[0.85] tracking-tighter"
            />
            <p className="body-lg text-muted max-w-2xl">
              {t('pages.network.heroLead')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Network Cards */}
      <section
        aria-label={t('pages.network.partnersLabel')}
        className="section-spacing bg-canvas"
      >
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {networks.map((net) => {
              const dark = net.id === "ean";
              const main = dark ? "text-canvas-white" : "text-ink";
              const sub = dark ? "text-canvas-white/75" : "text-muted";
              return (
              <motion.div 
                key={net.id}
                whileHover={{ y: -4 }}
                className={`panel-bordered p-10 md:p-14 flex flex-col justify-between min-h-[400px] ${dark ? "section-surface-obsidian" : "bg-canvas"}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-12">
                    <span className={`display-md font-bold ${main}`}>{net.name}</span>
                    <span className="eyebrow">{t('pages.network.memberLabel')}</span>
                  </div>
                  <h3 className={`headline mb-6 ${main}`}>{t(`pages.network.${net.id}Full`)}</h3>
                  <p className={`body-lg mb-10 max-w-sm ${sub}`}>{t(`pages.network.${net.id}Desc`)}</p>
                </div>
                
                <ul className="feature-stack">
                  {net.featureKeys.map((fk) => (
                    <li key={fk} className="feature-stack-item">
                      <span className={`body-default font-bold ${main}`}>{t(`pages.network.${fk}`)}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );})}
          </div>
        </div>
      </section>

      {/* GSSA Section - Specialized capability */}
      <section
        aria-labelledby="network-gssa-heading"
        className="section-spacing bg-canvas"
      >
        <div className="container-wide">
          <div className="max-w-4xl mb-24">
            <span className="eyebrow mb-6">{t('pages.network.gssaEyebrow')}</span>
            <h2 id="network-gssa-heading" className="display-lg text-ink mb-10 leading-none">{t('pages.network.gssaTitle')}</h2>
            <p className="body-lg text-muted max-w-2xl leading-relaxed">
              {t('pages.network.gssaLead')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {airlines.map((airline, index) => (
              <div key={index} className="p-8 bg-canvas border border-hairline rounded-2xl hover:border-desert-sienna/60 transition-all group">
                <span className="eyebrow block mb-4">{t('pages.network.partnerLabel')}</span>
                <h4 className="headline-sm text-ink mb-3">{airline.name}</h4>
                <p className="caption text-muted line-clamp-2 leading-relaxed">{airline.routes}</p>
              </div>
            ))}
          </div>

          <div className="mt-32 text-center">
            <Link href="/#contact" className="btn-pill-primary text-lg py-5 px-12 group inline-flex items-center gap-3">
              <span>{t('pages.network.ctaExplore')}</span>
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
            </Link>
          </div>
        </div>
      </section>

      {/* Global ecosystem */}
      <section
        aria-labelledby="network-ecosystem-heading"
        className="section-spacing bg-canvas"
      >
        <div className="container-wide text-center">
          <h2 id="network-ecosystem-heading" className="display-lg text-ink mb-20 tracking-tighter">{t('pages.network.ecosystemTitle')}</h2>
          <div className="max-w-6xl mx-auto">
            <div className="aspect-auto md:aspect-[21/9] section-surface-obsidian rounded-[var(--radius-feature)] p-12 md:p-16 flex items-center justify-center relative">
               {/* Background patterns */}
               <div className="absolute inset-0 opacity-10 pointer-events-none group-hover:opacity-15 transition-opacity" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
               
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 className="relative z-10 p-12"
               >
                <span className="eyebrow mb-6">{t('pages.network.ecsEyebrow')}</span>
                <p className="display-xl text-canvas-white leading-none mb-4">59</p>
                <p className="display-sm text-canvas-white tracking-tight font-bold">{t('pages.network.ecsCountLabel')}</p>
                <p className="body-lg text-canvas-white/75 mt-8 max-w-xl mx-auto leading-relaxed">{t('pages.network.ecsLead')}</p>
               </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
