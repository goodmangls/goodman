'use client';

import Link from 'next/link';
import { useTranslations } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { FaPlane, FaShip, FaBoxOpen, FaScrewdriverWrench } from 'react-icons/fa6';

interface Service {
  icon: React.ReactNode;
  nameKey: string;
  taglineKey: string;
  descriptionKey: string;
}

export default function ServicesShowcase() {
  const t = useTranslations('services');

  const services: Service[] = [
    {
      icon: <FaPlane />,
      nameKey: 'air.name',
      taglineKey: 'air.tagline',
      descriptionKey: 'air.description',
    },
    {
      icon: <FaShip />,
      nameKey: 'ocean.name',
      taglineKey: 'ocean.tagline',
      descriptionKey: 'ocean.description',
    },
    {
      icon: <FaBoxOpen />,
      nameKey: 'project.name',
      taglineKey: 'project.tagline',
      descriptionKey: 'project.description',
    },
    {
      icon: <FaScrewdriverWrench />,
      nameKey: 'mro.name',
      taglineKey: 'mro.tagline',
      descriptionKey: 'mro.description',
    },
  ];

  return (
    <section id="services" className="min-h-screen flex items-center section-md bg-[#070612] relative z-10 py-32">
      <div className="container">
        <div className="mb-20 md:mb-32 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-10 md:gap-20"
          >
            <h2 className="display-serif text-white text-5xl md:text-6xl lg:text-7xl tracking-tight flex-1">
              {t('title')}
            </h2>
            <p className="text-lg md:text-xl text-white/50 font-light md:max-w-lg leading-relaxed flex-1">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.8 }}
              className="glass-panel glass-panel-hover p-10 md:p-12 rounded-4xl group flex flex-col h-full"
            >
              <div className="text-4xl md:text-5xl mb-8 opacity-80 group-hover:scale-110 transition-transform duration-500 origin-left">
                {service.icon}
              </div>
              <div className="mt-auto">
                <h3 className="text-2xl md:text-3xl mb-3 text-white font-bold group-hover:text-[#FF6B35] transition-colors duration-300 font-serif">
                  {t(service.nameKey)}
                </h3>
                <p className="text-[#FF6B35] font-medium mb-4 text-sm tracking-wide uppercase opacity-80">
                  {t(service.taglineKey)}
                </p>
                <p className="text-white/60 mb-8 text-base leading-relaxed font-light">
                  {t(service.descriptionKey)}
                </p>
                <Link href="/services" className="inline-flex items-center text-white/40 hover:text-white transition-colors group/link pb-1 border-b border-transparent hover:border-white/20">
                  <span className="font-medium mr-2 text-sm uppercase tracking-wider">{t('learnMore') || 'Details'}</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
