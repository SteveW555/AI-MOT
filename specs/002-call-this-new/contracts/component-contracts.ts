/**
 * Component Contracts: Ask Me Anything Chatbot
 *
 * Feature: Ask Me Anything Chatbot
 * Branch: 002-call-this-new
 * Date: 2025-10-02
 *
 * This file defines TypeScript interfaces for all chatbot UI components.
 * All components must implement these contracts to ensure type safety and consistency.
 */

import * as React from 'react'

// ============================================================================
// SHARED TYPES
// ============================================================================

/**
 * Message role type
 */
export type MessageRole = 'user' | 'assistant'

/**
 * Message status type
 */
export type MessageStatus = 'sending' | 'sent' | 'error'

/**
 * Panel state type
 */
export type PanelState = 'collapsed' | 'expanded'

/**
 * Chat message entity
 */
export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: number
  status: MessageStatus
  error?: string
}

/**
 * Conversation entity
 */
export interface Conversation {
  id: string
  messages: ChatMessage[]
  startedAt: number
  lastActivityAt: number
  userEmail: string | null
  isActive: boolean
}

// ============================================================================
// COMPONENT 1: CHATBOT (Main Container)
// ============================================================================

/**
 * Main chatbot container component
 *
 * Responsibilities:
 * - Manages overall chatbot state (conversation, API integration)
 * - Handles expand/collapse toggle
 * - Provides context to child components
 * - Persists conversation to sessionStorage
 *
 * Usage:
 * ```tsx
 * <Chatbot
 *   config={{
 *     apiKey: process.env.VITE_OPENAI_API_KEY,
 *     model: 'gpt-4-turbo',
 *     systemPrompt: KNOWLEDGE_BASE
 *   }}
 *   className="custom-class"
 * />
 * ```
 */
export interface ChatbotProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Configuration for OpenAI API integration
   */
  config: {
    /** OpenAI API key (from environment variable) */
    apiKey: string
    /** Model identifier (e.g., 'gpt-4-turbo') */
    model: string
    /** System prompt / knowledge base content */
    systemPrompt: string
    /** Request timeout in milliseconds (default: 5000) */
    timeout?: number
    /** Max retry attempts (default: 1) */
    maxRetries?: number
  }

  /**
   * Initial panel state (default: 'collapsed')
   */
  initialState?: PanelState

  /**
   * Callback when panel state changes
   */
  onStateChange?: (state: PanelState) => void

  /**
   * Callback when new message is sent
   */
  onMessageSent?: (message: ChatMessage) => void

  /**
   * Callback when error occurs
   */
  onError?: (error: Error) => void

  /**
   * Custom fallback message for API errors
   * Default: "I'm unavailable right now. Would you like to book a consultation directly?"
   */
  fallbackMessage?: string

  /**
   * Booking form URL for fallback button
   * Default: '/booking'
   */
  bookingUrl?: string

  /**
   * Optional CSS class name for styling
   */
  className?: string
}

// ============================================================================
// COMPONENT 2: CHAT PANEL (Floating Panel Wrapper)
// ============================================================================

/**
 * Floating panel wrapper component
 *
 * Responsibilities:
 * - Renders floating panel UI (bottom-right positioning)
 * - Handles expand/collapse animation
 * - Contains chat messages, input, and email capture
 * - Manages keyboard navigation (Escape to close)
 *
 * Usage:
 * ```tsx
 * <ChatPanel
 *   state="expanded"
 *   onToggle={() => setState('collapsed')}
 *   onClose={() => setState('collapsed')}
 * >
 *   {children}
 * </ChatPanel>
 * ```
 */
export interface ChatPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Current panel state
   */
  state: PanelState

  /**
   * Callback to toggle panel state
   */
  onToggle: () => void

  /**
   * Callback to close panel
   */
  onClose: () => void

  /**
   * Panel title (default: 'Ask Me Anything')
   */
  title?: string

  /**
   * Whether to show close button (default: true)
   */
  showCloseButton?: boolean

  /**
   * Children components (messages, input, email capture)
   */
  children: React.ReactNode

  /**
   * Optional CSS class name
   */
  className?: string
}

// ============================================================================
// COMPONENT 3: CHAT MESSAGE (Individual Message Display)
// ============================================================================

/**
 * Individual message component
 *
 * Responsibilities:
 * - Renders single message (user or assistant)
 * - Displays timestamp
 * - Shows loading state for 'sending' status
 * - Shows error state with error message
 * - Applies role-based styling (user vs assistant)
 *
 * Usage:
 * ```tsx
 * <ChatMessageComponent
 *   message={{
 *     id: '123',
 *     role: 'user',
 *     content: 'What services do you offer?',
 *     timestamp: Date.now(),
 *     status: 'sent'
 *   }}
 *   showTimestamp={true}
 * />
 * ```
 */
