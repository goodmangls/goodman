'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function HtmlLangSync() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = pathname === '/ko' || pathname.startsWith('/ko/') ? 'ko' : 'en';
  }, [pathname]);

  return null;
}
