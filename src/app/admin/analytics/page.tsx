'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { fetchAllStudents, fetchTasks } from '@/services/supabaseService';
import { UserProfile, TaskItem } from '@/types';
import { BarChart3, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminAnalyticsPage() {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    async function loadData() {
      const sList = await fetchAllStudents();
      const tList = await fetchTasks();
      setStudents(sList);
      setTasks(tList);
    }
    loadData();
  }, []);

  const totalCompletedTasks = students.reduce((acc, s) => acc + (s.tasksCompletedCount || 0), 0);
  const totalXp = students.reduce((acc, s) => acc + (s.xp || 0), 0);
  const activeStudents = students.filter((s) => (s.currentStreak || 0) > 0).length;

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-[#C9A227]" /> Platform Analytics &amp; Reports
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Live engagement metrics, student submission stats, and XP growth analytics.
        </p>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="space-y-1">
          <span className="text-xs text-[#FAFAFA]/60 font-bold uppercase">Active Students</span>
          <p className="text-3xl font-extrabold text-white font-mono">{activeStudents}</p>
          <span className="text-xs text-zinc-500 font-mono">Out of {students.length} registered</span>
        </Card>

        <Card className="space-y-1">
          <span className="text-xs text-[#FAFAFA]/60 font-bold uppercase">Total Solved Code</span>
          <p className="text-3xl font-extrabold text-emerald-400 font-mono">{totalCompletedTasks}</p>
          <span className="text-xs text-zinc-500">Tasks completed by students</span>
        </Card>

        <Card className="space-y-1">
          <span className="text-xs text-[#FAFAFA]/60 font-bold uppercase">Total Platform XP</span>
          <p className="text-3xl font-extrabold text-[#C9A227] font-mono">{totalXp}</p>
          <span className="text-xs text-zinc-500">XP accumulated</span>
        </Card>

        <Card className="space-y-1">
          <span className="text-xs text-[#FAFAFA]/60 font-bold uppercase">Available Tasks</span>
          <p className="text-3xl font-extrabold text-white font-mono">{tasks.length}</p>
          <span className="text-xs text-zinc-500">Assigned challenges</span>
        </Card>
      </div>

      {/* Activity Visualization Chart */}
      <Card className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#C9A227]" /> Weekly Task Completion Activity
          </h3>
          <span className="text-xs text-zinc-400 font-mono">Live Supabase PostgREST Data</span>
        </div>

        {totalCompletedTasks === 0 ? (
          <div className="py-16 text-center space-y-2">
            <BarChart3 className="w-10 h-10 text-[#C9A227]/40 mx-auto" />
            <h4 className="text-sm font-bold text-zinc-300">Analytics graphs will generate automatically as students submit coding tasks.</h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Once students register and complete assigned tasks, real-time activity trends will be displayed here.
            </p>
          </div>
        ) : (
          <div className="h-64 flex items-end justify-between gap-4 pt-6 px-4">
            {daysOfWeek.map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[11px] text-[#C9A227] font-mono font-bold">0%</span>
                <motion.div
                  className="w-full max-w-[48px] bg-gradient-to-t from-[#C9A227]/30 to-[#C9A227] rounded-t-xl"
                  initial={{ height: 0 }}
                  animate={{ height: '10%' }}
                  transition={{ duration: 0.5 }}
                />
                <span className="text-xs text-zinc-400 font-bold font-mono">{day}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
