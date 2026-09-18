import { useState, useEffect, useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { translateAuthError } from '../../../utils/authErrors';
import type { AuthUser } from '../../../types/auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: unknown) {
      const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
      throw new Error(translateAuthError(code));
    }
  }, []);

  const register = useCallback(async (email: string, pass: string): Promise<void> => {
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch (error: unknown) {
      const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
      throw new Error(translateAuthError(code));
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await firebaseSignOut(auth);
  }, []);

  const getIdToken = useCallback(async (): Promise<string | null> => {
    if (!auth.currentUser) return null;
    return auth.currentUser.getIdToken();
  }, []);

  return {
    user,
    loading,
    login,
    register,
    logout,
    getIdToken,
  };
}
