import React, { useState } from 'react';
import Markdown from 'react-markdown';
import {
  User,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  RotateCw,
  Edit2,
  AlertTriangle,
} from 'lucide-react';
import { Message } from '../types';

interface MessageItemProps {
  message: Message;
  onRetry?: () => void;
  onEdit?: (newContent: string) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onRetry,
  onEdit,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const isUser = message.role === 'user';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editContent.trim() && onEdit) {
      onEdit(editContent.trim());
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`py-5 px-4 sm:px-6 transition-colors ${
        isUser
          ? 'bg-transparent'
          : 'bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800/60'
      }`}
    >
      <div className="max-w-4xl mx-auto flex gap-4">
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-medium text-xs">
              <User className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Message Content Body */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Top meta bar */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {isUser ? 'You' : 'Gemini Assistant'}
            </span>
            <div className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
              {isUser && onEdit && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                  title="Edit prompt"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={copyToClipboard}
                className="p-1 hover:text-slate-600 dark:hover:text-slate-200 rounded flex items-center gap-1"
                title="Copy message"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Edit Form or Markdown Display */}
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="space-y-2 mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-800 border border-indigo-400 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none"
                rows={3}
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded-md text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-md font-medium"
                >
                  Save & Resend
                </button>
              </div>
            </form>
          ) : message.isError ? (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-800 dark:text-red-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <span>Error generating response</span>
              </div>
              <p className="text-red-600 dark:text-red-300">{message.content}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-colors"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Retry Answer</span>
                </button>
              )}
            </div>
          ) : (
            <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-slate-800 dark:text-slate-200 break-words">
              <Markdown>{message.content}</Markdown>
              {message.isStreaming && (
                <span className="inline-block w-2 h-4 ml-1 bg-indigo-500 animate-pulse rounded-xs vertical-middle" />
              )}
            </div>
          )}

          {/* Web Search Grounding Sources */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                <span>Verified Sources</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {message.sources.map((source, index) => (
                  <a
                    key={index}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs border border-slate-200/80 dark:border-slate-700/80 transition-colors max-w-xs truncate"
                  >
                    <span className="truncate">{source.title || source.uri}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
