import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

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
}

/**
 * Search input component with clear button and loading state
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Search help articles...',
      isSearching = false,
      className,
    },
    ref
  ) => {
    return (
      <div className={cn('relative w-full', className)}>
        {/* Search icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-slate-400"
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
        </div>

        {/* Input field */}
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full pl-12 pr-12 py-3 rounded-lg',
            'border-2 border-slate-200 focus:border-purple-400',
            'focus:outline-none focus:ring-2 focus:ring-purple-200',
            'text-slate-900 placeholder-slate-400',
            'transition-all duration-200'
          )}
        />

        {/* Loading indicator or clear button */}
        {isSearching ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <svg
              className="animate-spin h-5 w-5 text-purple-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : (
          value && (
            <button
              onClick={() => onChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Clear search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )
        )}
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'
