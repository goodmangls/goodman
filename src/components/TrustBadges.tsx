'use client';

import { useTranslations } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function TrustBadges() {
  const t = useTranslations('trust');

  const memberships = [
    { name: 'MPL', desc: t('mpl') },
    { name: 'EAN', desc: t('ean') },
    { name: 'IATA', desc: t('iata') },
  ];

  return (
    <div className="bg-[#070612] py-24 md:py-32 relative z-20">
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
          <span className="text-xs md:text-sm font-medium text-white/30 uppercase tracking-[0.2em] w-full md:w-auto text-center">
            {t('subtitle')}
          </span>
          {memberships.map((member, index) => (
            <motion.div 
              key={member.name} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="group cursor-default"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-2xl md:text-3xl font-bold text-white/80 group-hover:text-white transition-colors duration-500 font-serif">
                  {member.name}
                </div>
                <div className="h-px w-0 bg-[#FF6B35] group-hover:w-full transition-all duration-500 ease-out" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
