'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  Code2,
  Trophy,
  BookOpen,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const StudentSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, signOutUser } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const studentLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Coding Playground', href: '/playground', icon: Code2 },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Study Materials', href: '/materials', icon: BookOpen },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await signOutUser();
    router.push('/login');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative sticky top-0 h-screen bg-[#09090B] border-r border-white/10 flex flex-col justify-between p-4 select-none z-30 shrink-0"
    >
      <div>
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-2 py-3 mb-6">
          <Link href="/dashboard" className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A227] to-[#D4AF37] flex items-center justify-center font-black text-black text-xl shadow-[0_0_20px_rgba(201,162,39,0.3)] shrink-0">
              S
            </div>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                <span className="font-extrabold text-lg text-white tracking-wider font-mono flex items-center gap-1.5">
                  SkillDev <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                </span>
                <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-widest">
                  Student Portal
                </span>
              </motion.div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {studentLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'text-white bg-gradient-to-r from-[#151518] to-[#1c1a12] border border-[#C9A227]/40 shadow-[0_0_15px_rgba(201,162,39,0.15)] font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="studentActiveIndicator"
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#C9A227]"
                  />
                )}
                <Icon
                  className={cn(
                    'w-5 h-5 shrink-0 transition-colors',
                    isActive ? 'text-[#C9A227]' : 'text-zinc-400 group-hover:text-zinc-200'
                  )}
                />
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="truncate">
                    {link.name}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Streak / Logout */}
      <div className="space-y-3">
        {!collapsed && user && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#151518] to-[#111113] border border-[#C9A227]/20 flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#C9A227]/15 text-[#C9A227]">
              <Flame className="w-5 h-5 fill-[#C9A227]" />
            </div>
            <div>
              <p className="text-[11px] text-zinc-400 font-medium">Daily Streak</p>
              <p className="text-sm font-extrabold text-white font-mono">
                {user.currentStreak || 0} Days 🔥
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};
