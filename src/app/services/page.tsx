'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      name: "Air Freight",
      id: "air",
      icon: "✈️",
      tagline: "When Every Minute Counts",
      colorBlock: "bg-color-block-mint",
      overview: "Our air freight division specializes in time-critical and temperature-sensitive cargo. With GSA/CSA partnerships across major airlines, we offer priority booking and competitive rates.",
      features: [
        "Express & Next Flight Out service",
        "Temperature-controlled solutions",
        "Dangerous goods certified",
        "Hand-carry services",
        "Charter arrangements"
      ],
      caseStudy: {
        title: "Semiconductor Equipment",
        route: "Seoul to Austin",
        challenge: "72-hour delivery window for critical manufacturing equipment",
        solution: "Direct charter arrangement with specialized packaging",
        result: "Delivered in 48 hours, zero damage"
      }
    },
    {
      name: "Ocean Freight",
      id: "ocean",
      icon: "🚢",
      tagline: "Global Reach, Local Expertise",
      colorBlock: "bg-color-block-lilac",
      overview: "Full-service ocean freight solutions including FCL, LCL, and specialized container services. Our network reaches every major port worldwide.",
      features: [
        "FCL & LCL services",
        "Reefer containers",
        "Out-of-gauge cargo",
        "Door-to-door deliveries",
        "Customs brokerage"
      ],
      caseStudy: {
        title: "Manufacturing Equipment",
        route: "Busan to Hamburg",
        challenge: "Oversized machinery requiring specialized container",
        solution: "Flat rack container with custom securing arrangements",
        result: "Safe transit, on-time delivery, 20% cost savings"
      }
    },
    {
      name: "Project Cargo",
      id: "project",
      icon: "📦",
      tagline: "Complex Solutions Made Simple",
      colorBlock: "bg-color-block-lime",
      overview: "Specialized project logistics for oversized, heavy-lift, and high-value cargo. Full project management from planning to final installation.",
      features: [
        "Route surveys & feasibility studies",
        "Multi-modal transportation",
        "Heavy-lift capabilities",
        "On-site project management",
        "Insurance & risk management"
      ],
      caseStudy: {
        title: "Power Plant Turbine",
        route: "Korea to Vietnam",
        challenge: "180-ton turbine requiring multi-modal transport",
        solution: "Combined sea, river barge, and specialized road transport",
        result: "100% success rate, completed 2 weeks early"
      }
    }
  ];

  return (
    <main className="bg-canvas min-h-screen">
      {/* Page Hero */}
      <section className="hero-spacing bg-canvas border-b border-hairline">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl"
          >
            <span className="figma-mono text-xs tracking-[0.3em] text-ink/40 block mb-6 uppercase">Our Capabilities</span>
            <h1 className="display-xl text-ink mb-10 leading-[0.85] tracking-tighter">
              Logistics at the Speed of Trust.
            </h1>
            <p className="body-lg text-ink/70 max-w-2xl">
              Beyond GSSA expertise, we deliver a full spectrum of logistics services designed for the most demanding supply chains. Small giant, big impact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Navigation / Quick Links */}
      <section className="py-6 bg-canvas border-b border-hairline sticky top-16 md:top-16 z-30 backdrop-blur-xl bg-canvas/80">
        <div className="container-wide flex flex-wrap gap-4 md:gap-8 items-center">
          <span className="figma-mono text-[10px] text-ink/30 uppercase tracking-widest mr-4">Quick Access</span>
          {services.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="text-sm font-bold text-ink hover:text-ink/60 transition-colors py-2">
              {s.name}
            </a>
          ))}
        </div>
      </section>

      {/* Services Modular Blocks */}
      <div className="section-spacing space-y-24 md:space-y-32">
        {services.map((service) => (
          <section key={service.id} id={service.id} className="container-wide scroll-mt-32">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`${service.colorBlock} color-block shadow-sm`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7 p-10 md:p-16 lg:p-24 border-b lg:border-b-0 lg:border-r border-ink/10 flex flex-col justify-between">
                   <div>
                      <div className="flex items-center gap-6 mb-16">
                         <div className="w-16 h-16 rounded-2xl bg-canvas flex items-center justify-center text-4xl shadow-sm border border-ink/5">
                            {service.icon}
                         </div>
                         <span className="figma-mono text-xs tracking-widest text-ink/40 uppercase font-bold">{service.name}</span>
                      </div>
                      <h2 className="display-lg text-ink mb-8 leading-none tracking-tight">{service.tagline}</h2>
                      <p className="body-lg text-ink/80 mb-16 max-w-xl leading-relaxed">{service.overview}</p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-16 border-t border-ink/10">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-4">
                           <div className="w-1.5 h-1.5 rounded-full bg-ink/40 mt-2.5 flex-shrink-0" />
                           <span className="body-sm text-ink/90 font-medium">{feature}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="lg:col-span-5 p-10 md:p-16 lg:p-24 bg-ink/[0.02] flex flex-col">
                   <div className="flex items-center gap-3 mb-16">
                      <div className="w-2 h-2 rounded-full bg-ink animate-pulse" />
                      <span className="figma-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase font-bold">Field Success Story</span>
                   </div>
                   
                   <div className="flex-1">
                      <h4 className="headline text-ink mb-2">{service.caseStudy.title}</h4>
                      <p className="figma-mono text-[10px] tracking-widest text-ink/50 mb-10 uppercase font-medium">{service.caseStudy.route}</p>
                      
                      <div className="space-y-10">
                         <div>
                           <p className="text-[10px] figma-mono text-ink/40 mb-3 uppercase tracking-widest">The Challenge</p>
                           <p className="body-sm text-ink/80 leading-relaxed italic border-l-2 border-ink/10 pl-6">&ldquo;{service.caseStudy.challenge}&rdquo;</p>
                         </div>
                         <div>
                           <p className="text-[10px] figma-mono text-ink/40 mb-3 uppercase tracking-widest">Our Solution</p>
                           <p className="body-sm text-ink/80 leading-relaxed">{service.caseStudy.solution}</p>
                         </div>
                         <div className="p-8 bg-canvas border border-ink/10 rounded-2xl shadow-inner-sm">
                           <p className="text-[10px] figma-mono text-ink/40 mb-2 uppercase tracking-widest">Final Outcome</p>
                           <p className="headline-sm text-ink font-black">{service.caseStudy.result}</p>
                         </div>
                      </div>
                   </div>
                   
                   <div className="mt-16 pt-10 border-t border-ink/5 flex justify-between items-center">
                      <span className="figma-mono text-[10px] text-ink/20">CASE REF: {service.id.toUpperCase()}-2026</span>
                      <button className="text-[10px] figma-mono text-ink/40 hover:text-ink transition-colors font-bold uppercase tracking-widest">Read Full Story →</button>
                   </div>
                </div>
              </div>
            </motion.div>
          </section>
        ))}
      </div>

      {/* Unified CTA Section */}
      <section className="section-spacing bg-ink text-canvas overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="container-wide text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="display-xl mb-12 tracking-tighter leading-none">Ready to Move?<br />Let&apos;s Connect.</h2>
            <p className="body-lg text-canvas/60 mb-16 max-w-xl mx-auto">
              Whether it&apos;s a one-off express shipment or a complex multi-year project, our team is ready to deliver.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/#contact" className="btn-pill-secondary w-full sm:w-auto text-lg py-5 px-10">
                Request a Quote
              </Link>
              <Link href="/company" className="text-canvas/60 hover:text-canvas transition-colors figma-mono text-xs uppercase tracking-widest font-bold">
                Learn About Our Team →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
