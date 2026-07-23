export interface SearchSource {
  title: string;
  uri: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  sources?: SearchSource[];
  isStreaming?: boolean;
  isError?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  personaId?: string;
  enableSearch?: boolean;
}

export interface SystemPersona {
  id: string;
  name: string;
  description: string;
  icon: string;
  systemInstruction: string;
  temperature: number;
}

export interface DocumentChunk {
  id: string;
  title: string;
  page: string;
  url: string;
  department: string;
  category: 'General' | 'Administration' | 'Departments' | 'Admissions' | 'Placements' | 'Academics' | 'Facilities' | 'Rules' | 'Notices';
  content: string;
  chunk_number: number;
  last_updated: string;
  embedding?: number[];
  similarityScore?: number;
}

export interface CrawlJobStatus {
  isCrawling: boolean;
  pagesScraped: number;
  totalPagesDiscovered: number;
  chunksCreated: number;
  embeddingsGenerated: number;
  currentUrl: string;
  logs: string[];
  lastCrawlTime?: string;
}
