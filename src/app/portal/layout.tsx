'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PortalShell from './PortalShell';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?callbackUrl=/portal');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070612]">
        <div className="w-6 h-6 border-2 border-white/30 border-t-[#FF6B35] rounded-full animate-spin" />
      </div>
    );
  }

  return <PortalShell>{children}</PortalShell>;
}
