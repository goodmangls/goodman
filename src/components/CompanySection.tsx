'use client';

const values = [
  { title: 'Trust', desc: 'The foundation of every partnership' },
  { title: 'Velocity', desc: 'Logistics at the speed of business' },
  { title: 'Connectivity', desc: 'Global network, local expertise' },
];

export default function CompanySection() {
  return (
    <section id="company" className="bg-canvas py-24">
      <div className="container-wide">
        <div className="max-w-4xl mb-24">
          <span className="eyebrow block mb-8">Established 2014</span>
          <h2 className="display-xl mb-8">Small Giant. <br />Big Impact.</h2>
          <p className="body-lg text-ink/60">
            As a dedicated GSSA, airline cargo representation is our core identity — 
            not a side business. Backed by ECS Group, we rival companies many times 
            our size through technical precision and local expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          {values.map((item) => (
            <div key={item.title} className="p-8 bg-surface-soft rounded-md">
              <h3 className="headline mb-4">{item.title}</h3>
              <p className="body-default opacity-70">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto p-12 md:p-16 border border-hairline rounded-md text-center">
          <blockquote className="subhead italic mb-8">
            &quot;In logistics, every shipment carries not just cargo, but our clients&apos; trust and reputation.&quot;
          </blockquote>
          <cite className="eyebrow not-italic text-ink/50 block">CEO & Founder</cite>
        </div>
      </div>
    </section>
  );
}
