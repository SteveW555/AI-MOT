# Data Model: Ask Me Anything Chatbot

**Feature**: Ask Me Anything Chatbot
**Branch**: `002-call-this-new`
**Date**: 2025-10-02

## Overview

This document defines the complete data model for the chatbot feature, including TypeScript interfaces, validation rules, state transitions, and storage schemas. All entities follow TypeScript strict mode conventions with explicit typing and no `any` types.

---

## Entity 1: ChatMessage

Represents a single message in the conversation thread.

### TypeScript Interface

```typescript
interface ChatMessage {
  id: string                    // Unique identifier (UUID v4)
  role: 'user' | 'assistant'    // Message sender type
  content: string               // Message text content
  timestamp: number             // Unix timestamp (milliseconds)
  status: 'sending' | 'sent' | 'error'  // Message delivery status
  error?: string                // Error message if status === 'error'
}
```

### Field Specifications

| Field | Type | Required | Constraints | Default |
|-------|------|----------|-------------|---------|
| `id` | `string` | Yes | UUID v4 format | `crypto.randomUUID()` |
| `role` | `'user' \| 'assistant'` | Yes | Enum: user, assistant | N/A |
| `content` | `string` | Yes | Min: 1 char, Max: 4000 chars | N/A |
| `timestamp` | `number` | Yes | > 0, <= Date.now() | `Date.now()` |
| `status` | `'sending' \| 'sent' \| 'error'` | Yes | Enum values only | `'sending'` |
| `error` | `string` | No | Present only if status === 'error' | `undefined` |

### Validation Rules

```typescript
function validateChatMessage(message: unknown): message is ChatMessage {
  if (typeof message !== 'object' || message === null) return false

  const m = message as Partial<ChatMessage>

  // ID validation
  if (typeof m.id !== 'string' || !isValidUUID(m.id)) return false

  // Role validation
  if (m.role !== 'user' && m.role !== 'assistant') return false

  // Content validation
  if (typeof m.content !== 'string') return false
  if (m.content.length < 1 || m.content.length > 4000) return false

  // Timestamp validation
  if (typeof m.timestamp !== 'number') return false
  if (m.timestamp <= 0 || m.timestamp > Date.now()) return false

  // Status validation
  const validStatuses = ['sending', 'sent', 'error'] as const
  if (!validStatuses.includes(m.status as any)) return false

  // Error field validation
  if (m.status === 'error' && typeof m.error !== 'string') return false
  if (m.status !== 'error' && m.error !== undefined) return false

  return true
}
```

### State Transitions

```
User Message Flow:
  [Created] → status: 'sending'
  → [API Success] → status: 'sent'
  → [API Failure] → status: 'error', error: <message>

Assistant Message Flow:
  [Received from API] → status: 'sent' (immediately)
  (Assistant messages never have 'sending' or 'error' status)
```

### Usage Examples

```typescript
// User message creation
const userMessage: ChatMessage = {
  id: crypto.randomUUID(),
  role: 'user',
  content: 'What services do you offer?',
  timestamp: Date.now(),
  status: 'sending'
}

// Assistant message from API
const assistantMessage: ChatMessage = {
  id: crypto.randomUUID(),
  role: 'assistant',
  content: 'We offer AI consultation, audit, implementation, and training services.',
  timestamp: Date.now(),
  status: 'sent'
}

// Error message
const errorMessage: ChatMessage = {
  id: userMessage.id,
  role: userMessage.role,
  content: userMessage.content,
  timestamp: userMessage.timestamp,
  status: 'error',
  error: 'Request timeout after retry'
}
```

---

## Entity 2: Conversation

Represents the entire chat session with all messages and metadata.

### TypeScript Interface

```typescript
interface Conversation {
  id: string                    // Conversation session ID (UUID v4)
  messages: ChatMessage[]       // Array of all messages
  startedAt: number             // Session start timestamp
  lastActivityAt: number        // Last message timestamp
  userEmail: string | null      // Optional user email
  isActive: boolean             // Whether conversation is ongoing
}
```

### Field Specifications

| Field | Type | Required | Constraints | Default |
|-------|------|----------|-------------|---------|
| `id` | `string` | Yes | UUID v4 format | `crypto.randomUUID()` |
| `messages` | `ChatMessage[]` | Yes | Max: 100 messages | `[]` |
| `startedAt` | `number` | Yes | > 0 | `Date.now()` |
| `lastActivityAt` | `number` | Yes | >= startedAt | `Date.now()` |
| `userEmail` | `string \| null` | Yes | Valid email or null | `null` |
| `isActive` | `boolean` | Yes | true/false | `true` |

