'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NetworkPage() {
  const airlines = [
    { name: "Korean Air Cargo", routes: "Seoul-LAX, Seoul-JFK, Seoul-FRA" },
    { name: "Asiana Cargo", routes: "Seoul-SFO, Seoul-ORD, Seoul-CDG" },
    { name: "Air China Cargo", routes: "Seoul-PEK, PEK-LAX, PEK-FRA" },
    { name: "Singapore Airlines Cargo", routes: "Seoul-SIN, SIN-AMS, SIN-NYC" },
  ];

  const networks = [
    {
      id: "mpl",
      name: "MPL",
      fullName: "MarcoPoloLine Group",
      color: "bg-color-block-lilac",
      desc: "Premium logistics network focused on quality service and innovation across Asia-Pacific.",
      features: ['Exclusive territory protection', 'Quality certification standards', 'Advanced IT integration']
    },
    {
      id: "ean",
      name: "EAN",
      fullName: "Exclusive Air Network",
      color: "bg-color-block-mint",
      desc: "Elite network of air cargo logistics providers committed to service excellence and innovation.",
      features: ['Best-in-class service standards', 'Collaborative partnerships', 'Continuous improvement focus']
    }
  ];

  return (
    <main className="bg-canvas min-h-screen">
      {/* Header */}
      <section className="hero-spacing bg-canvas border-b border-hairline">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl"
          >
            <span className="figma-mono text-xs tracking-[0.3em] text-ink/40 block mb-6 uppercase">Global Footprint</span>
            <h1 className="display-xl text-ink mb-10 leading-[0.85] tracking-tighter">
              World Reach.<br />Local Depth.
            </h1>
            <p className="body-lg text-ink/70 max-w-2xl">
              Connected to over 59 countries through elite logistics networks and strategic GSSA partnerships. We provide the infrastructure for global commerce.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Network Cards */}
      <section className="section-spacing bg-canvas">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {networks.map((net) => (
              <motion.div 
                key={net.id}
                whileHover={{ y: -4 }}
                className={`${net.color} color-block border border-ink/10 flex flex-col justify-between min-h-[400px] md:min-h-[500px] shadow-sm`}
              >
                <div>
                  <div className="flex justify-between items-start mb-16">
                    <span className="figma-mono text-4xl font-black text-ink">{net.name}</span>
                    <div className="px-4 py-1 rounded-full border border-ink/20 figma-mono text-[10px] uppercase font-bold text-ink/60">Registered Member</div>
                  </div>
                  <h3 className="display-md text-ink mb-8 leading-tight">{net.fullName}</h3>
                  <p className="body-lg text-ink/70 mb-12 max-w-sm">{net.desc}</p>
                </div>
                
                <div className="pt-10 border-t border-ink/10 space-y-4">
                  {net.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-4 text-ink/80">
                      <div className="w-1 h-1 rounded-full bg-ink/30" />
                      <span className="body-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GSA Section - Bold Cream Block */}
      <section className="section-spacing bg-color-block-cream border-y border-hairline">
        <div className="container-wide">
          <div className="max-w-4xl mb-24">
            <span className="figma-mono text-sm tracking-widest text-ink/40 block mb-6 uppercase font-bold">The GSSA Advantage</span>
            <h2 className="display-lg text-ink mb-10 leading-none">Your Gateway to the Korean Market</h2>
            <p className="body-lg text-ink/70 max-w-2xl leading-relaxed">
              We represent airlines with an owner-operator mindset. From capacity guarantees to local route development, we ensure your airline&apos;s success in the Northeast Asian corridor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <div className="p-12 bg-canvas rounded-3xl border border-ink/10 shadow-sm">
              <h4 className="headline text-ink mb-6">GSA (General Sales Agent)</h4>
              <p className="body-lg text-ink/60 leading-relaxed">
                Exclusive representation of airlines in specific markets, handling all passenger and cargo sales activities with 100% focus and local expertise.
              </p>
            </div>
            <div className="p-12 bg-canvas rounded-3xl border border-ink/10 shadow-sm">
              <h4 className="headline text-ink mb-6">CSA (Cargo Sales Agent)</h4>
              <p className="body-lg text-ink/60 leading-relaxed">
                Specialized cargo sales representation, providing capacity guarantees and preferential rates for logistics partners across our global network.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {airlines.map((airline, index) => (
              <div key={index} className="p-8 bg-canvas border border-ink/5 rounded-2xl hover:border-ink/30 transition-all group">
                <span className="figma-mono text-[10px] tracking-widest text-ink/30 block mb-4 uppercase font-bold group-hover:text-ink/60">Partner Carrier</span>
                <h4 className="headline-sm text-ink mb-3">{airline.name}</h4>
                <p className="text-xs text-ink/40 line-clamp-2 leading-loose figma-mono">{airline.routes}</p>
              </div>
            ))}
          </div>

          <div className="mt-32 text-center">
            <Link href="/#contact" className="btn-pill-primary text-lg py-5 px-12 group inline-flex items-center gap-3">
              <span>Explore Partnership Opportunities</span>
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
            </Link>
          </div>
        </div>
      </section>

      {/* Immersive Coverage Section - Lime Block */}
      <section className="section-spacing bg-canvas">
        <div className="container-wide text-center">
          <h2 className="display-lg text-ink mb-20 tracking-tighter">Global Ecosystem</h2>
          <div className="max-w-6xl mx-auto">
            <div className="aspect-auto md:aspect-[21/9] bg-color-block-lime color-block border border-ink/10 flex items-center justify-center relative shadow-sm group">
               {/* Background patterns */}
               <div className="absolute inset-0 opacity-10 pointer-events-none group-hover:opacity-15 transition-opacity" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
               
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 className="relative z-10 p-12"
               >
                <span className="figma-mono text-sm tracking-[0.4em] text-ink/40 block mb-8 uppercase font-black">Strategic ECS Partnership</span>
                <p className="display-xl text-ink leading-none mb-4">59</p>
                <p className="display-sm text-ink tracking-tight font-black">NATIONS CONNECTED</p>
                <p className="body-lg text-ink/60 mt-10 max-w-xl mx-auto leading-relaxed">Through our strategic partnership with ECS Group, we provide our partners with access to the world&apos;s largest GSSA infrastructure.</p>
               </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
