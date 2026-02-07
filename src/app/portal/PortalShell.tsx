'use client';

import { ReactNode } from 'react';
import PortalSidebar from '@/components/portal/PortalSidebar';
import PortalHeader from '@/components/portal/PortalHeader';
import { ToastProvider } from '@/contexts/ToastContext';

export default function PortalShell({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#070612]">
        <PortalSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <PortalHeader />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
