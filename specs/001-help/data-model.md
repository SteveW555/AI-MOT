# Data Model: Help Documentation System

**Feature**: Help Documentation System
**Branch**: 001-help
**Date**: 2025-10-02

## Overview

This document defines the TypeScript data structures for the help documentation system. All types follow strict TypeScript mode requirements and are designed for client-side state management with React hooks.

---

## Core Entities

### 1. HelpSection

Represents one of the three main accordion sections (Service Explanation, Booking Instructions, FAQ).

```typescript
interface HelpSection {
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
```

**Validation Rules**:
- `id`: Must be unique across all sections, lowercase-kebab-case
- `title`: Required, 3-50 characters
- `content`: Required, supports markdown or HTML
- `order`: Non-negative integer, determines display sequence
- `type`: One of three predefined types

**Example**:
```typescript
const serviceSection: HelpSection = {
  id: 'service-explanation',
  title: 'What is AI MOT?',
  content: '<p>AI MOT delivers a tactical blueprint...</p>',
  order: 0,
  type: 'service'
}
```

---

### 2. FAQItem

Represents individual question-answer pairs within the FAQ section.

```typescript
interface FAQItem {
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
```

**Validation Rules**:
- `id`: Unique, lowercase-kebab-case
- `question`: Required, ends with '?', 10-200 characters
- `answer`: Required, minimum 20 characters
- `order`: Non-negative integer
- `keywords`: Optional array for improved search matching

**Example**:
```typescript
const faqItem: FAQItem = {
  id: 'what-is-initial-consultation',
  question: 'What happens during an Initial Consultation?',
  answer: 'During the Initial Consultation, we discuss your business...',
  order: 0,
  keywords: ['consultation', 'first', 'meeting', 'introduction']
}
```

---

### 3. SearchQuery

Represents a user's search input and metadata.

```typescript
interface SearchQuery {
  /** The search text entered by user */
  text: string

  /** Timestamp when search was initiated */
  timestamp: number

  /** Whether search is currently active/loading */
  isActive: boolean
}
```

**Validation Rules**:
- `text`: Trimmed string, minimum 2 characters for valid search
- `timestamp`: Unix timestamp (milliseconds)
- `isActive`: Boolean flag for UI state

**Usage**:
```typescript
const [searchQuery, setSearchQuery] = useState<SearchQuery>({
  text: '',
  timestamp: Date.now(),
  isActive: false
})
```

---

### 4. SearchResult

Represents a single search match with highlighted snippet.

```typescript
interface SearchResult {
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
```

**Validation Rules**:
- `sourceId`: Must reference valid HelpSection.id or FAQItem.id
- `snippet`: Max 200 characters, includes ~50 chars before/after match
- `matches`: Array of character positions for highlighting
- `score`: Float between 0-1, determined by match-sorter algorithm

**Example**:
```typescript
const searchResult: SearchResult = {
  sourceId: 'service-explanation',
  sourceType: 'section',
  title: 'What is AI MOT?',
  snippet: '...delivers a tactical blueprint for maximizing your profitability...',
  matches: [{ start: 12, end: 20 }], // "tactical"
  score: 0.87
}
```

---

## Component State Types

### AccordionState

Manages which accordion sections are currently expanded.

```typescript
type AccordionState = Set<string> // Set of expanded section IDs

// Or as array for simpler React state:
type AccordionState = string[] // Array of expanded section IDs
```

**Operations**:
```typescript
// Toggle expansion
const toggle = (id: string) => {
  setExpanded(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  )
}

// Check if expanded
const isExpanded = (id: string) => expanded.includes(id)
```

---

### SearchState

Composite state for search functionality.

```typescript
interface SearchState {
  /** Current search query */
  query: string

  /** Debounced query value (300ms delay) */
  debouncedQuery: string

  /** Search results array */
  results: SearchResult[]

  /** Whether search is in progress */
  isSearching: boolean

  /** Whether no results were found */
  hasNoResults: boolean
}
```

**Usage Pattern**:
```typescript
const [searchState, setSearchState] = useState<SearchState>({
  query: '',
  debouncedQuery: '',
  results: [],
  isSearching: false,
  hasNoResults: false
})
```

---

## Aggregate Structures

### HelpContent

Top-level structure containing all help content.

```typescript
interface HelpContent {
  /** Array of main help sections */
  sections: HelpSection[]

  /** Array of FAQ items */
  faqs: FAQItem[]

  /** Last updated timestamp */
  lastUpdated: string // ISO 8601 date string

  /** Version identifier */
  version: string
}
```

**File Location**: `src/data/help-content.ts`

