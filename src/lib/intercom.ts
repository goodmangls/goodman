import type { Locale } from '@/lib/i18n-messages';

export const INTERCOM_APP_ID =
  process.env.NEXT_PUBLIC_INTERCOM_APP_ID ?? 'k5z51xs2';

/** Distance from viewport edges (Intercom minimum: 20). */
export const INTERCOM_LAUNCHER_PADDING = 24;

/**
 * Map our in-app locale to an Intercom Messenger `language_override` code.
 * Both `en` and `ko` are valid IETF tags Intercom accepts directly, so this
 * stays a 1:1 map today. Extend here if more locales are added (e.g. cn → zh-CN).
 * @see https://www.intercom.com/help/en/articles/180-localize-intercom-to-work-with-multiple-languages
 */
const INTERCOM_LANG_MAP: Record<Locale, string> = {
  en: 'en',
  ko: 'ko',
};

export type IntercomBootSettings = {
  app_id: string;
  alignment?: 'left' | 'right';
  horizontal_padding?: number;
  vertical_padding?: number;
  language_override?: string;
};

/**
 * Boot settings for the Intercom Messenger. The messenger UI follows the
 * site's EN/KO toggle: re-invoking `Intercom()` with a new `language_override`
 * swaps the messenger locale on the fly (no reboot needed).
 */
export function buildIntercomSettings(locale: Locale): IntercomBootSettings {
  return {
    app_id: INTERCOM_APP_ID,
    alignment: 'right',
    horizontal_padding: INTERCOM_LAUNCHER_PADDING,
    vertical_padding: INTERCOM_LAUNCHER_PADDING,
    language_override: INTERCOM_LANG_MAP[locale],
  };
}
