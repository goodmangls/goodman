'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { label: 'Company', href: '/company' },
  { label: 'Services', href: '/services' },
  { label: 'Network', href: '/network' },
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center transition-all duration-500 ${
          isScrolled 
            ? 'h-16 bg-canvas/80 backdrop-blur-xl border-b border-hairline shadow-sm' 
            : 'h-20 bg-canvas'
        }`}
      >
        <div className="container-wide flex items-center justify-between h-full w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 z-20">
            <div className="relative h-8 w-40 transition-all">
              <Image 
                src="/images/logo/logo-black.svg" 
                alt="GOODMAN GLS" 
                fill 
                className="object-contain object-left dark:invert" 
                priority 
              />
            </div>
          </Link>

          {/* Nav Items */}
          <div className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <Link 
                key={item.label} 
                href={item.href} 
                className="text-[15px] font-bold text-ink/80 hover:text-ink transition-colors tracking-tight"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTAs & Toggle */}
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-4">
              <Link 
                href="#contact" 
                className="btn-pill-secondary !text-[14px] !px-4 !py-2"
              >
                Contact sales
              </Link>
              <Link 
                href="#contact" 
                className="btn-pill-primary !text-[14px] !px-5 !py-2.5"
              >
                Get started
              </Link>
            </div>
            <ThemeToggle />
          </div>

          {/* Mobile Toggle Group */}
          <div className="lg:hidden flex items-center gap-4">
            <ThemeToggle />
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 text-ink"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-current transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-full h-0.5 bg-current transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-full h-0.5 bg-current transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }} 
            className="fixed inset-0 z-40 bg-canvas lg:hidden pt-20 px-6"
          >
            <div className="flex flex-col gap-6">
              {navItems.map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href} 
                  className="text-2xl font-bold text-ink"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <hr className="border-hairline" />
              <Link href="#contact" className="btn-pill-primary w-full py-4 text-center">Get started</Link>
              <Link href="#contact" className="btn-pill-secondary w-full py-4 text-center">Contact sales</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