**Example Structure**:
```typescript
export const helpContent: HelpContent = {
  sections: [
    {
      id: 'service-explanation',
      title: 'What is AI MOT?',
      content: '...',
      order: 0,
      type: 'service'
    },
    {
      id: 'booking-instructions',
      title: 'How to Book',
      content: '...',
      order: 1,
      type: 'booking'
    },
    {
      id: 'faq-section',
      title: 'Frequently Asked Questions',
      content: '',
      order: 2,
      type: 'faq'
    }
  ],
  faqs: [
    // ... FAQ items
  ],
  lastUpdated: '2025-10-02T00:00:00Z',
  version: '1.0.0'
}
```

---

## Type Guards

Utility functions for runtime type checking.

```typescript
/** Check if source is a HelpSection */
function isHelpSection(source: HelpSection | FAQItem): source is HelpSection {
  return 'type' in source && ['service', 'booking', 'faq'].includes(source.type)
}

/** Check if source is a FAQItem */
function isFAQItem(source: HelpSection | FAQItem): source is FAQItem {
  return 'question' in source && 'answer' in source
}

/** Validate search query is actionable */
function isValidSearchQuery(query: string): boolean {
  return query.trim().length >= 2
}
```

---

## State Transitions

### Accordion Section Lifecycle

```
[Collapsed]
  ↓ (user clicks header)
[Expanding]
  ↓ (animation complete)
[Expanded]
  ↓ (user clicks header again)
[Collapsing]
  ↓ (animation complete)
[Collapsed]
```

**State Storage**: Array of expanded section IDs in React state

---

### Search Lifecycle

```
[Idle: query = '']
  ↓ (user types)
[Debouncing: query updating, debouncedQuery stale]
  ↓ (300ms elapsed)
[Searching: debouncedQuery updated, computing results]
  ↓ (results computed)
[Results Displayed] or [No Results]
  ↓ (user clears input)
[Idle]
```

---

## Relationships

```
HelpContent
├── sections: HelpSection[]
│   └── Each section displayed as accordion item
└── faqs: FAQItem[]
    └── Displayed within FAQ accordion section

SearchQuery
└── produces → SearchResult[]
    └── Each result references either:
        ├── HelpSection (via sourceId)
        └── FAQItem (via sourceId)
```

---

## Indexing Strategy

For search optimization:

```typescript
/** Flattened search index */
interface SearchIndex {
  id: string
  type: 'section' | 'faq'
  searchableText: string // concatenated title + content/question + answer
  source: HelpSection | FAQItem
}

/** Build search index from help content */
function buildSearchIndex(content: HelpContent): SearchIndex[] {
  const sectionIndexes = content.sections.map(section => ({
    id: section.id,
    type: 'section' as const,
    searchableText: `${section.title} ${section.content}`.toLowerCase(),
    source: section
  }))

  const faqIndexes = content.faqs.map(faq => ({
    id: faq.id,
    type: 'faq' as const,
    searchableText: `${faq.question} ${faq.answer} ${faq.keywords?.join(' ') || ''}`.toLowerCase(),
    source: faq
  }))

  return [...sectionIndexes, ...faqIndexes]
}
```

---

## Performance Considerations

### Memory Usage
- **HelpContent**: ~50-100KB for all content
- **SearchIndex**: ~60-120KB (includes redundant searchableText)
- **SearchResults**: ~5-10KB per search (max 20 results)

**Total**: <200KB in-memory, acceptable for client-side

### Search Complexity
- **Time**: O(n) where n = number of items (~20-30)
- **With match-sorter**: ~5-10ms per search on modern hardware
- **Target**: <50ms end-to-end (easily achievable)

---

## Validation Schema (Runtime)

For content validation during development:

```typescript
import { z } from 'zod' // Optional: if adding zod

const HelpSectionSchema = z.object({
  id: z.string().regex(/^[a-z-]+$/),
  title: z.string().min(3).max(50),
  content: z.string().min(10),
  order: z.number().int().nonnegative(),
  type: z.enum(['service', 'booking', 'faq']),
  icon: z.string().optional()
})

const FAQItemSchema = z.object({
  id: z.string().regex(/^[a-z-]+$/),
  question: z.string().min(10).max(200).endsWith('?'),
  answer: z.string().min(20),
  category: z.string().optional(),
  order: z.number().int().nonnegative(),
  keywords: z.array(z.string()).optional()
})
```

**Note**: Runtime validation optional for MVP, TypeScript provides compile-time safety.

---

## Admin Panel Entities (FR-013)

### 5. AdminUser

Represents an authorized user with access to the content editing admin panel.

```typescript
interface AdminUser {
  /** Unique identifier */
  id: string

  /** Username for login */
  username: string

  /** Hashed password (never store plain text) */
  passwordHash: string

  /** Last login timestamp */
  lastLogin: number | null

  /** Whether account is active */
  isActive: boolean
}
```

