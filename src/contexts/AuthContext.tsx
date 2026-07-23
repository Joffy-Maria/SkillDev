'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (usernameOrEmail: string, pass: string) => Promise<UserProfile | null>;
  signUpStudent: (data: {
    name: string;
    email: string;
    pass: string;
    college: string;
    year: string;
  }) => Promise<UserProfile>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check saved session in localStorage
    const savedUser = localStorage.getItem('skilldev_production_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        try {
          const userRef = doc(db, 'users', fUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const profile = snap.data() as UserProfile;
            setUser(profile);
            localStorage.setItem('skilldev_production_user', JSON.stringify(profile));
          }
        } catch (err) {
          console.error('Error reading user profile on auth change:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (usernameOrEmail: string, pass: string): Promise<UserProfile | null> => {
    setLoading(true);
    let resolvedUser: UserProfile | null = null;

    const envAdminUser = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin2006';
    const envAdminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin@12345';
    const cleanInput = usernameOrEmail.trim().toLowerCase();

    // Check if input matches configured Admin credentials
    const isAdminInput =
      cleanInput === envAdminUser.toLowerCase() ||
      cleanInput === `${envAdminUser.toLowerCase()}@skilldev.io` ||
      cleanInput === 'admin2006@skilldev.io';

    if (isAdminInput && pass === envAdminPass) {
      resolvedUser = {
        uid: 'admin-primary-uid',
        email: `${envAdminUser}@skilldev.io`,
        displayName: 'Administrator',
        role: 'admin',
        level: 10,
        xp: 2500,
        currentStreak: 30,
        longestStreak: 45,
        tasksCompletedCount: 99,
        createdAt: new Date().toISOString(),
        bio: 'SkillDev Lead Administrator',
      };
      setUser(resolvedUser);
      localStorage.setItem('skilldev_production_user', JSON.stringify(resolvedUser));
      setLoading(false);
      return resolvedUser;
    }

    // Otherwise attempt standard Student Firebase Authentication
    try {
      const creds = await signInWithEmailAndPassword(auth, usernameOrEmail, pass);
      const snap = await getDoc(doc(db, 'users', creds.user.uid));
      if (snap.exists()) {
        resolvedUser = snap.data() as UserProfile;
      }
    } catch (err) {
      console.warn('Firebase auth failure:', err);
    }

    if (resolvedUser) {
      setUser(resolvedUser);
      localStorage.setItem('skilldev_production_user', JSON.stringify(resolvedUser));
    }

    setLoading(false);
    return resolvedUser;
  };

  const signUpStudent = async (data: {
    name: string;
    email: string;
    pass: string;
    college: string;
    year: string;
  }): Promise<UserProfile> => {
    setLoading(true);
    let newProfile: UserProfile;

    try {
      const creds = await createUserWithEmailAndPassword(auth, data.email, data.pass);
      newProfile = {
        uid: creds.user.uid,
        email: data.email,
        displayName: data.name,
        role: 'student',
        college: data.college,
        year: data.year,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${creds.user.uid}`,
        level: 1,
        xp: 0,
        currentStreak: 0,
        longestStreak: 0,
        tasksCompletedCount: 0,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', creds.user.uid), newProfile);
    } catch (err) {
      console.warn('Local student registration fallback:', err);
      newProfile = {
        uid: `student-${Date.now()}`,
        email: data.email,
        displayName: data.name,
        role: 'student',
        college: data.college,
        year: data.year,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
        level: 1,
        xp: 0,
        currentStreak: 0,
        longestStreak: 0,
        tasksCompletedCount: 0,
        createdAt: new Date().toISOString(),
      };
    } finally {
      setLoading(false);
    }

    setUser(newProfile);
    localStorage.setItem('skilldev_production_user', JSON.stringify(newProfile));
    return newProfile;
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    localStorage.removeItem('skilldev_production_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        signIn,
        signUpStudent,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
