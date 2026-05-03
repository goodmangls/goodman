'use client';

import Link from 'next/link';

const features = [
  'Agent Zone - Partner Registration & Tariff Access',
  'Market Insights - Korea Trade Intelligence Reports',
  'Dedicated Account Management',
];

export default function PartnerHubSection() {
  return (
    <section id="partner-hub" className="bg-canvas py-24">
      <div className="color-block color-block-pink">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32 items-center">
          <div>
            <span className="eyebrow block mb-8">Exclusive</span>
            <h2 className="display-lg mb-8">Partner Hub</h2>
            <p className="body-lg text-ink/60 mb-12">
              Exclusive resources for our global network. Access technical intelligence 
              and strategic insights to grow your business in Korea.
            </p>
            <ul className="space-y-6 mb-12">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-4">
                  <span className="w-1.5 h-1.5 bg-ink rounded-full" />
                  <span className="body-default font-medium">{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="#contact" className="btn-pill-primary">
              Contact us to join
            </Link>
          </div>

          <div className="hidden md:flex justify-end">
            <div className="w-full aspect-square max-w-sm bg-canvas rounded-md border border-hairline flex items-center justify-center p-12">
              <div className="display-xl !text-9xl opacity-10">G</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
