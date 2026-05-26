'use client';

import { useEffect } from 'react';
import Intercom from '@intercom/messenger-js-sdk';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildIntercomSettings, INTERCOM_APP_ID } from '@/lib/intercom';

/**
 * Boots the Intercom Messenger on the client for anonymous visitors and keeps
 * the messenger UI locale in sync with the site's EN/KO toggle. Re-invoking
 * `Intercom()` issues an `update` under the hood, so a locale change swaps the
 * messenger language without a reboot.
 *
 * NOTE: This site has no authenticated portal yet. When auth is added, identify
 * the visitor here (user_id + Rails-side `user_hash` for Identity Verification)
 * and call `shutdown()` then `boot()` on logout — re-invoking `Intercom()` alone
 * issues an `update`, which does not restart a shut-down session.
 */
export default function IntercomMessenger() {
  const { locale } = useLanguage();

  useEffect(() => {
    if (!INTERCOM_APP_ID) return;
    Intercom(buildIntercomSettings(locale));
  }, [locale]);

  return null;
}
