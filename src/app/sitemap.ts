import type { MetadataRoute } from 'next';

const siteUrl = 'https://goodmangls.com';

const publicRoutes = ['/', '/ko', '/company', '/services', '/network'];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route === '/' ? '' : route}`,
    lastModified: new Date('2026-06-26'),
    changeFrequency: route === '/' || route === '/ko' ? 'weekly' : 'monthly',
    priority: route === '/' || route === '/ko' ? 1 : 0.8,
  }));
}
