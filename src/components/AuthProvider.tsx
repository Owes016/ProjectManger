'use client';

import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { userAtom, sessionAtom, isLoadingAtom, setupAuthListener } from '@/lib/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [, setUser] = useAtom(userAtom);
  const [, setSession] = useAtom(sessionAtom);
  const [, setIsLoading] = useAtom(isLoadingAtom);

  useEffect(() => {
    const cleanup = setupAuthListener(setUser, setSession, setIsLoading);
    return cleanup;
  }, [setUser, setSession, setIsLoading]);

  return <>{children}</>;
} 