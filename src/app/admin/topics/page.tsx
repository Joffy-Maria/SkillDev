'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { fetchTopics } from '@/services/supabaseService';
import { StudyTopic, CategoryType } from '@/types';
import { FolderTree, Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<StudyTopic[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<StudyTopic | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>('dsa');
  const [description, setDescription] = useState('');

  useEffect(() => {
    async function loadTopics() {
      const list = await fetchTopics();
      setTopics(list);
    }
    loadTopics();
  }, []);

  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const topicId = editingTopic ? editingTopic.id : `topic-${Date.now()}`;
    const newTopic: StudyTopic = {
      id: topicId,
      name,
      category,
      description,
      resourceCount: editingTopic?.resourceCount || 0,
      createdAt: editingTopic?.createdAt || new Date().toISOString(),
    };

    await supabase.from('topics').upsert({
      id: topicId,
      name: newTopic.name,
      category: newTopic.category,
      description: newTopic.description,
      resource_count: newTopic.resourceCount,
      created_at: newTopic.createdAt,
    });

    if (editingTopic) {
      setTopics(topics.map((t) => (t.id === topicId ? newTopic : t)));
    } else {
      setTopics([newTopic, ...topics]);
    }

    setIsModalOpen(false);
    setEditingTopic(null);
    setName('');
    setDescription('');
  };

  const handleDelete = async (topicId: string) => {
    await supabase.from('topics').delete().eq('id', topicId);
    setTopics(topics.filter((t) => t.id !== topicId));
  };

  const openEditModal = (t: StudyTopic) => {
    setEditingTopic(t);
    setName(t.name);
    setCategory(t.category);
    setDescription(t.description);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FolderTree className="w-8 h-8 text-[#C9A227]" /> Study Topics Manager
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Create, rename, or archive curriculum topics for DSA, CS Fundamentals, and System Design.
          </p>
        </div>

        <Button
          variant="gold"
          onClick={() => {
            setEditingTopic(null);
            setName('');
            setDescription('');
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-1" /> Create New Topic
        </Button>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((t) => (
          <Card key={t.id} className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="gold">{t.category.toUpperCase()}</Badge>
                <span className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> {t.resourceCount || 0} resources
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{t.name}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{t.description}</p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-2">
              <Button variant="glass" size="sm" onClick={() => openEditModal(t)}>
                <Edit2 className="w-3.5 h-3.5 mr-1" /> Rename
              </Button>
              <button
                onClick={() => handleDelete(t.id)}
                className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Delete Topic"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTopic(null);
        }}
        title={editingTopic ? 'Rename / Edit Topic' : 'Create Study Topic'}
      >
        <form onSubmit={handleSaveTopic} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">Topic Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dynamic Programming"
              className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryType)}
              className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
            >
              <option value="dsa">Data Structures &amp; Algorithms</option>
              <option value="cs_fundamentals">Computer Science Fundamentals</option>
              <option value="system_design">System Design</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of topics covered..."
              className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <Button type="submit" variant="gold" className="w-full">
            {editingTopic ? 'Save Changes' : 'Create Topic'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
