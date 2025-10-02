import React from 'react'
import { cn } from '@/lib/utils'
import type { SearchResult } from '@/types/help'
import { SearchResultItem } from './search-result-item'
import { NoResults } from './no-results'

export interface SearchResultsProps {
  /** Array of search results to display */
  results: SearchResult[]

  /** The search query for highlighting */
  searchQuery: string

  /** Callback when result is clicked */
  onResultClick: (result: SearchResult) => void

  /** Callback to clear search */
  onClearSearch: () => void

  /** Whether no results were found */
  hasNoResults: boolean

  /** Optional CSS class name */
  className?: string
}

/**
 * Component for displaying search results list
 */
export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  searchQuery,
  onResultClick,
  onClearSearch,
  hasNoResults,
  className,
}) => {
  if (hasNoResults) {
    return <NoResults searchQuery={searchQuery} onClearSearch={onClearSearch} className={className} />
  }

  if (results.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Results count */}
      <p className="text-sm text-slate-600">
        Found {results.length} result{results.length !== 1 ? 's' : ''} for "
        <span className="font-semibold">{searchQuery}</span>"
      </p>

      {/* Results list */}
      <div className="space-y-2">
        {results.map((result) => (
          <SearchResultItem
            key={result.sourceId}
            result={result}
            searchQuery={searchQuery}
            onClick={() => onResultClick(result)}
          />
        ))}
      </div>
    </div>
  )
}
