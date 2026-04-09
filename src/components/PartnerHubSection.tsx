'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const features = [
  'Agent Zone - Partner Registration & Tariff Access',
  'Market Insights - Korea Trade Intelligence Reports',
  'Dedicated Account Management',
];

export default function PartnerHubSection() {
  return (
    <section id="partner-hub" className="min-h-screen flex items-center section-md bg-[#070612] relative overflow-hidden py-32">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF6B35]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="glass-panel p-12 md:p-20 rounded-[3rem] relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center relative z-10">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <div className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-[#FF6B35] tracking-widest uppercase font-bold mb-6">
                  Partners Only
                </div>
                <h2 className="display-serif text-white text-4xl md:text-5xl lg:text-6xl mb-6 md:mb-8 leading-tight">
                  Partner Hub
                </h2>
                <p className="text-xl md:text-2xl text-white/50 mb-8 md:mb-12 font-light leading-relaxed">
                  Exclusive Resources for Our Global Network
                </p>
                <ul className="space-y-6 mb-12">
                  {features.map((feature, index) => (
                    <motion.li key={index} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + index * 0.1 }} className="flex items-center gap-5">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-[#FF6B35]/10 flex items-center justify-center border border-[#FF6B35]/20">
                        <svg className="w-4 h-4 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-white/70 text-lg font-light">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <Link href="#contact" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#FF6B35] text-white font-semibold hover:bg-[#E05A2B] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,107,53,0.3)]">
                  <span className="mr-2">Contact Us</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="hidden md:flex justify-end relative">
                <div className="relative w-full aspect-square max-w-md">
                  <div className="absolute inset-0 bg-linear-to-tr from-[#0A2463] to-[#FF6B35] opacity-10 rounded-full blur-[80px] animate-pulse-slow" />
                  <div className="relative h-full w-full rounded-[2.5rem] glass-panel border-white/10 flex items-center justify-center">
                    <div className="text-white/5 w-64 h-64">
                      <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                    </div>
                  </div>
                  <div className="absolute -top-8 -right-8 p-6 rounded-2xl bg-[#0A2463]/80 backdrop-blur-xl border border-white/10 shadow-2xl animate-bounce-gentle">
                    <div className="w-10 h-10 text-white">&#9992;&#65039;</div>
                  </div>
                  <div className="absolute -bottom-6 -left-6 p-6 rounded-2xl bg-[#FF6B35]/80 backdrop-blur-xl border border-white/10 shadow-2xl animate-bounce-gentle stagger-2">
                    <div className="w-10 h-10 text-white">&#128674;</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
