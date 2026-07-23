'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchAllStudents, publishWeeklyPerformer, fetchWeeklyPerformer } from '@/services/firebaseService';
import { UserProfile, WeeklyPerformer } from '@/types';
import { Trophy, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { triggerGoldConfetti } from '@/components/ui/confetti';

export default function AdminLeaderboardPage() {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [weekLabel, setWeekLabel] = useState('Week 30, July 2026');
  const [achievementReason, setAchievementReason] = useState(
    'Demonstrated exceptional consistency in solving hard DP problems and helping club peers.'
  );
  const [currentPerformer, setCurrentPerformer] = useState<WeeklyPerformer | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    async function loadData() {
      const list = await fetchAllStudents();
      const sorted = list.sort((a, b) => b.xp - a.xp);
      setStudents(sorted);
      if (sorted.length > 0) setSelectedStudentId(sorted[0].uid);
      const perf = await fetchWeeklyPerformer();
      setCurrentPerformer(perf);
    }
    loadData();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.uid === selectedStudentId);
    if (!student) return;

    const newPerformer: WeeklyPerformer = {
      id: `perf-${Date.now()}`,
      studentId: student.uid,
      studentName: student.displayName,
      studentAvatar: student.avatarUrl,
      weekLabel,
      achievementReason,
      publishedAt: new Date().toISOString(),
    };

    await publishWeeklyPerformer(newPerformer);
    setCurrentPerformer(newPerformer);
    triggerGoldConfetti();
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Trophy className="w-8 h-8 text-[#C9A227]" /> Leaderboard &amp; Performer Publisher
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Review top student rankings and publish the Weekly Performer spotlight banner.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Weekly Performer published successfully to all student portals!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <Card className="space-y-4">
          <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
            Select &amp; Publish Spotlight
          </h3>

          <form onSubmit={handlePublish} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Select Student</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
              >
                {students.map((s) => (
                  <option key={s.uid} value={s.uid}>
                    {s.displayName} ({s.xp} XP - Lvl {s.level})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Week Title</label>
              <input
                type="text"
                required
                value={weekLabel}
                onChange={(e) => setWeekLabel(e.target.value)}
                className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Citation Note</label>
              <textarea
                required
                rows={3}
                value={achievementReason}
                onChange={(e) => setAchievementReason(e.target.value)}
                className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
              />
            </div>

            <Button type="submit" variant="gold" className="w-full">
              <Sparkles className="w-4 h-4 mr-2" /> Publish Spotlight Banner
            </Button>
          </form>
        </Card>

        {/* Current Spotlight Card */}
        <Card variant="gold" className="lg:col-span-2 flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center space-x-2 text-[#C9A227] text-xs font-bold uppercase tracking-wider mb-4">
              <Award className="w-4 h-4" /> Active Student Dashboard Spotlight
            </div>

            {currentPerformer ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentPerformer.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={currentPerformer.studentName}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#C9A227] shadow-xl"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">{currentPerformer.studentName}</h3>
                    <p className="text-xs text-[#C9A227] font-semibold">{currentPerformer.weekLabel}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 italic text-sm text-zinc-300 leading-relaxed">
                  &quot;{currentPerformer.achievementReason}&quot;
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 py-8 text-center">No active performer published yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
