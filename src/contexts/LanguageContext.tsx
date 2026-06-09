'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import { getMessage, messages, type Locale } from '@/lib/i18n-messages';

export type { Locale };

const STORAGE_KEY = 'goodman-gls-locale';

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  if (window.location.pathname === '/ko' || window.location.pathname.startsWith('/ko/')) {
    return 'ko';
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'ko' ? 'ko' : 'en';
}

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);
  const pathLocale: Locale = pathname === '/ko' || pathname.startsWith('/ko/') ? 'ko' : 'en';
  const effectiveLocale = pathLocale ?? locale;

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, effectiveLocale);
    document.documentElement.lang = effectiveLocale;
  }, [effectiveLocale]);

  const t = useCallback(
    (key: string) => getMessage(messages[effectiveLocale], key),
    [effectiveLocale],
  );

  const value = useMemo(
    () => ({ locale: effectiveLocale, setLocale, t }),
    [effectiveLocale, setLocale, t],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
