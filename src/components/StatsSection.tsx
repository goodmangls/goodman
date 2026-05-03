'use client';

import { useInView } from 'framer-motion';
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
    <span ref={ref} className="display-xl !text-6xl md:!text-7xl lg:!text-8xl text-ink tabular-nums tracking-tighter">
      {count}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const stats = [
    { value: 10, suffix: '+', label: 'Years of Experience', key: 'years' },
    { value: 15, suffix: '+', label: 'Airlines Represented', key: 'airlines' },
    { value: 59, suffix: '', label: 'Countries Connected', key: 'countries' },
    { value: 3, suffix: '', label: 'Offices in Korea', key: 'offices' },
  ];

  return (
    <section className="bg-canvas py-24">
      <div className="color-block color-block-lime">
        <div className="max-w-6xl">
          <span className="eyebrow block mb-12">Performance in numbers</span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {stats.map((stat) => (
              <div key={stat.key} className="flex flex-col items-start">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <div className="headline mt-4 opacity-80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
