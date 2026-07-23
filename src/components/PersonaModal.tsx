import React, { useState } from 'react';
import { X, Sparkles, Code, Search, Calculator, Zap, Check, Sliders } from 'lucide-react';
import { SystemPersona } from '../types';
import { SYSTEM_PERSONAS } from '../data/personas';

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPersona: SystemPersona;
  onSelectPersona: (persona: SystemPersona) => void;
  onCustomInstruction: (customPrompt: string) => void;
}

const ICON_MAP: Record<string, any> = {
  Sparkles,
  Code,
  Search,
  Calculator,
  Zap,
};

export const PersonaModal: React.FC<PersonaModalProps> = ({
  isOpen,
  onClose,
  currentPersona,
  onSelectPersona,
  onCustomInstruction,
}) => {
  const [customPrompt, setCustomPrompt] = useState(currentPersona.systemInstruction);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      onCustomInstruction(customPrompt.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                Assistant Accuracy & Mode
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose a system prompt persona or write custom instructions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-2 bg-slate-50/30 dark:bg-slate-900/30">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'presets'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Presets
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'custom'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Custom System Instruction
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {activeTab === 'presets' ? (
            <div className="space-y-2.5">
              {SYSTEM_PERSONAS.map((persona) => {
                const IconComponent = ICON_MAP[persona.icon] || Sparkles;
                const isSelected = currentPersona.id === persona.id;

                return (
                  <button
                    key={persona.id}
                    onClick={() => {
                      onSelectPersona(persona);
                      setCustomPrompt(persona.systemInstruction);
                      onClose();
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-start justify-between transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-slate-900 dark:text-slate-100 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          {persona.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {persona.description}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Custom System Prompt
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={6}
                  placeholder="Enter exact system instructions for Gemini..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Define guidelines, constraints, domain knowledge, or tone for accurate answers.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
                >
                  Apply Custom Prompt
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
