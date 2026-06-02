import { describe, expect, it } from 'vitest';
import { getMessage, messages, type Locale } from './i18n-messages';

const locales: Locale[] = ['en', 'ko'];

function t(locale: Locale, key: string) {
  return getMessage(messages[locale], key);
}

describe('home landing content strategy', () => {
  it.each(locales)('positions GOODMAN GLS as Korea-first end-to-end logistics for %s', (locale) => {
    const headline = `${t(locale, 'home.hero.titleLine1')} ${t(locale, 'home.hero.titleLine2')}`;
    const lead = t(locale, 'home.hero.lead');

    expect(headline).toContain(locale === 'ko' ? '한국' : 'Korea');
    expect(headline).toMatch(locale === 'ko' ? /전 구간|원스톱/ : /end-to-end|one-stop/i);
    expect(lead).toMatch(locale === 'ko' ? /항공|해상|통관|창고/ : /air|ocean|customs|warehousing/i);
  });

  it.each(locales)('surfaces above-the-fold proof points for %s', (locale) => {
    expect(t(locale, 'home.hero.proofLabel')).not.toBe('home.hero.proofLabel');

    const proofKeys = ['network', 'airlines', 'coverage'];

    for (const key of proofKeys) {
      const label = t(locale, `home.hero.proof.${key}.label`);
      const value = t(locale, `home.hero.proof.${key}.value`);

      expect(label).not.toBe(`home.hero.proof.${key}.label`);
      expect(value).not.toBe(`home.hero.proof.${key}.value`);
      expect(label.length).toBeGreaterThan(3);
      expect(value.length).toBeGreaterThan(1);
    }
  });

  it.each(locales)('keeps airline partnership as a specialized capability, not the only homepage promise for %s', (locale) => {
    expect(t(locale, 'home.why.lead')).toMatch(locale === 'ko' ? /전 구간|공급망/ : /supply chain|every link/i);
    expect(t(locale, 'home.gsa.lead')).toMatch(locale === 'ko' ? /항공사|파트너십/ : /airlines|partnerships/i);
  });
});
