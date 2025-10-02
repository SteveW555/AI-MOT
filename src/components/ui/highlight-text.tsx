import React from 'react'
import { cn } from '@/lib/utils'

export interface HighlightTextProps {
  /** The text to display */
  text: string

  /** The query to highlight */
  query: string

  /** CSS class for highlight marks */
  highlightClassName?: string
}

/**
 * Component that highlights matching text within a string
 */
export const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  query,
  highlightClassName = 'bg-yellow-200 font-semibold',
}) => {
  if (!query) {
    return <>{text}</>
  }

  try {
    // Escape special regex characters
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedQuery})`, 'gi')
    const parts = text.split(regex)

    return (
      <>
        {parts.map((part, index) => {
          const isMatch = regex.test(part)
          regex.lastIndex = 0 // Reset regex state

          return isMatch ? (
            <mark key={index} className={cn(highlightClassName)}>
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          )
        })}
      </>
    )
  } catch (error) {
    // Fallback if regex fails
    return <>{text}</>
  }
}
