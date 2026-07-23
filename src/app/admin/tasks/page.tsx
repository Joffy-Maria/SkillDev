'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { fetchTasks, createTaskInFirestore, deleteTaskInFirestore } from '@/services/firebaseService';
import { TaskItem, TaskDifficulty, TaskType } from '@/types';
import { CheckSquare, Plus, Trash2, Zap, Clock, Calendar } from 'lucide-react';

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Task Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TaskType>('daily');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('medium');
  const [deadline, setDeadline] = useState('2026-07-30');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);

  useEffect(() => {
    async function loadTasks() {
      const list = await fetchTasks();
      setTasks(list);
    }
    loadTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const xpMap: Record<TaskDifficulty, number> = { easy: 10, medium: 20, hard: 40 };

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title,
      description,
      type,
      difficulty,
      xpReward: xpMap[difficulty],
      deadline,
      estimatedMinutes,
      createdBy: 'Admin',
      createdAt: new Date().toISOString(),
    };

    await createTaskInFirestore(newTask);
    setTasks([newTask, ...tasks]);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleDelete = async (taskId: string) => {
    await deleteTaskInFirestore(taskId);
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-[#C9A227]" /> Task &amp; Challenge Management
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Create, modify, or retire daily &amp; weekly coding tasks for students.
          </p>
        </div>

        <Button variant="gold" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-1" /> Create Task
        </Button>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((t) => (
          <Card key={t.id} className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge variant={t.difficulty}>{t.difficulty}</Badge>
                  <Badge variant={t.type === 'daily' ? 'daily' : 'weekly'}>{t.type}</Badge>
                </div>
                <span className="text-xs font-mono font-bold text-[#C9A227]">+{t.xpReward} XP</span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">{t.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{t.description}</p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-mono">Deadline: {t.deadline || 'Jul 30'}</span>
              <button
                onClick={() => handleDelete(t.id)}
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Placement Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">Task Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Reverse Nodes in k-Group"
              className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">Problem Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description &amp; constraints..."
              className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Task Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TaskType)}
                className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
              >
                <option value="daily">Daily Task</option>
                <option value="weekly">Weekly Task</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as TaskDifficulty)}
                className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
              >
                <option value="easy">Easy (+10 XP)</option>
                <option value="medium">Medium (+20 XP)</option>
                <option value="hard">Hard (+40 XP)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Estimated Minutes</label>
              <input
                type="number"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Deadline Date</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
              />
            </div>
          </div>

          <Button type="submit" variant="gold" className="w-full mt-2">
            Publish Task to Students
          </Button>
        </form>
      </Modal>
    </div>
  );
}
