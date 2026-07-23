'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { fetchTasks, createTaskInSupabase, deleteTaskInSupabase } from '@/services/supabaseService';
import { TaskItem, TaskDifficulty, TaskType, CategoryType } from '@/types';
import { CheckSquare, Plus, Trash2, Zap, Clock } from 'lucide-react';

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('dsa');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('medium');
  const [type, setType] = useState<TaskType>('daily');
  const [xpReward, setXpReward] = useState(20);
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    async function loadTasks() {
      const list = await fetchTasks();
      setTasks(list);
    }
    loadTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title,
      description,
      category,
      difficulty,
      type,
      xpReward: Number(xpReward),
      deadline: deadline || 'Today midnight',
      isArchived: false,
      createdBy: 'Admin',
      createdAt: new Date().toISOString(),
    };

    await createTaskInSupabase(newTask);
    setTasks([newTask, ...tasks]);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTaskInSupabase(taskId);
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-[#C9A227]" /> Task Management
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Assign coding challenges, set difficulty levels, and manage placement tasks.
          </p>
        </div>

        <Button variant="gold" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Create New Task
        </Button>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <Card className="p-12 text-center space-y-3 border-dashed border-white/10">
          <CheckSquare className="w-10 h-10 text-[#C9A227]/40 mx-auto" />
          <h3 className="text-lg font-bold text-white">No tasks created yet.</h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Click &quot;Create New Task&quot; above to create the first coding challenge for students.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((t) => (
            <Card key={t.id} className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant={t.difficulty}>{t.difficulty}</Badge>
                    <Badge variant={t.type === 'daily' ? 'daily' : 'weekly'}>{t.type}</Badge>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#C9A227] flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> +{t.xpReward} XP
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1">{t.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{t.description}</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {t.deadline}
                </span>

                <button
                  onClick={() => handleDeleteTask(t.id)}
                  className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete Task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">Task Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Reverse a Linked List"
              className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Problem statement and constraints..."
              className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">XP Reward</label>
              <input
                type="number"
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
                className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Deadline</label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="e.g. Today 11:59 PM"
                className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
              />
            </div>
          </div>

          <Button type="submit" variant="gold" className="w-full">
            Publish Task to Students
          </Button>
        </form>
      </Modal>
    </div>
  );
}
