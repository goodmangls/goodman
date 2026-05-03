'use client';

const pillars = [
  {
    key: 'sales',
    title: 'In the Market',
    description: 'We sell smart, act fast, and deliver consistently. Our local teams know every forwarder and route in Korea.',
  },
  {
    key: 'capacity',
    title: 'In the Air',
    description: 'Dynamic pricing, yield optimization, and strategic space allocation that maximizes your revenue per flight.',
  },
  {
    key: 'intelligence',
    title: 'On the Ground',
    description: 'Trade flow analysis, seasonal forecasting, and regulatory intelligence updated weekly for our partners.',
  },
  {
    key: 'digital',
    title: 'In the Cloud',
    description: 'Real-time dashboards, API connectivity, and digital booking platforms at your fingertips.',
  },
];

export default function WhyGSSASection() {
  return (
    <section id="services" className="bg-canvas py-24">
      <div className="color-block color-block-lilac">
        <div className="max-w-4xl">
          <span className="eyebrow block mb-8">What we do</span>
          
          <h2 className="display-lg mb-12">
            We think like an airline. <br />
            We act like your team.
          </h2>
          
          <p className="body-lg mb-16 max-w-2xl">
            A GSSA is not a middleman. We are your dedicated commercial team in Korea — 
            selling your capacity, managing your brand, and growing your revenue as if it 
            were our own business.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {pillars.map((pillar) => (
              <div key={pillar.key}>
                <h4 className="headline mb-3">{pillar.title}</h4>
                <p className="body-default opacity-80">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
