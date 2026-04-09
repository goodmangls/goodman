'use client';

import Link from 'next/link';
import { useTranslations } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function GSASection() {
  const t = useTranslations('gsa');

  const partnerKeys = ['ws', 'o3', 'bx', 'mo', 'su'];

  return (
    <section id="network" className="min-h-screen flex items-center section-md bg-[#070612] relative overflow-hidden py-32">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[#0A2463]/10 rounded-full blur-[180px] pointer-events-none opacity-50" />

      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 md:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-10 md:gap-20"
          >
            <div className="flex-1">
                <h2 className="display-serif text-white text-5xl md:text-6xl lg:text-7xl mb-6 tracking-tight">
                {t('title')}
                </h2>
                <p className="text-xl md:text-2xl text-white/50 font-light">
                {t('subtitle')}
                </p>
            </div>
            <div className="flex-1 md:max-w-lg">
                <p className="text-base md:text-lg text-white/40 leading-relaxed font-light">
                {t('description')}
                </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-20 md:mb-28">
            {partnerKeys.map((key, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
                className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-center items-center text-center h-[120px]"
              >
                <div className="text-white font-bold text-lg mb-2">
                  {key.toUpperCase()}
                </div>
                <div className="text-xs text-white/50 leading-tight">
                  {t(`partners.${key}`)}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/network-solutions" className="group inline-flex items-center justify-center px-10 py-5 rounded-full bg-white text-[#070612] text-sm font-bold uppercase tracking-wider hover:bg-[#FF6B35] hover:text-white transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#FF6B35]/50 focus-visible:outline-none">
              <span>{t('cta')}</span>
              <svg
                className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