**Validation Rules**:
- `username`: Required, 3-20 characters, alphanumeric
- `passwordHash`: Required, bcrypt hash
- `lastLogin`: Unix timestamp or null
- `isActive`: Boolean flag for account suspension

**Example**:
```typescript
const adminUser: AdminUser = {
  id: 'admin-001',
  username: 'contenteditor',
  passwordHash: '$2b$10$...',
  lastLogin: 1696248000000,
  isActive: true
}
```

---

### 6. ContentEditSession

Represents an active content editing session in the admin panel.

```typescript
interface ContentEditSession {
  /** Session ID */
  id: string

  /** Reference to section or FAQ being edited */
  contentId: string

  /** Type of content being edited */
  contentType: 'section' | 'faq'

  /** Draft content (unsaved changes) */
  draftContent: string

  /** Last save timestamp */
  lastSaved: number

  /** Last auto-save timestamp */
  lastAutoSaved: number | null

  /** Whether content has unsaved changes */
  isDirty: boolean
}
```

**Validation Rules**:
- `contentId`: Must reference valid HelpSection.id or FAQItem.id
- `draftContent`: HTML or Markdown string
- `lastSaved`: Unix timestamp
- `isDirty`: True if draftContent differs from saved content

**Example**:
```typescript
const editSession: ContentEditSession = {
  id: 'session-abc123',
  contentId: 'service-explanation',
  contentType: 'section',
  draftContent: '<p>Updated service description...</p>',
  lastSaved: 1696248000000,
  lastAutoSaved: 1696248120000,
  isDirty: true
}
```

---

## Analytics Entities (FR-015)

### 7. AnalyticsEvent

Represents a user interaction event tracked by Google Analytics.

```typescript
interface AnalyticsEvent {
  /** Event ID (client-generated) */
  id: string

  /** Event type */
  eventType: 'page_view' | 'search' | 'section_click' | 'result_click' | 'time_on_page'

  /** Timestamp when event occurred */
  timestamp: number

  /** User session ID (Google Analytics session) */
  sessionId: string

  /** Event-specific payload */
  payload: {
    // For page_view
    pageUrl?: string
    referrer?: string

    // For search
    searchQuery?: string
    resultCount?: number

    // For section_click
    sectionId?: string
    sectionTitle?: string

    // For result_click
    resultId?: string
    resultRank?: number

    // For time_on_page
    duration?: number // milliseconds
  }
}
```

**Validation Rules**:
- `eventType`: One of 5 predefined types
- `timestamp`: Unix timestamp
- `payload`: Varies by eventType

**Example**:
```typescript
const searchEvent: AnalyticsEvent = {
  id: 'evt-123',
  eventType: 'search',
  timestamp: 1696248000000,
  sessionId: 'GA1.2.123456789.1696248000',
  payload: {
    searchQuery: 'booking process',
    resultCount: 5
  }
}
```

---

### 8. PopularTopic

Aggregated metric showing frequently accessed content.

```typescript
interface PopularTopic {
  /** Content ID (section or FAQ) */
  contentId: string

  /** Content type */
  contentType: 'section' | 'faq'

  /** Title of content */
  title: string

  /** View count in time period */
  viewCount: number

  /** Search match count */
  searchMatchCount: number

  /** Average time spent (milliseconds) */
  avgTimeSpent: number

  /** Time period for aggregation */
  period: {
    start: number // Unix timestamp
    end: number   // Unix timestamp
  }
}
```

**Validation Rules**:
- `viewCount`: Non-negative integer
- `searchMatchCount`: Non-negative integer
- `avgTimeSpent`: Non-negative number
- `period`: Valid date range

**Example**:
```typescript
const popularTopic: PopularTopic = {
  contentId: 'service-explanation',
  contentType: 'section',
  title: 'What is AI MOT?',
  viewCount: 1250,
  searchMatchCount: 340,
  avgTimeSpent: 45000, // 45 seconds
  period: {
    start: 1696161600000, // Last 7 days
    end: 1696248000000
  }
}
```

---

## Updated Next Steps

1. Create TypeScript interface file: `src/types/help.ts` (includes all 8 entities)
2. Create data file: `src/data/help-content.ts`
3. Implement search index builder in `src/lib/search.ts`
4. Create component prop contracts in Phase 1
5. **NEW**: Create admin authentication service in `src/lib/auth.ts`
6. **NEW**: Create Google Analytics integration in `src/lib/analytics.ts`
7. **NEW**: Create backend API endpoints for admin panel content updates

---

*Data model complete with admin panel and analytics entities. Ready for component contract generation.*
