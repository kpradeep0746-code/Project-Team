import { DocumentChunk, SearchSource } from '../types';
import { INITIAL_KNOWLEDGE_BASE } from '../data/collegeKnowledgeBase';

export interface RetrievalResult {
  relevantChunks: DocumentChunk[];
  sources: SearchSource[];
  promptContext: string;
}

// In-memory active knowledge store initialized with Govt Poly Proddatur dataset
let activeKnowledgeBase: DocumentChunk[] = [...INITIAL_KNOWLEDGE_BASE];

export function getActiveKnowledgeBase(): DocumentChunk[] {
  return activeKnowledgeBase;
}

export function updateActiveKnowledgeBase(newChunks: DocumentChunk[]) {
  // Merge or replace
  const existingIds = new Set(activeKnowledgeBase.map((c) => c.id));
  const additions = newChunks.filter((c) => !existingIds.has(c.id));
  activeKnowledgeBase = [...additions, ...activeKnowledgeBase];
}

export function replaceActiveKnowledgeBase(allChunks: DocumentChunk[]) {
  activeKnowledgeBase = allChunks;
}

/**
 * Keyword & TF-IDF similarity score calculation between prompt and chunk text/metadata
 */
function calculateSimilarityScore(query: string, chunk: DocumentChunk): number {
  const q = query.toLowerCase().trim();
  const keywords = q
    .replace(/[^\w\s]/gi, '')
    .split(/\s+/)
    .filter((k) => k.length > 2);

  if (keywords.length === 0) return 0;

  const contentLower = chunk.content.toLowerCase();
  const titleLower = chunk.title.toLowerCase();
  const deptLower = chunk.department.toLowerCase();
  const pageLower = chunk.page.toLowerCase();

  let score = 0;

  for (const word of keywords) {
    // Exact match in title or department yields high weight
    if (titleLower.includes(word)) score += 3.5;
    if (deptLower.includes(word)) score += 3.0;
    if (pageLower.includes(word)) score += 2.0;

    // Content occurrences
    const occurrences = contentLower.split(word).length - 1;
    if (occurrences > 0) {
      score += Math.min(occurrences * 1.2, 5.0);
    }
  }

  // Bonus for domain specific acronyms or names
  if (q.includes('principal') && contentLower.includes('gurumurthy reddy')) score += 8.0;
  if (q.includes('hod') && (titleLower.includes('hod') || contentLower.includes('head of department'))) score += 5.0;
  if ((q.includes('fee') || q.includes('cost')) && (chunk.category === 'Admissions' || contentLower.includes('fee'))) score += 4.0;
  if ((q.includes('admission') || q.includes('polycet')) && chunk.category === 'Admissions') score += 4.0;
  if ((q.includes('placement') || q.includes('jobs') || q.includes('company')) && chunk.category === 'Placements') score += 4.0;
  if ((q.includes('hostel') || q.includes('library')) && chunk.category === 'Facilities') score += 4.0;

  return score;
}

/**
 * Retrieve top relevant chunks for RAG generation
 */
export function retrieveContext(query: string, topK: number = 4): RetrievalResult {
  const scored = activeKnowledgeBase.map((chunk) => ({
    chunk,
    score: calculateSimilarityScore(query, chunk),
  }));

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  const topMatches = scored
    .filter((item) => item.score > 0.5)
    .slice(0, topK)
    .map((item) => item.chunk);

  // If no match above threshold, fallback to top 2 general/about chunks
  const finalChunks =
    topMatches.length > 0
      ? topMatches
      : activeKnowledgeBase.slice(0, 2);

  const sources: SearchSource[] = finalChunks.map((c) => ({
    title: `${c.title} (${c.page})`,
    uri: c.url,
  }));

  const promptContext = finalChunks
    .map(
      (c, idx) =>
        `--- DOCUMENT CHUNK ${idx + 1} ---
Title: ${c.title}
Page: ${c.page}
URL: ${c.url}
Category: ${c.category} | Department: ${c.department}
Content:
${c.content}
`
    )
    .join('\n\n');

  return {
    relevantChunks: finalChunks,
    sources,
    promptContext,
  };
}
