'use client';

import { ReactNode } from 'react';
import Providers from './Providers';
import Navigation from './Navigation';
import Footer from './Footer';
import FloatingConnect from './FloatingConnect';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <Navigation />
      {children}
      <Footer />
      <FloatingConnect />
    </Providers>
  );
}
