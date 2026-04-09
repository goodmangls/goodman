'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

function EanBadge() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const badgeDiv = document.createElement('div');
    badgeDiv.id = 'ean-badge-10032';
    el.appendChild(badgeDiv);

    const script = document.createElement('script');
    script.src = 'https://www.ean-network.com/api/widget/10032/embed.js';
    script.async = true;
    el.appendChild(script);

    return () => { el.innerHTML = ''; };
  }, []);

  return <div ref={containerRef} className="inline-flex items-center" />;
}


export default function Footer() {
  return (
    <footer className="bg-[#070612] text-white border-t border-white/5 relative z-10">
      <div className="container py-12 md:py-16 lg:py-20 px-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="relative h-10 w-48 mb-6">
                <Image 
                  src="/images/logo/logo-white.svg" 
                  alt="GOODMAN GLS" 
                  fill
                  className="object-contain object-left"
                />
              </div>
              <p className="text-lg md:text-xl text-[#FF6B35] font-semibold mb-6">
                Your Strategic Partner in Korea & Beyond
              </p>
            </div>
            <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-md">
              Connecting global trade with velocity, trust, and expertise since 2014.
              Korea's dedicated cargo GSSA, backed by ECS Group's global network.
            </p>
            
            {/* Social/Contact Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href="mailto:contact@goodmangls.com" 
                className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full transition-all duration-200 text-sm font-semibold text-center border border-white/10 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/50"
              >
                Email Us
              </a>
              <Link
                href="/#contact"
                className="px-6 py-3 bg-[#FF6B35] hover:bg-[#E05A2B] rounded-full transition-all duration-200 text-sm font-semibold text-center text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/50"
              >
                Get Quote
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base md:text-lg font-bold mb-6 text-white font-serif">Quick Links</h4>
            <ul className="space-y-4 text-sm md:text-base text-white/60">
              <li>
                <Link href="/services" className="hover:text-[#FF6B35] transition-colors inline-flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/50 rounded-lg">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Services
                </Link>
              </li>
              <li>
                <Link href="/network-solutions" className="hover:text-[#FF6B35] transition-colors inline-flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/50 rounded-lg">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Network & Solutions
                </Link>
              </li>
              <li>
                <Link href="/partner-hub" className="hover:text-[#FF6B35] transition-colors inline-flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/50 rounded-lg">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Partner Hub
                </Link>
              </li>
              <li>
                <Link href="/company" className="hover:text-[#FF6B35] transition-colors inline-flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/50 rounded-lg">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base md:text-lg font-bold mb-6 text-white font-serif">Contact</h4>
            <ul className="space-y-4 text-sm md:text-base text-white/60">
              <li className="flex items-start gap-3">
                <svg aria-hidden="true" className="w-5 h-5 text-[#FF6B35] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Seoul, Republic of Korea</span>
              </li>
              <li className="flex items-start gap-3">
                <svg aria-hidden="true" className="w-5 h-5 text-[#FF6B35] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:contact@goodmangls.com" aria-label="Email us at contact@goodmangls.com" className="hover:text-[#FF6B35] transition-colors break-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/50 rounded-lg">
                  contact@goodmangls.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <svg aria-hidden="true" className="w-5 h-5 text-[#FF6B35] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="text-white font-semibold text-sm md:text-base">Mon-Fri 9:00-18:00 KST</div>
                  <div className="text-xs md:text-sm mt-1 text-[#FF6B35]">Emergency: 24/7</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Memberships & Certifications */}
        <div className="border-t border-white/10 pt-10 mb-10">
          <span className="block text-center font-semibold text-white/40 uppercase tracking-wider text-xs mb-6">Memberships & Certifications</span>

          {/* EAN + MPL — side by side, matching card style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-4">
            {/* EAN Badge (widget) */}
            <div className="rounded-2xl bg-[#1a2332] border border-[#2a3a4e] p-4 flex items-center min-h-[140px]">
              <EanBadge />
            </div>

            {/* MPL Badge — mirroring EAN widget layout */}
            <a
              href="https://www.marcopololine.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl bg-[#1a2332] border border-[#2a3a4e] hover:border-[#3a5a7e] p-4 flex items-stretch min-h-[140px] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/50"
            >
              <div className="flex items-center justify-between w-full gap-4">
                {/* Left: Company info */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                    <span className="text-[#0A2463] font-extrabold text-sm leading-none">MPL</span>
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">GOODMAN GLS</div>
                    <div className="text-white/50 text-xs">Seoul, SOUTH KOREA</div>
                    <div className="text-white/40 text-xs">Member since 2014</div>
                  </div>
                </div>
                {/* Right: MPL Logo */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0A2463] to-[#1a4a8a] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-extrabold text-base">MPL</span>
                </div>
              </div>
              {/* Bottom bar — matching EAN verified badge style */}
              <div className="absolute bottom-0 left-0 right-0" style={{ display: 'contents' }}>
              </div>
            </a>
          </div>

          {/* MPL bottom bar + services (outside the <a> to avoid nesting issues) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div />
            <div className="flex items-center justify-between px-4 -mt-3">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0A2463]/30 border border-[#4A90D9]/30 text-[10px] font-semibold text-[#4A90D9]">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  VERIFIED MEMBER
                </span>
              </div>
              <a href="https://www.marcopololine.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-white/30 hover:text-white/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/50 rounded">
                marcopololine.com →
              </a>
            </div>
          </div>

          {/* IATA — compact text badge below */}
          <div className="flex justify-center mt-4">
            <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full font-semibold text-xs text-white/50">
              IATA Certified Agent
            </span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs md:text-sm text-white/30 border-t border-white/10 pt-8">
          <p>&copy; 2025 GOODMAN Global Logistics Service. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
