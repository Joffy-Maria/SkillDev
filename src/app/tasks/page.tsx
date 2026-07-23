'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { triggerGoldConfetti } from '@/components/ui/confetti';
import { Modal } from '@/components/ui/modal';
import { fetchTasks, markTaskCompleteInSupabase } from '@/services/supabaseService';
import { TaskItem } from '@/types';
import { CheckSquare, Clock, Code2, CheckCircle2, Zap, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function StudentTasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly' | 'completed'>('all');
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  useEffect(() => {
    async function loadData() {
      const list = await fetchTasks();
      setTasks(list.filter((t) => !t.isArchived));
    }
    loadData();
  }, []);

  const handleMarkCompleted = async (task: TaskItem) => {
    if (!user) return;
    setCompletedTaskIds((prev) => [...prev, task.id]);
    await markTaskCompleteInSupabase(user.uid, task);
    triggerGoldConfetti();
    setSelectedTask(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'daily') return task.type === 'daily';
    if (filter === 'weekly') return task.type === 'weekly';
    if (filter === 'completed') return completedTaskIds.includes(task.id);
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-[#C9A227]" /> Coding Tasks &amp; Challenges
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Solve daily and weekly placement problems to earn XP and level up.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center bg-[#151518] border border-white/10 p-1.5 rounded-xl space-x-1">
          {(['all', 'daily', 'weekly', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? 'bg-[#C9A227] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards Grid */}
      {filteredTasks.length === 0 ? (
        <Card className="p-12 text-center space-y-3 border-dashed border-white/10">
          <CheckSquare className="w-10 h-10 text-[#C9A227]/40 mx-auto" />
          <h3 className="text-lg font-bold text-white">No tasks have been assigned yet.</h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Check back later when administrators assign new coding tasks, or open the Monaco Playground to practice.
          </p>
          <div className="pt-2">
            <Link href="/playground">
              <Button variant="gold" size="sm">
                Open Monaco Playground
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => {
            const isCompleted = completedTaskIds.includes(task.id);

            return (
              <Card key={task.id} className="flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant={task.difficulty}>{task.difficulty}</Badge>
                      <Badge variant={task.type === 'daily' ? 'daily' : 'weekly'}>{task.type}</Badge>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#C9A227] flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-[#C9A227]" /> +{task.xpReward} XP
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{task.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                    {task.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3 text-zinc-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" /> {task.estimatedMinutes || 20}m
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" /> {task.deadline || 'Open'}
                    </span>
                  </div>

                  {isCompleted ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Solved
                    </span>
                  ) : (
                    <Button variant="gold" size="sm" onClick={() => setSelectedTask(task)}>
                      Solve Task
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Task Modal */}
      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title={selectedTask?.title || 'Solve Task'}>
        {selectedTask && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant={selectedTask.difficulty}>{selectedTask.difficulty}</Badge>
              <Badge variant={selectedTask.type === 'daily' ? 'daily' : 'weekly'}>{selectedTask.type}</Badge>
              <span className="text-xs font-mono font-bold text-[#C9A227]">+{selectedTask.xpReward} XP</span>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed">{selectedTask.description}</p>

            <div className="flex flex-col gap-2 pt-2">
              <Button variant="gold" className="w-full" onClick={() => handleMarkCompleted(selectedTask)}>
                Mark Task Completed (+{selectedTask.xpReward} XP)
              </Button>
              <Link href="/playground" className="w-full">
                <Button variant="glass" className="w-full">
                  <Code2 className="w-4 h-4 mr-2 text-[#C9A227]" /> Open Code in Monaco Playground
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
