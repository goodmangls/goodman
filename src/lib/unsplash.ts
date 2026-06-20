export type UnsplashTopic = 'ocean' | 'air' | 'global' | 'warehouse';
export type MenuHeroPage = 'company' | 'services' | 'network';

export type UnsplashImage = {
  id: string;
  topic: UnsplashTopic;
  brandUse: 'approved-hero-candidate' | 'approved-menu-hero-candidate' | 'approved-section-candidate';
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
  {
    id: 'gls-company-premium-ocean-vessel',
    topic: 'global',
    brandUse: 'approved-menu-hero-candidate',
    selectionNote: 'Premium fixed curation: large ocean vessel gives the company story a stronger global-trade signature than generic route imagery.',
    alt: 'Ocean container vessel representing GOODMAN GLS global logistics scale',
    src: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?q=86&w=2200&auto=format&fit=crop&crop=entropy',
    smallSrc: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?q=74&w=960&auto=format&fit=crop&crop=entropy',
    width: 2400,
    height: 1600,
    color: '#24323a',
    blurHash: 'L35O{Yt700WB~qWBt7Rj4nWB?bof',
    photographer: 'Unsplash Contributor',
    photographerUrl: `https://unsplash.com/${utm}`,
    unsplashUrl: `https://unsplash.com/photos/1605745341112-85968b19335b?${utm}`,
    downloadLocation: 'https://api.unsplash.com/photos/gls-company-premium-ocean-vessel/download',
  },
  {
    id: 'gls-services-premium-warehouse-depth',
    topic: 'warehouse',
    brandUse: 'approved-menu-hero-candidate',
    selectionNote: 'Premium fixed curation: high-density warehouse depth keeps the services page operational and substantial.',
    alt: 'Modern logistics warehouse operations for GOODMAN GLS services',
    src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=84&w=2200&auto=format&fit=crop&crop=entropy',
    smallSrc: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=72&w=960&auto=format&fit=crop&crop=entropy',
    width: 2200,
    height: 1467,
    color: '#2c3335',
    blurHash: 'L15#Rjt700M{~qM{RjRj4nRj?bWB',
    photographer: 'Unsplash Contributor',
    photographerUrl: `https://unsplash.com/${utm}`,
    unsplashUrl: `https://unsplash.com/photos/logistics-warehouse?${utm}`,
    downloadLocation: 'https://api.unsplash.com/photos/gls-services-premium-warehouse-depth/download',
  },
  {
    id: 'gls-network-premium-container-grid',
    topic: 'ocean',
    brandUse: 'approved-menu-hero-candidate',
    selectionNote: 'Premium fixed curation: aerial container-grid pattern makes the network page feel broader and more distinctive.',
    alt: 'Aerial container terminal grid for GOODMAN GLS global partner network',
    src: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=84&w=2200&auto=format&fit=crop&crop=entropy',
    smallSrc: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=72&w=960&auto=format&fit=crop&crop=entropy',
    width: 2940,
    height: 1960,
    color: '#1f2d2f',
    blurHash: 'L25#E?xv00Rj4n%MRjRj00t7~qM{',
    photographer: 'Unsplash Contributor',
    photographerUrl: `https://unsplash.com/${utm}`,
    unsplashUrl: `https://unsplash.com/photos/ocean-freight-logistics?${utm}`,
    downloadLocation: 'https://api.unsplash.com/photos/gls-network-premium-container-grid/download',
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

const menuHeroTopics: Record<MenuHeroPage, UnsplashTopic> = {
  company: 'global',
  services: 'warehouse',
  network: 'ocean',
};

export function getMenuHeroUnsplashImage(page: MenuHeroPage): UnsplashImage {
  const topic = menuHeroTopics[page];
  const image = approvedUnsplashImages.find(
    (candidate) => candidate.topic === topic && candidate.brandUse === 'approved-menu-hero-candidate',
  );

  if (!image) {
    throw new Error(`Missing approved GOODMAN GLS menu hero image for page: ${page}`);
  }

  return image;
}