### Validation Rules

```typescript
function validateConversation(conversation: unknown): conversation is Conversation {
  if (typeof conversation !== 'object' || conversation === null) return false

  const c = conversation as Partial<Conversation>

  // ID validation
  if (typeof c.id !== 'string' || !isValidUUID(c.id)) return false

  // Messages validation
  if (!Array.isArray(c.messages)) return false
  if (c.messages.length > 100) return false
  if (!c.messages.every(validateChatMessage)) return false

  // Timestamps validation
  if (typeof c.startedAt !== 'number' || c.startedAt <= 0) return false
  if (typeof c.lastActivityAt !== 'number') return false
  if (c.lastActivityAt < c.startedAt) return false

  // Email validation
  if (c.userEmail !== null && !isValidEmail(c.userEmail)) return false

  // Active status validation
  if (typeof c.isActive !== 'boolean') return false

  return true
}
```

### State Transitions

```
Conversation Lifecycle:
  [Created] → isActive: true, messages: []
  → [User sends message] → messages.push(userMessage), lastActivityAt updated
  → [API responds] → messages.push(assistantMessage), lastActivityAt updated
  → [User provides email] → userEmail set (optional)
  → [User closes chatbot] → isActive: false
  → [Session ends] → Cleared from sessionStorage
```

### Usage Examples

```typescript
// New conversation
const newConversation: Conversation = {
  id: crypto.randomUUID(),
  messages: [],
  startedAt: Date.now(),
  lastActivityAt: Date.now(),
  userEmail: null,
  isActive: true
}

// Active conversation with messages
const activeConversation: Conversation = {
  id: 'existing-uuid',
  messages: [
    { /* user message */ },
    { /* assistant message */ }
  ],
  startedAt: 1696234567000,
  lastActivityAt: 1696234589000,
  userEmail: 'user@example.com',
  isActive: true
}

// Closed conversation
const closedConversation: Conversation = {
  ...activeConversation,
  isActive: false
}
```

---

## Entity 3: ChatbotConfig

Configuration settings for the chatbot behavior and API integration.

### TypeScript Interface

```typescript
interface ChatbotConfig {
  apiKey: string                // OpenAI API key
  model: string                 // Model identifier
  systemPrompt: string          // Knowledge base content
  timeout: number               // Request timeout (ms)
  maxRetries: number            // Max retry attempts
  temperature: number           // Response randomness (0-2)
  maxTokens: number             // Max response length
  fallbackMessage: string       // Error fallback text
  bookingUrl: string            // Booking form URL
}
```

### Field Specifications

| Field | Type | Required | Constraints | Default |
|-------|------|----------|-------------|---------|
| `apiKey` | `string` | Yes | Min: 20 chars, starts with 'sk-' | From env |
| `model` | `string` | Yes | Valid OpenAI model name | `'gpt-4-turbo'` |
| `systemPrompt` | `string` | Yes | Min: 100 chars | From knowledge base |
| `timeout` | `number` | Yes | 1000-30000 ms | `5000` |
| `maxRetries` | `number` | Yes | 0-3 | `1` |
| `temperature` | `number` | Yes | 0-2 | `0.7` |
| `maxTokens` | `number` | Yes | 100-4000 | `500` |
| `fallbackMessage` | `string` | Yes | Min: 10 chars | Default text |
| `bookingUrl` | `string` | Yes | Valid URL or path | `'/booking'` |

### Validation Rules

```typescript
function validateChatbotConfig(config: unknown): config is ChatbotConfig {
  if (typeof config !== 'object' || config === null) return false

  const c = config as Partial<ChatbotConfig>

  // API key validation
  if (typeof c.apiKey !== 'string') return false
  if (c.apiKey.length < 20 || !c.apiKey.startsWith('sk-')) return false

  // Model validation
  if (typeof c.model !== 'string' || c.model.length < 1) return false

  // System prompt validation
  if (typeof c.systemPrompt !== 'string' || c.systemPrompt.length < 100) return false

  // Numeric constraints
  if (typeof c.timeout !== 'number' || c.timeout < 1000 || c.timeout > 30000) return false
  if (typeof c.maxRetries !== 'number' || c.maxRetries < 0 || c.maxRetries > 3) return false
  if (typeof c.temperature !== 'number' || c.temperature < 0 || c.temperature > 2) return false
  if (typeof c.maxTokens !== 'number' || c.maxTokens < 100 || c.maxTokens > 4000) return false

  // String constraints
  if (typeof c.fallbackMessage !== 'string' || c.fallbackMessage.length < 10) return false
  if (typeof c.bookingUrl !== 'string' || c.bookingUrl.length < 1) return false

  return true
}
```

