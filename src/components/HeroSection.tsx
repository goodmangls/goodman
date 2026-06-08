'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import DisplayLines from './DisplayLines';
import { useLanguage } from '@/contexts/LanguageContext';

const proofItems = [
  {
    key: 'network',
    labelKey: 'home.hero.proof.network.label',
    valueKey: 'home.hero.proof.network.value',
  },
  {
    key: 'airlines',
    labelKey: 'home.hero.proof.airlines.label',
    valueKey: 'home.hero.proof.airlines.value',
  },
  {
    key: 'coverage',
    labelKey: 'home.hero.proof.coverage.label',
    valueKey: 'home.hero.proof.coverage.value',
  },
] as const;

export default function HeroSection() {
  const { t } = useLanguage();
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative hero-spacing overflow-hidden"
    >
      {/* Full-bleed imagery */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=80&w=2940&auto=format&fit=crop"
          alt="Container yard and integrated logistics routes"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/95 via-obsidian/65 to-obsidian/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_32%,rgba(188,113,85,0.32),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.13)_1px,transparent_1px)] bg-[length:auto,56px_56px] opacity-70" />
      </div>

      <div className="container-wide relative z-10 w-full">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="subhead text-canvas-white/90 mb-6 max-w-xl"
          >
            {t('home.hero.eyebrow')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <DisplayLines
              as="h1"
              id="hero-heading"
              lines={[t('home.hero.titleLine1'), t('home.hero.titleLine2')]}
              className="display-hero text-canvas-white mb-8"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="body-lg text-canvas-white/80 max-w-xl mb-12"
          >
            {t('home.hero.lead')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mb-12"
          >
            <Link href="#contact" className="btn-pill-primary">
              {t('home.hero.ctaPrimary')}
            </Link>
            <Link href="/services" className="btn-pill-ghost">
              {t('home.hero.ctaSecondary')}
            </Link>
          </motion.div>

          <motion.dl
            aria-label={t('home.hero.proofLabel')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-card)] bg-canvas-white/20 sm:grid-cols-3"
          >
            {proofItems.map((item) => (
              <div key={item.key} className="bg-obsidian/60 px-4 py-3 backdrop-blur-sm sm:px-5 sm:py-4">
                <dt className="caption text-canvas-white/85">{t(item.labelKey)}</dt>
                <dd className="mt-2 whitespace-nowrap text-2xl font-bold tracking-tight text-canvas-white sm:text-[28px]">
                  {t(item.valueKey)}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.aside
          aria-label="GOODMAN GLS integrated logistics control tower"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="hidden rounded-[32px] border border-canvas-white/20 bg-obsidian/55 p-6 shadow-2xl shadow-obsidian/40 backdrop-blur-md lg:block"
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="caption text-canvas-white/50">CONTROL TOWER</p>
              <p className="mt-2 text-2xl font-bold leading-tight text-canvas-white">Korea multimodal flow</p>
            </div>
            <span className="rounded-full bg-desert-sienna px-3 py-1 text-xs font-bold text-canvas-white">LIVE</span>
          </div>

          <div className="relative min-h-[260px] overflow-hidden rounded-[24px] border border-canvas-white/15 bg-canvas-white/5 p-5">
            <div className="absolute inset-x-7 top-1/2 h-px bg-gradient-to-r from-canvas-white/15 via-desert-sienna to-canvas-white/15" />
            <div className="absolute bottom-8 left-1/2 top-8 w-px bg-gradient-to-b from-canvas-white/15 via-desert-sienna to-canvas-white/15" />
            {[
              ['AIR', 'top-5 left-5'],
              ['OCEAN', 'top-5 right-5'],
              ['ROAD', 'bottom-5 left-5'],
              ['3PL', 'bottom-5 right-5'],
            ].map(([label, position]) => (
              <div key={label} className={`absolute ${position} rounded-2xl border border-canvas-white/15 bg-obsidian/70 px-4 py-3`}>
                <p className="caption text-canvas-white/50">{label}</p>
                <div className="mt-2 h-1.5 w-16 rounded-full bg-desert-sienna" />
              </div>
            ))}
            <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-desert-sienna/70 bg-obsidian text-center shadow-[0_0_36px_rgba(188,113,85,0.35)]">
              <span className="caption text-canvas-white">ONE DESK</span>
            </div>
          </div>
        </motion.aside>
        </div>
      </div>
    </section>
  );
}
