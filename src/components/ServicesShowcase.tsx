'use client';

import { useTranslations } from '@/contexts/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaPlane, FaShip, FaBoxOpen, FaScrewdriverWrench, FaArrowRight } from 'react-icons/fa6';
import { useRef } from 'react';

interface Service {
  icon: React.ReactNode;
  nameKey: string;
  taglineKey: string;
  descriptionKey: string;
}

export default function ServicesShowcase() {
  const t = useTranslations('services');
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const yParallax = useTransform(scrollYProgress, [0, 1], [50, -50]);

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
    <section id="services" className="min-h-screen flex items-center section-md bg-[#070612] relative z-10 py-32 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070612] via-[#0A0A1F] to-[#070612] pointer-events-none" />
      
      <div className="container relative z-10" ref={containerRef}>
        <motion.div 
            style={{ y: yParallax }}
            className="mb-24 md:mb-32 max-w-6xl mx-auto"
        >
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
            <p className="text-lg md:text-xl text-white/50 font-light md:max-w-lg leading-relaxed flex-1 border-l border-white/10 pl-8">
              {t('subtitle')}
            </p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1400px] mx-auto">
          {services.map((service, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6, type: "spring", stiffness: 40 }}
              whileHover={{ y: -15 }}
              className="glass-panel p-10 md:p-12 rounded-3xl group flex flex-col h-full relative overflow-hidden border border-white/5 hover:border-[#FF6B35]/30 transition-colors duration-500 focus-visible:ring-2 focus-visible:ring-[#FF6B35]/50 focus-visible:outline-none"
            >
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <FaArrowRight className="text-[#FF6B35] -rotate-45 motion-safe:group-hover:rotate-0 transition-transform duration-300" />
              </div>

              <div className="text-4xl md:text-5xl mb-12 opacity-80 text-white/80 group-hover:text-[#FF6B35] motion-safe:group-hover:scale-110 transition-all duration-500 origin-left">
                {service.icon}
              </div>
              
              <div className="mt-auto relative z-10">
                <h3 className="text-2xl md:text-3xl mb-3 text-white font-bold group-hover:text-white transition-colors duration-300 font-serif">
                  {t(service.nameKey)}
                </h3>
                <p className="text-[#FF6B35] font-medium mb-6 text-sm tracking-wide uppercase opacity-80">
                  {t(service.taglineKey)}
                </p>
                <p className="text-white/60 mb-8 text-base leading-relaxed font-light group-hover:text-white/80 transition-colors">
                  {t(service.descriptionKey)}
                </p>
              </div>

              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B35]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
