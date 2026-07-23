'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { fetchAllStudents } from '@/services/firebaseService';
import { UserProfile } from '@/types';
import { Trophy, Crown, Flame, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    async function loadLeaderboard() {
      const list = await fetchAllStudents();
      if (user && !list.find((s) => s.uid === user.uid)) {
        list.push(user);
      }
      const sorted = list.sort((a, b) => (b.xp || 0) - (a.xp || 0));
      setStudents(sorted);
    }
    loadLeaderboard();
  }, [user]);

  const top1 = students[0];
  const top2 = students[1];
  const top3 = students[2];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Trophy className="w-8 h-8 text-[#C9A227]" /> Coding Club Leaderboard
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Top performers competing for weekly and monthly placement glory.
          </p>
        </div>

        <div className="flex items-center bg-[#151518] border border-white/10 p-1.5 rounded-xl space-x-1">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeframe === 'weekly' ? 'bg-[#C9A227] text-black shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Weekly Ranking
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeframe === 'monthly' ? 'bg-[#C9A227] text-black shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Monthly Ranking
          </button>
        </div>
      </div>

      {students.length === 0 ? (
        <Card className="p-12 text-center space-y-3 border-dashed border-white/10">
          <Trophy className="w-12 h-12 text-[#C9A227]/40 mx-auto" />
          <h3 className="text-lg font-bold text-white">The leaderboard will appear once students begin completing tasks.</h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Solve daily challenges to earn XP, level up, and secure your place on the top podium.
          </p>
        </Card>
      ) : (
        <>
          {/* Animated 3D Podium for Top 3 */}
          {top1 && (
            <div className="flex items-end justify-center gap-4 md:gap-8 pt-10 pb-6">
              {/* 2nd Place (Silver) */}
              {top2 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-3 flex flex-col items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={top2.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'}
                      alt={top2.displayName}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover ring-2 ring-slate-400 shadow-xl"
                    />
                    <span className="absolute -top-3 w-6 h-6 rounded-full bg-slate-400 text-black font-extrabold text-xs flex items-center justify-center shadow-md">
                      2
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white max-w-[100px] truncate text-center">{top2.displayName}</p>
                  <p className="text-xs font-mono font-bold text-slate-300">{top2.xp || 0} XP</p>
                  <div className="w-24 md:w-32 h-36 mt-3 rounded-t-2xl bg-gradient-to-t from-[#151518] to-slate-500/20 border-t-2 border-slate-400 flex items-center justify-center">
                    <Award className="w-8 h-8 text-slate-400" />
                  </div>
                </motion.div>
              )}

              {/* 1st Place (Gold Winner) */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <Crown className="w-8 h-8 text-[#C9A227] animate-bounce mb-1" />
                <div className="relative mb-3 flex flex-col items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={top1.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={top1.displayName}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover ring-4 ring-[#C9A227] shadow-[0_0_30px_rgba(201,162,39,0.4)]"
                  />
                  <span className="absolute -top-3 w-7 h-7 rounded-full bg-[#C9A227] text-black font-black text-sm flex items-center justify-center shadow-lg">
                    1
                  </span>
                </div>
                <p className="text-base font-extrabold text-white max-w-[120px] truncate text-center">{top1.displayName}</p>
                <p className="text-sm font-mono font-black text-[#C9A227]">{top1.xp || 0} XP</p>
                <div className="w-28 md:w-36 h-48 mt-3 rounded-t-2xl bg-gradient-to-t from-[#151518] to-[#C9A227]/30 border-t-4 border-[#C9A227] flex items-center justify-center shadow-[0_0_30px_rgba(201,162,39,0.15)]">
                  <Trophy className="w-10 h-10 text-[#C9A227]" />
                </div>
              </motion.div>

              {/* 3rd Place (Bronze) */}
              {top3 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-3 flex flex-col items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={top3.avatarUrl || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'}
                      alt={top3.displayName}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover ring-2 ring-amber-700 shadow-xl"
                    />
                    <span className="absolute -top-3 w-6 h-6 rounded-full bg-amber-700 text-white font-extrabold text-xs flex items-center justify-center shadow-md">
                      3
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white max-w-[100px] truncate text-center">{top3.displayName}</p>
                  <p className="text-xs font-mono font-bold text-amber-500">{top3.xp || 0} XP</p>
                  <div className="w-24 md:w-32 h-28 mt-3 rounded-t-2xl bg-gradient-to-t from-[#151518] to-amber-900/20 border-t-2 border-amber-700 flex items-center justify-center">
                    <Award className="w-8 h-8 text-amber-700" />
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Leaderboard Table */}
          <Card className="p-0 overflow-hidden border border-white/10">
            <div className="px-6 py-4 bg-[#111113] border-b border-white/10 flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <span>Rank &amp; Student</span>
              <div className="flex items-center space-x-12">
                <span>Level</span>
                <span>Streak</span>
                <span>Tasks</span>
                <span>Total XP</span>
              </div>
            </div>

            <div className="divide-y divide-white/5">
              {students.map((student, idx) => {
                const isCurrentUser = user?.uid === student.uid;
                return (
                  <div
                    key={student.uid}
                    className={`px-6 py-4 flex items-center justify-between transition-colors ${
                      isCurrentUser
                        ? 'bg-[#1e1b10] border-l-4 border-[#C9A227]'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="w-6 text-center font-mono font-bold text-zinc-400 text-sm">
                        #{idx + 1}
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
                        alt={student.displayName}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          {student.displayName}
                          {isCurrentUser && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-[#C9A227] text-black font-extrabold">
                              YOU
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-zinc-500">{student.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-12 text-sm font-mono">
                      <span className="text-zinc-300">Lvl {student.level || 1}</span>
                      <span className="text-amber-400 flex items-center gap-1 font-bold">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" /> {student.currentStreak || 0}d
                      </span>
                      <span className="text-zinc-300">{student.tasksCompletedCount || 0}</span>
                      <span className="text-[#C9A227] font-extrabold flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 fill-[#C9A227]" /> {student.xp || 0} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
