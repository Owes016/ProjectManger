'use client';

import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { userAtom, sessionAtom, isLoadingAtom, signIn, signOut, signUp } from '@/lib/auth';

// Error type interface matching the one in auth.ts
interface ErrorType {
  message: string;
}

export function useAuth() {
  const [user] = useAtom(userAtom);
  const [session] = useAtom(sessionAtom);
  const [isLoading] = useAtom(isLoadingAtom);
  const router = useRouter();

  const handleSignIn = async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    return { error };
  };

  const handleSignUp = async (email: string, password: string) => {
    const { error } = await signUp(email, password);
    return { error };
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return {
    user,
    session,
    isLoading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut
  };
} 