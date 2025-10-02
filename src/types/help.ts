/**
 * Type definitions for Help Documentation System
 * Based on data-model.md specifications
 */

export interface HelpSection {
  /** Unique identifier for the section */
  id: string

  /** Display title shown in accordion header */
  title: string

  /** Rich text content displayed when section is expanded */
  content: string

  /** Display order (0-indexed) */
  order: number

  /** Section type for categorization */
  type: 'service' | 'booking' | 'faq'

  /** Icon identifier (optional, for visual enhancement) */
  icon?: string
}

export interface FAQItem {
  /** Unique identifier */
  id: string

  /** The question text */
  question: string

  /** The answer text (supports rich formatting) */
  answer: string

  /** Category for grouping (if FAQ has sub-sections) */
  category?: string

  /** Display order within FAQ section */
  order: number

  /** Keywords for search optimization */
  keywords?: string[]
}

export interface SearchQuery {
  /** The search text entered by user */
  text: string

  /** Timestamp when search was initiated */
  timestamp: number

  /** Whether search is currently active/loading */
  isActive: boolean
}

export interface SearchResult {
  /** ID of the section or FAQ item containing the match */
  sourceId: string

  /** Type of source (section or faq) */
  sourceType: 'section' | 'faq'

  /** Title of the source (section title or FAQ question) */
  title: string

  /** Content snippet showing the match context */
  snippet: string

  /** Array of match positions for highlighting */
  matches: Array<{ start: number; end: number }>

  /** Relevance score (0-1, higher is more relevant) */
  score: number
}

export interface HelpContent {
  /** Array of main help sections */
  sections: HelpSection[]

  /** Array of FAQ items */
  faqs: FAQItem[]

  /** Last updated timestamp */
  lastUpdated: string // ISO 8601 date string

  /** Version identifier */
  version: string
}
