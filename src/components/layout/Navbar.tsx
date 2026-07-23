'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/store/useAppStore';
import { calculateLevelProgress } from '@/lib/utils';
import {
  Bell,
  Search,
  Sparkles,
  User as UserIcon,
  LogOut,
  Shield,
  Zap,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export const Navbar: React.FC = () => {
  const { user, signOutUser } = useAuth();
  const { toggleCommandPalette, notifications, markNotificationRead, clearNotifications } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const levelInfo = user ? calculateLevelProgress(user.xp) : null;

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#09090B]/80 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 flex items-center justify-between">
      {/* Command Palette Search Button */}
      <button
        onClick={toggleCommandPalette}
        className="flex items-center space-x-3 px-3.5 py-2 rounded-xl bg-[#151518] border border-white/10 hover:border-[#C9A227]/40 text-zinc-400 hover:text-white transition-all text-xs md:text-sm shadow-inner"
      >
        <Search className="w-4 h-4 text-[#C9A227]" />
        <span className="hidden sm:inline">Search tasks, topics, playground...</span>
        <span className="sm:hidden">Search...</span>
        <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white/10 text-zinc-300 rounded border border-white/10">
          Ctrl K
        </kbd>
      </button>

      {/* Right Controls */}
      <div className="flex items-center space-x-3 md:space-x-5">
        {/* Level & XP Chip (for Students) */}
        {user && user.role === 'student' && (
          <div className="flex items-center space-x-2 bg-gradient-to-r from-[#151518] to-[#1c1a12] border border-[#C9A227]/30 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <div className="flex items-center space-x-1 text-[#C9A227]">
              <Zap className="w-3.5 h-3.5 fill-[#C9A227]" />
              <span>Lvl {levelInfo?.currentLevel || user.level}</span>
            </div>
            <div className="h-3 w-[1px] bg-white/10" />
            <span className="text-white font-mono">{user.xp} XP</span>
          </div>
        )}

        {/* Admin Badge Chip (for Admins) */}
        {user && user.role === 'admin' && (
          <div className="flex items-center space-x-1.5 bg-[#C9A227]/15 border border-[#C9A227]/30 px-3 py-1 rounded-xl text-xs font-bold text-[#C9A227]">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrator</span>
          </div>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-[#151518] border border-white/10 hover:border-[#C9A227]/40 text-zinc-300 hover:text-white transition-all"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C9A227] text-black font-bold text-[10px] flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#151518] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C9A227]" /> Notifications
                  </h4>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-xs text-zinc-400 hover:text-[#C9A227] transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-zinc-500 text-center py-4">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                          n.read
                            ? 'bg-[#111113]/50 border-white/5 text-zinc-400'
                            : 'bg-[#1a1811] border-[#C9A227]/30 text-white font-medium'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[#C9A227]">{n.title}</span>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-[#C9A227]" />}
                        </div>
                        <p className="text-zinc-300 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-1.5 rounded-xl bg-[#151518] border border-white/10 hover:border-[#C9A227]/40 transition-all"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'user'}`}
              alt={user?.displayName || 'User'}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#C9A227]/40"
            />
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-[#151518] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 space-y-1"
              >
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <p className="text-sm font-bold text-white truncate">{user?.displayName}</p>
                  <p className="text-xs text-zinc-400 capitalize flex items-center gap-1 mt-0.5">
                    {user?.role === 'admin' ? (
                      <Shield className="w-3 h-3 text-[#C9A227]" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    )}
                    {user?.role} Account
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    router.push(user?.role === 'admin' ? '/admin/settings' : '/profile');
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-[#C9A227]" />
                  <span>{user?.role === 'admin' ? 'Settings' : 'My Profile'}</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    signOutUser();
                    router.push('/login');
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
