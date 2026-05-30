'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import DisplayLines from './DisplayLines';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className="relative hero-spacing overflow-hidden">
      {/* Full-bleed imagery */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?q=80&w=2940&auto=format&fit=crop"
          alt="Cargo aircraft on approach"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/50 to-obsidian/25" />
      </div>

      <div className="container-wide relative z-10 w-full">
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
            className="flex flex-wrap items-center gap-4"
          >
            <Link href="#contact" className="btn-pill-primary">
              {t('home.hero.ctaPrimary')}
            </Link>
            <Link href="/network" className="btn-pill-ghost">
              {t('home.hero.ctaSecondary')}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
