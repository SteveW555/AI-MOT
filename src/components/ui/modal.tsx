import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ className, open, onClose, title, children, ...props }, ref) => {
    const modalRef = useRef<HTMLDivElement>(null)
    const titleId = useRef(`modal-title-${Math.random().toString(36).substr(2, 9)}`)
    const [isVisible, setIsVisible] = useState(false)
    const [shouldRender, setShouldRender] = useState(false)

    // Handle mount/unmount with animation delay
    useEffect(() => {
      if (open) {
        setShouldRender(true)
        // Trigger animation after render
        requestAnimationFrame(() => {
          setIsVisible(true)
        })
      } else {
        setIsVisible(false)
        // Wait for animation to complete before unmounting
        const timer = setTimeout(() => {
          setShouldRender(false)
        }, 300) // Match transition duration
        return () => clearTimeout(timer)
      }
    }, [open])

    // ESC key support
    useEffect(() => {
      if (!isVisible) return

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [isVisible, onClose])

    // Focus trap
    useEffect(() => {
      if (!isVisible || !modalRef.current) return

      const modal = modalRef.current
      const focusableElements = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      // Focus first element
      firstElement?.focus()

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }

      modal.addEventListener('keydown', handleTab)
      return () => modal.removeEventListener('keydown', handleTab)
    }, [isVisible])

    if (!shouldRender) return null

    return createPortal(
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center p-4',
          'bg-black/50 backdrop-blur-sm',
          'transition-opacity duration-300',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
      >
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId.current : undefined}
          aria-label={!title ? 'Modal dialog' : undefined}
          tabIndex={-1}
          className={cn(
            'bg-gradient-to-r from-[rgb(179,223,255)] via-[rgb(221,208,255)] to-[rgb(253,230,244)]',
            'p-[4px] rounded-lg shadow-2xl',
            'max-w-2xl w-full',
            'transition-all duration-300',
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            className
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-lg">
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-blue-200/50">
                <h2
                  id={titleId.current}
                  className="text-2xl font-bold text-slate-900"
                >
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className={cn(
                    'rounded-lg p-2 transition-colors',
                    'text-slate-700 hover:text-blue-600 hover:bg-blue-50',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500'
                  )}
                  aria-label="Close modal"
                >
                  <svg
                    className="w-6 h-6"
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
              </div>
            )}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>,
      document.body
    )
  }
)

Modal.displayName = 'Modal'

export { Modal }