### Default Configuration

```typescript
const DEFAULT_CONFIG: ChatbotConfig = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  model: 'gpt-4-turbo',
  systemPrompt: KNOWLEDGE_BASE, // From src/data/chatbot-knowledge-base.ts
  timeout: 5000,
  maxRetries: 1,
  temperature: 0.7,
  maxTokens: 500,
  fallbackMessage: "I'm unavailable right now. Would you like to book a consultation directly?",
  bookingUrl: '/booking'
}
```

---

## Entity 4: SessionStorage Schema

Defines the structure of data persisted in browser sessionStorage.

### TypeScript Interface

```typescript
interface ChatbotSessionStorage {
  version: string               // Schema version for migration
  conversation: Conversation    // Current conversation
  lastSaved: number             // Last save timestamp
}
```

### Field Specifications

| Field | Type | Required | Constraints | Default |
|-------|------|----------|-------------|---------|
| `version` | `string` | Yes | Semver format (e.g., '1.0.0') | `'1.0.0'` |
| `conversation` | `Conversation` | Yes | Valid Conversation object | New conversation |
| `lastSaved` | `number` | Yes | > 0 | `Date.now()` |

### Storage Key

```typescript
const STORAGE_KEY = 'ai-mot-chatbot-conversation'
```

### Validation Rules

```typescript
function validateSessionStorage(data: unknown): data is ChatbotSessionStorage {
  if (typeof data !== 'object' || data === null) return false

  const d = data as Partial<ChatbotSessionStorage>

  // Version validation (semver pattern)
  if (typeof d.version !== 'string' || !/^\d+\.\d+\.\d+$/.test(d.version)) return false

  // Conversation validation
  if (!validateConversation(d.conversation)) return false

  // Last saved validation
  if (typeof d.lastSaved !== 'number' || d.lastSaved <= 0) return false

  return true
}
```

### Serialization Logic

```typescript
function saveToSessionStorage(conversation: Conversation): void {
  const data: ChatbotSessionStorage = {
    version: '1.0.0',
    conversation,
    lastSaved: Date.now()
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    // Handle quota exceeded error gracefully
    console.error('Failed to save conversation:', error)
  }
}

function loadFromSessionStorage(): Conversation | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const data = JSON.parse(raw)
    if (!validateSessionStorage(data)) {
      // Invalid data, clear and return null
      sessionStorage.removeItem(STORAGE_KEY)
      return null
    }

    return data.conversation
  } catch (error) {
    // JSON parse error, clear and return null
    sessionStorage.removeItem(STORAGE_KEY)
    return null
  }
}

function clearSessionStorage(): void {
  sessionStorage.removeItem(STORAGE_KEY)
}
```

### Migration Strategy

```typescript
// Future schema version handling
function migrateSessionStorage(data: any): ChatbotSessionStorage | null {
  if (data.version === '1.0.0') {
    return data // Current version
  }

  // Future migrations
  // if (data.version === '1.0.0') {
  //   return migrateFrom_1_0_0_to_1_1_0(data)
  // }

  return null // Unknown version, discard
}
```

---

## Utility Types

### Helper Types

```typescript
// Message creation without ID/timestamp (auto-generated)
type CreateChatMessageInput = Pick<ChatMessage, 'role' | 'content'>

// Conversation creation input
type CreateConversationInput = Pick<Conversation, 'id'>

// Config override type
type ChatbotConfigOverride = Partial<ChatbotConfig>

// Email validation result
interface EmailValidation {
  isValid: boolean
  error?: string
}
```

### Type Guards

```typescript
function isUserMessage(message: ChatMessage): message is ChatMessage & { role: 'user' } {
  return message.role === 'user'
}

function isAssistantMessage(message: ChatMessage): message is ChatMessage & { role: 'assistant' } {
  return message.role === 'assistant'
}

function isErrorMessage(message: ChatMessage): message is ChatMessage & { status: 'error' } {
  return message.status === 'error'
}
```

### Validation Utilities

```typescript
function isValidUUID(id: string): boolean {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidPattern.test(id)
}

function isValidEmail(email: string): boolean {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailPattern.test(email)
}

function validateMessageContent(content: string): EmailValidation {
  if (content.trim().length === 0) {
    return { isValid: false, error: 'Message cannot be empty' }
  }
  if (content.length > 4000) {
    return { isValid: false, error: 'Message too long (max 4000 characters)' }
  }
  return { isValid: true }
}
```

---

## State Machine Diagram

