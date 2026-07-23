import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { PersonaModal } from './components/PersonaModal';
import { KnowledgeExplorer } from './components/KnowledgeExplorer';
import { CrawlerDashboard } from './components/CrawlerDashboard';
import { SupabaseDashboard } from './components/SupabaseDashboard';
import { Conversation, Message, SystemPersona, DocumentChunk } from './types';
import { SYSTEM_PERSONAS } from './data/personas';
import { INITIAL_KNOWLEDGE_BASE } from './data/collegeKnowledgeBase';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'knowledge' | 'crawler' | 'supabase'>('chat');

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem('gpp_conversations_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    return localStorage.getItem('gpp_active_id_v2') || null;
  });

  const [currentPersona, setCurrentPersona] = useState<SystemPersona>(SYSTEM_PERSONAS[0]);
  const [enableSearch, setEnableSearch] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'active' | 'missing'>('checking');

  // Knowledge base state
  const [knowledgeChunks, setKnowledgeChunks] = useState<DocumentChunk[]>(INITIAL_KNOWLEDGE_BASE);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync conversations
  useEffect(() => {
    try {
      localStorage.setItem('gpp_conversations_v2', JSON.stringify(conversations));
    } catch (e) {
      console.error('Failed to save conversations to localStorage', e);
    }
  }, [conversations]);

  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem('gpp_active_id_v2', activeConversationId);
    } else {
      localStorage.removeItem('gpp_active_id_v2');
    }
  }, [activeConversationId]);

  // Fetch knowledge base chunks
  const refreshKnowledgeChunks = async () => {
    try {
      const res = await fetch('/api/knowledge-base');
      const data = await res.json();
      if (data.chunks && data.chunks.length > 0) {
        setKnowledgeChunks(data.chunks);
      }
    } catch (err) {
      console.warn('Failed to fetch knowledge base from server', err);
    }
  };

  useEffect(() => {
    refreshKnowledgeChunks();
  }, []);

  // Health Check
  const checkHealth = async () => {
    setApiKeyStatus('checking');
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      if (data.hasApiKey) {
        setApiKeyStatus('active');
      } else {
        setApiKeyStatus('missing');
      }
    } catch (err) {
      console.error('Health check failed:', err);
      setApiKeyStatus('missing');
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const messages = activeConversation ? activeConversation.messages : [];

  const createNewChat = () => {
    const newId = Date.now().toString();
    const newConv: Conversation = {
      id: newId,
      title: 'New College Query',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      personaId: currentPersona.id,
      enableSearch,
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
    setActiveTab('chat');
  };

  const getOrCreateActiveConversationId = (): string => {
    if (activeConversationId && conversations.some((c) => c.id === activeConversationId)) {
      return activeConversationId;
    }
    const newId = Date.now().toString();
    const newConv: Conversation = {
      id: newId,
      title: 'New College Query',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      personaId: currentPersona.id,
      enableSearch,
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
    return newId;
  };

  const handleSendMessage = async (promptText: string) => {
    if (!promptText.trim() || isStreaming) return;

    const convId = getOrCreateActiveConversationId();

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: promptText,
      timestamp: Date.now(),
    };

    const assistantMessageId = `assistant-${Date.now()}`;
    const assistantMessagePlaceholder: Message = {
      id: assistantMessageId,
      role: 'model',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          const isFirstMessage = c.messages.length === 0;
          const updatedTitle = isFirstMessage
            ? promptText.slice(0, 32) + (promptText.length > 32 ? '...' : '')
            : c.title;

          return {
            ...c,
            title: updatedTitle,
            updatedAt: Date.now(),
            messages: [...c.messages, userMessage, assistantMessagePlaceholder],
          };
        }
        return c;
      })
    );

    setIsStreaming(true);
    abortControllerRef.current = new AbortController();

    const currentConv = conversations.find((c) => c.id === convId);
    const existingMessages = currentConv ? currentConv.messages : [];
    const fullHistory = [...existingMessages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          messages: fullHistory,
          enableSearch,
          systemInstruction: currentPersona.systemInstruction,
          temperature: currentPersona.temperature,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to generate answer`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Response body is unreadable');

      const decoder = new TextDecoder();
      let accumulatedText = '';
      let finalSources: any[] = [];
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.replace(/^data:\s*/, '');
            if (!dataStr) continue;

            try {
              const parsed = JSON.parse(dataStr);

              if (parsed.error) {
                throw new Error(parsed.error);
              }

              if (parsed.text) {
                accumulatedText += parsed.text;

                setConversations((prev) =>
                  prev.map((c) => {
                    if (c.id === convId) {
                      return {
                        ...c,
                        messages: c.messages.map((m) =>
                          m.id === assistantMessageId
                            ? { ...m, content: accumulatedText }
                            : m
                        ),
                      };
                    }
                    return c;
                  })
                );
              }

              if (parsed.sources && parsed.sources.length > 0) {
                finalSources = parsed.sources;
              }

              if (parsed.done) {
                setConversations((prev) =>
                  prev.map((c) => {
                    if (c.id === convId) {
                      return {
                        ...c,
                        messages: c.messages.map((m) =>
                          m.id === assistantMessageId
                            ? {
                                ...m,
                                content:
                                  accumulatedText ||
                                  "I couldn't find that information in the official college website.",
                                sources: finalSources,
                                isStreaming: false,
                              }
                            : m
                        ),
                      };
                    }
                    return c;
                  })
                );
              }
            } catch (jsonErr) {
              console.warn('Error parsing SSE data:', jsonErr);
            }
          }
        }
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === convId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === assistantMessageId
                  ? {
                      ...m,
                      isStreaming: false,
                      sources: finalSources,
                    }
                  : m
              ),
            };
          }
          return c;
        })
      );
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Stream request aborted');
      } else {
        console.error('Streaming RAG Error:', err);
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === convId) {
              return {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantMessageId
                    ? {
                        ...m,
                        content:
                          err.message || 'An error occurred while calling the AI model.',
                        isStreaming: false,
                        isError: true,
                      }
                    : m
                ),
              };
            }
            return c;
          })
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleRetry = () => {
    if (!activeConversation) return;
    const lastUserMsg = [...activeConversation.messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConversationId) {
            const filtered = c.messages.filter((m) => !m.isError);
            return { ...c, messages: filtered };
          }
          return c;
        })
      );
      handleSendMessage(lastUserMsg.content);
    }
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    if (!activeConversation) return;
    const index = activeConversation.messages.findIndex((m) => m.id === messageId);
    if (index === -1) return;

    const truncated = activeConversation.messages.slice(0, index);
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          return { ...c, messages: truncated };
        }
        return c;
      })
    );

    handleSendMessage(newContent);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      setActiveConversationId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all conversation history?')) {
      setConversations([]);
      setActiveConversationId(null);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => {
          setActiveConversationId(id);
          setActiveTab('chat');
        }}
        onNewChat={createNewChat}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        onClearAll={handleClearAll}
        currentPersona={currentPersona}
        onOpenPersonaModal={() => setIsPersonaModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-white dark:bg-slate-950 relative">
        <Header
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onNewChat={createNewChat}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          apiKeyStatus={apiKeyStatus}
          onCheckHealth={checkHealth}
        />

        {activeTab === 'chat' ? (
          <>
            <MessageList
              messages={messages}
              currentPersona={currentPersona}
              onSendPrompt={handleSendMessage}
              onRetry={handleRetry}
              onEditMessage={handleEditMessage}
            />

            <ChatInput
              onSendMessage={handleSendMessage}
              isStreaming={isStreaming}
              onStopStreaming={handleStopStreaming}
              enableSearch={enableSearch}
              onToggleSearch={() => setEnableSearch((prev) => !prev)}
            />
          </>
        ) : activeTab === 'knowledge' ? (
          <KnowledgeExplorer chunks={knowledgeChunks} />
        ) : activeTab === 'crawler' ? (
          <CrawlerDashboard
            onKnowledgeUpdated={refreshKnowledgeChunks}
            totalChunksCount={knowledgeChunks.length}
          />
        ) : (
          <SupabaseDashboard />
        )}
      </div>

      {/* Persona Customization Modal */}
      <PersonaModal
        isOpen={isPersonaModalOpen}
        onClose={() => setIsPersonaModalOpen(false)}
        currentPersona={currentPersona}
        onSelectPersona={(persona) => setCurrentPersona(persona)}
        onCustomInstruction={(prompt) => {
          setCurrentPersona({
            id: `custom-${Date.now()}`,
            name: 'Custom Instructions',
            description: 'User-specified guidelines',
            icon: 'Sliders',
            systemInstruction: prompt,
            temperature: 0.2,
          });
        }}
      />
    </div>
  );
}
