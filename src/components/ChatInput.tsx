import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Globe, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isStreaming: boolean;
  onStopStreaming: () => void;
  enableSearch: boolean;
  onToggleSearch: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isStreaming,
  onStopStreaming,
  enableSearch,
  onToggleSearch,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isStreaming) {
      onSendMessage(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky bottom-0 z-20">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="relative bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs focus-within:border-indigo-500 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything or request accurate code/facts... (Shift + Enter for line break)"
            rows={1}
            className="w-full px-4 pt-3.5 pb-12 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none resize-none max-h-48"
          />

          {/* Bottom Bar inside Input */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
            {/* Search Grounding Quick Pill */}
            <button
              type="button"
              onClick={onToggleSearch}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                enableSearch
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                  : 'bg-slate-200/60 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title="Toggle Google Search for real-time accurate information"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Search Grounding</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  enableSearch ? 'bg-blue-600' : 'bg-slate-400'
                }`}
              />
            </button>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {isStreaming ? (
                <button
                  type="button"
                  onClick={onStopStreaming}
                  className="px-3 py-1.5 bg-slate-800 dark:bg-slate-200 hover:bg-slate-900 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl shadow-xs transition-all flex items-center justify-center"
                  title="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="mt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span>Gemini 3.6 Flash • Server-side secure • Grounded for accuracy</span>
        </div>
      </div>
    </div>
  );
};
