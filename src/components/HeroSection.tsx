'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { FaArrowRight, FaStar } from 'react-icons/fa6';
import Hls from 'hls.js';
import { cn } from '@/lib/utils';
import QuoteForm from '@/components/quotes/QuoteForm';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const SplitText = ({ text, className, delay = 0 }: SplitTextProps) => {
  const words = text.split(' ');
  return (
    <span className={cn('inline-block', className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.08,
            ease: [0.215, 0.61, 0.355, 1],
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

interface BlurInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

const BlurIn = ({ children, className, delay = 0, duration = 0.6 }: BlurInProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function HeroSection() {
  const t = useTranslations('hero');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showRateInquiry, setShowRateInquiry] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const src = 'https://customer-cbeadsgr09pnsezs.cloudflarestream.com/df176a2fb2ea2b64bd21ae1c10d3af6a/manifest/video.m3u8';

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        video.muted = true;
        video.play().catch(e => console.log('Auto-play failed', e));
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.muted = true;
        video.play().catch(e => console.log('Auto-play failed', e));
      });
    }
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#070612]">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 select-none">
        <video
          ref={videoRef}
          playsInline
          muted
          loop
          className="absolute inset-0 h-full w-full object-cover origin-left scale-125 ml-[200px]"
          poster="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop"
        />
        {/* Bottom Fade Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#070612] to-transparent z-10 pointer-events-none" />
        
        {/* Global overlay for darkness if needed, but not requested. Leaving out as per spec "Video shifted... Bottom fade gradient...". */}
      </div>

      {/* Content */}
      <div className="container relative z-20 h-full flex items-center">
        <div className="w-full max-w-5xl mx-auto flex flex-col justify-center items-start">
          
          {/* Badge */}
          <BlurIn delay={0} duration={0.6}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-6">
              <FaStar className="w-3 h-3 text-[#FF6B35]" />
              <span className="text-sm font-medium text-white/80">
                {t('badge')}
              </span>
            </div>
          </BlurIn>

          {/* Main Heading */}
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-tight lg:leading-[1.2]">
              <div className="block">
                <SplitText text={t('headlineLine1')} />
              </div>
              <div className="flex flex-wrap items-baseline gap-x-[0.25em]">
                <SplitText text={t('headlineLine2')} delay={0.4} />
                <motion.span 
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
                  className="font-serif italic text-white"
                >
                  {t('headlineLine3')}
                </motion.span>
              </div>
            </h1>
          </div>

          {/* Subtitle */}
          <BlurIn delay={0.4} duration={0.6} className="mb-12">
            <div className="max-w-xl text-lg font-normal text-white/80 leading-relaxed">
              <p className="mb-4">{t('subheadline')}</p>
              <p>{t('description')}</p>
            </div>
          </BlurIn>

          {/* CTA Buttons */}
          <BlurIn delay={0.6} duration={0.6}>
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                href="/book-call" 
                className="group relative inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-[#070612] font-medium transition-transform hover:scale-105"
              >
                {t('ctaPrimary')}
                <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link 
                href="/network-solutions" 
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium hover:bg-white/30 transition-colors"
              >
                {t('ctaSecondary')}
              </Link>
            </div>
          </BlurIn>

          {/* Quick Tools (Rate & Track) */}
          <BlurIn delay={0.8} duration={0.6} className="mt-8 pt-8 border-t border-white/10 w-full max-w-lg">
            <div className="flex items-center gap-8 text-white/80">
                <button
                    onClick={() => setShowRateInquiry(true)}
                    className="flex items-center gap-3 hover:text-[#FF6B35] transition-colors group"
                >
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#FF6B35]/50 group-hover:bg-[#FF6B35]/10 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium">Rate Inquiry</span>
                </button>

                <Link 
                    href="#track-trace" 
                    className="flex items-center gap-3 hover:text-[#FF6B35] transition-colors group"
                >
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#FF6B35]/50 group-hover:bg-[#FF6B35]/10 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium">Track & Trace</span>
                </Link>
            </div>
          </BlurIn>

        </div>
      </div>

      {/* Rate Inquiry Modal */}
      {showRateInquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowRateInquiry(false)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl max-w-2xl w-full p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]" 
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowRateInquiry(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-3xl font-bold mb-2 text-[#070612]">Request a Rate Quote</h3>
            <p className="text-gray-600 mb-8">Get competitive rates for your shipment within 24 hours</p>

            <QuoteForm
              mode="public"
              onSuccess={() => {
                setTimeout(() => setShowRateInquiry(false), 3000);
              }}
              onCancel={() => setShowRateInquiry(false)}
            />
          </motion.div>
        </div>
      )}
    </section>
  );
}
