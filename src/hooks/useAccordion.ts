import { useState, useCallback } from 'react'

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
  expandAll: (sectionIds: string[]) => void

  /** Check if a section is expanded */
  isExpanded: (sectionId: string) => boolean
}

/**
 * Custom hook for managing accordion state
 * @param initialExpanded - Optional array of initially expanded section IDs
 * @returns Accordion state management functions
 */
export function useAccordion(initialExpanded: string[] = []): UseAccordionReturn {
  const [expandedSections, setExpandedSections] = useState<string[]>(initialExpanded)

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }, [])

  const expandSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev : [...prev, sectionId]
    )
  }, [])

  const collapseSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => prev.filter((id) => id !== sectionId))
  }, [])

  const collapseAll = useCallback(() => {
    setExpandedSections([])
  }, [])

  const expandAll = useCallback((sectionIds: string[]) => {
    setExpandedSections(sectionIds)
  }, [])

  const isExpanded = useCallback(
    (sectionId: string) => expandedSections.includes(sectionId),
    [expandedSections]
  )

  return {
    expandedSections,
    toggleSection,
    expandSection,
    collapseSection,
    collapseAll,
    expandAll,
    isExpanded,
  }
}
