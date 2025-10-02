import React from 'react'
import { cn } from '@/lib/utils'
import type { SearchResult } from '@/types/help'
import { HighlightText } from './highlight-text'

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
 * Individual search result item component
 */
export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  result,
  searchQuery,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 rounded-lg border-2 border-slate-200',
        'hover:border-purple-300 hover:bg-purple-50',
        'transition-all duration-200 group',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          {/* Title with highlighting */}
          <h4 className="font-semibold text-slate-900 group-hover:text-purple-700 mb-1">
            <HighlightText text={result.title} query={searchQuery} />
          </h4>

          {/* Snippet with highlighting */}
          <p className="text-sm text-slate-600 line-clamp-2">
            <HighlightText
              text={result.snippet}
              query={searchQuery}
              highlightClassName="bg-yellow-200 font-medium"
            />
          </p>

          {/* Source type badge */}
          <span className="inline-block mt-2 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
            {result.sourceType === 'faq' ? 'FAQ' : 'Help Section'}
          </span>
        </div>

        {/* Arrow icon */}
        <svg
          className="w-5 h-5 text-slate-400 group-hover:text-purple-500 transition-colors flex-shrink-0 mt-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </button>
  )
}
