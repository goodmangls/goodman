'use client';

import { ReactNode } from 'react';
import Providers from './Providers';
import Navigation from './Navigation';
import Footer from './Footer';
import IntercomMessenger from './IntercomMessenger';
import HtmlLangSync from './HtmlLangSync';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <HtmlLangSync />
      <IntercomMessenger />
      <Navigation />
      {children}
      <Footer />
    </Providers>
  );
}
