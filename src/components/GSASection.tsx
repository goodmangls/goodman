'use client';

import Link from 'next/link';

const partners = [
  { code: 'WS', name: 'WestJet Cargo (GSA)' },
  { code: 'O3', name: 'ShunFeng Airlines (CSA)' },
  { code: 'BX', name: 'Air Busan (GSA)' },
  { code: 'M0', name: 'Aero Mongolia (GSA)' },
  { code: 'SU', name: 'Aeroflot (CSA)' },
  { code: 'F7', name: 'iFly Airlines (GSA)' },
  { code: 'ZH', name: 'Shenzhen Airlines (CSA)' },
  { code: '8Y', name: 'China Post (CSA)' },
];

export default function GSASection() {
  return (
    <section id="network" className="bg-canvas py-24">
      <div className="container-wide">
        <div className="max-w-4xl mb-16">
          <span className="eyebrow block mb-8">Partnerships</span>
          <h2 className="display-lg text-ink mb-6">Airlines we represent</h2>
          <p className="body-lg text-ink/60">
            Trusted by carriers worldwide to grow their Korean market presence. 
            From flag carriers to specialty freighters.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-hairline border border-hairline overflow-hidden rounded-md">
          {partners.map((partner) => (
            <div 
              key={partner.code} 
              className="bg-canvas p-8 flex flex-col justify-center items-center text-center h-[160px] group hover:bg-surface-soft transition-colors"
            >
              <span className="card-title mb-2 group-hover:scale-110 transition-transform">{partner.code}</span>
              <span className="caption opacity-50">{partner.name}</span>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Link href="#contact" className="btn-pill-primary">
            Become a partner
          </Link>
        </div>
      </div>
    </section>
  );
}
