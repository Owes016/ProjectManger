'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !user) {
        // User is not authenticated but page requires auth
        router.push('/login');
      } else if (!requireAuth && user) {
        // User is authenticated but page doesn't require auth (like login page)
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, requireAuth, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // If auth is required and user isn't authenticated, don't render children
  if (requireAuth && !user) {
    return null;
  }

  // If auth is not required and user is authenticated, don't render children
  if (!requireAuth && user) {
    return null;
  }

  // Render children otherwise
  return <>{children}</>;
} 