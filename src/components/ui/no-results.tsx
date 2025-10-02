import React from 'react'
import { cn } from '@/lib/utils'

export interface NoResultsProps {
  /** The search query that produced no results */
  searchQuery: string

  /** Callback to clear search */
  onClearSearch: () => void

  /** Optional CSS class name */
  className?: string
}

/**
 * Component displayed when search returns no results
 */
export const NoResults: React.FC<NoResultsProps> = ({
  searchQuery,
  onClearSearch,
  className,
}) => {
  return (
    <div
      className={cn(
        'text-center py-12 px-4 bg-slate-50 rounded-lg border-2 border-slate-200',
        className
      )}
    >
      {/* Icon */}
      <svg
        className="w-16 h-16 mx-auto text-slate-300 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      {/* Message */}
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        No results found
      </h3>
      <p className="text-slate-600 mb-4">
        We couldn't find any help articles matching{' '}
        <span className="font-semibold">"{searchQuery}"</span>
      </p>

      {/* Suggestions */}
      <div className="space-y-2 text-sm text-slate-600 mb-6">
        <p>Try:</p>
        <ul className="list-none space-y-1">
          <li>• Using different keywords</li>
          <li>• Checking your spelling</li>
          <li>• Browsing help sections below</li>
        </ul>
      </div>

      {/* Clear button */}
      <button
        onClick={onClearSearch}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
      >
        Clear Search
      </button>
    </div>
  )
}
