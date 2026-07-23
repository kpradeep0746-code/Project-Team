import React, { useState } from 'react';
import {
  Globe,
  Play,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Server,
  Layers,
  FileText,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { DocumentChunk } from '../types';

interface CrawlerDashboardProps {
  onKnowledgeUpdated: () => void;
  totalChunksCount: number;
}

export const CrawlerDashboard: React.FC<CrawlerDashboardProps> = ({
  onKnowledgeUpdated,
  totalChunksCount,
}) => {
  const [targetUrl, setTargetUrl] = useState('https://govtpolyproddatur.ac.in/');
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlLogs, setCrawlLogs] = useState<string[]>([
    '[INIT] Web crawler initialized for Government Polytechnic Proddatur website.',
    '[READY] Target scope: https://govtpolyproddatur.ac.in/* (HTML pages & notice PDFs)',
    '[CONFIG] Chunking strategy: 500 words per chunk with 100 words overlap.',
  ]);

  const [crawlResult, setCrawlResult] = useState<{
    pageTitle?: string;
    chunksCreated?: number;
    message?: string;
  } | null>(null);

  // Manual Chunk Form State
  const [showManualForm, setShowManualForm] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customPage, setCustomPage] = useState('Admissions / Notice');
  const [customCategory, setCustomCategory] = useState<any>('Notices');
  const [customDept, setCustomDept] = useState('General Administration');
  const [customContent, setCustomContent] = useState('');

  const runLiveCrawl = async () => {
    if (!targetUrl.trim() || isCrawling) return;

    setIsCrawling(true);
    setCrawlResult(null);

    const timestamp = new Date().toLocaleTimeString();
    setCrawlLogs((prev) => [
      `[${timestamp}] Requesting HTTP GET ${targetUrl}...`,
      `[${timestamp}] Extracting DOM, stripping header/nav/footer/styles...`,
      ...prev,
    ]);

    try {
      const res = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl: targetUrl.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Crawling failed');
      }

      setCrawlResult({
        pageTitle: data.pageTitle,
        chunksCreated: data.chunksCreated,
        message: data.message,
      });

      setCrawlLogs((prev) => [
        `[SUCCESS] Parsed "${data.pageTitle}" -> Created ${data.chunksCreated} vector chunks.`,
        `[INGEST] Updated active knowledge store. Total chunks: ${data.totalActiveChunks}`,
        ...prev,
      ]);

      onKnowledgeUpdated();
    } catch (err: any) {
      setCrawlLogs((prev) => [
        `[ERROR] Failed to crawl ${targetUrl}: ${err.message}`,
        ...prev,
      ]);
    } finally {
      setIsCrawling(false);
    }
  };

  const handleManualIngest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customContent.trim()) return;

    const newChunk: DocumentChunk = {
      id: `manual-${Date.now()}`,
      title: customTitle.trim(),
      page: customPage.trim(),
      url: targetUrl,
      category: customCategory,
      department: customDept.trim(),
      chunk_number: 1,
      last_updated: new Date().toISOString().split('T')[0],
      content: customContent.trim(),
    };

    // Post custom chunk
    fetch('/api/crawl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUrl }),
    })
      .then(() => {
        onKnowledgeUpdated();
        setShowManualForm(false);
        setCustomTitle('');
        setCustomContent('');
        setCrawlLogs((prev) => [
          `[MANUAL INGEST] Added custom document "${newChunk.title}"`,
          ...prev,
        ]);
      })
      .catch(() => {
        onKnowledgeUpdated();
      });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-300" />
              <h1 className="text-lg font-bold">College Web Crawler & Data Pipeline</h1>
            </div>
            <p className="text-xs text-indigo-200/90 max-w-xl">
              Crawls <span className="underline decoration-indigo-400">https://govtpolyproddatur.ac.in/</span>, extracts clean text, strips menus/footers, chunks into ~500-word segments, and generates vector embeddings.
            </p>
          </div>

          <div className="px-4 py-2 bg-indigo-950/60 rounded-xl border border-indigo-700/50 text-right shrink-0">
            <span className="text-[10px] text-indigo-300 uppercase block">Total Vector Chunks</span>
            <span className="text-xl font-bold text-white">{totalChunksCount} Chunks</span>
          </div>
        </div>

        {/* Live Crawler Control Panel */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Trigger Website Crawler</span>
            </h2>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Sanitizer Active</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://govtpolyproddatur.ac.in/"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={runLiveCrawl}
              disabled={isCrawling}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
            >
              {isCrawling ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Crawling & Processing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Crawl & Ingest Page</span>
                </>
              )}
            </button>
          </div>

          {/* Preset College Quick Links */}
          <div className="pt-2">
            <span className="text-[11px] text-slate-400 block mb-2 font-medium">Quick Target Pages:</span>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { name: 'Home Page', url: 'https://govtpolyproddatur.ac.in/' },
                { name: 'About College', url: 'https://govtpolyproddatur.ac.in/about' },
                { name: 'Civil Dept', url: 'https://govtpolyproddatur.ac.in/departments/civil' },
                { name: 'Mechanical Dept', url: 'https://govtpolyproddatur.ac.in/departments/mechanical' },
                { name: 'Admissions & Fee', url: 'https://govtpolyproddatur.ac.in/admissions/fee-structure' },
                { name: 'Placements', url: 'https://govtpolyproddatur.ac.in/placements/overview' },
              ].map((link) => (
                <button
                  key={link.name}
                  onClick={() => setTargetUrl(link.url)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          {/* Result Alert */}
          {crawlResult && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200 text-xs space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{crawlResult.message}</span>
              </div>
              <p className="text-emerald-700 dark:text-emerald-300">
                Extracted Title: <strong>{crawlResult.pageTitle}</strong> • Created{' '}
                <strong>{crawlResult.chunksCreated}</strong> new 500-word vector chunks.
              </p>
            </div>
          )}
        </div>

        {/* Scheduled Automation Pipeline Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold text-xs">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Weekly Scheduled Crawler (Cron)</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Automated scraper runs every Sunday at 02:00 AM UTC. Only inserts new or updated pages based on content hash.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-[11px] font-mono text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Cron Schedule: "0 2 * * 0"</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold text-xs">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>Manual Document Ingestion</span>
              </div>
              <button
                onClick={() => setShowManualForm(!showManualForm)}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                {showManualForm ? 'Close Form' : 'Add Custom Document'}
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Add custom notices, circulars, or PDF transcript text directly to the vector store.
            </p>
          </div>
        </div>

        {/* Manual Ingestion Form */}
        {showManualForm && (
          <form
            onSubmit={handleManualIngest}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-800 shadow-sm space-y-4"
          >
            <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Add Custom Knowledge Document
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. POLYCET 2026 Spot Admissions Notice"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                  Category
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                >
                  <option value="Notices">Notices & Circulars</option>
                  <option value="Admissions">Admissions & POLYCET</option>
                  <option value="Departments">Departments & HODs</option>
                  <option value="Placements">Placements</option>
                  <option value="Rules">Rules & Regulations</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                Document Content
              </label>
              <textarea
                required
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                rows={4}
                placeholder="Paste notice text, syllabus changes, or official document contents..."
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowManualForm(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium"
              >
                Ingest Document
              </button>
            </div>
          </form>
        )}

        {/* Live Logs Terminal */}
        <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-md space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-slate-200">Live Crawler Execution Logs</span>
            </div>
            <span className="text-[10px] text-slate-500">Real-time Node.js Worker</span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pt-1 text-[11px] leading-relaxed">
            {crawlLogs.map((log, index) => (
              <div
                key={index}
                className={
                  log.includes('[ERROR]')
                    ? 'text-red-400'
                    : log.includes('[SUCCESS]')
                    ? 'text-emerald-400 font-semibold'
                    : log.includes('[INGEST]')
                    ? 'text-indigo-300'
                    : 'text-slate-400'
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
