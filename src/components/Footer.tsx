'use client';

import Link from 'next/link';
import Image from 'next/image';
import DisplayLines from './DisplayLines';
import { useLanguage } from '@/contexts/LanguageContext';

const footerLinks = {
  company: [
    { key: 'about', href: '/company' },
    { key: 'network', href: '/network' },
    { key: 'partnerHub', href: '/#partner-hub' },
  ],
  services: [
    { key: 'air', href: '/services#air' },
    { key: 'ocean', href: '/services#ocean' },
    { key: 'land', href: '/services#land' },
    { key: 'customs', href: '/services#customs' },
    { key: 'warehouse', href: '/services#warehouse' },
    { key: 'project', href: '/services#project' },
  ],
  legal: [
    { key: 'privacy', href: '#' },
    { key: 'terms', href: '#' },
  ]
};

export default function Footer() {
  const { t } = useLanguage();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      aria-labelledby="footer-heading"
      className="section-surface-obsidian pt-32 pb-20 md:pt-40"
    >
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-20 lg:gap-20 mb-24">
          <div className="flex flex-col justify-between">
            <div>
              <div className="relative h-10 w-48 mb-16">
                <Image
                  src="/images/logo/logo-black.svg"
                  alt="GOODMAN GLS"
                  fill
                  className="object-contain object-left brightness-0 invert"
                />
              </div>
              <DisplayLines
                as="h2"
                id="footer-heading"
                lines={[t('home.footer.titleLine1'), t('home.footer.titleLine2')]}
                className="display-lg text-canvas-white mb-12 max-w-lg"
              />
              <p className="body-lg text-canvas-white/70 mb-16 max-w-md">
                {t('home.footer.lead')}
              </p>
            </div>

            <div className="flex items-center gap-6 mt-12">
              <Link href="/#contact" className="btn-pill-primary">
                {t('home.footer.cta')}
              </Link>
              <button
                type="button"
                onClick={scrollToTop}
                className="w-12 h-12 rounded-full border border-canvas-white/30 flex items-center justify-center hover:bg-canvas-white/10 transition-colors text-canvas-white/60 hover:text-canvas-white"
                aria-label="Scroll to top"
              >
                ↑
              </button>
            </div>
          </div>

          <div className="lg:pt-4">
            <span className="caption block mb-8 text-canvas-white/50">{t('home.footer.companyHeading')}</span>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="body-sm font-bold text-canvas-white hover:text-canvas-white/70 transition-colors"
                  >
                    {t(`home.footer.links.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:pt-4">
            <span className="caption block mb-8 text-canvas-white/50">{t('home.footer.servicesHeading')}</span>
            <ul className="space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="body-sm font-bold text-canvas-white hover:text-canvas-white/70 transition-colors"
                  >
                    {t(`home.footer.links.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-16 border-t border-canvas-white/20 flex flex-col md:flex-row justify-between items-start md:items-end gap-16">
          <div className="space-y-10">
            <div className="flex flex-wrap gap-x-12 gap-y-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="body-sm text-canvas-white/50 hover:text-canvas-white font-semibold transition-colors"
                >
                  {t(`home.footer.links.${link.key}`)}
                </Link>
              ))}
            </div>
            <div className="space-y-2">
              <p className="body-sm text-canvas-white/40">
                {t('home.footer.copyright')}
              </p>
              <p className="caption text-canvas-white/30">
                {t('home.footer.tagline')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-12 opacity-40 hover:opacity-70 transition-opacity duration-700">
            {['IATA', 'MPL', 'EAN'].map((badge) => (
              <div key={badge} className="flex flex-col items-center gap-3">
                <span className="caption text-canvas-white/80 tracking-[0.3em]">
                  {badge}
                </span>
                <div className="w-8 h-px bg-canvas-white/30" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
