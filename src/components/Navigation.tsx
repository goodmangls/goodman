'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const t = useTranslations('nav');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t('company'), href: '#company' },
    { label: t('services'), href: '#services' },
    { label: t('networkSolutions'), href: '#network' },
    { label: t('partnerHub'), href: '#partner-hub' },
    { label: t('contact'), href: '#contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
      >
        <div 
          className={`
            relative flex items-center justify-between 
            w-full max-w-6xl px-6 py-3 
            rounded-full transition-all duration-300
            ${isScrolled 
              ? 'bg-white/1 backdrop-blur-xl border border-white/10 shadow-sm' 
              : 'bg-transparent border border-transparent'
            }
          `}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group z-20">
            <div className="relative h-8 w-40">
              <Image 
                src="/images/logo/logo-white.svg" 
                alt="GOODMAN GLS" 
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <div className={`
              flex items-center gap-2 px-2 py-1.5 rounded-full 
              ${!isScrolled && 'bg-black/20 backdrop-blur-md border border-white/5'}
            `}>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="relative px-5 py-2.5 text-sm font-medium text-white/80 transition-all duration-300 rounded-full hover:text-[#FF6B35] hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,107,53,0.3)] hover:border hover:border-white/10 border border-transparent"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3 z-20">
            <LanguageToggle />
            <Link 
              href="/partner-hub#login" 
              className="px-5 py-2.5 bg-[#FF6B35] text-white text-sm font-semibold rounded-full hover:bg-[#E05A2B] hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors z-20"
          >
            <motion.div
              animate={isMenuOpen ? "open" : "closed"}
              className="w-6 h-6 flex flex-col justify-center items-center gap-1.5"
            >
              <motion.span 
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: 45, y: 6 }
                }}
                className="w-full h-0.5 bg-current block origin-center"
              />
              <motion.span 
                variants={{
                  closed: { opacity: 1 },
                  open: { opacity: 0 }
                }}
                className="w-full h-0.5 bg-current block"
              />
              <motion.span 
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: -45, y: -8 } // approx adjustments for 6px gap
                }}
                className="w-full h-0.5 bg-current block origin-center"
              />
            </motion.div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-24 z-40 lg:hidden"
          >
            <div className="bg-[#1A1A2E]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 overflow-hidden">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block px-4 py-3 text-lg font-medium text-white/90 hover:text-[#FF6B35] hover:bg-white/10 rounded-xl transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                
                <div className="h-px bg-white/10 my-2" />
                
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm text-white/60">Language</span>
                  <LanguageToggle />
                </div>
                
                <Link 
                  href="/partner-hub#login" 
                  className="flex items-center justify-center gap-2 px-4 py-3 mt-2 bg-[#FF6B35] text-white font-semibold rounded-xl hover:bg-[#E05A2B] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Partner Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
