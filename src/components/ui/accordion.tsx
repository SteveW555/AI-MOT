import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { HelpSection } from '@/types/help'

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
 * Individual accordion item component
 */
export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ section, isExpanded, onToggle, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('border-2 border-slate-200 rounded-lg overflow-hidden', className)}
      >
        <button
          onClick={onToggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onToggle()
            }
          }}
          aria-expanded={isExpanded}
          className="w-full px-6 py-4 text-left bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 hover:from-blue-100 hover:via-purple-100 hover:to-pink-100 transition-all duration-200 flex justify-between items-center min-h-[44px]"
        >
          <span className="text-lg font-semibold text-slate-900">
            {section.title}
          </span>
          <svg
            className={cn(
              'w-5 h-5 text-slate-600 transition-transform duration-300',
              isExpanded && 'rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <div
          className={cn(
            'transition-all duration-300 ease-in-out overflow-hidden',
            isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div
            className="px-6 py-4 text-slate-700 prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </div>
      </div>
    )
  }
)

AccordionItem.displayName = 'AccordionItem'

/**
 * Accordion component for displaying collapsible help sections
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ sections, expandedSections, onToggleSection, className }, ref) => {
    // Sort sections by order
    const sortedSections = [...sections].sort((a, b) => a.order - b.order)

    return (
      <div ref={ref} className={cn('space-y-4', className)}>
        {sortedSections.map((section) => (
          <AccordionItem
            key={section.id}
            section={section}
            isExpanded={expandedSections.includes(section.id)}
            onToggle={() => onToggleSection(section.id)}
          />
        ))}
      </div>
    )
  }
)

Accordion.displayName = 'Accordion'
