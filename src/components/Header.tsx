import React from 'react';
import {
  PanelLeft,
  Plus,
  Sparkles,
  Globe,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  Database,
  Bot,
  Terminal,
  Building2,
  Download,
} from 'lucide-react';

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onNewChat: () => void;
  activeTab: 'chat' | 'knowledge' | 'crawler' | 'supabase';
  onTabChange: (tab: 'chat' | 'knowledge' | 'crawler' | 'supabase') => void;
  apiKeyStatus: 'checking' | 'active' | 'missing';
  onCheckHealth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  onNewChat,
  activeTab,
  onTabChange,
  apiKeyStatus,
  onCheckHealth,
}) => {
  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 flex items-center justify-between sticky top-0 z-20 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-none flex items-center gap-1.5">
              Govt Poly Proddatur AI
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                RAG Chatbot
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
              Official College Knowledge Base & Crawler
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="hidden md:flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
        <button
          onClick={() => onTabChange('chat')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
            activeTab === 'chat'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>AI Chatbot</span>
        </button>

        <button
          onClick={() => onTabChange('knowledge')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
            activeTab === 'knowledge'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Knowledge Base</span>
        </button>

        <button
          onClick={() => onTabChange('crawler')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
            activeTab === 'crawler'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Web Crawler</span>
        </button>

        <button
          onClick={() => onTabChange('supabase')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
            activeTab === 'supabase'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Supabase SQL</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Health Check Badge */}
        <button
          onClick={onCheckHealth}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
            apiKeyStatus === 'active'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50'
              : apiKeyStatus === 'missing'
              ? 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50'
              : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
          }`}
          title="Gemini Backend Status"
        >
          {apiKeyStatus === 'active' ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>RAG Active</span>
            </>
          ) : apiKeyStatus === 'missing' ? (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>API Key Missing</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-400" />
              <span>Checking...</span>
            </>
          )}
        </button>

        {/* Download ZIP button */}
        <a
          href="/api/download-zip"
          download="govt-poly-proddatur-rag.zip"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
          title="Download complete project source code ZIP"
        >
          <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>ZIP</span>
        </a>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="p-1.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center justify-center"
          title="Start New Chat"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
