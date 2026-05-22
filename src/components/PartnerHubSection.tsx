'use client';

import Link from 'next/link';

const features = [
  'Agent Zone — partner registration & tariff access',
  'Market insights — Korea trade intelligence reports',
  'Dedicated account management',
];

export default function PartnerHubSection() {
  return (
    <section id="partner-hub" className="bg-canvas section-spacing">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <p className="eyebrow mb-6">Exclusive</p>
            <h2 className="display-lg text-ink mb-8">Partner Hub</h2>
            <p className="body-lg text-muted mb-12 max-w-xl">
              Exclusive resources for our global network. Access technical intelligence and
              strategic insights to grow your business in Korea.
            </p>
            <ul className="feature-stack max-w-lg mb-12">
              {features.map((feature) => (
                <li key={feature} className="feature-stack-item">
                  <span className="body-default text-ink font-bold">{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="#contact" className="btn-pill-primary">
              Contact us to join
            </Link>
          </div>

          <div className="hidden md:flex justify-end">
            <div className="panel-bordered w-full aspect-square max-w-sm flex items-center justify-center p-12 bg-surface-soft">
              <span className="display-xl opacity-10 text-ink select-none">G</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
