/**
 * Component Contracts: Help Documentation System
 *
 * TypeScript interface definitions for all React components in the help system.
 * These serve as contracts between components and enforce type safety.
 *
 * All interfaces follow React 19+ and TypeScript 5.7+ conventions.
 */

import { ReactNode } from 'react'

// ============================================================================
// Data Type Imports (from data-model.md)
// ============================================================================

export interface HelpSection {
  id: string
  title: string
  content: string
  order: number
  type: 'service' | 'booking' | 'faq'
  icon?: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  category?: string
  order: number
  keywords?: string[]
}

export interface SearchResult {
  sourceId: string
  sourceType: 'section' | 'faq'
  title: string
  snippet: string
  matches: Array<{ start: number; end: number }>
  score: number
}

// ============================================================================
// Component Prop Interfaces
// ============================================================================

/**
 * Accordion Component
 *
 * Displays collapsible sections with independent expand/collapse behavior.
 * Supports keyboard navigation (Enter/Space) and tracks expanded state.
 */
export interface AccordionProps {
  /** Array of help sections to display */
  sections: HelpSection[]

  /** Currently expanded section IDs */
  expandedSections: string[]

  /** Callback when section is toggled */
  onToggleSection: (sectionId: string) => void

  /** Optional CSS class name for styling */
  className?: string

  /** Whether to show icons in headers */
  showIcons?: boolean
}

/**
 * Accordion Item Component
 *
 * Individual accordion section with header and collapsible content panel.
 */
export interface AccordionItemProps {
  /** The help section data */
  section: HelpSection

  /** Whether this section is currently expanded */
  isExpanded: boolean

  /** Callback when header is clicked */
  onToggle: () => void

  /** Optional CSS class name */
  className?: string
}

/**
 * Search Input Component
 *
 * Text input with search icon, clear button, and debounced onChange.
 */
export interface SearchInputProps {
  /** Current search query value */
  value: string

  /** Callback when search value changes */
  onChange: (value: string) => void

  /** Placeholder text */
  placeholder?: string

  /** Whether search is in progress */
  isSearching?: boolean

  /** Optional CSS class name */
  className?: string

  /** Debounce delay in milliseconds (default: 300) */
  debounceMs?: number
}

/**
 * Search Results Component
 *
 * Displays list of search matches with highlighted text.
 */
export interface SearchResultsProps {
  /** Array of search results to display */
  results: SearchResult[]

  /** The search query for highlighting */
  searchQuery: string

  /** Callback when result is clicked */
  onResultClick: (result: SearchResult) => void

  /** Optional CSS class name */
  className?: string
}

/**
 * Search Result Item Component
 *
 * Single search result with highlighted snippet.
 */
export interface SearchResultItemProps {
  /** The search result data */
  result: SearchResult

  /** The search query for highlighting */
  searchQuery: string

  /** Callback when clicked */
  onClick: () => void

  /** Optional CSS class name */
  className?: string
}

/**
 * Highlight Text Component
 *
 * Highlights matching text within a string using <mark> tags.
 */
export interface HighlightTextProps {
  /** The text to display */
  text: string

  /** The query to highlight */
  query: string

  /** CSS class for highlight marks (default: 'bg-yellow-200 font-semibold') */
  highlightClassName?: string
}

/**
 * No Results Message Component
 *
 * Displays when search returns empty results.
 */
export interface NoResultsProps {
  /** The search query that produced no results */
  searchQuery: string

  /** Callback to clear search */
  onClearSearch: () => void

  /** Optional CSS class name */
  className?: string
}

/**
 * Help Page Component
 *
 * Top-level page component containing search bar and accordion sections.
 */
export interface HelpPageProps {
  /** All help content data */
  content: {
    sections: HelpSection[]
    faqs: FAQItem[]
  }

  /** Callback to navigate back to home */
  onNavigateHome?: () => void

  /** Optional CSS class name */
  className?: string
}

/**
 * Footer Help Link Component
 *
 * Link in footer that navigates to help page.
 */
export interface FooterHelpLinkProps {
  /** Callback when help link is clicked */
  onClick: () => void

  /** Link text (default: 'Help') */
  label?: string

  /** Optional CSS class name */
  className?: string
}

// ============================================================================
// Hook Return Types
// ============================================================================

/**
 * useAccordion Hook Return Type
 *
 * Custom hook for managing accordion state.
 */
export interface UseAccordionReturn {
  /** Array of expanded section IDs */
  expandedSections: string[]

  /** Toggle a section's expanded state */
  toggleSection: (sectionId: string) => void