export interface ChatMessageComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Message data to display
   */
  message: ChatMessage

  /**
   * Whether to show timestamp (default: false)
   */
  showTimestamp?: boolean

  /**
   * Whether to show status indicator (default: true)
   */
  showStatus?: boolean

  /**
   * Custom timestamp format function
   */
  formatTimestamp?: (timestamp: number) => string

  /**
   * Optional CSS class name
   */
  className?: string
}

// ============================================================================
// COMPONENT 4: CHAT INPUT (User Input Field)
// ============================================================================

/**
 * Chat input component
 *
 * Responsibilities:
 * - Renders text input for user messages
 * - Validates input (non-empty, max length)
 * - Handles submit (Enter key or button click)
 * - Disables during API loading state
 * - Shows character count (optional)
 *
 * Usage:
 * ```tsx
 * <ChatInput
 *   onSubmit={(content) => sendMessage(content)}
 *   isLoading={false}
 *   disabled={false}
 *   maxLength={4000}
 * />
 * ```
 */
export interface ChatInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  /**
   * Callback when message is submitted
   * @param content - The message content
   */
  onSubmit: (content: string) => void

  /**
   * Whether API request is in progress
   */
  isLoading: boolean

  /**
   * Whether input is disabled
   */
  disabled?: boolean

  /**
   * Maximum message length (default: 4000)
   */
  maxLength?: number

  /**
   * Placeholder text (default: 'Ask me anything...')
   */
  placeholder?: string

  /**
   * Whether to show character count (default: false)
   */
  showCharCount?: boolean

  /**
   * Custom submit button text (default: 'Send')
   */
  submitButtonText?: string

  /**
   * Callback when input value changes
   */
  onChange?: (value: string) => void

  /**
   * Optional CSS class name
   */
  className?: string
}

// ============================================================================
// COMPONENT 5: EMAIL CAPTURE (Optional Email Field)
// ============================================================================

/**
 * Email capture component
 *
 * Responsibilities:
 * - Renders optional email input field
 * - Validates email format (HTML5 + regex)
 * - Stores email in conversation state
 * - Shows validation errors
 * - Clearly indicates field is optional
 *
 * Usage:
 * ```tsx
 * <EmailCapture
 *   value={userEmail}
 *   onChange={(email) => setUserEmail(email)}
 *   onValidEmail={(email) => saveEmail(email)}
 * />
 * ```
 */
export interface EmailCaptureProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Current email value
   */
  value: string

  /**
   * Callback when email changes
   * @param email - The email string (may be invalid)
   */
  onChange: (email: string) => void

  /**
   * Callback when valid email is confirmed
   * @param email - The validated email string
   */
  onValidEmail?: (email: string) => void

  /**
   * Whether to show validation errors inline (default: true)
   */
  showValidationErrors?: boolean

  /**
   * Custom placeholder text (default: 'your@email.com (optional)')
   */
  placeholder?: string

  /**
   * Custom label text (default: 'Email (optional)')
   */
  label?: string

  /**
   * Email validation pattern (default: RFC 5322 simplified)
   */
  pattern?: string

  /**
   * Whether field is disabled
   */
  disabled?: boolean

  /**
   * Optional CSS class name
   */
  className?: string
}

// ============================================================================
// HOOK CONTRACTS
// ============================================================================

/**
 * Chatbot state management hook
 *
 * Responsibilities:
 * - Manages conversation state
 * - Handles API calls to OpenAI
 * - Persists to sessionStorage
 * - Provides message send/receive functions
 *
 * Usage:
 * ```tsx
 * const {
 *   conversation,
 *   isLoading,
 *   error,
 *   sendMessage,
 *   setEmail,
 *   clearConversation
 * } = useChatbot(config)
 * ```
 */
export interface UseChatbotReturn {
  /**
   * Current conversation state
   */
  conversation: Conversation

  /**
   * Whether API request is in progress
   */
  isLoading: boolean

  /**
   * Current error state (null if no error)
   */
  error: Error | null

  /**
   * Send user message and get AI response
   * @param content - User message content
   */
  sendMessage: (content: string) => Promise<void>

  /**
   * Set user email (optional)
   * @param email - User email address
   */
  setEmail: (email: string) => void

  /**
   * Clear conversation and start fresh
   */
  clearConversation: () => void

  /**
   * Retry last failed message
   */
  retryLastMessage: () => Promise<void>
}

/**
 * Session storage persistence hook
 *
 * Responsibilities:
 * - Wraps sessionStorage with type safety
 * - Handles JSON serialization/deserialization
 * - Provides error handling for quota exceeded
 *
 * Usage:
 * ```tsx
 * const [conversation, setConversation] = useSessionStorage<Conversation>(
 *   'ai-mot-chatbot',
 *   initialConversation
 * )
 * ```
 */
export interface UseSessionStorageReturn<T> {
  /**
   * Current stored value
   */
  value: T

  /**
   * Update stored value
   * @param newValue - New value to store
   */
  setValue: (newValue: T | ((prev: T) => T)) => void

