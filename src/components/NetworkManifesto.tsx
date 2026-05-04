'use client';

import Link from 'next/link';

export default function NetworkManifesto() {
  return (
    <section className="bg-canvas py-24">
      <div className="color-block color-block-navy">
        <div className="max-w-4xl">
          <span className="eyebrow block mb-8 text-white/60">Built for Scale</span>
          <h2 className="display-lg text-white mb-12">
            We rival enterprises<br />
            many times our size.
          </h2>
          <p className="body-lg text-white/80 max-w-2xl mb-12">
            Through ECS Group — the world&apos;s largest GSSA infrastructure spanning
            59 nations — we wield the network of a multinational while preserving
            the responsiveness of a specialist team.
          </p>
          <Link
            href="/network"
            className="btn-pill-secondary"
          >
            See the network
          </Link>
        </div>
      </div>
    </section>
  );
}
