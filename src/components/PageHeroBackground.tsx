import Image from 'next/image';
import type { UnsplashImage } from '@/lib/unsplash';

type PageHeroBackgroundProps = {
  image: UnsplashImage;
  priority?: boolean;
};

export default function PageHeroBackground({ image, priority = true }: PageHeroBackgroundProps) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes="100vw"
        className="ks-menu-hero-bg-image object-cover object-center"
        data-unsplash-topic={image.topic}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian/92 via-obsidian/62 to-obsidian/22" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_26%,rgba(188,113,85,0.26),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.10)_1px,transparent_1px)] bg-[length:auto,64px_64px] opacity-70" />
      <div className="ks-menu-hero-bg-attribution">
        Photo:{' '}
        <a href={image.photographerUrl} target="_blank" rel="noreferrer">
          {image.photographer}
        </a>{' '}
        on{' '}
        <a href={image.unsplashUrl} target="_blank" rel="noreferrer">
          Unsplash
        </a>
      </div>
    </div>
  );
}
