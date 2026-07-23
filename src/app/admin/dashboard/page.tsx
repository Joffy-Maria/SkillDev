'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchAllStudents, fetchTasks, fetchTopics, fetchMaterials } from '@/services/supabaseService';
import { UserProfile, TaskItem, StudyTopic, StudyMaterial } from '@/types';
import { Shield, Users, CheckSquare, Zap, Plus, Award, BookOpen, FolderTree } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [topics, setTopics] = useState<StudyTopic[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);

  useEffect(() => {
    async function loadData() {
      const sList = await fetchAllStudents();
      const tList = await fetchTasks();
      const topList = await fetchTopics();
      const mList = await fetchMaterials();
      setStudents(sList);
      setTasks(tList);
      setTopics(topList);
      setMaterials(mList);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-[#C9A227]/20 text-[#C9A227] text-xs font-bold uppercase tracking-widest border border-[#C9A227]/30 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Admin Control Center
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-2 tracking-tight">
            Welcome to SkillDev Admin Control Center
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage coding club placement tasks, student rosters, topics, and study materials.
          </p>
        </div>

        {/* Admin Quick Action Controls */}
        <div className="flex items-center space-x-3">
          <Link href="/admin/tasks">
            <Button variant="gold" size="sm">
              <Plus className="w-4 h-4 mr-1" /> Create Task
            </Button>
          </Link>
          <Link href="/admin/materials">
            <Button variant="glass" size="sm">
              <BookOpen className="w-4 h-4 mr-1 text-[#C9A227]" /> Upload Material
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase">
            <span>Registered Students</span>
            <Users className="w-4 h-4 text-[#C9A227]" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{students.length}</p>
          <p className="text-xs text-zinc-500">Active student accounts</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase">
            <span>Tasks Created</span>
            <CheckSquare className="w-4 h-4 text-[#C9A227]" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{tasks.length}</p>
          <p className="text-xs text-zinc-500">Daily &amp; weekly tasks</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase">
            <span>Study Topics</span>
            <FolderTree className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{topics.length}</p>
          <p className="text-xs text-zinc-500">Active curriculum topics</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase">
            <span>Resources Uploaded</span>
            <BookOpen className="w-4 h-4 text-[#C9A227]" />
          </div>
          <p className="text-3xl font-extrabold text-[#C9A227] font-mono">{materials.length}</p>
          <p className="text-xs text-zinc-500">PDFs &amp; external links</p>
        </Card>
      </div>

      {/* Task Management Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[#C9A227]" /> Active Placement Tasks ({tasks.length})
            </h3>
            <Link href="/admin/tasks" className="text-xs text-[#C9A227] font-semibold hover:underline">
              Manage All Tasks &rarr;
            </Link>
          </div>

          {tasks.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-sm font-bold text-zinc-400">No tasks created yet.</p>
              <p className="text-xs text-zinc-500">Click &quot;Create Task&quot; to assign the first challenge to students.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl bg-[#111113] border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={t.difficulty}>{t.difficulty}</Badge>
                      <Badge variant={t.type === 'daily' ? 'daily' : 'weekly'}>{t.type}</Badge>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#C9A227]">+{t.xpReward} XP</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Admin Actions */}
        <Card className="space-y-4">
          <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
            Admin Quick Management
          </h3>

          <div className="space-y-3">
            <Link href="/admin/tasks">
              <div className="p-3 rounded-xl bg-white/5 hover:bg-[#C9A227]/15 border border-white/5 hover:border-[#C9A227]/40 transition-all flex items-center space-x-3 cursor-pointer">
                <Plus className="w-5 h-5 text-[#C9A227]" />
                <div>
                  <p className="text-xs font-bold text-white">Create New Task</p>
                  <p className="text-[11px] text-zinc-400">Set difficulty, XP, deadline</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/materials">
              <div className="p-3 rounded-xl bg-white/5 hover:bg-[#C9A227]/15 border border-white/5 hover:border-[#C9A227]/40 transition-all flex items-center space-x-3 cursor-pointer">
                <BookOpen className="w-5 h-5 text-[#C9A227]" />
                <div>
                  <p className="text-xs font-bold text-white">Upload Study Materials</p>
                  <p className="text-[11px] text-zinc-400">Modal upload for PDFs &amp; links</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/topics">
              <div className="p-3 rounded-xl bg-white/5 hover:bg-[#C9A227]/15 border border-white/5 hover:border-[#C9A227]/40 transition-all flex items-center space-x-3 cursor-pointer">
                <FolderTree className="w-5 h-5 text-[#C9A227]" />
                <div>
                  <p className="text-xs font-bold text-white">Manage Study Topics</p>
                  <p className="text-[11px] text-zinc-400">Create, rename, or delete topics</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/leaderboard">
              <div className="p-3 rounded-xl bg-white/5 hover:bg-[#C9A227]/15 border border-white/5 hover:border-[#C9A227]/40 transition-all flex items-center space-x-3 cursor-pointer">
                <Award className="w-5 h-5 text-[#C9A227]" />
                <div>
                  <p className="text-xs font-bold text-white">Publish Weekly Performer</p>
                  <p className="text-[11px] text-zinc-400">Spotlight top student</p>
                </div>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
