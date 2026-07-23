'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { fetchTopics, fetchMaterials, uploadFileToFirebaseStorage } from '@/services/firebaseService';
import { StudyTopic, StudyMaterial, MaterialProvider } from '@/types';
import {
  BookOpen,
  Plus,
  Search,
  FileText,
  Video,
  Code,
  FolderTree,
  ExternalLink,
  Trash2,
  Edit2,
  CheckCircle2,
} from 'lucide-react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function AdminMaterialsPage() {
  const [topics, setTopics] = useState<StudyTopic[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states inside modal
  const [title, setTitle] = useState('');
  const [materialType, setMaterialType] = useState<'pdf' | 'link'>('link');
  const [url, setUrl] = useState('');
  const [provider, setProvider] = useState<MaterialProvider>('leetcode');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [topicIdForForm, setTopicIdForForm] = useState('');

  useEffect(() => {
    async function loadData() {
      const tList = await fetchTopics();
      const mList = await fetchMaterials();
      setTopics(tList);
      setMaterials(mList);
      if (tList.length > 0) setTopicIdForForm(tList[0].id);
    }
    loadData();
  }, []);

  const totalPdfs = materials.filter((m) => m.type === 'pdf').length;
  const totalLinks = materials.filter((m) => m.type === 'link').length;

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let finalUrl = url;
      if (materialType === 'pdf' && file) {
        finalUrl = await uploadFileToFirebaseStorage(file, 'materials');
      }

      const newMaterial: StudyMaterial = {
        id: `mat-${Date.now()}`,
        topicId: topicIdForForm || topics[0]?.id || 'topic-arrays',
        title,
        type: materialType,
        url: finalUrl || 'https://leetcode.com',
        provider: materialType === 'pdf' ? 'pdf' : provider,
        uploadDate: new Date().toISOString(),
        createdBy: 'Admin',
        description,
      };

      await setDoc(doc(db, 'materials', newMaterial.id), newMaterial);
      setMaterials([newMaterial, ...materials]);
      setIsModalOpen(false);
      setTitle('');
      setUrl('');
      setDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (matId: string) => {
    try {
      await deleteDoc(doc(db, 'materials', matId));
      setMaterials(materials.filter((m) => m.id !== matId));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredMaterials = materials.filter((m) => {
    const matchesTopic = selectedTopicId === 'all' || m.topicId === selectedTopicId;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTopic && matchesSearch;
  });

  return (
    <div className="space-y-8 relative pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#C9A227]" /> Study Materials Management
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Organize DSA topics, upload PDF notes, and curate technical placement links.
          </p>
        </div>

        <Button variant="gold" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Upload Resource
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="space-y-1">
          <span className="text-xs text-zinc-400 font-bold uppercase">Topics</span>
          <p className="text-3xl font-extrabold text-white font-mono">{topics.length}</p>
        </Card>

        <Card className="space-y-1">
          <span className="text-xs text-zinc-400 font-bold uppercase">PDF Notes</span>
          <p className="text-3xl font-extrabold text-[#C9A227] font-mono">{totalPdfs}</p>
        </Card>

        <Card className="space-y-1">
          <span className="text-xs text-zinc-400 font-bold uppercase">External Links</span>
          <p className="text-3xl font-extrabold text-emerald-400 font-mono">{totalLinks}</p>
        </Card>

        <Card className="space-y-1">
          <span className="text-xs text-zinc-400 font-bold uppercase">Total Resources</span>
          <p className="text-3xl font-extrabold text-white font-mono">{materials.length}</p>
        </Card>
      </div>

      {/* Topic Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-[#C9A227]" /> DSA &amp; Computer Science Topics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setSelectedTopicId('all')}
            className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
              selectedTopicId === 'all'
                ? 'bg-[#C9A227] text-black border-[#C9A227] shadow-lg'
                : 'bg-[#151518] text-white border-white/10 hover:border-[#C9A227]/40'
            }`}
          >
            All Resources ({materials.length})
          </button>
          {topics.map((topic) => {
            const count = materials.filter((m) => m.topicId === topic.id).length;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                  selectedTopicId === topic.id
                    ? 'bg-[#C9A227] text-black border-[#C9A227] shadow-lg'
                    : 'bg-[#151518] text-white border-white/10 hover:border-[#C9A227]/40'
                }`}
              >
                <span className="block truncate">{topic.name}</span>
                <span className="text-[10px] opacity-75 font-mono">{count} items</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resource Table */}
      <Card className="p-0 overflow-hidden border border-white/10 space-y-0">
        <div className="p-4 bg-[#111113] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-sm font-bold text-white">Active Resources</span>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resource title..."
              className="w-full bg-[#151518] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A227]"
            />
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {filteredMaterials.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">No study materials found.</div>
          ) : (
            filteredMaterials.map((m) => (
              <div key={m.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#C9A227]">
                    {m.type === 'pdf' ? <FileText className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{m.title}</h4>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <Badge variant="gold">{m.provider}</Badge>
                      <span className="text-[10px] text-zinc-500 uppercase">{m.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <a href={m.url} target="_blank" rel="noreferrer">
                    <Button variant="glass" size="sm">
                      <ExternalLink className="w-3.5 h-3.5 mr-1" /> View
                    </Button>
                  </a>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37] text-black font-black text-2xl flex items-center justify-center shadow-[0_0_30px_rgba(201,162,39,0.5)] hover:scale-110 active:scale-95 transition-all"
        title="Upload Resource Modal"
      >
        +
      </button>

      {/* Modal Upload Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Study Resource">
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">Target Topic</label>
            <select
              value={topicIdForForm}
              onChange={(e) => setTopicIdForForm(e.target.value)}
              className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
            >
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">Resource Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dynamic Programming Cheatsheet"
              className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMaterialType('link')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                materialType === 'link' ? 'bg-[#C9A227] text-black' : 'bg-[#111113] text-zinc-400 border border-white/10'
              }`}
            >
              External Link
            </button>
            <button
              type="button"
              onClick={() => setMaterialType('pdf')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                materialType === 'pdf' ? 'bg-[#C9A227] text-black' : 'bg-[#111113] text-zinc-400 border border-white/10'
              }`}
            >
              PDF File
            </button>
          </div>

          {materialType === 'link' ? (
            <>
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Provider Platform</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as MaterialProvider)}
                  className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
                >
                  <option value="leetcode">LeetCode / NeetCode</option>
                  <option value="github">GitHub</option>
                  <option value="youtube">YouTube</option>
                  <option value="gfg">GeeksForGeeks</option>
                  <option value="docs">Documentation</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Resource URL</label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Select PDF File</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-zinc-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#C9A227] file:text-black hover:file:bg-[#D4AF37]"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short details..."
              className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <Button type="submit" variant="gold" className="w-full" isLoading={isUploading}>
            Publish Resource to Students
          </Button>
        </form>
      </Modal>
    </div>
  );
}
