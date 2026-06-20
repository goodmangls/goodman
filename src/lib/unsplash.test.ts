import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { approvedUnsplashImages, getHeroUnsplashImages } from './unsplash';

const root = process.cwd();
const read = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), 'utf8');

describe('approved Unsplash image pool', () => {
  it('keeps a curated pool with attribution and download tracking metadata', () => {
    expect(approvedUnsplashImages.length).toBeGreaterThanOrEqual(3);

    for (const image of approvedUnsplashImages) {
      expect(image.src).toContain('images.unsplash.com');
      expect(image.smallSrc).toContain('images.unsplash.com');
      expect(image.alt.toLowerCase()).not.toContain('logo');
      expect(image.photographer).toBeTruthy();
      expect(image.photographerUrl).toContain('utm_source=goodman_gls');
      expect(image.unsplashUrl).toContain('utm_source=goodman_gls');
      expect(image.downloadLocation).toContain('/photos/');
      expect(image.width).toBeGreaterThan(1000);
      expect(image.height).toBeGreaterThan(600);
    }
  });

  it('returns only hero-approved logistics images for the GLS homepage', () => {
    const heroImages = getHeroUnsplashImages();

    expect(heroImages).toHaveLength(3);
    expect(heroImages.map((image) => image.topic)).toEqual(['ocean', 'air', 'global']);
    expect(heroImages.every((image) => image.brandUse === 'approved-hero-candidate')).toBe(true);
  });
});

describe('GLS hero Unsplash integration', () => {
  it('uses the approved-pool selector and renders source attribution', () => {
    const hero = read('src/components/HeroSection.tsx');

    expect(hero).toContain('getHeroUnsplashImages');
    expect(hero).toContain('ks-hero-bg-slide');
    expect(hero).toContain('ks-hero-bg-attribution');
    expect(hero).toContain('Photo:');
    expect(hero).not.toContain('photo-1494412519320-aa613dfb7738');
  });

  it('keeps Unsplash remote images server-safe and Next/Image-compatible', () => {
    const nextConfig = read('next.config.mjs');
    const hero = read('src/components/HeroSection.tsx');

    expect(nextConfig).toContain("hostname: 'images.unsplash.com'");
    expect(hero).toContain('priority={index === 0}');
    expect(hero).not.toContain('NEXT_PUBLIC_UNSPLASH_ACCESS_KEY');
  });
});
