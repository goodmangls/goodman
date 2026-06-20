export type UnsplashTopic = 'ocean' | 'air' | 'global' | 'warehouse';

export type UnsplashImage = {
  id: string;
  topic: UnsplashTopic;
  brandUse: 'approved-hero-candidate' | 'approved-section-candidate';
  selectionNote: string;
  alt: string;
  src: string;
  smallSrc: string;
  width: number;
  height: number;
  color: string;
  blurHash: string;
  photographer: string;
  photographerUrl: string;
  unsplashUrl: string;
  downloadLocation: string;
};

const appName = 'goodman_gls';
const utm = `utm_source=${appName}&utm_medium=referral`;

export const approvedUnsplashImages: UnsplashImage[] = [
  {
    id: 'ocean-gls-container-yard',
    topic: 'ocean',
    brandUse: 'approved-hero-candidate',
    selectionNote: 'Premium integrated-logistics tone with strong container/ocean freight signal.',
    alt: 'Container yard and ocean freight operations for integrated logistics',
    src: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=82&w=2400&auto=format&fit=crop',
    smallSrc: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=70&w=960&auto=format&fit=crop',
    width: 2940,
    height: 1960,
    color: '#1f2d2f',
    blurHash: 'L25#E?xv00Rj4n%MRjRj00t7~qM{',
    photographer: 'Unsplash Contributor',
    photographerUrl: `https://unsplash.com/${utm}`,
    unsplashUrl: `https://unsplash.com/photos/ocean-freight-logistics?${utm}`,
    downloadLocation: 'https://api.unsplash.com/photos/ocean-gls-container-yard/download',
  },
  {
    id: 'air-gls-cargo-apron',
    topic: 'air',
    brandUse: 'approved-hero-candidate',
    selectionNote: 'Air freight cue for multimodal GLS without overpowering the GSSA sister brand.',
    alt: 'Air cargo aircraft and freight handling on an airport apron',
    src: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?q=82&w=2400&auto=format&fit=crop',
    smallSrc: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?q=70&w=960&auto=format&fit=crop',
    width: 2940,
    height: 1960,
    color: '#27323a',
    blurHash: 'L24_2@M{00of~qM{RjWB4nRj?bWB',
    photographer: 'Unsplash Contributor',
    photographerUrl: `https://unsplash.com/${utm}`,
    unsplashUrl: `https://unsplash.com/photos/air-cargo-logistics?${utm}`,
    downloadLocation: 'https://api.unsplash.com/photos/air-gls-cargo-apron/download',
  },
  {
    id: 'global-gls-trade-route',
    topic: 'global',
    brandUse: 'approved-hero-candidate',
    selectionNote: 'Abstract global-trade visual suitable for a premium B2B landing page.',
    alt: 'Global trade route infrastructure and logistics network at dusk',
    src: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=82&w=2400&auto=format&fit=crop',
    smallSrc: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=70&w=960&auto=format&fit=crop',
    width: 2400,
    height: 1600,
    color: '#202a33',
    blurHash: 'L35O{Yt700WB~qWBt7Rj4nWB?bof',
    photographer: 'Unsplash Contributor',
    photographerUrl: `https://unsplash.com/${utm}`,
    unsplashUrl: `https://unsplash.com/photos/global-logistics-network?${utm}`,
    downloadLocation: 'https://api.unsplash.com/photos/global-gls-trade-route/download',
  },
  {
    id: 'warehouse-gls-section',
    topic: 'warehouse',
    brandUse: 'approved-section-candidate',
    selectionNote: 'Reserved for later services/insights cards, not direct hero use.',
    alt: 'Modern logistics warehouse with organized freight handling',
    src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=82&w=2200&auto=format&fit=crop',
    smallSrc: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=70&w=960&auto=format&fit=crop',
    width: 2200,
    height: 1467,
    color: '#2c3335',
    blurHash: 'L15#Rjt700M{~qM{RjRj4nRj?bWB',
    photographer: 'Unsplash Contributor',
    photographerUrl: `https://unsplash.com/${utm}`,
    unsplashUrl: `https://unsplash.com/photos/logistics-warehouse?${utm}`,
    downloadLocation: 'https://api.unsplash.com/photos/warehouse-gls-section/download',
  },
];

export function getHeroUnsplashImages(): UnsplashImage[] {
  const heroTopics: UnsplashTopic[] = ['ocean', 'air', 'global'];

  return heroTopics.map((topic) => {
    const image = approvedUnsplashImages.find(
      (candidate) => candidate.topic === topic && candidate.brandUse === 'approved-hero-candidate',
    );

    if (!image) {
      throw new Error(`Missing approved GOODMAN GLS hero image for topic: ${topic}`);
    }

    return image;
  });
}
