import React, { useState, useEffect } from 'react';
import { Database, Copy, Check, Terminal, Shield, Cpu, Code2, Layers, CheckCircle } from 'lucide-react';

export const SupabaseDashboard: React.FC = () => {
  const [sqlCode, setSqlCode] = useState<string>('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTab, setActiveTab] = useState<'sql' | 'node' | 'python'>('sql');

  useEffect(() => {
    fetch('/api/supabase/schema')
      .then((res) => res.json())
      .then((data) => setSqlCode(data.sql))
      .catch(() => {
        setSqlCode(`-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Create college_documents table
CREATE TABLE IF NOT EXISTS college_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  page TEXT,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  department TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  metadata JSONB DEFAULT '{}'::jsonb,
  chunk_number INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`);
      });
  }, []);

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const pythonScript = `# =========================================================
# STANDALONE PYTHON INGESTION PIPELINE FOR SUPABASE + GEMINI
# =========================================================
import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
import google.generativeai as genai

# Setup API Keys
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
genai.configure(api_key=GEMINI_API_KEY)

TARGET_URL = "https://govtpolyproddatur.ac.in/"

def crawl_and_ingest():
    print(f"Crawling {TARGET_URL}...")
    res = requests.get(TARGET_URL)
    soup = BeautifulSoup(res.text, 'html.parser')
    
    # Strip unnecessary elements
    for s in soup(["script", "style", "nav", "footer", "header"]):
        s.extract()
        
    page_title = soup.title.string if soup.title else "Government Polytechnic Proddatur"
    text = soup.get_text(separator=' ')
    words = text.split()
    
    # Chunking ~500 words with 100 overlap
    chunk_size = 500
    overlap = 100
    
    for i in range(0, len(words), chunk_size - overlap):
        chunk_text = " ".join(words[i:i + chunk_size])
        if len(chunk_text.strip()) < 100:
            continue
            
        # Generate Gemini Embedding
        emb_res = genai.embed_content(
            model="models/text-embedding-004",
            content=chunk_text
        )
        embedding = emb_res['embedding']
        
        # Insert into Supabase 'college_documents'
        data = {
            "title": page_title,
            "page": "Home",
            "url": TARGET_URL,
            "category": "General",
            "department": "General Administration",
            "content": chunk_text,
            "embedding": embedding,
            "metadata": {"source": "python_crawler_v1"}
        }
        supabase.table("college_documents").insert(data).execute()
        print("Ingested chunk successfully into Supabase!")

if __name__ == "__main__":
    crawl_and_ingest()
`;

  const nodeScript = `// =========================================================
// NODE.JS / TYPESCRIPT STANDALONE INGESTION SCRIPT
// =========================================================
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import axios from 'axios';
import * as cheerio from 'cheerio';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function runETLPipeline() {
  const url = 'https://govtpolyproddatur.ac.in/';
  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);
  $('script, style, nav, footer, header').remove();

  const title = $('title').text() || 'Government Polytechnic Proddatur';
  const cleanText = $('body').text().replace(/\\s+/g, ' ').trim();

  // Chunking
  const words = cleanText.split(' ');
  const chunks = [];
  for (let i = 0; i < words.length; i += 400) {
    chunks.push(words.slice(i, i + 500).join(' '));
  }

  for (const [idx, chunk] of chunks.entries()) {
    const record = {
      title: \`\${title} (Chunk \${idx + 1})\`,
      page: 'Home',
      url,
      category: 'General',
      department: 'General Administration',
      content: chunk,
      metadata: { env: 'production', parser: 'cheerio-v1' },
    };
    await supabase.from('college_documents').insert(record);
    console.log(\`Ingested chunk \${idx + 1} to Supabase!\`);
  }
}

runETLPipeline();
`;

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              <h1 className="text-lg font-bold">Supabase pgvector Database Setup</h1>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              SQL schema, indexes, vector similarity function, and automated ingestion scripts for <span className="font-mono text-indigo-300">college_documents</span> in Supabase.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 rounded-xl text-xs font-semibold shrink-0">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>pgvector Ready</span>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 uppercase text-[10px] font-semibold block">Table Name</span>
            <span className="font-bold text-slate-800 dark:text-slate-100 font-mono text-sm">college_documents</span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 uppercase text-[10px] font-semibold block">Vector Model</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono text-sm">VECTOR(1536)</span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 uppercase text-[10px] font-semibold block">Search Index</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">ivfflat (cosine)</span>
          </div>
        </div>

        {/* Code Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-4 pb-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('sql')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  activeTab === 'sql'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>1. Supabase SQL Schema</span>
              </button>

              <button
                onClick={() => setActiveTab('python')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  activeTab === 'python'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>2. Python ETL Crawler</span>
              </button>

              <button
                onClick={() => setActiveTab('node')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  activeTab === 'node'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>3. Node.js Ingestion</span>
              </button>
            </div>

            <button
              onClick={() => {
                const textToCopy =
                  activeTab === 'sql'
                    ? sqlCode
                    : activeTab === 'python'
                    ? pythonScript
                    : nodeScript;
                navigator.clipboard.writeText(textToCopy);
                setCopiedScript(true);
                setTimeout(() => setCopiedScript(false), 2000);
              }}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
            >
              {copiedScript ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <div className="p-6 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
            <pre className="leading-relaxed">
              {activeTab === 'sql'
                ? sqlCode
                : activeTab === 'python'
                ? pythonScript
                : nodeScript}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
