'use client';

import { motion } from 'framer-motion';

const memberships = [
  { name: 'MPL', desc: 'MPL Network' },
  { name: 'EAN', desc: 'Excellence Alliance Network' },
  { name: 'IATA', desc: 'IATA Certified Agent' },
  { name: 'ECS', desc: 'ECS Group Partner' },
];

export default function TrustBadges() {
  return (
    <div className="bg-canvas py-16 border-b border-hairline">
      <div className="container-wide">
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24">
          <span className="eyebrow !text-ink/30 uppercase tracking-widest text-[10px]">
            Trusted Memberships
          </span>
          {memberships.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group cursor-default"
            >
              <span className="display-lg !text-2xl text-ink/40 group-hover:text-ink transition-colors">
                {member.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
