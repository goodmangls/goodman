'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import DisplayLines from '@/components/DisplayLines';

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
      desc: "Premium logistics network focused on quality service and innovation across Asia-Pacific.",
      features: ['Exclusive territory protection', 'Quality certification standards', 'Advanced IT integration']
    },
    {
      id: "ean",
      name: "EAN",
      fullName: "Exclusive Air Network",
      desc: "Elite network of air cargo logistics providers committed to service excellence and innovation.",
      features: ['Best-in-class service standards', 'Collaborative partnerships', 'Continuous improvement focus']
    }
  ];

  return (
    <main className="bg-canvas min-h-screen">
      {/* Header */}
      <section className="page-hero">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl"
          >
            <span className="eyebrow mb-6">Global footprint</span>
            <DisplayLines
              as="h1"
              lines={['World Reach.', 'Local Depth.']}
              className="display-xl text-ink mb-10 leading-[0.85] tracking-tighter"
            />
            <p className="body-lg text-muted max-w-2xl">
              Connected to over 59 countries through elite logistics networks and strategic GSSA partnerships. We provide the infrastructure for global commerce.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Network Cards */}
      <section className="section-spacing bg-canvas">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {networks.map((net) => {
              const dark = net.id === "ean";
              const main = dark ? "text-canvas-white" : "text-ink";
              const sub = dark ? "text-canvas-white/75" : "text-muted";
              return (
              <motion.div 
                key={net.id}
                whileHover={{ y: -4 }}
                className={`panel-bordered p-10 md:p-14 flex flex-col justify-between min-h-[400px] ${dark ? "section-surface-obsidian" : "bg-canvas"}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-12">
                    <span className={`display-md font-bold ${main}`}>{net.name}</span>
                    <span className="eyebrow">Member</span>
                  </div>
                  <h3 className={`headline mb-6 ${main}`}>{net.fullName}</h3>
                  <p className={`body-lg mb-10 max-w-sm ${sub}`}>{net.desc}</p>
                </div>
                
                <ul className="feature-stack">
                  {net.features.map((feature) => (
                    <li key={feature} className="feature-stack-item">
                      <span className={`body-default font-bold ${main}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );})}
          </div>
        </div>
      </section>

      {/* GSA Section - Bold Cream Block */}
      <section className="section-spacing bg-canvas">
        <div className="container-wide">
          <div className="max-w-4xl mb-24">
            <span className="eyebrow mb-6">The GSSA advantage</span>
            <h2 className="display-lg text-ink mb-10 leading-none">Your Gateway to the Korean Market</h2>
            <p className="body-lg text-muted max-w-2xl leading-relaxed">
              We represent airlines with an owner-operator mindset. From capacity guarantees to local route development, we ensure your airline&apos;s success in the Northeast Asian corridor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <div className="p-12 bg-canvas rounded-3xl border border-hairline">
              <h4 className="headline text-ink mb-6">GSA (General Sales Agent)</h4>
              <p className="body-lg text-muted leading-relaxed">
                Exclusive representation of airlines in specific markets, handling all passenger and cargo sales activities with 100% focus and local expertise.
              </p>
            </div>
            <div className="p-12 bg-canvas rounded-3xl border border-hairline">
              <h4 className="headline text-ink mb-6">CSA (Cargo Sales Agent)</h4>
              <p className="body-lg text-muted leading-relaxed">
                Specialized cargo sales representation, providing capacity guarantees and preferential rates for logistics partners across our global network.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {airlines.map((airline, index) => (
              <div key={index} className="p-8 bg-canvas border border-hairline rounded-2xl hover:border-desert-sienna/60 transition-all group">
                <span className="eyebrow block mb-4">Partner carrier</span>
                <h4 className="headline-sm text-ink mb-3">{airline.name}</h4>
                <p className="caption text-muted line-clamp-2 leading-relaxed">{airline.routes}</p>
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

      {/* Global ecosystem */}
      <section className="section-spacing bg-canvas">
        <div className="container-wide text-center">
          <h2 className="display-lg text-ink mb-20 tracking-tighter">Global Ecosystem</h2>
          <div className="max-w-6xl mx-auto">
            <div className="aspect-auto md:aspect-[21/9] section-surface-obsidian rounded-[var(--radius-feature)] p-12 md:p-16 flex items-center justify-center relative">
               {/* Background patterns */}
               <div className="absolute inset-0 opacity-10 pointer-events-none group-hover:opacity-15 transition-opacity" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
               
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 className="relative z-10 p-12"
               >
                <span className="eyebrow mb-6">Strategic ECS partnership</span>
                <p className="display-xl text-canvas-white leading-none mb-4">59</p>
                <p className="display-sm text-canvas-white tracking-tight font-bold">nations connected</p>
                <p className="body-lg text-canvas-white/75 mt-8 max-w-xl mx-auto leading-relaxed">Through our strategic partnership with ECS Group, we provide our partners with access to the world&apos;s largest GSSA infrastructure.</p>
               </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
