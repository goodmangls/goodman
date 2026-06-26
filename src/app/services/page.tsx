'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PageHeroBackground from '@/components/PageHeroBackground';
import DisplayLines from '@/components/DisplayLines';
import { useLanguage } from '@/contexts/LanguageContext';
import { getMenuHeroUnsplashImage } from '@/lib/unsplash';

const serviceConfig = [
  { id: 'air', icon: '✈️' },
  { id: 'ocean', icon: '🚢' },
  { id: 'land', icon: '🚚' },
  { id: 'customs', icon: '🛃' },
  { id: 'warehouse', icon: '🏭' },
  { id: 'project', icon: '📦' },
];

const bridgeLogisFeatures = [
  'instantQuotes',
  'transparentBreakdown',
  'verifiedRates',
] as const;

const bridgeLogisMetrics = [
  { value: 'UPS / DHL', labelKey: 'carriers' },
  { value: '190+', labelKey: 'countries' },
  { value: '1 sec', labelKey: 'quoteTime' },
] as const;

export default function ServicesPage() {
  const { t } = useLanguage();
  const heroImage = getMenuHeroUnsplashImage('services');

  useEffect(() => {
    if (window.location.hash !== '#bridgelogis') return;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById('bridgelogis')?.scrollIntoView({ block: 'start' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const services = serviceConfig.map((s) => ({
    ...s,
    name: t(`pages.services.items.${s.id}.name`),
    tagline: t(`pages.services.items.${s.id}.tagline`),
    overview: t(`pages.services.items.${s.id}.overview`),
    features: [1, 2, 3, 4].map((i) => t(`pages.services.items.${s.id}.f${i}`)),
    caseStudy: {
      title: t(`pages.services.items.${s.id}.caseTitle`),
      route: t(`pages.services.items.${s.id}.caseRoute`),
      challenge: t(`pages.services.items.${s.id}.caseChallenge`),
      solution: t(`pages.services.items.${s.id}.caseSolution`),
      result: t(`pages.services.items.${s.id}.caseResult`),
    },
  }));

  return (
    <main className="bg-canvas min-h-screen">
      {/* Page Hero */}
      <section
        aria-labelledby="services-hero-heading"
        className="page-hero with-menu-hero-bg"
      >
        <PageHeroBackground image={heroImage} />
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl"
          >
            <span className="eyebrow mb-6">{t('pages.services.heroEyebrow')}</span>
            <h1 id="services-hero-heading" className="display-xl text-canvas-white mb-10 leading-[0.85] tracking-tighter">
              {t('pages.services.heroTitle')}
            </h1>
            <p className="body-lg text-canvas-white/78 max-w-2xl">
              {t('pages.services.heroLead')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Navigation / Quick Links */}
      <section
        aria-label={t('pages.services.quickAccess')}
        className="py-6 bg-canvas border-b border-hairline sticky top-16 md:top-16 z-30 backdrop-blur-xl bg-canvas/80"
      >
        <div className="container-wide flex flex-wrap gap-4 md:gap-8 items-center">
          <span className="eyebrow mr-4">{t('pages.services.quickAccess')}</span>
          {services.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="text-sm font-bold text-ink hover:text-muted transition-colors py-2">
              {s.name}
            </a>
          ))}
          <a href="#bridgelogis" className="text-sm font-bold text-primary hover:text-primary/70 transition-colors py-2">
            BridgeLogis
          </a>
        </div>
      </section>

      {/* Services Modular Blocks */}
      <div className="section-spacing space-y-24 md:space-y-32">
        {services.map((service, index) => { const isDark = index % 2 === 1; const main = isDark ? "text-canvas-white" : "text-ink"; const sub = isDark ? "text-canvas-white/75" : "text-muted"; const border = isDark ? "border-canvas-white/20" : "border-hairline"; const dot = isDark ? "bg-canvas-white/50" : "bg-ink/40"; const caseMeta = isDark ? "text-canvas-white/35" : "text-muted"; const caseBtn = isDark ? "text-canvas-white/55 hover:text-canvas-white" : "text-muted hover:text-ink"; return (
          <section
            key={service.id}
            id={service.id}
            aria-labelledby={`services-${service.id}-heading`}
            className="container-wide scroll-mt-32"
          >
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`panel-bordered ${isDark ? "section-surface-obsidian" : "bg-canvas"}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className={`lg:col-span-7 p-10 md:p-16 lg:p-24 border-b lg:border-b-0 lg:border-r ${border} flex flex-col justify-between`}>
                   <div>
                      <div className="flex items-center gap-6 mb-16">
                         <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl border ${border} ${isDark ? "bg-canvas-white/10" : "bg-surface-soft"}`}>
                            {service.icon}
                         </div>
                         <span className="eyebrow">{service.name}</span>
                      </div>
                      <h2 id={`services-${service.id}-heading`} className={`display-lg ${main} mb-8 leading-none tracking-tight`}>{service.tagline}</h2>
                      <p className={`body-lg ${sub} mb-12 max-w-xl leading-relaxed`}>{service.overview}</p>
                   </div>
                   
                   <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-16 border-t ${border}`}>
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-4">
                           <div className={`w-1.5 h-1.5 rounded-full ${dot} mt-2.5 flex-shrink-0`} />
                           <span className={`body-sm ${main} font-medium`}>{feature}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className={`lg:col-span-5 p-10 md:p-16 lg:p-24 ${isDark ? "bg-canvas-white/5" : "bg-surface-soft"} flex flex-col`}>
                   <div className="flex items-center gap-3 mb-16">
                      <div className={`w-2 h-2 rounded-full ${isDark ? "bg-canvas-white" : "bg-ink"} animate-pulse`} />
                      <span className="eyebrow mb-8">{t('pages.services.fieldStory')}</span>
                   </div>
                   
                   <div className="flex-1">
                      <h4 className={`headline ${main} mb-2`}>{service.caseStudy.title}</h4>
                      <p className={`caption ${sub} mb-8 uppercase font-medium`}>{service.caseStudy.route}</p>
                      
                      <div className="space-y-10">
                         <div>
                           <p className="eyebrow mb-3">{t('pages.services.challengeLabel')}</p>
                           <p className={`body-sm ${sub} leading-relaxed italic border-l-2 ${border} pl-6`}>&ldquo;{service.caseStudy.challenge}&rdquo;</p>
                         </div>
                         <div>
                           <p className="eyebrow mb-3">{t('pages.services.solutionLabel')}</p>
                           <p className={`body-sm ${sub} leading-relaxed`}>{service.caseStudy.solution}</p>
                         </div>
                         <div className={`p-6 border ${border} rounded-2xl shadow-inner-sm`}>
                           <p className="eyebrow mb-2">{t('pages.services.outcomeLabel')}</p>
                           <p className={`headline-sm ${main} font-bold`}>{service.caseStudy.result}</p>
                         </div>
                      </div>
                   </div>
                   
                   <div className={`mt-12 pt-8 border-t ${border} flex justify-between items-center`}>
                      <span className={`caption ${caseMeta}`}>{t('pages.services.caseRef')}: {service.id.toUpperCase()}-2026</span>
                      <button type="button" className={`caption font-bold ${caseBtn} transition-colors`}>{t('pages.services.readStory')}</button>
                   </div>
                </div>
              </div>
            </motion.div>
          </section>
        );})}
      </div>

      {/* BridgeLogis Section */}
      <section
        id="bridgelogis"
        aria-labelledby="bridgelogis-heading"
        className="container-wide section-spacing scroll-mt-32"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative overflow-hidden rounded-[2.5rem] border border-hairline bg-[#0A1628] text-canvas-white shadow-2xl"
        >
          <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #38bdf8 0, transparent 28%), radial-gradient(circle at 80% 0%, #FF6B35 0, transparent 24%), linear-gradient(135deg, rgba(255,255,255,0.14), transparent 40%)' }} />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-10 md:p-16 lg:p-20 border-b lg:border-b-0 lg:border-r border-canvas-white/15">
              <span className="eyebrow mb-6 text-canvas-white/70">{t('pages.services.bridgeLogis.eyebrow')}</span>
              <h2 id="bridgelogis-heading" className="display-lg mb-8 leading-none tracking-tight">
                {t('pages.services.bridgeLogis.title')}
              </h2>
              <p className="body-lg text-canvas-white/75 mb-12 max-w-2xl leading-relaxed">
                {t('pages.services.bridgeLogis.lead')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                {bridgeLogisMetrics.map((metric) => (
                  <div key={metric.labelKey} className="rounded-3xl border border-canvas-white/15 bg-canvas-white/10 p-6 backdrop-blur-sm">
                    <p className="text-3xl font-black tracking-tight mb-2">{metric.value}</p>
                    <p className="caption text-canvas-white/60">{t(`pages.services.bridgeLogis.metrics.${metric.labelKey}`)}</p>
                  </div>
                ))}
              </div>
              <p className="body-sm text-canvas-white/55 mb-12 max-w-2xl leading-relaxed">
                {t('pages.services.bridgeLogis.caveat')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://bridgelogis.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-primary w-full sm:w-auto text-base py-5 px-8 text-center shadow-lg shadow-primary/20"
                  aria-label={t('pages.services.bridgeLogis.ctaAria')}
                >
                  {t('pages.services.bridgeLogis.ctaPrimary')}
                </a>
                <Link href="/#contact" className="rounded-full border border-canvas-white/20 px-8 py-5 text-center font-bold text-canvas-white/75 hover:text-canvas-white hover:border-canvas-white/45 transition-colors">
                  {t('pages.services.bridgeLogis.ctaSecondary')}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 p-10 md:p-16 lg:p-20 bg-canvas-white/5">
              <div className="rounded-[2rem] border border-canvas-white/15 bg-canvas-white/10 p-6 mb-10 shadow-inner-sm">
                <p className="caption text-canvas-white/50 uppercase font-bold mb-4">{t('pages.services.bridgeLogis.previewLabel')}</p>
                <div className="flex items-center justify-between gap-4 rounded-2xl bg-canvas-white/10 p-4 mb-4">
                  <span className="body-sm font-bold">ICN → LAX</span>
                  <span className="caption text-emerald-300">LIVE FSC</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-canvas-white/70"><span>UPS</span><span>{t('pages.services.bridgeLogis.compareNow')}</span></div>
                  <div className="h-2 rounded-full bg-canvas-white/10 overflow-hidden"><div className="h-full w-4/5 rounded-full bg-primary" /></div>
                  <div className="flex justify-between text-sm text-canvas-white/70"><span>DHL</span><span>{t('pages.services.bridgeLogis.compareNow')}</span></div>
                  <div className="h-2 rounded-full bg-canvas-white/10 overflow-hidden"><div className="h-full w-3/5 rounded-full bg-sky-400" /></div>
                </div>
              </div>

              <div className="space-y-6">
                {bridgeLogisFeatures.map((feature) => (
                  <div key={feature} className="flex gap-4">
                    <div className="mt-1 h-3 w-3 rounded-full bg-primary shadow-[0_0_24px_rgba(255,107,53,0.8)] flex-shrink-0" />
                    <div>
                      <h3 className="headline-sm mb-2">{t(`pages.services.bridgeLogis.features.${feature}.title`)}</h3>
                      <p className="body-sm text-canvas-white/65 leading-relaxed">{t(`pages.services.bridgeLogis.features.${feature}.desc`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Unified CTA Section */}
      <section
        aria-labelledby="services-cta-heading"
        className="section-surface-obsidian section-spacing overflow-hidden relative"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="container-wide text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <DisplayLines
              as="h2"
              id="services-cta-heading"
              lines={[t('pages.services.ctaTitle1'), t('pages.services.ctaTitle2')]}
              className="display-xl text-canvas-white mb-12 tracking-tighter leading-none"
            />
            <p className="body-lg text-canvas-white/75 mb-16 max-w-xl mx-auto">
              {t('pages.services.ctaLead')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/#contact" className="btn-pill-primary w-full sm:w-auto text-lg py-5 px-10">
                {t('pages.services.ctaPrimary')}
              </Link>
              <Link href="/company" className="text-canvas-white/60 hover:text-canvas-white transition-colors eyebrow">
                {t('pages.services.ctaSecondary')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
