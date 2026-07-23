'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchTopics, fetchMaterials } from '@/services/firebaseService';
import { StudyTopic, StudyMaterial } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import {
  BookOpen,
  Search,
  Bookmark,
  ExternalLink,
  Download,
  FileText,
  Video,
  Code,
} from 'lucide-react';

export default function StudyMaterialsPage() {
  const [topics, setTopics] = useState<StudyTopic[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { bookmarkedIds, toggleBookmark } = useAppStore();

  useEffect(() => {
    async function loadMaterials() {
      const tList = await fetchTopics();
      const mList = await fetchMaterials();
      setTopics(tList);
      setMaterials(mList);
    }
    loadMaterials();
  }, []);

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'youtube':
        return <Video className="w-4 h-4 text-rose-500" />;
      case 'leetcode':
        return <Code className="w-4 h-4 text-amber-500" />;
      case 'pdf':
        return <FileText className="w-4 h-4 text-[#C9A227]" />;
      default:
        return <BookOpen className="w-4 h-4 text-cyan-400" />;
    }
  };

  const filteredMaterials = materials.filter((item) => {
    const matchesTopic = selectedTopicId === 'all' || item.topicId === selectedTopicId;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTopic && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#C9A227]" /> DSA &amp; Placement Study Materials
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Curated PDFs, YouTube lectures, documentation, and LeetCode problem paths.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topic or material..."
            className="w-full bg-[#151518] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A227]"
          />
        </div>
      </div>

      {/* Topic Filter Pills */}
      {topics.length > 0 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedTopicId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTopicId === 'all'
                ? 'bg-[#C9A227] text-black shadow-[0_0_15px_rgba(201,162,39,0.3)]'
                : 'bg-[#151518] text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            All Topics
          </button>
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTopicId(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTopicId === t.id
                  ? 'bg-[#C9A227] text-black shadow-[0_0_15px_rgba(201,162,39,0.3)]'
                  : 'bg-[#151518] text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      {/* Materials Cards Grid / Empty State */}
      {filteredMaterials.length === 0 ? (
        <Card className="p-12 text-center space-y-3 border-dashed border-white/10">
          <BookOpen className="w-10 h-10 text-[#C9A227]/40 mx-auto" />
          <h3 className="text-lg font-bold text-white">No study materials available.</h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Study resources and PDF documents will appear here once uploaded by the administrator.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((mat) => {
            const isBookmarked = bookmarkedIds.includes(mat.id);

            return (
              <Card key={mat.id} className="flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                        {getProviderIcon(mat.provider)}
                      </span>
                      <Badge variant="gold">{mat.provider}</Badge>
                    </div>
                    <button
                      onClick={() => toggleBookmark(mat.id)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-[#C9A227] transition-colors"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${isBookmarked ? 'text-[#C9A227] fill-[#C9A227]' : ''}`}
                      />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-[#FAFAFA] mb-2 line-clamp-1">{mat.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {mat.description || 'Verified study resource for campus placement prep.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <a href={mat.url} target="_blank" rel="noreferrer" className="flex-1">
                    <Button variant="glass" size="sm" className="w-full">
                      <ExternalLink className="w-3.5 h-3.5 mr-1" /> Open Resource
                    </Button>
                  </a>
                  {mat.type === 'pdf' && (
                    <a href={mat.url} download>
                      <Button variant="outline" size="sm">
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </a>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
