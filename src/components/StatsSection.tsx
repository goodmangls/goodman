'use client';

import { useTranslations } from '@/contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#FF6B35] tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const t = useTranslations('stats');

  const stats = [
    { value: 10, suffix: '+', label: t('years'), key: 'years' },
    { value: 5, suffix: '', label: t('airlines'), key: 'airlines' },
    { value: 59, suffix: '', label: t('countries'), key: 'countries' },
    { value: 3, suffix: '', label: t('offices'), key: 'offices' },
  ];

  return (
    <section className="bg-[#070612] relative overflow-hidden py-24 md:py-32">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF6B35]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs md:text-sm font-medium text-white/30 uppercase tracking-[0.2em]">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col items-center text-center"
            >
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <div className="mt-3 text-sm md:text-base text-white/50 font-light leading-tight">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
