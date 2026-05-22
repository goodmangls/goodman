'use client';

import Link from 'next/link';
import DisplayLines from './DisplayLines';

export default function NetworkManifesto() {
  return (
    <section className="bg-canvas section-spacing">
      <div className="container-wide">
        <div className="section-surface-obsidian rounded-[var(--radius-feature)] p-10 md:p-16 lg:p-20 max-w-4xl">
          <p className="eyebrow mb-6">Built for scale</p>
          <DisplayLines
            as="h2"
            lines={['We rival enterprises', 'many times our size.']}
            className="display-lg text-canvas-white mb-8"
          />
          <p className="body-lg text-canvas-white/75 max-w-2xl mb-12">
            Through ECS Group — the world&apos;s largest GSSA infrastructure spanning 59
            nations — we wield the network of a multinational while preserving the
            responsiveness of a specialist team.
          </p>
          <Link href="/network" className="btn-pill-primary">
            See the network
          </Link>
        </div>
      </div>
    </section>
  );
}