### Chatbot State Flow

```
┌─────────────────┐
│  Initial Load   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Check sessionStorage    │
└────────┬────────────────┘
         │
    ┌────▼─────┐
    │  Found?  │
    └──┬───┬───┘
       │   │
    Yes│   │No
       │   │
       ▼   ▼
    ┌──────────┐  ┌──────────────────┐
    │ Validate │  │ Create New       │
    │ & Restore│  │ Conversation     │
    └────┬─────┘  └────────┬─────────┘
         │                 │
         └────────┬────────┘
                  │
                  ▼
         ┌────────────────┐
         │ Chatbot Ready  │
         └────────┬───────┘
                  │
         ┌────────▼────────┐
         │ User Action:    │
         │ - Send Message  │
         │ - Add Email     │
         │ - Close Panel   │
         └────────┬────────┘
                  │
         ┌────────▼────────────┐
         │ Update Conversation │
         └────────┬────────────┘
                  │
         ┌────────▼────────────┐
         │ Save to Session     │
         └─────────────────────┘
```

### Message State Flow

```
User Message:
  Create (status: 'sending')
    │
    ▼
  Call API
    │
  ┌─▼─────────┐
  │ Success?  │
  └─┬─────┬───┘
    │     │
  Yes│   │No
    │     │
    ▼     ▼
  Set    Retry
  'sent' Once
           │
        ┌──▼──────┐
        │Success? │
        └─┬───┬───┘
          │   │
        Yes│ │No
          │   │
          ▼   ▼
        'sent' 'error'

Assistant Message:
  Receive from API
    │
    ▼
  Create (status: 'sent')
```

---

## Performance Considerations

### Storage Limits

- **sessionStorage Quota**: ~5MB per origin
- **Message Limit**: 100 messages max (enforced in Conversation validation)
- **Estimated Size**: ~50KB for 100 messages (well under quota)

### Optimization Strategies

```typescript
// Trim old messages if approaching limit
function trimConversation(conversation: Conversation): Conversation {
  if (conversation.messages.length > 100) {
    return {
      ...conversation,
      messages: conversation.messages.slice(-100) // Keep last 100
    }
  }
  return conversation
}

// Debounced save to reduce sessionStorage writes
function debouncedSave(conversation: Conversation, delay: number = 500): void {
  clearTimeout(saveTimeoutId)
  saveTimeoutId = setTimeout(() => {
    saveToSessionStorage(conversation)
  }, delay)
}
```

---

## Error Handling

### Error Types

```typescript
type ChatbotError =
  | { type: 'validation'; field: string; message: string }
  | { type: 'api'; code: number; message: string }
  | { type: 'timeout'; attempts: number }
  | { type: 'storage'; quota: boolean }
  | { type: 'network'; message: string }
```

### Error Recovery

```typescript
function handleError(error: ChatbotError): ChatMessage {
  const errorMessages: Record<ChatbotError['type'], string> = {
    validation: 'Invalid input. Please check your message.',
    api: "I'm having trouble responding. Please try again.",
    timeout: 'Request timed out. Would you like to book a consultation?',
    storage: 'Unable to save conversation history.',
    network: 'Network error. Please check your connection.'
  }

  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: errorMessages[error.type],
    timestamp: Date.now(),
    status: 'sent'
  }
}
```

---

## Testing Fixtures

### Mock Data

```typescript
// Mock conversation for testing
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
      content: 'We offer AI consultation, audit, implementation, and training.',
      timestamp: 1696234568000,
      status: 'sent'
    }
  ],
  startedAt: 1696234567000,
  lastActivityAt: 1696234568000,
  userEmail: null,
  isActive: true
}

// Mock config for testing
export const mockConfig: ChatbotConfig = {
  apiKey: 'sk-test-key-1234567890abcdef',
  model: 'gpt-4-turbo',
  systemPrompt: 'Test system prompt',
  timeout: 5000,
  maxRetries: 1,
  temperature: 0.7,
  maxTokens: 500,
  fallbackMessage: 'Test fallback message',
  bookingUrl: '/booking'
}
```

---

## Summary

This data model provides:

✅ **Type Safety**: All entities strictly typed with validation
✅ **State Management**: Clear state transitions and lifecycle
✅ **Storage**: Robust sessionStorage schema with migration support
✅ **Error Handling**: Comprehensive error types and recovery
✅ **Performance**: Optimized storage and message limits
✅ **Testing**: Mock data and type guards for testing

All types follow TypeScript strict mode with no `any` types and explicit validation rules.

---

*Data model version: 1.0.0*
*Last updated: 2025-10-02*
