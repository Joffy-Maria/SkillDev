'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculateLevelProgress } from '@/lib/utils';
import {
  Flame,
  Zap,
  Award,
  Code,
  Mail,
  Building,
  GraduationCap,
} from 'lucide-react';

export default function StudentProfilePage() {
  const { user } = useAuth();
  const levelDetails = user ? calculateLevelProgress(user.xp || 0) : null;

  const tasksCount = user?.tasksCompletedCount || 0;
  const currentStreak = user?.currentStreak || 0;
  const xp = user?.xp || 0;

  // Generate 364 days heatmap grid based on real student completions
  const heatmapDays = Array.from({ length: 364 }, (_, i) => {
    if (tasksCount === 0) return 0;
    return i >= 364 - tasksCount ? Math.min(3, Math.max(1, (i % 3) + 1)) : 0;
  });

  const achievements = [
    { title: 'First Solution', desc: 'Solved your 1st coding task', icon: '🚀', unlocked: tasksCount >= 1 },
    { title: '7-Day Streak', desc: 'Maintained 7 consecutive active days', icon: '🔥', unlocked: currentStreak >= 7 },
    { title: 'Century Club', desc: 'Crossed 400 total XP', icon: '⚡', unlocked: xp >= 400 },
    { title: 'DSA Architect', desc: 'Completed 15 DSA challenges', icon: '💎', unlocked: tasksCount >= 15 },
  ];

  return (
    <div className="space-y-8">
      {/* Profile Banner Card */}
      <Card variant="gold" className="relative p-8 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=student'}
            alt={user?.displayName || 'Student'}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-[#C9A227] shadow-2xl"
          />

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">{user?.displayName || 'Student'}</h1>
              <Badge variant="gold">Level {levelDetails?.currentLevel || user?.level || 1}</Badge>
            </div>

            <p className="text-xs text-zinc-400 font-mono flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-3.5 h-3.5 text-[#C9A227]" /> {user?.email}
            </p>

            {(user?.college || user?.year) && (
              <p className="text-xs text-zinc-400 font-mono flex items-center justify-center md:justify-start gap-3">
                {user.college && <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-[#C9A227]" /> {user.college}</span>}
                {user.year && <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5 text-[#C9A227]" /> {user.year}</span>}
              </p>
            )}

            <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed pt-1">
              {user?.bio || 'SkillDev Student preparing for technical placement challenges.'}
            </p>
          </div>

          <div className="flex flex-col items-end justify-center space-y-2 border-l border-white/10 pl-6 hidden md:flex">
            <div className="text-right">
              <span className="text-xs text-zinc-400">Total Experience</span>
              <p className="text-2xl font-extrabold text-white font-mono">{xp} XP</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400">Streak Record</span>
              <p className="text-base font-bold text-[#C9A227] font-mono">{currentStreak} Days 🔥</p>
            </div>
          </div>
        </div>
      </Card>

      {/* GitHub-style Contribution Heatmap */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-[#C9A227]" /> 365-Day Coding Activity Heatmap
          </h3>
          <span className="text-xs text-zinc-400 font-mono">
            {tasksCount} Solved Submissions
          </span>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="grid grid-rows-7 grid-flow-col gap-1.5 w-max">
            {heatmapDays.map((intensity, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-sm transition-all hover:scale-125 ${
                  intensity === 3
                    ? 'bg-[#C9A227] shadow-[0_0_8px_rgba(201,162,39,0.5)]'
                    : intensity === 2
                    ? 'bg-[#C9A227]/60'
                    : intensity === 1
                    ? 'bg-[#C9A227]/25'
                    : 'bg-white/5 border border-white/5'
                }`}
                title={`Day ${i + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2 text-[10px] text-zinc-500 font-mono">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-white/5" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#C9A227]/25" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#C9A227]/60" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#C9A227]" />
          <span>More</span>
        </div>
      </Card>

      {/* Achievements Badges Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-[#C9A227]" /> Unlocked Milestones &amp; Badges
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach, idx) => (
            <Card
              key={idx}
              className={`p-4 border transition-all ${
                ach.unlocked
                  ? 'bg-gradient-to-br from-[#151518] to-[#1e1b10] border-[#C9A227]/40'
                  : 'bg-[#111113] border-white/5 opacity-40'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{ach.icon}</span>
                <div>
                  <h4 className="text-sm font-bold text-white">{ach.title}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">{ach.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
