'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative hero-spacing bg-canvas overflow-hidden">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-2xl relative z-10">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="eyebrow text-ink mb-6"
            >
              Small Giant. Big Impact.
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="display-xl text-ink mb-8"
            >
              We sell your cargo <br />
              as if it were <span className="italic font-serif">our own</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="body-lg text-ink/60 max-w-xl mb-12"
            >
              Figma-style logistics representation in Korea. 15+ airlines, 50+ countries via ECS Group, and one dedicated team representing your brand.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link href="#contact" className="btn-pill-primary">
                Get started
              </Link>
              <Link href="/network" className="btn-pill-secondary">
                View Network
              </Link>
            </motion.div>
          </div>

          {/* Hero Image Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[400px] md:h-[600px] w-full rounded-lg overflow-hidden border border-hairline shadow-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?q=80&w=2940&auto=format&fit=crop"
              alt="Cargo Aircraft"
              fill
              className="object-cover transition-all duration-700 hover:scale-105 dark:brightness-90 dark:contrast-110"
              priority
            />
            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-ink/5 dark:bg-black/20 pointer-events-none" />
          </motion.div>
        </div>
      </div>

      {/* Decorative background element - subtle pastel block */}
      <div className="absolute top-0 right-0 -z-10 translate-x-1/4 -translate-y-1/4">
        <div className="w-[800px] h-[800px] bg-block-cream rounded-full opacity-30 blur-3xl dark:opacity-10" />
      </div>
    </section>
  );
}
