import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const read = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), 'utf8');

describe('SEO language URL policy', () => {
  it('keeps English as the default root URL and exposes Korean at /ko', () => {
    const layout = read('src/app/layout.tsx');
    const koPage = read('src/app/ko/page.tsx');

    expect(layout).toContain('metadataBase: new URL("https://goodmangls.com")');
    expect(layout).toContain('canonical: "/"');
    expect(layout).toContain('ko: "/ko"');
    expect(layout).toContain('"x-default": "/"');

    expect(koPage).toContain('canonical: "/ko"');
    expect(koPage).toContain('url: "https://goodmangls.com/ko"');
    expect(koPage).toContain('locale: "ko_KR"');
  });

  it('redirects old /en paths to the clean English default paths', () => {
    const config = read('next.config.mjs');

    expect(config).toContain("source: '/en'");
    expect(config).toContain("destination: '/'");
    expect(config).toContain("source: '/en/:path*'");
    expect(config).toContain("destination: '/:path*'");
    expect(config).toContain('permanent: true');
  });

  it('uses real URL changes for the public language toggle', () => {
    const navigation = read('src/components/Navigation.tsx');
    const languageContext = read('src/contexts/LanguageContext.tsx');

    expect(navigation).toContain("router.push(nextLocale === 'ko' ? '/ko' : '/')");
    expect(languageContext).toContain("window.location.pathname === '/ko'");
  });
});
