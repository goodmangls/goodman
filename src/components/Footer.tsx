'use client';

import Link from 'next/link';
import Image from 'next/image';

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
    <footer className="bg-canvas text-ink border-t border-hairline pt-48 pb-20">
      <div className="container-wide">
        {/* Top Section with Large Branding */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32 mb-40">
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="relative h-10 w-48 mb-16">
                <Image 
                  src="/images/logo/logo-black.svg" 
                  alt="GOODMAN GLS" 
                  fill
                  className="object-contain object-left dark:invert"
                />
              </div>
              <h2 className="display-lg mb-12 tracking-[calc(var(--letter-spacing-display-lg)*1.5)] leading-[0.9] max-w-lg">
                The Small Giant.<br />
                Global Impact.
              </h2>
              <p className="body-lg text-ink/50 mb-16 max-w-md leading-relaxed">
                Elevating logistics representation since 2014. We provide the infrastructure for your global ambitions with localized Korean expertise.
              </p>
            </div>
            
            <div className="flex items-center gap-6 mt-12">
               <Link href="/#contact" className="btn-pill-primary !px-8 !py-3">
                 Start a Partnership
               </Link>
               <button 
                 onClick={scrollToTop}
                 className="w-12 h-12 rounded-full border border-hairline flex items-center justify-center hover:bg-surface-soft transition-colors text-ink/40 hover:text-ink"
               >
                 ↑
               </button>
            </div>
          </div>

          {/* Directory Links */}
          <div className="lg:col-span-3 lg:pt-4">
            <span className="caption block mb-8 text-ink/40">Internal Directory</span>
            <ul className="space-y-4">
              {footerLinks.company.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="body-sm font-bold text-ink hover:text-ink/60 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Expertise Links */}
          <div className="lg:col-span-3 lg:pt-4">
            <span className="caption block mb-8 text-ink/40">Expertise & Solutions</span>
            <ul className="space-y-4">
              {footerLinks.services.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="body-sm font-bold text-ink hover:text-ink/60 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section - Legal & Badges */}
        <div className="pt-20 border-t border-hairline-soft flex flex-col md:flex-row justify-between items-start md:items-end gap-16">
          <div className="space-y-10">
             <div className="flex flex-wrap gap-x-12 gap-y-6">
                {footerLinks.legal.map(link => (
                  <Link key={link.label} href={link.href} className="body-sm text-ink/40 hover:text-ink font-semibold transition-colors">
                    {link.label}
                  </Link>
                ))}
             </div>
             <div className="space-y-2">
                <p className="body-sm text-ink/30 font-medium tracking-tight">© 2026 GOODMAN Global Logistics Service. All rights reserved.</p>
                <p className="figma-mono text-[9px] text-ink/20 uppercase tracking-[0.2em]">Designed for high-impact logistics representation.</p>
             </div>
          </div>
          
          <div className="flex items-center gap-12 grayscale opacity-15 hover:opacity-40 transition-all duration-700">
             <div className="flex flex-col items-center gap-3">
                <span className="figma-mono text-[11px] font-black tracking-[0.3em]">IATA</span>
                <div className="w-8 h-px bg-ink/20" />
             </div>
             <div className="flex flex-col items-center gap-3">
                <span className="figma-mono text-[11px] font-black tracking-[0.3em]">MPL</span>
                <div className="w-8 h-px bg-ink/20" />
             </div>
             <div className="flex flex-col items-center gap-3">
                <span className="figma-mono text-[11px] font-black tracking-[0.3em]">EAN</span>
                <div className="w-8 h-px bg-ink/20" />
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
