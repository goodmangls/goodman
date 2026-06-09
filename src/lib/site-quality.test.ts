import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), 'utf8');

describe('footer network certifications', () => {
  it('shows IATA membership alongside MPL and EAN in the footer', () => {
    const footer = read('src/components/Footer.tsx');

    expect(footer).toContain('MPL NETWORK');
    expect(footer).toContain('ean-badge-10032');
    expect(footer).toContain('IATA MEMBER');
    expect(footer).toContain('17-3 7233 0010');
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
