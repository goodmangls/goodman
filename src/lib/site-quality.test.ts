import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), 'utf8');

describe('footer network certifications', () => {
  it('shows balanced MPL, EAN, and IATA membership cards in the footer', () => {
    const footer = read('src/components/Footer.tsx');
    const css = read('src/app/globals.css');

    expect(footer).toContain('MPL NETWORK');
    expect(footer).toContain('EAN NETWORKS');
    expect(footer).toContain('Member No. 4952');
    expect(footer).not.toContain('Member No. 10032');
    expect(footer).toContain('IATA MEMBER');
    expect(footer).toContain('17-3 7233 0010');
    expect(footer).not.toContain('ean-badge-10032');
    expect(footer).not.toContain('ean-network.com/api/widget/10032/embed.js');
    expect(css).toContain('.network-cert-mark--ean');
  });
});

describe('public crawler and credential readiness', () => {
  it('publishes robots and sitemap metadata routes for public crawl coverage', () => {
    const robots = read('src/app/robots.ts');
    const sitemap = read('src/app/sitemap.ts');

    expect(robots).toContain("sitemap: `${siteUrl}/sitemap.xml`");
    expect(robots).toContain("allow: '/'");
    expect(robots).toContain("disallow: ['/api/', '/admin/', '/portal/']");
    expect(sitemap).toContain("'/'");
    expect(sitemap).toContain("'/ko'");
    expect(sitemap).toContain("'/services'");
    expect(sitemap).toContain("'/network'");
  });

  it('keeps hreflang, JSON-LD, and EAN credential proof crawlable on owned pages', () => {
    const layout = read('src/app/layout.tsx');
    const koPage = read('src/app/ko/page.tsx');
    const langSync = read('src/components/HtmlLangSync.tsx');

    expect(layout).toContain('application/ld+json');
    expect(layout).toContain("name: 'EAN Networks'");
    expect(layout).toContain("identifier: 'Member No. 4952'");
    expect(layout).not.toContain('Member No. 10032');
    expect(koPage).toContain('canonical: "/ko"');
    expect(koPage).toContain('locale: "ko_KR"');
    expect(langSync).toContain("document.documentElement.lang");
    expect(langSync).toContain("? 'ko' : 'en'");
  });

  it('states BridgeLogis carrier comparison with a final-quote caveat instead of partner claims', () => {
    const servicesPage = read('src/app/services/page.tsx');
    const en = read('messages/en.json');
    const ko = read('messages/ko.json');

    expect(servicesPage).toContain("t('pages.services.bridgeLogis.caveat')");
    expect(en).toContain('tariff comparison only');
    expect(en).toContain('final quotation');
    expect(en).toContain('available UPS and DHL express tariff options');
    expect(en).not.toContain('UPS and DHL express freight, calculate');
    expect(ko).toContain('운임 비교를 위한 표기');
    expect(ko).toContain('최종 견적');
  });
});

describe('mobile visual quality', () => {
  it('uses a mobile typography override so display headings do not render with cramped line-height', () => {
    const css = read('src/app/globals.css');

    expect(css).toMatch(/@media\s*\(max-width:\s*767px\)/);
    expect(css).toMatch(/\.display-hero[\s\S]*line-height:\s*1\.0[5-9]/);
    expect(css).toMatch(/\.display-xl[\s\S]*line-height:\s*1\.0[5-9]/);
    expect(css).toMatch(/\.display-lg[\s\S]*line-height:\s*1\.0[5-9]/);
  });

  it('stacks home hero CTAs as full-width buttons on mobile', () => {
    const hero = read('src/components/HeroSection.tsx');

    expect(hero).toContain('flex-col sm:flex-row');
    expect(hero).toContain('w-full sm:w-auto');
    expect(hero).toContain('justify-center');
  });
});
