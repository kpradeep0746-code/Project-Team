import React, { useEffect, useRef } from 'react';
import { Building2, BookOpen, Users, Award, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import { Message, SystemPersona } from '../types';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  messages: Message[];
  currentPersona: SystemPersona;
  onSendPrompt: (prompt: string) => void;
  onRetry: () => void;
  onEditMessage: (messageId: string, newContent: string) => void;
}

const STARTER_PROMPTS = [
  {
    icon: Building2,
    title: 'College Overview',
    prompt: 'Tell me about Government Polytechnic Proddatur.',
  },
  {
    icon: Users,
    title: 'Principal & Leadership',
    prompt: 'Who is the principal of the college?',
  },
  {
    icon: BookOpen,
    title: 'Diplomas & Branches',
    prompt: 'What diploma engineering branches are offered at the college?',
  },
  {
    icon: Award,
    title: 'Admissions & Fee Details',
    prompt: 'What are the admission requirements, POLYCET process, and fee structure?',
  },
  {
    icon: Users,
    title: 'Department HODs',
    prompt: 'Who is the HOD of Mechanical Engineering?',
  },
  {
    icon: ShieldAlert,
    title: 'Placements & Companies',
    prompt: 'What placement opportunities and recruiting companies visit the campus?',
  },
];

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentPersona,
  onSendPrompt,
  onRetry,
  onEditMessage,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-8 max-w-4xl mx-auto w-full flex flex-col justify-center">
        <div className="text-center space-y-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-500/20">
            <Building2 className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Government Polytechnic Proddatur AI Assistant
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Official Knowledge Base Chatbot grounded strictly on <span className="underline font-medium">https://govtpolyproddatur.ac.in/</span>. Ask anything about courses, faculty, admissions, fees, or placements.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-xs text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Strict Grounded RAG Enabled • No Hallucinations</span>
          </div>
        </div>

        {/* Prompt Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto w-full">
          {STARTER_PROMPTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => onSendPrompt(item.prompt)}
                className="group p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 hover:border-indigo-200 dark:hover:border-indigo-800 text-left transition-all duration-200 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium text-xs mb-1.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    "{item.prompt}"
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-end text-xs text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((msg, index) => (
        <MessageItem
          key={msg.id || index}
          message={msg}
          onRetry={index === messages.length - 1 && msg.isError ? onRetry : undefined}
          onEdit={(newContent) => onEditMessage(msg.id, newContent)}
        />
      ))}
      <div ref={bottomRef} className="h-4" />
    </div>
  );
};
