'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated, isAdminOrModerator, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
    }

    if (!isAdminOrModerator) {
      // Redirect to home if not admin or moderator
      router.push('/');
      return;
    }
  }, [isAuthenticated, isAdminOrModerator, router]);

  // Show loading while checking authentication
  if (!isAuthenticated || !isAdminOrModerator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-grey-600 to-cyan-200 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if user is not admin or moderator
  if (user && user.status !== 'admin' && user.status !== 'mods') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-grey-600 to-cyan-200 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don&apos;t have permission to access this page. Admin or Moderator access required.</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-orange-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-cyan-600 transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
