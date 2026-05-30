'use client';

import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

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
    <span ref={ref} className="display-xl text-canvas-white tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const { t } = useLanguage();
  const stats = [
    { value: 10, suffix: '+', key: 'years' },
    { value: 15, suffix: '+', key: 'airlines' },
    { value: 59, suffix: '', key: 'countries' },
    { value: 3, suffix: '', key: 'offices' },
  ];

  return (
    <section
      aria-label={t('home.stats.eyebrow')}
      className="section-surface-obsidian section-spacing"
    >
      <div className="container-wide">
        <p className="eyebrow mb-12">{t('home.stats.eyebrow')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {stats.map((stat) => (
            <div key={stat.key} className="flex flex-col items-start">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p className="headline mt-4 text-canvas-white/75">{t(`home.stats.${stat.key}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
