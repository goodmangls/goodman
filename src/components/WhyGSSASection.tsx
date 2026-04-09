'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useTranslations } from '@/contexts/LanguageContext';

const pillars = [
  {
    key: 'sales',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    gradient: 'from-[#FF6B35]/20 to-[#FF6B35]/5',
    accent: '#FF6B35',
  },
  {
    key: 'capacity',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12zm0 0h7.5" />
      </svg>
    ),
    gradient: 'from-[#4A90D9]/20 to-[#4A90D9]/5',
    accent: '#4A90D9',
  },
  {
    key: 'intelligence',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    accent: '#10b981',
  },
  {
    key: 'digital',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
    gradient: 'from-violet-500/20 to-violet-500/5',
    accent: '#8b5cf6',
  },
];

export default function WhyGSSASection() {
  const t = useTranslations('whyGssa');
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#070612] py-32 md:py-40">
      {/* Atmospheric background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#FF6B35]/[0.03] rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#4A90D9]/[0.04] rounded-full blur-[180px]" />
      </motion.div>

      {/* Diagonal line decoration */}
      <div className="absolute top-0 left-1/2 w-px h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

      <div className="container relative z-10">
        {/* Header — editorial asymmetric layout */}
        <div className="max-w-6xl mx-auto mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#FF6B35]/30 bg-[#FF6B35]/5 text-[#FF6B35] text-xs font-semibold uppercase tracking-[0.15em] mb-8">
              {t('badge')}
            </span>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight max-w-2xl">
                {t('title')}
              </h2>
              <p className="text-base md:text-lg text-white/40 leading-relaxed max-w-md font-light">
                {t('description')}
              </p>
            </div>
          </motion.div>
        </div>

        {/* "What is a GSSA?" explainer block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-6xl mx-auto mb-20 md:mb-28"
        >
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm" />
            <div className="absolute inset-0 border border-white/[0.08] rounded-3xl" />
            <div className="relative grid md:grid-cols-2 gap-0">
              {/* Left — definition */}
              <div className="p-8 md:p-12 lg:p-16 border-b md:border-b-0 md:border-r border-white/[0.06]">
                <span className="text-[#FF6B35] text-sm font-semibold uppercase tracking-wider">{t('definitionLabel')}</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mt-4 mb-6 leading-tight">
                  {t('definitionTitle')}
                </h3>
                <p className="text-white/50 leading-relaxed">
                  {t('definitionBody')}
                </p>
              </div>
              {/* Right — why it matters */}
              <div className="p-8 md:p-12 lg:p-16">
                <span className="text-[#4A90D9] text-sm font-semibold uppercase tracking-wider">{t('whyLabel')}</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mt-4 mb-6 leading-tight">
                  {t('whyTitle')}
                </h3>
                <p className="text-white/50 leading-relaxed">
                  {t('whyBody')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Service Pillars — 4-column grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative rounded-2xl overflow-hidden cursor-default"
            >
              {/* Card bg */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />
              <div className="absolute inset-0 border border-white/[0.06] rounded-2xl group-hover:border-white/[0.12] transition-colors duration-500" />

              {/* Glow on hover */}
              <div
                className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-radial ${pillar.gradient} rounded-full blur-3xl opacity-0 motion-safe:group-hover:opacity-100 transition-opacity duration-700`}
              />

              <div className="relative p-6 md:p-8">
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-500"
                  style={{
                    backgroundColor: `${pillar.accent}10`,
                    color: pillar.accent,
                    border: `1px solid ${pillar.accent}20`,
                  }}
                >
                  {pillar.icon}
                </div>

                {/* Title */}
                <h4 className="text-lg font-bold text-white mb-3 group-hover:text-white transition-colors">
                  {t(`pillars.${pillar.key}.title`)}
                </h4>

                {/* Description */}
                <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors duration-500">
                  {t(`pillars.${pillar.key}.description`)}
                </p>

                {/* Bottom accent line */}
                <div
                  className="mt-6 h-px w-0 motion-safe:group-hover:w-full transition-all duration-700 ease-out"
                  style={{ backgroundColor: pillar.accent }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
