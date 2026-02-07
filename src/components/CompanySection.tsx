'use client';

import { useTranslations } from '@/contexts/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaHandshakeSimple, FaBolt, FaGlobe, FaUserTie } from 'react-icons/fa6';
import { useRef } from 'react';

export default function CompanySection() {
  const t = useTranslations('company');
  const sectionRef = useRef<HTMLElement>(null);
  
  // Scroll Parallax Hooks
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yContent = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Using default English values for now if translation keys are missing, 
  // ensuring the logic works even without full ko/en JSON updates immediately.
  const strengths = ['local', 'market', 'relationship', 'operational'];
  
  const values = [
    { icon: <FaHandshakeSimple />, titleKey: 'values.trust', descKey: 'values.trustDesc' },
    { icon: <FaBolt />, titleKey: 'values.velocity', descKey: 'values.velocityDesc' },
    { icon: <FaGlobe />, titleKey: 'values.connectivity', descKey: 'values.connectivityDesc' },
  ];

  return (
    <section 
      ref={sectionRef}
      id="company" 
      className="min-h-screen flex items-center section-lg bg-[#070612] relative z-10 overflow-hidden py-32"
    >
        {/* Parallax Background Decorative Element */}
        <motion.div 
            style={{ y: yBackground }}
            className="absolute left-0 bottom-0 w-[600px] h-[600px] bg-white/2 rounded-full blur-[120px] pointer-events-none" 
        />

        <div className="container relative z-10">
            <motion.div 
                style={{ y: yContent }}
                className="max-w-6xl mx-auto mb-20 md:mb-32"
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-10 md:gap-20"
                >
                    <div className="flex-1">
                        <span className="text-[#FF6B35] font-bold tracking-widest uppercase text-sm mb-4 block">
                            {t('since')}
                        </span>
                        <h2 className="display-serif text-white text-5xl md:text-6xl lg:text-7xl leading-tight">
                            {t('title').split('.').map((part, i) => (
                                <span key={i} className="block">{part}{part && '.'}</span>
                            ))}
                        </h2>
                    </div>
                    <div className="flex-1 md:max-w-xl">
                        <p className="text-xl text-white/60 font-light leading-relaxed">
                            {t('description')}
                        </p>
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <p className="text-white/80 font-medium italic">
                                {t('identity')}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-20 md:mb-32">
                {values.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: index * 0.1, duration: 0.6, type: "spring", stiffness: 50 }}
                        whileHover={{ y: -10, transition: { duration: 0.3 } }}
                        className="glass-panel p-10 rounded-3xl group hover:bg-white/5 transition-colors duration-500 text-left border border-white/5 hover:border-white/10"
                    >
                        <div className="text-5xl mb-6 group-hover:scale-110 group-hover:text-[#FF6B35] transition-all duration-500">
                            {item.icon}
                        </div>
                         <h3 className="text-2xl font-serif text-white mb-4">
                             {t(item.titleKey)}
                         </h3>
                         <p className="text-white/50 leading-relaxed font-light">
                             {t(item.descKey)}
                         </p>
                    </motion.div>
                ))}
            </div>

            {/* Core Strengths Grid */}
            <div className="mb-20">
                <h3 className="text-2xl font-serif text-white mb-8">Core Strengths</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {strengths.map((key, i) => (
                        <motion.div 
                            key={key} 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-start gap-4 hover:bg-white/10 transition-colors cursor-default"
                        >
                            <div className="w-2 h-2 mt-2.5 rounded-full bg-[#FF6B35]" />
                            <div>
                                <h4 className="text-lg font-bold text-white capitalize mb-1">{key} Presence</h4>
                                <p className="text-white/60 text-sm">{t(`strengths.${key}`)}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CEO Message / Highlight */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-6xl mx-auto"
            >
                <div className="glass-panel p-12 md:p-16 rounded-3xl relative overflow-hidden group">
                     {/* Interactive Shine Effect */}
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16">
                        <div className="shrink-0 relative">
                           <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-linear-to-br from-[#FF6B35] to-purple-600 p-[2px]">
                               <div className="w-full h-full rounded-full bg-[#070612] flex items-center justify-center overflow-hidden">
                                   <FaUserTie className="text-4xl text-white/80" />
                               </div>
                           </div>
                           <div className="absolute -bottom-2 -right-2 bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
                               CEO
                           </div>
                        </div>
                        <div className="text-center md:text-left">
                            <blockquote className="text-2xl md:text-3xl font-serif text-white/90 italic mb-6 leading-relaxed">
                                {t('ceoQuote')}
                            </blockquote>
                            <cite className="not-italic text-[#FF6B35] font-bold tracking-wide uppercase text-sm">
                                {t('ceoRole')}
                            </cite>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
  );
}
