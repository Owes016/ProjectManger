import { atom } from 'jotai';
import { supabase } from './supabase';
import { User, Session } from '@supabase/supabase-js';

// Add an ErrorType interface
interface ErrorType {
  message: string;
}

// Atoms for storing authentication state
export const userAtom = atom<User | null>(null);
export const sessionAtom = atom<Session | null>(null);
export const isLoadingAtom = atom<boolean>(true);

// Function to get the current session
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  } catch (error) {
    console.error('Error getting session:', error);
    return { session: null, error };
  }
};

// Function to sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error: error as ErrorType | null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { data: null, error: { message: 'An error occurred during sign in' } as ErrorType };
  }
};

// Function to sign up with email and password
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    
    return { data, error: error as ErrorType | null };
  } catch (error) {
    console.error('Error signing up:', error);
    return { data: null, error: { message: 'An error occurred during sign up' } as ErrorType };
  }
};

// Function to sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
};

// Function to listen to auth changes
export const setupAuthListener = (
  setUser: (user: User | null) => void,
  setSession: (session: Session | null) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  // Initial session check
  getSession().then(({ session }) => {
    setSession(session);
    setUser(session?.user ?? null);
    setIsLoading(false);
  });

  // Set up auth state change listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    }
  );

  // Return cleanup function
  return () => {
    subscription.unsubscribe();
  };
}; 