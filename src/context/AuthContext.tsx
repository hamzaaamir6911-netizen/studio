'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, firebase_is_configured } from '@/lib/firebase/config';
import type { AppUser } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signup: (email: string, password: string, name: string, role: 'buyer' | 'seller') => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const missingKeyError = "Firebase API key is not configured. Please add NEXT_PUBLIC_FIREBASE_API_KEY to your .env file. You can get one from your Firebase project settings.";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!firebase_is_configured) {
        if(process.env.NODE_ENV === 'development') {
            console.warn(missingKeyError);
        }
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: userData.role,
          });
        } else {
            // This case can happen if user exists in Auth but not in Firestore.
            // For this app's logic, we assume they always co-exist after signup.
             setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
             });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const checkConfig = () => {
      if (!firebase_is_configured) {
          toast({
              title: "Firebase Not Configured",
              description: missingKeyError,
              variant: "destructive",
              duration: 10000,
          });
          throw new Error(missingKeyError);
      }
  }

  const signup = async (email: string, password: string, name: string, role: 'buyer' | 'seller') => {
    checkConfig();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    await updateProfile(firebaseUser, { displayName: name });
    
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email,
        displayName: name,
        role,
    });
  };

  const login = async (email: string, password: string) => {
    checkConfig();
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    checkConfig();
    await signOut(auth);
  };

  const value = { user, loading, signup, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
