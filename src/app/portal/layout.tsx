import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import PortalShell from './PortalShell';

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/auth/login?callbackUrl=/portal');
  }

  return <PortalShell>{children}</PortalShell>;
}
