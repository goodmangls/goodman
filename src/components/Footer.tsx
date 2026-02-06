import Link from 'next/link';
import Image from 'next/image';

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
              Connecting global trade with velocity, trust, and expertise since 2004. 
              We deliver mission-critical logistics solutions across air, ocean, and project cargo.
            </p>
            
            {/* Social/Contact Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href="mailto:contact@goodmangls.com" 
                className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full transition-all duration-200 text-sm font-semibold text-center border border-white/10 text-white"
              >
                Email Us
              </a>
              <Link
                href="/#contact"
                className="px-6 py-3 bg-[#FF6B35] hover:bg-[#E05A2B] rounded-full transition-all duration-200 text-sm font-semibold text-center text-white"
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
                <Link href="/services" className="hover:text-[#FF6B35] transition-colors inline-flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Services
                </Link>
              </li>
              <li>
                <Link href="/network-solutions" className="hover:text-[#FF6B35] transition-colors inline-flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Network & Solutions
                </Link>
              </li>
              <li>
                <Link href="/partner-hub" className="hover:text-[#FF6B35] transition-colors inline-flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Partner Hub
                </Link>
              </li>
              <li>
                <Link href="/company" className="hover:text-[#FF6B35] transition-colors inline-flex items-center gap-2 group">
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
                <svg className="w-5 h-5 text-[#FF6B35] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Seoul, Republic of Korea</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#FF6B35] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:contact@goodmangls.com" className="hover:text-[#FF6B35] transition-colors break-all">
                  contact@goodmangls.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#FF6B35] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Memberships */}
        <div className="border-t border-white/10 pt-10 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm">
            <span className="font-semibold text-white/40">Proud Member of:</span>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {['MPL', 'EAN', 'IATA Certified'].map((item) => (
                <span key={item} className="px-5 py-2.5 bg-white/5 backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-all rounded-full font-semibold text-xs md:text-sm text-white/70">
                  {item}
                </span>
              ))}
            </div>
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
