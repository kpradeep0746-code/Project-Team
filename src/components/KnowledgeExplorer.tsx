import React, { useState } from 'react';
import { Search, Filter, BookOpen, Layers, ExternalLink, Calendar, Tag, Database, Copy, Check } from 'lucide-react';
import { DocumentChunk } from '../types';

interface KnowledgeExplorerProps {
  chunks: DocumentChunk[];
}

export const KnowledgeExplorer: React.FC<KnowledgeExplorerProps> = ({ chunks }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedChunk, setSelectedChunk] = useState<DocumentChunk | null>(chunks[0] || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'General', 'Administration', 'Departments', 'Admissions', 'Placements', 'Facilities', 'Rules'];

  const filteredChunks = chunks.filter((chunk) => {
    const matchesSearch =
      chunk.title.toLowerCase().includes(search.toLowerCase()) ||
      chunk.content.toLowerCase().includes(search.toLowerCase()) ||
      chunk.department.toLowerCase().includes(search.toLowerCase());

    const matchesCat =
      selectedCategory === 'All' || chunk.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-slate-50/50 dark:bg-slate-950">
      {/* Left List Column */}
      <div className="w-full md:w-5/12 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-white dark:bg-slate-900">
        {/* Header Search & Filter */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                College Knowledge Base
              </h2>
            </div>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
              {filteredChunks.length} Chunks
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents, HODs, fees, courses..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Categories Pill Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Chunks List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredChunks.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No matching knowledge chunks found.
            </div>
          ) : (
            filteredChunks.map((chunk) => {
              const isSelected = selectedChunk?.id === chunk.id;
              return (
                <div
                  key={chunk.id}
                  onClick={() => setSelectedChunk(chunk)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {chunk.title}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                      #{chunk.chunk_number}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 line-clamp-2 text-[11px] leading-relaxed mb-2">
                    {chunk.content}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-indigo-500" />
                      {chunk.category} • {chunk.department}
                    </span>
                    <span className="truncate max-w-[100px]">{chunk.page}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Content Viewer Detail */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
        {selectedChunk ? (
          <div className="max-w-3xl mx-auto w-full space-y-6">
            {/* Header info */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 text-xs font-semibold mb-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    {selectedChunk.category}
                  </span>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedChunk.title}
                  </h1>
                </div>

                <button
                  onClick={() => handleCopy(selectedChunk.content, selectedChunk.id)}
                  className="px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 shrink-0"
                >
                  {copiedId === selectedChunk.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Department</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedChunk.department}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Page</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedChunk.page}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Chunk No.</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    #{selectedChunk.chunk_number}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Last Updated</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {selectedChunk.last_updated}
                  </span>
                </div>
              </div>

              {/* Source Link */}
              <div className="pt-3 flex items-center gap-2 text-xs">
                <span className="text-slate-400">Official URL:</span>
                <a
                  href={selectedChunk.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 truncate"
                >
                  <span className="truncate">{selectedChunk.url}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>

            {/* Chunk Body Content */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="font-semibold text-xs text-slate-500 uppercase tracking-wider">
                Extracted Text Content (~500 Words Chunk)
              </h3>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-mono bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
                {selectedChunk.content}
              </div>
            </div>

            {/* Metadata JSON Preview */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Metadata JSON Payload</span>
                </h3>
                <span className="text-[10px] text-slate-400">Embedding: 1536-dim vector ready</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto">
                {JSON.stringify(
                  {
                    id: selectedChunk.id,
                    title: selectedChunk.title,
                    page: selectedChunk.page,
                    url: selectedChunk.url,
                    department: selectedChunk.department,
                    category: selectedChunk.category,
                    chunk_number: selectedChunk.chunk_number,
                    last_updated: selectedChunk.last_updated,
                    word_count: selectedChunk.content.split(' ').length,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        ) : (
          <div className="m-auto text-center text-slate-400 text-sm">
            Select a knowledge chunk from the left panel to inspect details.
          </div>
        )}
      </div>
    </div>
  );
};
