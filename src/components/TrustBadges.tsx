'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const memberships = [
  { name: 'MPL', desc: 'MPL Network' },
  { name: 'EAN', desc: 'Excellence Alliance Network' },
  { name: 'IATA', desc: 'IATA Certified Agent' },
  { name: 'ECS', desc: 'ECS Group Partner' },
];

export default function TrustBadges() {
  const { t } = useLanguage();
  return (
    <div className="bg-canvas py-12 border-b border-hairline">
      <div className="container-wide">
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
          <span className="eyebrow">{t('home.trust.eyebrow')}</span>
          {memberships.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group cursor-default"
            >
              <span className="card-title text-ink group-hover:text-muted transition-colors">
                {member.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
