'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchAllStudents } from '@/services/firebaseService';
import { UserProfile } from '@/types';
import { Users, Search, Flame, Zap } from 'lucide-react';
import { Modal } from '@/components/ui/modal';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [inspectStudent, setInspectStudent] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function loadData() {
      const list = await fetchAllStudents();
      setStudents(list);
    }
    loadData();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.displayName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-[#C9A227]" /> Student Roster &amp; Progress Inspector
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Monitor student engagement, XP progression, streaks, and individual problem solving history.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student by name or email..."
            className="w-full bg-[#151518] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A227]"
          />
        </div>
      </div>

      {/* Roster Table / Empty State */}
      <Card className="p-0 overflow-hidden border border-white/10">
        <div className="px-6 py-4 bg-[#111113] border-b border-white/10 flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
          <span>Student</span>
          <div className="flex items-center space-x-12">
            <span>Level</span>
            <span>Streak</span>
            <span>Tasks Done</span>
            <span>Total XP</span>
            <span>Action</span>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">
              No students have registered yet.
            </div>
          ) : (
            filtered.map((s) => (
              <div key={s.uid} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center space-x-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
                    alt={s.displayName}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{s.displayName}</h4>
                    <p className="text-xs text-zinc-500">{s.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-12 text-sm font-mono">
                  <span className="text-zinc-300">Lvl {s.level || 1}</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" /> {s.currentStreak || 0}d
                  </span>
                  <span className="text-zinc-300">{s.tasksCompletedCount || 0}</span>
                  <span className="text-[#C9A227] font-extrabold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-[#C9A227]" /> {s.xp || 0} XP
                  </span>
                  <Button variant="glass" size="sm" onClick={() => setInspectStudent(s)}>
                    Inspect
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Student Inspector Modal */}
      <Modal isOpen={!!inspectStudent} onClose={() => setInspectStudent(null)} title={inspectStudent?.displayName || 'Student Profile'}>
        {inspectStudent && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-[#111113] border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={inspectStudent.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
                alt={inspectStudent.displayName}
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-[#C9A227]"
              />
              <div>
                <h3 className="text-base font-bold text-white">{inspectStudent.displayName}</h3>
                <p className="text-xs text-zinc-400">{inspectStudent.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="gold">Level {inspectStudent.level || 1}</Badge>
                  <span className="text-xs text-[#C9A227] font-mono font-bold">{inspectStudent.xp || 0} XP</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                <span className="text-xs text-zinc-400 block">Current Streak</span>
                <span className="text-lg font-bold text-white font-mono">{inspectStudent.currentStreak || 0} Days 🔥</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                <span className="text-xs text-zinc-400 block">Tasks Solved</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">{inspectStudent.tasksCompletedCount || 0}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