  /**
   * Remove value from storage
   */
  removeValue: () => void

  /**
   * Error state (null if no error)
   */
  error: Error | null
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Email validation result
 */
export interface EmailValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Message validation result
 */
export interface MessageValidationResult {
  isValid: boolean
  error?: string
}

// ============================================================================
// STYLE VARIANTS (for class-variance-authority)
// ============================================================================

/**
 * Message component variants
 */
export const messageVariants = {
  role: {
    user: 'bg-gradient-to-br from-blue-500 to-purple-500 text-white ml-auto',
    assistant: 'bg-slate-100 text-slate-900 mr-auto'
  },
  status: {
    sending: 'opacity-60 animate-pulse',
    sent: 'opacity-100',
    error: 'border-2 border-red-500'
  }
} as const

/**
 * Panel component variants
 */
export const panelVariants = {
  state: {
    collapsed: 'w-16 h-16 rounded-full',
    expanded: 'w-96 h-[600px] rounded-lg'
  }
} as const

/**
 * Input component variants
 */
export const inputVariants = {
  state: {
    default: 'border-slate-300 focus:border-purple-500',
    error: 'border-red-500 focus:border-red-500',
    disabled: 'bg-slate-100 cursor-not-allowed opacity-60'
  }
} as const

// ============================================================================
// ACCESSIBILITY PROPS
// ============================================================================

/**
 * ARIA props for chatbot components
 */
export interface ChatbotAriaProps {
  /** ARIA label for chatbot panel */
  'aria-label'?: string
  /** ARIA role for chat region */
  'aria-role'?: string
  /** ARIA live region for new messages */
  'aria-live'?: 'polite' | 'assertive'
  /** ARIA expanded state for panel */
  'aria-expanded'?: boolean
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Chatbot event handlers
 */
export interface ChatbotEventHandlers {
  onMessageSent?: (message: ChatMessage) => void
  onMessageReceived?: (message: ChatMessage) => void
  onError?: (error: Error) => void
  onPanelToggle?: (state: PanelState) => void
  onEmailCapture?: (email: string) => void
  onConversationClear?: () => void
}

// ============================================================================
// TESTING UTILITIES
// ============================================================================

/**
 * Mock conversation for testing
 */
export const mockConversation: Conversation = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  messages: [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      role: 'user',
      content: 'What services do you offer?',
      timestamp: 1696234567000,
      status: 'sent'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      role: 'assistant',
      content: 'We offer AI consultation, audit, implementation, and training services.',
      timestamp: 1696234568000,
      status: 'sent'
    }
  ],
  startedAt: 1696234567000,
  lastActivityAt: 1696234568000,
  userEmail: null,
  isActive: true
}

/**
 * Mock chatbot config for testing
 */
export const mockChatbotConfig = {
  apiKey: 'sk-test-key-1234567890abcdef',
  model: 'gpt-4-turbo',
  systemPrompt: 'You are a helpful AI assistant for AI MOT consultancy.',
  timeout: 5000,
  maxRetries: 1
}

// ============================================================================
// COMPONENT REF TYPES
// ============================================================================

/**
 * Chatbot component ref (for React.forwardRef)
 */
export type ChatbotRef = HTMLDivElement

/**
 * ChatPanel component ref
 */
export type ChatPanelRef = HTMLDivElement

/**
 * ChatMessage component ref
 */
export type ChatMessageRef = HTMLDivElement

/**
 * ChatInput component ref
 */
export type ChatInputRef = HTMLInputElement

/**
 * EmailCapture component ref
 */
export type EmailCaptureRef = HTMLInputElement

// ============================================================================
// EXPORT SUMMARY
// ============================================================================

/**
 * All component contracts exported:
 *
 * Components:
 * - ChatbotProps (main container)
 * - ChatPanelProps (floating panel)
 * - ChatMessageComponentProps (message display)
 * - ChatInputProps (user input)
 * - EmailCaptureProps (email capture)
 *
 * Hooks:
 * - UseChatbotReturn
 * - UseSessionStorageReturn
 *
 * Types:
 * - ChatMessage, Conversation
 * - MessageRole, MessageStatus, PanelState
 * - EmailValidationResult, MessageValidationResult
 *
 * Utilities:
 * - messageVariants, panelVariants, inputVariants
 * - mockConversation, mockChatbotConfig
 * - ChatbotRef, ChatPanelRef, ChatMessageRef, ChatInputRef, EmailCaptureRef
 */

// Type-only export (no runtime code)
export type {
  // Re-export all interfaces for convenience
  ChatbotProps,
  ChatPanelProps,
  ChatMessageComponentProps,
  ChatInputProps,
  EmailCaptureProps,
  UseChatbotReturn,
  UseSessionStorageReturn,
  EmailValidationResult,
  MessageValidationResult,
  ChatbotAriaProps,
  ChatbotEventHandlers
}
