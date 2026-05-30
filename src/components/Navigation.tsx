'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useLanguage, type Locale } from '@/contexts/LanguageContext';

const navItems = [
  { key: 'company', href: '/company' },
  { key: 'services', href: '/services' },
  { key: 'network', href: '/network' },
];

const localeLabels: Record<Locale, string> = {
  en: 'EN',
  ko: '한국어',
};

function LocaleToggle({ isHeroNav }: { isHeroNav: boolean }) {
  const { locale, setLocale } = useLanguage();
  const base = isHeroNav
    ? 'text-canvas-white/70 hover:text-canvas-white'
    : 'text-muted hover:text-ink';
  const active = isHeroNav ? 'text-canvas-white' : 'text-ink';

  return (
    <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest" role="group" aria-label="Language">
      {(['en', 'ko'] as Locale[]).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={`px-2 py-1 rounded transition-colors ${locale === code ? active : base}`}
          aria-pressed={locale === code}
        >
          {localeLabels[code]}
        </button>
      ))}
    </div>
  );
}

export default function Navigation() {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isHeroNav = isHome && !isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navSurface = isHeroNav
    ? 'h-20 bg-transparent border-transparent'
    : isScrolled
      ? 'h-16 bg-canvas/90 backdrop-blur-xl border-b border-hairline shadow-sm'
      : 'h-20 bg-canvas border-b border-transparent';

  const linkClass = isHeroNav
    ? 'text-[17px] font-bold text-canvas-white/85 hover:text-canvas-white transition-colors'
    : 'text-[17px] font-bold text-muted hover:text-ink transition-colors';

  const logoClass = isHeroNav ? 'object-contain object-left brightness-0 invert' : 'object-contain object-left dark:invert';

  return (
    <>
      <nav
        aria-label="Primary"
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center transition-all duration-500 ${navSurface}`}
      >
        <div className="container-wide flex items-center justify-between h-full w-full">
          <Link href="/" className="flex items-center gap-2 z-20">
            <div className="relative h-8 w-40 transition-all">
              <Image
                src="/images/logo/logo-black.svg"
                alt="GOODMAN GLS"
                fill
                className={logoClass}
                priority
              />
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <Link key={item.key} href={item.href} className={linkClass}>
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Link
                href="#contact"
                className={
                  isHeroNav
                    ? 'btn-pill-ghost !py-3 !px-5'
                    : 'btn-pill-sm bg-canvas text-ink border border-hairline hover:bg-surface-soft'
                }
              >
                {t('nav.contactSales')}
              </Link>
              <Link href="#contact" className="btn-pill-primary">
                {t('nav.getStarted')}
              </Link>
            </div>
            <LocaleToggle isHeroNav={isHeroNav} />
            <ThemeToggle />
          </div>

          <div className="lg:hidden flex items-center gap-4">
            <LocaleToggle isHeroNav={isHeroNav} />
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 ${isHeroNav ? 'text-canvas-white' : 'text-ink'}`}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-current transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
                />
                <span
                  className={`w-full h-0.5 bg-current transition-all ${isMenuOpen ? 'opacity-0' : ''}`}
                />
                <span
                  className={`w-full h-0.5 bg-current transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-canvas lg:hidden pt-24 px-6"
          >
            <div className="flex flex-col gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="headline text-ink"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(`nav.${item.key}`)}
                </Link>
              ))}
              <hr className="border-hairline" />
              <Link
                href="#contact"
                className="btn-pill-primary w-full py-4 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.getStarted')}
              </Link>
              <Link
                href="#contact"
                className="btn-pill-secondary w-full py-4 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.contactSales')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
