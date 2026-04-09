'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight, FaStar } from 'react-icons/fa6';
import Hls from 'hls.js';
import { cn } from '@/lib/utils';

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
  const videoRef = useRef<HTMLVideoElement>(null);

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
          className="absolute inset-0 h-full w-full object-cover object-[center_30%] scale-105"
          poster="https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?q=80&w=2940&auto=format&fit=crop"
        />
        {/* Light overlay — aircraft image stays prominent */}
        <div className="absolute inset-0 bg-[#070612]/30 z-[1] pointer-events-none" />
        {/* Bottom fade for text area */}
        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-[#070612] via-[#070612]/80 to-transparent z-[2] pointer-events-none" />
      </div>

      {/* Content */}
      <div className="container relative z-20 h-full flex items-end pb-32 md:pb-40">
        <div className="w-full max-w-3xl flex flex-col justify-end items-start">
          
          {/* Badge */}
          <BlurIn delay={0} duration={0.6}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-6">
              <FaStar className="w-3 h-3 text-[#FF6B35]" />
              <span className="text-sm font-medium text-white/80">
                Cargo GSSA Since 2014
              </span>
            </div>
          </BlurIn>

          {/* Main Heading */}
          <div className="mb-5">
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight">
              <div className="block">
                <SplitText text="We Sell Your Cargo" />
              </div>
              <div className="flex flex-wrap items-baseline gap-x-[0.25em]">
                <SplitText text="as If It Were" delay={0.4} />
                <motion.span 
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
                  className="font-serif italic text-white"
                >
                  Our Own
                </motion.span>
              </div>
            </h1>
          </div>

          {/* Subtitle */}
          <BlurIn delay={0.4} duration={0.6} className="mb-8">
            <p className="max-w-lg text-base md:text-lg text-white/70 leading-relaxed">
              5 airlines. 59 countries via ECS Group. One dedicated cargo team in Korea.
            </p>
          </BlurIn>

          {/* CTA Buttons */}
          <BlurIn delay={0.6} duration={0.6}>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#contact"
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#FF6B35] text-white font-semibold motion-safe:hover:scale-105 transition-transform focus-visible:ring-2 focus-visible:ring-[#FF6B35]/50 focus-visible:outline-none"
              >
                Request a Rate
                <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="#network"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-white/10 backdrop-blur-sm text-white font-medium hover:bg-white/20 transition-colors focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
              >
                Meet Our Airlines
              </Link>
            </div>
          </BlurIn>

        </div>
      </div>

    </section>
  );
}
