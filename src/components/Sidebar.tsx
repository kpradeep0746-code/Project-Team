import React, { useState } from 'react';
import {
  Plus,
  MessageSquare,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  MessageCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { Conversation, SystemPersona } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onClearAll: () => void;
  currentPersona: SystemPersona;
  onOpenPersonaModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onRenameConversation,
  onClearAll,
  currentPersona,
  onOpenPersonaModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const queryTrimmed = searchQuery.trim().toLowerCase();

  const filteredConversations = conversations.filter((c) => {
    if (!queryTrimmed) return true;
    const titleMatch = c.title.toLowerCase().includes(queryTrimmed);
    const contentMatch = c.messages?.some((m) =>
      m.content.toLowerCase().includes(queryTrimmed)
    );
    return titleMatch || contentMatch;
  });

  const getSnippet = (content: string, query: string) => {
    const index = content.toLowerCase().indexOf(query);
    if (index === -1) return null;
    const start = Math.max(0, index - 15);
    const end = Math.min(content.length, index + query.length + 25);
    let snippet = content.slice(start, end).replace(/\s+/g, ' ');
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';
    return snippet;
  };

  const startRename = (c: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(c.id);
    setEditTitle(c.title);
  };

  const saveRename = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30"
        onClick={onClose}
      />

      <aside className="w-72 border-r border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900 flex flex-col h-full fixed md:relative z-40 transition-all duration-200 shrink-0">
        {/* Top Actions */}
        <div className="p-3 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-col gap-2">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title or content..."
              className="w-full pl-8 pr-7 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="px-3 py-8 text-center text-slate-400 text-xs">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
              {searchQuery ? `No chats matching "${searchQuery}"` : 'No chat history yet'}
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isActive = c.id === activeConversationId;
              const isEditing = c.id === editingId;

              const matchingMsg = queryTrimmed
                ? c.messages?.find((m) => m.content.toLowerCase().includes(queryTrimmed))
                : undefined;
              const snippet = matchingMsg ? getSnippet(matchingMsg.content, queryTrimmed) : null;

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectConversation(c.id);
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-900 font-medium dark:bg-indigo-950/60 dark:text-indigo-200 border border-indigo-200/60 dark:border-indigo-800/50'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-2 min-w-0 flex-1 pr-2">
                    <MessageSquare
                      className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-400'
                      }`}
                    />
                    {isEditing ? (
                      <form
                        onSubmit={(e) => saveRename(c.id, e)}
                        className="flex items-center gap-1 w-full"
                      >
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-indigo-400 rounded text-xs focus:outline-none"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          type="button"
                          onClick={(e) => saveRename(c.id, e)}
                          className="text-emerald-600 hover:text-emerald-700 p-0.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={cancelRename}
                          className="text-slate-400 hover:text-slate-600 p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    ) : (
                      <div className="min-w-0 flex-1">
                        <span className="truncate block font-medium">{c.title}</span>
                        {snippet && (
                          <span className="text-[10px] text-indigo-600/80 dark:text-indigo-300/80 truncate block mt-0.5 italic font-normal">
                            "{snippet}"
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => startRename(c, e)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded hover:bg-slate-300/50 dark:hover:bg-slate-700/50"
                        title="Rename"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(c.id);
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded hover:bg-slate-300/50 dark:hover:bg-slate-700/50"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Footer Options */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
          <button
            onClick={onOpenPersonaModal}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2 truncate">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">{currentPersona.name}</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wide">Mode</span>
          </button>

          {conversations.length > 0 && (
            <button
              onClick={onClearAll}
              className="w-full px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All History</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
