import { matchSorter } from 'match-sorter'
import type { SearchResult, HelpSection, FAQItem } from '@/types/help'

interface SearchableItem {
  id: string
  type: 'section' | 'faq'
  title: string
  content: string
  searchableText: string
  source: HelpSection | FAQItem
}

/**
 * Build search index from help content
 * @param sections - Array of help sections
 * @param faqs - Array of FAQ items
 * @returns Flattened array of searchable items
 */
function buildSearchIndex(
  sections: HelpSection[],
  faqs: FAQItem[]
): SearchableItem[] {
  const sectionIndexes: SearchableItem[] = sections.map((section) => ({
    id: section.id,
    type: 'section' as const,
    title: section.title,
    content: section.content,
    searchableText: `${section.title} ${section.content}`.toLowerCase(),
    source: section,
  }))

  const faqIndexes: SearchableItem[] = faqs.map((faq) => ({
    id: faq.id,
    type: 'faq' as const,
    title: faq.question,
    content: faq.answer,
    searchableText: `${faq.question} ${faq.answer} ${faq.keywords?.join(' ') || ''}`.toLowerCase(),
    source: faq,
  }))

  return [...sectionIndexes, ...faqIndexes]
}

/**
 * Extract snippet around match position
 * @param text - Full text content
 * @param maxLength - Maximum snippet length (default: 200)
 * @returns Snippet with ellipsis if truncated
 */
function extractSnippet(text: string, maxLength: number = 200): string {
  // Remove HTML tags for snippet
  const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

  if (cleanText.length <= maxLength) {
    return cleanText
  }

  return cleanText.substring(0, maxLength) + '...'
}

/**
 * Execute search across help content
 * @param query - Search query string
 * @param sections - Array of help sections
 * @param faqs - Array of FAQ items
 * @returns Array of search results sorted by relevance
 */
export function executeSearch(
  query: string,
  sections: HelpSection[],
  faqs: FAQItem[]
): SearchResult[] {
  if (!query.trim()) {
    return []
  }

  const searchIndex = buildSearchIndex(sections, faqs)

  // Use match-sorter for fuzzy search with ranking
  const matches = matchSorter(searchIndex, query, {
    keys: ['title', 'searchableText'],
    threshold: matchSorter.rankings.CONTAINS,
  })

  // Convert matches to SearchResult format
  return matches.slice(0, 20).map((match, index) => ({
    sourceId: match.id,
    sourceType: match.type,
    title: match.title,
    snippet: extractSnippet(match.content),
    matches: [], // match-sorter doesn't provide exact match positions
    score: 1 - index / matches.length, // Approximate score based on ranking
  }))
}
