import React from 'react'
import { cn } from '@/lib/utils'
import { helpContent } from '@/data/help-content'
import { useAccordion } from '@/hooks/useAccordion'
import { useSearch } from '@/hooks/useSearch'
import { SearchInput } from '@/components/ui/search-input'
import { SearchResults } from '@/components/ui/search-results'
import { Accordion } from '@/components/ui/accordion'

export interface HelpPageProps {
  /** Callback to navigate back to home */
  onNavigateHome?: () => void

  /** Optional CSS class name */
  className?: string
}

/**
 * Help page component with search and accordion sections
 */
export const HelpPage: React.FC<HelpPageProps> = ({
  onNavigateHome,
  className,
}) => {
  const { sections, faqs } = helpContent

  // Accordion state management
  const { expandedSections, toggleSection, expandSection } = useAccordion([])

  // Search state management
  const {
    query,
    debouncedQuery,
    results,
    isSearching,
    hasNoResults,
    setQuery,
    clearSearch,
  } = useSearch(sections, faqs)

  // Handle search result click - expand relevant section and scroll to it
  const handleResultClick = (result: typeof results[0]) => {
    // Find the section that contains this result
    const sectionId = result.sourceType === 'faq' ? 'faq-section' : result.sourceId

    // Expand the section
    expandSection(sectionId)

    // Clear search to show the section
    clearSearch()

    // Scroll to section after a brief delay to allow expansion
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50', className)}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b-2 border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Help & Support
              </h1>
              <p className="text-slate-600 mt-1">Find answers and learn about AI MOT</p>
            </div>

            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                ← Back to Home
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8">
        {/* Search bar */}
        <div className="mb-8">
          <SearchInput
            value={query}
            onChange={setQuery}
            isSearching={isSearching}
            placeholder="Search help articles, FAQs..."
          />
        </div>

        {/* Search results or accordion sections */}
        {debouncedQuery ? (
          <SearchResults
            results={results}
            searchQuery={debouncedQuery}
            onResultClick={handleResultClick}
            onClearSearch={clearSearch}
            hasNoResults={hasNoResults}
          />
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Browse Help Topics
            </h2>
            <Accordion
              sections={sections}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
            />

            {/* FAQ Section */}
            {faqs.length > 0 && (
              <div className="mt-8">
                <div className="space-y-2">
                  {faqs.map((faq) => (
                    <div
                      key={faq.id}
                      id={faq.id}
                      className="border-2 border-slate-200 rounded-lg p-4 bg-white"
                    >
                      <h4 className="font-semibold text-slate-900 mb-2">
                        {faq.question}
                      </h4>
                      <p className="text-slate-700">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t-2 border-slate-200 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center text-sm text-slate-600">
          <p>Still need help? <a href="mailto:support@aimot.com" className="text-purple-600 hover:text-purple-700 font-medium">Contact us</a></p>
        </div>
      </footer>
    </div>
  )
}