  /** Expand a specific section */
  expandSection: (sectionId: string) => void

  /** Collapse a specific section */
  collapseSection: (sectionId: string) => void

  /** Collapse all sections */
  collapseAll: () => void

  /** Expand all sections */
  expandAll: () => void

  /** Check if a section is expanded */
  isExpanded: (sectionId: string) => boolean
}

/**
 * useSearch Hook Return Type
 *
 * Custom hook for managing search state and executing searches.
 */
export interface UseSearchReturn {
  /** Current search query */
  query: string

  /** Debounced query value */
  debouncedQuery: string

  /** Search results */
  results: SearchResult[]

  /** Whether search is in progress */
  isSearching: boolean

  /** Whether no results were found */
  hasNoResults: boolean

  /** Update search query */
  setQuery: (query: string) => void

  /** Clear search */
  clearSearch: () => void
}

/**
 * useDebounce Hook Return Type
 *
 * Custom hook for debouncing values.
 */
export interface UseDebounceReturn<T> {
  /** The debounced value */
  debouncedValue: T

  /** Whether debounce is pending */
  isPending: boolean
}

// ============================================================================
// Utility Type Definitions
// ============================================================================

/**
 * Page State
 *
 * Tracks which page is currently displayed.
 */
export type PageState = 'home' | 'help'

/**
 * Search Mode
 *
 * Determines how search results are displayed.
 */
export type SearchMode = 'inline' | 'overlay' | 'replace'

/**
 * Accordion Animation Config
 *
 * Configuration for accordion expand/collapse animations.
 */
export interface AccordionAnimationConfig {
  /** Animation duration in milliseconds */
  duration: number

  /** Easing function */
  easing: 'ease-in-out' | 'ease-in' | 'ease-out' | 'linear'

  /** Whether animations are enabled */
  enabled: boolean
}

// ============================================================================
// Event Handler Types
// ============================================================================

/**
 * Search Event Handler
 */
export type SearchEventHandler = (query: string) => void

/**
 * Section Toggle Event Handler
 */
export type SectionToggleHandler = (sectionId: string) => void

/**
 * Result Click Event Handler
 */
export type ResultClickHandler = (result: SearchResult) => void

/**
 * Navigation Event Handler
 */
export type NavigationHandler = (page: PageState) => void

// ============================================================================
// Context Types (if using React Context)
// ============================================================================

/**
 * Help Context Value
 *
 * Shared state and actions for help system via React Context.
 */
export interface HelpContextValue {
  /** All help content */
  content: {
    sections: HelpSection[]
    faqs: FAQItem[]
  }

  /** Search state */
  search: UseSearchReturn

  /** Accordion state */
  accordion: UseAccordionReturn

  /** Navigate to help page */
  navigateToHelp: () => void

  /** Navigate to home page */
  navigateToHome: () => void

  /** Current page */
  currentPage: PageState
}

// ============================================================================
// Test Utility Types
// ============================================================================

/**
 * Mock Help Content
 *
 * Simplified content structure for testing.
 */
export interface MockHelpContent {
  sections: Partial<HelpSection>[]
  faqs: Partial<FAQItem>[]
}

/**
 * Component Test Props
 *
 * Helper type for component testing with optional overrides.
 */
export type TestProps<T> = {
  [K in keyof T]?: T[K]
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Content Validation Result
 *
 * Result of validating help content structure.
 */
export interface ContentValidationResult {
  /** Whether validation passed */
  isValid: boolean

  /** Array of validation errors */
  errors: Array<{
    field: string
    message: string
    severity: 'error' | 'warning'
  }>
}

/**
 * Search Query Validator
 */
export type SearchQueryValidator = (query: string) => {
  isValid: boolean
  reason?: string
}

// ============================================================================
// Export All Types
// ============================================================================

export type {
  // Component Props
  AccordionProps,
  AccordionItemProps,
  SearchInputProps,
  SearchResultsProps,
  SearchResultItemProps,
  HighlightTextProps,
  NoResultsProps,
  HelpPageProps,
  FooterHelpLinkProps,

  // Hook Returns
  UseAccordionReturn,
  UseSearchReturn,
  UseDebounceReturn,

  // Utility Types
  PageState,
  SearchMode,
  AccordionAnimationConfig,

  // Event Handlers
  SearchEventHandler,
  SectionToggleHandler,
  ResultClickHandler,
  NavigationHandler,

  // Context
  HelpContextValue,

  // Testing
  MockHelpContent,
  TestProps,

  // Validation
  ContentValidationResult,
  SearchQueryValidator,
}
