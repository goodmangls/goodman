'use client';

import DisplayLines from './DisplayLines';

const pillars = [
  {
    key: 'sales',
    title: 'In the Market',
    description:
      'We sell smart, act fast, and deliver consistently. Our local teams know every forwarder and route in Korea.',
  },
  {
    key: 'capacity',
    title: 'In the Air',
    description:
      'Dynamic pricing, yield optimization, and strategic space allocation that maximizes your revenue per flight.',
  },
  {
    key: 'intelligence',
    title: 'On the Ground',
    description:
      'Trade flow analysis, seasonal forecasting, and regulatory intelligence updated weekly for our partners.',
  },
  {
    key: 'digital',
    title: 'In the Cloud',
    description:
      'Real-time dashboards, API connectivity, and digital booking platforms at your fingertips.',
  },
];

export default function WhyGSSASection() {
  return (
    <section id="services" className="bg-canvas section-spacing">
      <div className="container-wide">
        <div className="max-w-3xl mb-16">
          <p className="eyebrow mb-6">What we do</p>
          <DisplayLines
            as="h2"
            lines={['We think like an airline.', 'We act like your team.']}
            className="display-lg text-ink mb-8"
          />
          <p className="body-default text-muted max-w-2xl">
            A GSSA is not a middleman. We are your dedicated commercial team in Korea —
            selling your capacity, managing your brand, and growing your revenue as if it
            were our own business.
          </p>
        </div>

        <div className="feature-stack max-w-4xl">
          {pillars.map((pillar) => (
            <div key={pillar.key} className="feature-stack-item">
              <h3 className="headline text-ink mb-3">{pillar.title}</h3>
              <p className="body-default text-muted">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
