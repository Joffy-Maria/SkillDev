'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { triggerGoldConfetti } from '@/components/ui/confetti';
import { Modal } from '@/components/ui/modal';
import {
  fetchTasks,
  fetchWeeklyPerformer,
  markTaskCompleteInSupabase,
  fetchUserProgress,
} from '@/services/supabaseService';
import { TaskItem, WeeklyPerformer } from '@/types';
import { calculateLevelProgress } from '@/lib/utils';
import {
  Sparkles,
  Flame,
  Award,
  ArrowRight,
  Code2,
  CheckCircle2,
  Clock,
  Quote,
  Target,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const MOTIVATIONAL_QUOTES = [
  { quote: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { quote: 'Experience is the name everyone gives to their mistakes.', author: 'Oscar Wilde' },
  { quote: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
  { quote: 'Simplicity is prerequisite for reliability.', author: 'Edsger W. Dijkstra' },
];

export default function StudentDashboardPage() {
  const { user, refreshUserProfile } = useAuth();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [performer, setPerformer] = useState<WeeklyPerformer | null>(null);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [activeTaskModal, setActiveTaskModal] = useState<TaskItem | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    async function loadData() {
      const tList = await fetchTasks();
      setTasks(tList);
      const perf = await fetchWeeklyPerformer();
      setPerformer(perf);
      if (user) {
        const completedIds = await fetchUserProgress(user.uid);
        setCompletedTaskIds(completedIds);
      }
    }
    loadData();
    setQuoteIndex(Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));
  }, [user]);

  const handleCompleteTask = async (task: TaskItem) => {
    if (!user) return;
    setCompletedTaskIds((prev) => [...prev, task.id]);
    await markTaskCompleteInSupabase(user.uid, task);
    
    // Refresh user profile in context so the dashboard XP and Level instantly update
    await refreshUserProfile();
    
    triggerGoldConfetti();
    setActiveTaskModal(null);
  };

  const activeTasks = tasks.filter((t) => !t.isArchived);
  const completedCount = activeTasks.filter((t) => completedTaskIds.includes(t.id)).length;
  const progressPercent = activeTasks.length > 0 ? (completedCount / activeTasks.length) * 100 : 0;
  const levelDetails = user ? calculateLevelProgress(user.xp || 0) : null;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-[#C9A227]/10 text-[#C9A227] text-xs font-semibold uppercase tracking-widest border border-[#C9A227]/30">
              SkillDev Workspace
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-2 tracking-tight">
            Welcome to <span className="gold-gradient-text">SkillDev</span> 👋
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Hello {user?.displayName || 'Developer'}, ready to conquer coding challenges?
          </p>
        </div>

        {/* Action Button */}
        <Link href="/playground">
          <Button variant="gold" size="lg" className="shadow-[0_0_25px_rgba(201,162,39,0.3)]">
            <Code2 className="w-5 h-5 mr-2" /> Launch Monaco Playground
          </Button>
        </Link>
      </div>

      {/* Motivational Quote Widget */}
      <Card variant="gold" hoverGlow={false} className="relative overflow-hidden">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-xl bg-[#C9A227]/20 text-[#C9A227] shrink-0">
            <Quote className="w-6 h-6" />
          </div>
          <div>
            <p className="text-base md:text-lg font-medium text-white italic">
              &quot;{MOTIVATIONAL_QUOTES[quoteIndex].quote}&quot;
            </p>
            <p className="text-xs text-[#C9A227] font-semibold mt-1">
              — {MOTIVATIONAL_QUOTES[quoteIndex].author}
            </p>
          </div>
        </div>
      </Card>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Ring Card */}
        <Card className="flex flex-col items-center justify-center p-6 text-center space-y-4">
          <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-[#C9A227]" /> Today&apos;s Completion
          </h3>
          <ProgressRing progress={progressPercent} size={150} label={`${completedCount}/${activeTasks.length}`} sublabel="Tasks Completed" />
          <p className="text-xs text-zinc-400">
            Complete daily tasks to build your <span className="text-[#C9A227] font-bold">{user?.currentStreak || 0}-day streak</span>!
          </p>
        </Card>

        {/* Level & XP Progression */}
        <Card className="flex flex-col justify-between p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Level Status</span>
              <Badge variant="gold">Level {levelDetails?.currentLevel || 1}</Badge>
            </div>
            <h3 className="text-2xl font-extrabold text-white mt-2 font-mono">
              {user?.xp || 0} <span className="text-sm text-[#C9A227] font-normal">XP Total</span>
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Progress to Level {(levelDetails?.currentLevel || 1) + 1}</span>
              <span className="text-white font-mono">{levelDetails?.progressPercent || 0}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]"
                initial={{ width: 0 }}
                animate={{ width: `${levelDetails?.progressPercent || 0}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-[11px] text-zinc-500 text-right">
              {levelDetails?.nextLevelXp || 100} XP needed for next level
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
            <span className="text-zinc-400 flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" /> Current Streak
            </span>
            <span className="font-bold text-white font-mono">{user?.currentStreak || 0} Days</span>
          </div>
        </Card>

        {/* Weekly Performer Spotlight */}
        <Card className="flex flex-col justify-between p-6 bg-gradient-to-br from-[#151518] to-[#1e1a0f] border border-[#C9A227]/30">
          <div className="flex items-center space-x-2 text-[#C9A227] text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" /> Weekly Performer Spotlight
          </div>

          {performer ? (
            <div className="my-3 space-y-2">
              <div className="flex items-center space-x-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={performer.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
                  alt={performer.studentName}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#C9A227]"
                />
                <div>
                  <h4 className="text-base font-bold text-white">{performer.studentName}</h4>
                  <p className="text-xs text-[#C9A227] font-semibold">{performer.weekLabel}</p>
                </div>
              </div>
              <p className="text-xs text-zinc-300 bg-white/5 p-2.5 rounded-xl border border-white/5 italic">
                &quot;{performer.achievementReason}&quot;
              </p>
            </div>
          ) : (
            <div className="my-6 text-center py-6 text-xs text-zinc-500 italic">
              No weekly performer spotlight published yet.
            </div>
          )}

          <Link href="/leaderboard" className="text-xs text-[#C9A227] font-bold flex items-center gap-1 hover:underline">
            View Club Leaderboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Card>
      </div>

      {/* Today's Tasks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C9A227]" /> Assigned Placement Tasks
          </h2>
          <Link href="/tasks" className="text-xs text-[#C9A227] hover:underline font-semibold">
            View All Tasks &rarr;
          </Link>
        </div>

        {activeTasks.length === 0 ? (
          <Card className="p-8 text-center space-y-2 border-dashed border-white/10">
            <p className="text-sm font-bold text-zinc-300">No tasks have been assigned yet.</p>
            <p className="text-xs text-zinc-500">Check back later or launch the Monaco Playground to practice custom problems.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTasks.map((task) => {
              const isCompleted = completedTaskIds.includes(task.id);
              return (
                <Card key={task.id} className="flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={task.difficulty}>{task.difficulty}</Badge>
                      <span className="text-xs font-mono font-bold text-[#C9A227] flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" /> +{task.xpReward} XP
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 line-clamp-1">{task.title}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {task.estimatedMinutes || 20} mins
                    </span>

                    {isCompleted ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Completed
                      </span>
                    ) : (
                      <Button variant="gold" size="sm" onClick={() => setActiveTaskModal(task)}>
                        Solve Task
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Task Solver Trigger Modal */}
      <Modal isOpen={!!activeTaskModal} onClose={() => setActiveTaskModal(null)} title={activeTaskModal?.title || 'Solve Task'}>
        {activeTaskModal && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant={activeTaskModal.difficulty}>{activeTaskModal.difficulty}</Badge>
              <span className="text-xs text-[#C9A227] font-bold font-mono">+{activeTaskModal.xpReward} XP</span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">{activeTaskModal.description}</p>
            <div className="p-3 rounded-xl bg-[#111113] border border-white/10 text-xs font-mono text-zinc-400">
              Deadline: {activeTaskModal.deadline || 'Open'}
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="gold" className="flex-1" onClick={() => handleCompleteTask(activeTaskModal)}>
                Mark Solution Completed &amp; Claim +{activeTaskModal.xpReward} XP
              </Button>
              <Link href="/playground" className="flex-1">
                <Button variant="glass" className="w-full">
                  Open in Monaco Playground
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
