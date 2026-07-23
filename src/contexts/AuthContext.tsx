'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { fetchUserProfile } from '@/services/supabaseService';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Restore saved session on page load
    const savedUser = localStorage.getItem('skilldev_production_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }

    // Subscribe to Supabase Auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch latest profile from DB on every auth event
        const profile = await fetchUserProfile(session.user.id);
        if (profile) {
          setUser(profile);
          localStorage.setItem('skilldev_production_user', JSON.stringify(profile));
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('skilldev_production_user');
      }
      setLoading(false);
    });

    setLoading(false);
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (usernameOrEmail: string, pass: string): Promise<UserProfile | null> => {
    setLoading(true);
    let resolvedUser: UserProfile | null = null;

    const envAdminUser = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin2006';
    const envAdminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin@12345';
    const cleanInput = usernameOrEmail.trim().toLowerCase();

    // Admin credential check
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

    // Supabase Auth Email/Password Sign In
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: usernameOrEmail,
        password: pass,
      });

      if (error) throw new Error(error.message);

      if (data.user) {
        resolvedUser = await fetchUserProfile(data.user.id);
      }
    } catch (err: any) {
      setLoading(false);
      throw err;
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

    // Step 1: Create Supabase Auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.pass,
    });

    if (authError) {
      setLoading(false);
      throw new Error(authError.message);
    }

    const uid = authData.user?.id;
    if (!uid) {
      setLoading(false);
      throw new Error('Failed to create user account. Please try again.');
    }

    // Step 2: Build clean default student profile — all zeros, no mock data
    const newProfile: UserProfile = {
      uid,
      email: data.email,
      displayName: data.name,
      role: 'student',
      college: data.college,
      year: data.year,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
      level: 1,
      xp: 0,
      currentStreak: 0,
      longestStreak: 0,
      tasksCompletedCount: 0,
      bio: '',
      createdAt: new Date().toISOString(),
    };

    // Step 3: Persist profile to Supabase DB
    const { error: dbError } = await supabase.from('users').insert({
      uid: newProfile.uid,
      email: newProfile.email,
      display_name: newProfile.displayName,
      role: newProfile.role,
      college: newProfile.college,
      year: newProfile.year,
      avatar_url: newProfile.avatarUrl,
      level: newProfile.level,
      xp: newProfile.xp,
      current_streak: newProfile.currentStreak,
      longest_streak: newProfile.longestStreak,
      tasks_completed_count: newProfile.tasksCompletedCount,
      bio: newProfile.bio,
      created_at: newProfile.createdAt,
    });

    if (dbError) {
      console.error('Failed to save student profile to DB:', dbError.message);
      // Don't block signup if DB write fails — auth user exists, profile can be recreated on next login
    }

    setUser(newProfile);
    localStorage.setItem('skilldev_production_user', JSON.stringify(newProfile));
    setLoading(false);
    return newProfile;
  };

  const signOutUser = async () => {
    try {
      await supabase.auth.signOut();
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
