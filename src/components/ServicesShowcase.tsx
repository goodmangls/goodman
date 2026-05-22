'use client';

import DisplayLines from './DisplayLines';

const services = [
  {
    name: 'Air Freight',
    tagline: 'When Every Minute Counts',
    description:
      'Express and time-critical air cargo solutions with GSA/CSA expertise for major carriers.',
  },
  {
    name: 'Ocean Freight',
    tagline: 'Global Reach, Local Expertise',
    description:
      'Full container load (FCL) and less than container load (LCL) services worldwide.',
  },
  {
    name: 'Project Cargo',
    tagline: 'Complex Solutions Made Simple',
    description:
      'Specialized handling for oversized, heavy, and high-value project shipments.',
  },
  {
    name: 'Goodman Aero Solutions',
    tagline: 'Completing Expertise',
    description:
      'Total solutions supporting safe aircraft operations including AOG support and parts sale.',
  },
];

export default function ServicesShowcase() {
  return (
    <section className="section-surface-obsidian section-spacing">
      <div className="container-wide">
        <div className="max-w-3xl mb-16">
          <p className="eyebrow mb-6">Capabilities</p>
          <DisplayLines
            as="h2"
            lines={['Beyond GSSA —', 'Full logistics capability']}
            className="display-lg text-canvas-white mb-8"
          />
          <p className="body-lg text-canvas-white/75 max-w-2xl">
            Air, ocean, and project cargo expertise to complement our airline partnerships.
            We deliver velocity and trust in every shipment.
          </p>
        </div>

        <div className="feature-stack max-w-4xl">
          {services.map((service) => (
            <div key={service.name} className="feature-stack-item">
              <h3 className="headline text-canvas-white mb-2">{service.name}</h3>
              <p className="caption text-canvas-white/50 mb-4">{service.tagline}</p>
              <p className="body-default text-canvas-white/75">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
