'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ConditionalHeader() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Show header if:
  // 1. User is authenticated, OR
  // 2. User is on any page other than home (/)
  const shouldShowHeader = isAuthenticated || pathname !== '/';

  if (!shouldShowHeader) {
    return null;
  }

  return <Header />;
}
