'use client';

import Link from 'next/link';
import Image from 'next/image';
import DisplayLines from './DisplayLines';

const footerLinks = {
  company: [
    { label: 'About Us', href: '/company' },
    { label: 'Network', href: '/network' },
    { label: 'Partner Hub', href: '/#partner-hub' },
  ],
  services: [
    { label: 'Air Cargo', href: '/services#air' },
    { label: 'Ocean Freight', href: '/services#ocean' },
    { label: 'Project Cargo', href: '/services#project' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ]
};

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="section-surface-obsidian pt-32 pb-20 md:pt-40">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32 mb-24">
          <div className="lg:col-span-6 flex flex-col justify-between">
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
                lines={['The Small Giant.', 'Global Impact.']}
                className="display-lg text-canvas-white mb-12 max-w-lg"
              />
              <p className="body-lg text-canvas-white/70 mb-16 max-w-md">
                Elevating logistics representation since 2014. We provide the infrastructure
                for your global ambitions with localized Korean expertise.
              </p>
            </div>

            <div className="flex items-center gap-6 mt-12">
              <Link href="/#contact" className="btn-pill-primary">
                Start a Partnership
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

          <div className="lg:col-span-3 lg:pt-4">
            <span className="caption block mb-8 text-canvas-white/50">Company</span>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="body-sm font-bold text-canvas-white hover:text-canvas-white/70 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 lg:pt-4">
            <span className="caption block mb-8 text-canvas-white/50">Services</span>
            <ul className="space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="body-sm font-bold text-canvas-white hover:text-canvas-white/70 transition-colors"
                  >
                    {link.label}
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
                  key={link.label}
                  href={link.href}
                  className="body-sm text-canvas-white/50 hover:text-canvas-white font-semibold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="space-y-2">
              <p className="body-sm text-canvas-white/40">
                © 2026 GOODMAN Global Logistics Service. All rights reserved.
              </p>
              <p className="caption text-canvas-white/30">
                Korea cargo GSSA · ECS Group partner
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
