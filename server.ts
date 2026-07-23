import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import * as cheerio from "cheerio";
import {
  retrieveContext,
  getActiveKnowledgeBase,
  updateActiveKnowledgeBase,
} from "./src/services/ragService";
import { DocumentChunk, CrawlJobStatus } from "./src/types";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));

  // Helper to initialize Gemini SDK
  function getGenAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-gpp-rag-chatbot",
        },
      },
    });
  }

  // ZIP Download endpoint
  app.get("/api/download-zip", (_req, res) => {
    const zipPath = path.join(process.cwd(), "public", "govt-poly-proddatur-rag.zip");
    res.download(zipPath, "govt-poly-proddatur-rag.zip", (err) => {
      if (err) {
        console.error("Error downloading zip:", err);
        if (!res.headersSent) {
          res.status(500).send("Zip file not found or error occurred.");
        }
      }
    });
  });

  app.get("/govt-poly-proddatur-rag.zip", (_req, res) => {
    const zipPath = path.join(process.cwd(), "public", "govt-poly-proddatur-rag.zip");
    res.download(zipPath, "govt-poly-proddatur-rag.zip");
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    const hasApiKey = Boolean(process.env.GEMINI_API_KEY);
    const knowledgeCount = getActiveKnowledgeBase().length;
    res.json({ status: "ok", hasApiKey, knowledgeCount });
  });

  // Get active knowledge base chunks
  app.get("/api/knowledge-base", (_req, res) => {
    const chunks = getActiveKnowledgeBase();
    res.json({ total: chunks.length, chunks });
  });

  // Search knowledge base
  app.post("/api/knowledge-base/search", (req, res) => {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query required" });
    }
    const result = retrieveContext(query, 6);
    res.json({
      query,
      count: result.relevantChunks.length,
      chunks: result.relevantChunks,
      sources: result.sources,
    });
  });

  // Supabase SQL Schema Endpoint
  app.get("/api/supabase/schema", (_req, res) => {
    const sqlSchema = `-- =========================================================
-- SUPABASE DATABASE SETUP FOR GOVERNMENT POLYTECHNIC PRODDATUR
-- =========================================================

-- 1. Enable the pgvector extension to work with embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create table 'college_documents'
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create index for fast vector similarity search (cosine distance)
CREATE INDEX IF NOT EXISTS college_documents_embedding_idx
ON college_documents 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- 4. RPC Function for similarity search
CREATE OR REPLACE FUNCTION match_college_documents (
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.2,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  page TEXT,
  url TEXT,
  category TEXT,
  department TEXT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cd.id,
    cd.title,
    cd.page,
    cd.url,
    cd.category,
    cd.department,
    cd.content,
    cd.metadata,
    1 - (cd.embedding <=> query_embedding) AS similarity
  FROM college_documents cd
  WHERE 1 - (cd.embedding <=> query_embedding) > match_threshold
  ORDER BY cd.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
`;
    res.json({ sql: sqlSchema });
  });

  // Live Crawler Endpoint
  app.post("/api/crawl", async (req, res) => {
    const { targetUrl = "https://govtpolyproddatur.ac.in/" } = req.body;

    try {
      console.log(`Starting live crawl for ${targetUrl}...`);

      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} when fetching ${targetUrl}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Clean HTML: strip scripts, styles, header nav, footers, svg
      $("script, style, nav, footer, header, svg, noscript, iframe").remove();

      const pageTitle =
        $("title").text().trim() ||
        $("h1").first().text().trim() ||
        "Government Polytechnic Proddatur Page";

      // Extract main text content
      let textContent = $("body").text();
      textContent = textContent.replace(/\s+/g, " ").trim();

      // Chunking text into ~500 word blocks with 100 word overlap
      const words = textContent.split(" ");
      const chunkSize = 500;
      const overlap = 100;
      const newChunks: DocumentChunk[] = [];

      let chunkNumber = 1;
      for (let i = 0; i < words.length; i += chunkSize - overlap) {
        const chunkWords = words.slice(i, i + chunkSize);
        if (chunkWords.length < 30 && i > 0) break; // skip tiny residual chunks

        const chunkText = chunkWords.join(" ");
        const chunkId = `crawled-${Date.now()}-${chunkNumber}`;

        newChunks.push({
          id: chunkId,
          title: `${pageTitle} (Part ${chunkNumber})`,
          page: targetUrl.replace("https://govtpolyproddatur.ac.in", ""),
          url: targetUrl,
          category: "General",
          department: "General Administration",
          chunk_number: chunkNumber,
          last_updated: new Date().toISOString().split("T")[0],
          content: chunkText,
        });

        chunkNumber++;
      }

      // Update in-memory knowledge store
      if (newChunks.length > 0) {
        updateActiveKnowledgeBase(newChunks);
      }

      res.json({
        success: true,
        message: `Successfully crawled ${targetUrl}`,
        pageTitle,
        chunksCreated: newChunks.length,
        totalActiveChunks: getActiveKnowledgeBase().length,
        sampleChunk: newChunks[0] || null,
      });
    } catch (error: any) {
      console.error("Crawl error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to crawl target URL.",
      });
    }
  });

  // Streaming RAG Chatbot Endpoint
  app.post("/api/chat/stream", async (req, res) => {
    try {
      const { messages = [], enableSearch = false } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Messages array cannot be empty." });
      }

      const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
      const userQuery = lastUserMessage ? lastUserMessage.content : "";

      // Perform RAG retrieval over college knowledge base
      const ragContext = retrieveContext(userQuery, 5);

      const ai = getGenAI();

      const strictSystemInstruction = `You are the official AI Knowledge Base Chatbot for Government Polytechnic Proddatur (https://govtpolyproddatur.ac.in/).

Your core purpose is to provide 100% accurate, verified, helpful, and grounded answers to students, parents, faculty, and visitors.

STRICT GROUNDING RULES:
1. Answer the user's question using ONLY the provided Official College Knowledge Base context below.
2. If the user asks a question about the college (such as principal name, courses, fees, admissions, HODs, hostel, placements, rules, location) and the information is NOT present in the retrieved knowledge base context below, respond EXACTLY:
   "I couldn't find that information in the official college website."
3. Do NOT make up, guess, or hallucinate facts, dates, email addresses, phone numbers, or fees.
4. Present answers using clean Markdown with clear bullet points, headings, and bold highlights for readability.

OFFICIAL RETRIEVED KNOWLEDGE BASE CONTEXT:
${ragContext.promptContext}
`;

      const formattedContents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const config: any = {
        systemInstruction: strictSystemInstruction,
        temperature: 0.1, // low temperature for high precision & accuracy
      };

      if (enableSearch) {
        config.tools = [{ googleSearch: {} }];
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.6-flash",
        contents: formattedContents,
        config,
      });

      for await (const chunk of responseStream) {
        const textChunk = chunk.text;
        if (textChunk) {
          res.write(`data: ${JSON.stringify({ text: textChunk })}\n\n`);
        }
      }

      // Send citations at the end of stream
      res.write(
        `data: ${JSON.stringify({ done: true, sources: ragContext.sources })}\n\n`
      );
      res.end();
    } catch (error: any) {
      console.error("RAG Stream Error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message || "RAG chatbot stream error." });
      } else {
        res.write(
          `data: ${JSON.stringify({ error: error.message || "Stream failed." })}\n\n`
        );
        res.end();
      }
    }
  });

  // Non-streaming chat endpoint fallback
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages = [] } = req.body;
      const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
      const userQuery = lastUserMessage ? lastUserMessage.content : "";

      const ragContext = retrieveContext(userQuery, 5);
      const ai = getGenAI();

      const strictSystemInstruction = `You are the official AI Knowledge Base Chatbot for Government Polytechnic Proddatur (https://govtpolyproddatur.ac.in/).

STRICT GROUNDING RULES:
1. Answer using ONLY the official knowledge base context provided below.
2. If requested information is unavailable in context, respond:
   "I couldn't find that information in the official college website."
3. Never hallucinate facts.

OFFICIAL RETRIEVED KNOWLEDGE BASE CONTEXT:
${ragContext.promptContext}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: messages.map((m: { role: string; content: string }) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        })),
        config: {
          systemInstruction: strictSystemInstruction,
          temperature: 0.1,
        },
      });

      res.json({
        text: response.text || "I couldn't find that information in the official college website.",
        sources: ragContext.sources,
      });
    } catch (error: any) {
      console.error("RAG Chat Error:", error);
      res.status(500).json({ error: error.message || "Server error in RAG chatbot." });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
