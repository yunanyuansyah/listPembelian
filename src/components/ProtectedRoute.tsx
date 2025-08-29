'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireAdminOrModerator?: boolean;
  fallback?: ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  requireAdminOrModerator = false,
  fallback: _fallback = <div>Access denied</div> 
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isAdminOrModerator, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please log in to access this page.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Check if admin access is required
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h1>
          <p className="text-gray-600 mb-6">You need administrator privileges to access this page.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Check if admin or moderator access is required
  if (requireAdminOrModerator && !isAdminOrModerator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin or Moderator Access Required</h1>
          <p className="text-gray-600 mb-6">You need administrator or moderator privileges to access this page.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
