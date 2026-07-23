'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Code, BookOpen, Award, CheckSquare, Shield, Sparkles, FolderTree, Users, BarChart3, Settings } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/contexts/AuthContext';

export const CommandPalette: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const studentItems = [
    { title: 'Dashboard', path: '/dashboard', icon: Sparkles, category: 'Student Portal' },
    { title: 'Coding Tasks', path: '/tasks', icon: CheckSquare, category: 'Student Portal' },
    { title: 'Monaco Playground', path: '/playground', icon: Code, category: 'Student Portal' },
    { title: 'Leaderboard Rankings', path: '/leaderboard', icon: Award, category: 'Student Portal' },
    { title: 'Study Materials', path: '/materials', icon: BookOpen, category: 'Student Portal' },
    { title: 'My Profile & Heatmap', path: '/profile', icon: Sparkles, category: 'Student Portal' },
    { title: 'Account Settings', path: '/settings', icon: Settings, category: 'Student Portal' },
  ];

  const adminItems = [
    { title: 'Admin Overview', path: '/admin/dashboard', icon: Shield, category: 'Admin Portal' },
    { title: 'Student Roster', path: '/admin/students', icon: Users, category: 'Admin Portal' },
    { title: 'Task Management', path: '/admin/tasks', icon: CheckSquare, category: 'Admin Portal' },
    { title: 'Study Materials Manager', path: '/admin/materials', icon: BookOpen, category: 'Admin Portal' },
    { title: 'Study Topics Manager', path: '/admin/topics', icon: FolderTree, category: 'Admin Portal' },
    { title: 'Publish Performer Spotlight', path: '/admin/leaderboard', icon: Award, category: 'Admin Portal' },
    { title: 'Platform Analytics', path: '/admin/analytics', icon: BarChart3, category: 'Admin Portal' },
    { title: 'Admin Settings', path: '/admin/settings', icon: Settings, category: 'Admin Portal' },
  ];

  const activeItems = user?.role === 'admin' ? adminItems : studentItems;

  const filteredItems = activeItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    setCommandPaletteOpen(false);
    setQuery('');
    router.push(path);
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-[#151518] border border-[#C9A227]/30 rounded-2xl shadow-[0_0_50px_rgba(201,162,39,0.15)] overflow-hidden z-10"
          >
            {/* Search Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-[#111113]/80">
              <Search className="w-5 h-5 text-[#C9A227] mr-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search portal pages & shortcuts... (Press ESC to exit)"
                className="w-full bg-transparent text-white placeholder-zinc-500 focus:outline-none text-base"
                autoFocus
              />
              <span className="text-xs px-2 py-1 rounded bg-white/10 text-zinc-400 font-mono">
                ESC
              </span>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto p-3 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="py-8 text-center text-zinc-500 text-sm">
                  No matching shortcuts found for &quot;{query}&quot;
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(item.path)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 hover:border-[#C9A227]/40 border border-transparent transition-all group text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#C9A227]/20 text-[#C9A227]">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-white group-hover:text-[#C9A227]">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500 font-mono group-hover:text-zinc-300">
                        {item.category}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
