import { useState, useMemo } from 'react'
import { useDebounce } from './useDebounce'
import type { SearchResult, HelpSection, FAQItem } from '@/types/help'
import { executeSearch } from '@/lib/search'

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
 * Custom hook for managing search state and executing searches
 * @param sections - Array of help sections to search
 * @param faqs - Array of FAQ items to search
 * @returns Search state and management functions
 */
export function useSearch(
  sections: HelpSection[],
  faqs: FAQItem[]
): UseSearchReturn {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return []
    }
    return executeSearch(debouncedQuery, sections, faqs)
  }, [debouncedQuery, sections, faqs])

  const isSearching = query !== debouncedQuery
  const hasNoResults = debouncedQuery.trim() !== '' && results.length === 0

  const clearSearch = () => {
    setQuery('')
  }

  return {
    query,
    debouncedQuery,
    results,
    isSearching,
    hasNoResults,
    setQuery,
    clearSearch,
  }
}
