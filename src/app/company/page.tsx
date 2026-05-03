'use client';

import { motion } from 'framer-motion';

export default function CompanyPage() {
  const team = [
    {
      name: "Lee Chang-hee (이창희)",
      title: "Business Development Manager",
      department: "GSA/CSA Division",
      expertise: "Airline partnerships, Route development",
      icon: "👔"
    },
    {
      name: "Kim Min-ji (김민지)",
      title: "Operations Director",
      department: "Air & Ocean Operations",
      expertise: "Supply chain optimization, Customer service",
      icon: "⚡"
    },
    {
      name: "Park Seung-ho (박승호)",
      title: "Project Cargo Specialist",
      department: "Special Projects",
      expertise: "Heavy-lift, Multi-modal logistics",
      icon: "🏗️"
    },
  ];

  const timeline = [
    { year: "2014", milestone: "GOODMAN GLS founded in Seoul", desc: "Started as a cargo GSSA specializing in airline cargo sales with a vision to redefine the Korean market." },
    { year: "2015", milestone: "First GSA Partnership", desc: "Became General Sales Agent for major airline, proving the 'Small Giant' model works." },
    { year: "2018", milestone: "MPL & EAN Membership", desc: "Joined MarcoPoloLine Group and Exclusive Air Network to expand global reach." },
    { year: "2020", milestone: "Project Cargo Division Launch", desc: "Expanded into heavy-lift and specialized cargo for industrial partners." },
    { year: "2025", milestone: "Digital Platform Renewal", desc: "Investing in next-gen technology for real-time partner transparency." },
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
            <span className="figma-mono text-xs tracking-[0.3em] text-ink/40 block mb-6 uppercase">The Story</span>
            <h1 className="display-xl text-ink mb-10 leading-[0.85] tracking-tighter">
              Trust Through<br />Action. Since 2014.
            </h1>
            <p className="body-lg text-ink/70 max-w-xl">
              We aren&apos;t the biggest, but we aim to be the most impactful. Founded on the principle that logistics is a people business, we&apos;ve spent a decade proving that trust is earned, not given.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CEO Message - Editorial Pink Block */}
      <section className="section-spacing bg-canvas">
        <div className="container-wide">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-color-block-pink color-block border border-ink/10 shadow-sm"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 p-10 md:p-16 lg:p-24 border-b lg:border-b-0 lg:border-r border-ink/10 flex flex-col justify-between">
                <div>
                  <span className="figma-mono text-xs tracking-widest text-ink/40 block mb-16 font-bold uppercase">Leadership Insight</span>
                  <h2 className="display-lg text-ink mb-12 tracking-tight leading-none italic">&ldquo;Small Giant, Big Impact. That&apos;s our North Star.&rdquo;</h2>
                  <div className="space-y-8 body-lg text-ink/80 leading-relaxed max-w-2xl">
                    <p>
                      Welcome to GOODMAN GLS. Since our founding in 2014, we&apos;ve built our reputation on a simple principle: <strong>trust through action</strong>.
                    </p>
                    <p>
                      As a leading GSSA in Korea, we are strategically positioned as the gateway between global airlines and Korea&apos;s logistics market.
                    </p>
                    <p>
                      Our team of logistics professionals brings decades of combined experience in time-critical air freight and complex project cargo. We understand that every shipment carries not just cargo, but our clients&apos; reputation.
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 p-10 md:p-16 lg:p-24 flex flex-col justify-end bg-ink/[0.02]">
                <div className="mb-16">
                   <div className="w-40 h-40 rounded-full border-2 border-ink/10 flex items-center justify-center bg-canvas shadow-xl relative">
                      <span className="text-5xl font-black tracking-tighter text-ink/20">SH</span>
                      <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-ink rounded-full flex items-center justify-center text-canvas text-xl">
                        ✓
                      </div>
                   </div>
                </div>
                <h4 className="display-sm text-ink leading-tight tracking-tight font-black">Hyeon-Eok SHIN</h4>
                <p className="figma-mono text-xs tracking-[0.2em] text-ink/50 mt-3 font-bold uppercase">CEO & FOUNDER</p>
                <div className="mt-12 pt-12 border-t border-ink/10">
                  <p className="body-sm text-ink/40 leading-loose">38+ years in air cargo; former executive at Korean Air & Asiana Airlines Cargo. Architect of the GOODMAN service model.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline - Heritage Stream */}
      <section className="section-spacing bg-canvas">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-32">
              <span className="figma-mono text-xs tracking-widest text-ink/40 block mb-6 uppercase font-bold">The Heritage</span>
              <h2 className="display-lg text-ink tracking-tighter">A Decade of Excellence</h2>
            </div>
            
            <div className="relative">
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-ink/10 hidden md:block" />
              <div className="space-y-16 md:space-y-32">
                {timeline.map((item, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`relative flex flex-col md:flex-row gap-8 md:gap-24 items-start ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className="flex-1 md:text-right md:pr-12">
                      {index % 2 === 0 && (
                        <>
                          <span className="display-md text-ink/10 block mb-4">{item.year}</span>
                          <h4 className="headline text-ink mb-4">{item.milestone}</h4>
                          <p className="body text-ink/50 max-w-md ml-auto leading-relaxed">{item.desc}</p>
                        </>
                      )}
                    </div>
                    
                    <div className="w-4 h-4 rounded-full bg-ink border-4 border-canvas z-10 mt-6 hidden md:block" />
                    
                    <div className="flex-1 md:text-left md:pl-12">
                      {index % 2 !== 0 && (
                        <>
                          <span className="display-md text-ink/10 block mb-4">{item.year}</span>
                          <h4 className="headline text-ink mb-4">{item.milestone}</h4>
                          <p className="body text-ink/50 max-w-md leading-relaxed">{item.desc}</p>
                        </>
                      )}
                    </div>
                    
                    {/* Mobile Timeline View */}
                    <div className="md:hidden">
                       <span className="display-md text-ink/10 block mb-4">{item.year}</span>
                       <h4 className="headline text-ink mb-4">{item.milestone}</h4>
                       <p className="body text-ink/50 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team - Lilac Grid */}
      <section className="section-spacing bg-color-block-lilac border-y border-hairline">
        <div className="container-wide">
          <div className="max-w-4xl mb-24">
            <span className="figma-mono text-sm tracking-widest text-ink/40 block mb-6 uppercase font-bold">The Experts</span>
            <h2 className="display-lg text-ink mb-10 tracking-tight leading-none">Logistics is a<br />People Business.</h2>
            <p className="body-lg text-ink/70 max-w-2xl leading-relaxed">
              Our advantage is our team. We&apos;ve brought together the sharpest minds in Korean air freight to ensure your cargo—and your reputation—is in the right hands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div 
                key={index} 
                whileHover={{ y: -6 }}
                className="p-10 bg-canvas border border-ink/10 rounded-[32px] shadow-sm flex flex-col h-full"
              >
                <div className="w-20 h-20 bg-ink/[0.03] rounded-2xl flex items-center justify-center mb-12 border border-ink/5 text-4xl">
                  {member.icon}
                </div>
                <div className="flex-1">
                  <h4 className="headline text-ink mb-1">{member.name}</h4>
                  <p className="figma-mono text-[10px] tracking-[0.2em] text-ink/50 mb-8 uppercase font-bold">{member.title}</p>
                  
                  <div className="space-y-6 pt-8 border-t border-ink/5">
                    <div>
                      <p className="text-[10px] text-ink/30 figma-mono mb-2 uppercase tracking-widest font-bold">Division</p>
                      <p className="body-sm text-ink/80 font-medium">{member.department}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-ink/30 figma-mono mb-2 uppercase tracking-widest font-bold">Core Expertise</p>
                      <p className="body-sm text-ink/80 font-medium">{member.expertise}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-12 pt-8 border-t border-ink/5">
                   <button className="text-[10px] figma-mono text-ink/40 hover:text-ink transition-colors font-bold uppercase tracking-widest">View Profile →</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values - High Contrast Dark */}
      <section className="section-spacing bg-ink text-canvas overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="container-wide text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="display-xl mb-32 tracking-tighter leading-none">Our Core Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-24 max-w-6xl mx-auto">
              {[
                { label: "01", value: "Trust", desc: "Earned through consistent delivery and total transparency." },
                { label: "02", value: "Velocity", desc: "Speed matters in time-critical logistics. We move faster." },
                { label: "03", value: "Connectivity", desc: "Global reach through our elite strategic partnerships." },
              ].map((item, index) => (
                <div key={index} className="text-center group">
                  <span className="figma-mono text-xs tracking-[0.3em] text-canvas/40 block mb-8 font-black group-hover:text-canvas/60 transition-colors uppercase">{item.label}</span>
                  <h3 className="display-md text-canvas mb-8 tracking-tight font-black leading-none">{item.value}</h3>
                  <p className="body-lg text-canvas/60 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
