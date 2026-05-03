'use client';

const services = [
  {
    name: 'Air Freight',
    tagline: 'When Every Minute Counts',
    description: 'Express and time-critical air cargo solutions with GSA/CSA expertise for major carriers.',
  },
  {
    name: 'Ocean Freight',
    tagline: 'Global Reach, Local Expertise',
    description: 'Full container load (FCL) and less than container load (LCL) services worldwide.',
  },
  {
    name: 'Project Cargo',
    tagline: 'Complex Solutions Made Simple',
    description: 'Specialized handling for oversized, heavy, and high-value project shipments.',
  },
  {
    name: 'Goodman Aero Solutions',
    tagline: 'Completing Expertise',
    description: 'Total solutions supporting safe aircraft operations including AOG support and parts sale.',
  },
];

export default function ServicesShowcase() {
  return (
    <section className="bg-canvas py-24">
      <div className="color-block color-block-mint">
        <div className="max-w-4xl mb-24">
          <span className="eyebrow block mb-8">Capabilities</span>
          <h2 className="display-lg mb-8">Beyond GSSA — <br />Full logistics capability</h2>
          <p className="body-lg text-ink/60">
            Air, ocean, and project cargo expertise to complement our airline partnerships.
            We deliver velocity and trust in every shipment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-hairline/20 rounded-md overflow-hidden">
          {services.map((service) => (
            <div key={service.name} className="bg-canvas p-10 group hover:bg-surface-soft transition-colors">
              <span className="headline block mb-4 group-hover:translate-x-2 transition-transform">→ {service.name}</span>
              <p className="body-sm font-bold text-ink/40 mb-6 uppercase tracking-widest">{service.tagline}</p>
              <p className="body-default text-ink/70">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
