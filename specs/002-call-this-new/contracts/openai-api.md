# OpenAI API Contract

**Feature**: Ask Me Anything Chatbot
**Branch**: `002-call-this-new`
**Date**: 2025-10-02

## Contract Overview

This document defines the API contract for integrating with OpenAI's Chat Completions API, including request/response formats, error handling, timeout/retry logic, and contract test specifications.

---

## API Endpoint

### Base Configuration

```
Base URL: https://api.openai.com/v1
Endpoint: /chat/completions
Method: POST
Content-Type: application/json
```

### Authentication

```http
Authorization: Bearer {API_KEY}
```

**API Key Source**: Environment variable `VITE_OPENAI_API_KEY`
**Key Format**: String starting with `sk-`, minimum 20 characters
**Storage**: Build-time environment variable (not exposed to client in production)

---

## Request Format

### Request Schema

```typescript
interface ChatCompletionRequest {
  model: string                    // Model identifier
  messages: Message[]              // Conversation history
  temperature?: number             // Randomness (0-2), default 0.7
  max_tokens?: number              // Max response length, default 500
  stream?: boolean                 // Streaming response, default false
  user?: string                    // Unique user identifier (optional)
}

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}
```

### Request Example

```json
{
  "model": "gpt-4-turbo",
  "messages": [
    {
      "role": "system",
      "content": "<KNOWLEDGE_BASE_CONTENT>"
    },
    {
      "role": "user",
      "content": "What services do you offer?"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 500,
  "stream": false
}
```

### Request Constraints

| Parameter | Type | Required | Constraints | Default |
|-----------|------|----------|-------------|---------|
| `model` | string | Yes | Valid OpenAI model name | `'gpt-4-turbo'` |
| `messages` | array | Yes | Min: 2 (system + user), Max: 20 | N/A |
| `temperature` | number | No | 0-2 | `0.7` |
| `max_tokens` | number | No | 100-4000 | `500` |
| `stream` | boolean | No | true/false | `false` |
| `user` | string | No | Any string identifier | `undefined` |

---

## Response Format

### Success Response (200 OK)

```typescript
interface ChatCompletionResponse {
  id: string
  object: 'chat.completion'
  created: number                  // Unix timestamp
  model: string
  choices: Choice[]
  usage: Usage
}

interface Choice {
  index: number
  message: Message
  finish_reason: 'stop' | 'length' | 'content_filter'
}

interface Message {
  role: 'assistant'
  content: string
}

interface Usage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}
```

### Success Response Example

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1696234567,
  "model": "gpt-4-turbo",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "We offer AI consultation, audit, implementation, and training services tailored for small businesses."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 25,
    "total_tokens": 175
  }
}
```

### Response Extraction

```typescript
function extractAssistantMessage(response: ChatCompletionResponse): string {
  if (!response.choices || response.choices.length === 0) {
    throw new Error('No choices in API response')
  }

  const message = response.choices[0].message
  if (message.role !== 'assistant') {
    throw new Error('Unexpected message role')
  }

  return message.content
}
```

---

## Error Responses

### Error Schema

```typescript
interface OpenAIError {
  error: {
    message: string
    type: string
    param?: string | null
    code?: string | null
  }
}
```

### Error Types

#### 1. Authentication Error (401 Unauthorized)

```json
{
  "error": {
    "message": "Incorrect API key provided",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
```

**Handling**: Display fallback message, do not retry

#### 2. Rate Limit Error (429 Too Many Requests)

```json
{
  "error": {
    "message": "Rate limit exceeded",
    "type": "rate_limit_error"
  }
}
```

**Handling**: Display fallback message, do not retry (user-level rate limit)

#### 3. Server Error (500 Internal Server Error)

```json
{
  "error": {
    "message": "The server had an error processing your request",
    "type": "server_error"
  }
}
```

**Handling**: Retry once (may be transient), then fallback

#### 4. Service Unavailable (503 Service Unavailable)

```json
{
  "error": {
    "message": "The engine is currently overloaded",
    "type": "server_error"
  }
}
```

**Handling**: Retry once, then fallback

#### 5. Invalid Request (400 Bad Request)

```json
{
  "error": {
    "message": "Invalid 'messages' field",
    "type": "invalid_request_error",
    "param": "messages"
  }
}
```

**Handling**: Log error, display fallback, do not retry

---

## Timeout & Retry Logic

### Timeout Configuration

```typescript
const TIMEOUT_MS = 5000        // 5 seconds per request
const MAX_RETRIES = 1          // Retry once on failure
```

### Retry Strategy

```typescript
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  timeout: number = TIMEOUT_MS,
  maxAttempts: number = 2
): Promise<Response> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      return response

    } catch (error) {
      lastError = error as Error

      // Don't retry on abort (timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        if (attempt < maxAttempts) {
          continue // Retry on timeout
        }
      }

      // Don't retry on network errors that won't resolve
      if (error instanceof TypeError) {
        break // Network error, no retry
      }
    }
  }

  throw lastError!
}
```

### Retry Decision Matrix

| Error Type | HTTP Code | Retry? | Fallback? |
|------------|-----------|--------|-----------|
| Timeout (AbortError) | N/A | Yes (1x) | Yes |
| Network Error | N/A | No | Yes |
| Auth Error | 401 | No | Yes |
| Rate Limit | 429 | No | Yes |
| Bad Request | 400 | No | Yes |
| Server Error | 500 | Yes (1x) | Yes |
| Service Unavailable | 503 | Yes (1x) | Yes |

---

## Client Implementation

### Service Function

```typescript
// src/services/openai-client.ts

interface OpenAIClientConfig {
  apiKey: string
  model: string
  systemPrompt: string
  timeout?: number
  maxRetries?: number
}

export async function sendChatMessage(
  userMessage: string,
  conversationHistory: ChatMessage[],
  config: OpenAIClientConfig
): Promise<string> {
  const messages = buildMessagesArray(conversationHistory, userMessage, config.systemPrompt)

  const requestBody: ChatCompletionRequest = {
    model: config.model,
    messages,
    temperature: 0.7,
    max_tokens: 500,
    stream: false
  }

  try {
    const response = await fetchWithRetry(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify(requestBody)
      },
      config.timeout ?? 5000,
      (config.maxRetries ?? 1) + 1 // maxRetries + initial attempt
    )

    if (!response.ok) {
      const errorData: OpenAIError = await response.json()
      throw new APIError(errorData.error.message, response.status)
    }

    const data: ChatCompletionResponse = await response.json()
    return extractAssistantMessage(data)

  } catch (error) {
    // Map to user-friendly error
    throw mapToUserError(error)
  }
}

function buildMessagesArray(
  history: ChatMessage[],
  newMessage: string,
  systemPrompt: string
): Message[] {
  const messages: Message[] = [
    { role: 'system', content: systemPrompt }
  ]

  // Add conversation history (last 10 messages)
  const recentHistory = history.slice(-10)
  for (const msg of recentHistory) {
    messages.push({
      role: msg.role,
      content: msg.content
    })
  }

  // Add new user message
  messages.push({
    role: 'user',
    content: newMessage
  })

  return messages
}
```

### Error Mapping

```typescript
class APIError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'APIError'
  }
}

function mapToUserError(error: unknown): Error {
  if (error instanceof Error && error.name === 'AbortError') {
    return new Error('Request timeout. Please try again.')
  }

  if (error instanceof APIError) {
    if (error.statusCode === 401) {
      return new Error('Authentication failed. Please check API configuration.')
    }
    if (error.statusCode === 429) {
      return new Error('Rate limit exceeded. Please try again later.')
    }
    if (error.statusCode >= 500) {
      return new Error('Service temporarily unavailable.')
    }
    return error
  }

  if (error instanceof TypeError) {
    return new Error('Network error. Please check your connection.')
  }

  return new Error('An unexpected error occurred.')
}
```

---

## Contract Tests

### Test Suite Structure

```typescript
// tests/unit/openai-client.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendChatMessage } from '@/services/openai-client'

describe('OpenAI API Client', () => {
  const mockConfig = {
    apiKey: 'sk-test-key',
    model: 'gpt-4-turbo',
    systemPrompt: 'Test prompt',
    timeout: 5000,
    maxRetries: 1
  }

  beforeEach(() => {
    global.fetch = vi.fn()
  })

  describe('Request Formation', () => {
    it('should send correct request format', async () => {
      // Test implementation
    })

    it('should include system prompt as first message', async () => {
      // Test implementation
    })

    it('should append conversation history', async () => {
      // Test implementation
    })

    it('should limit history to last 10 messages', async () => {
      // Test implementation
    })

    it('should include authorization header', async () => {
      // Test implementation
    })
  })

  describe('Response Handling', () => {
    it('should extract assistant message from 200 response', async () => {
      // Test implementation
    })

    it('should handle empty choices array', async () => {
      // Test implementation
    })

    it('should handle missing content field', async () => {
      // Test implementation
    })
  })

  describe('Error Handling', () => {
    it('should handle 401 authentication error without retry', async () => {
      // Test implementation
    })

    it('should handle 429 rate limit without retry', async () => {
      // Test implementation
    })

    it('should retry once on 500 server error', async () => {
      // Test implementation
    })

    it('should retry once on 503 service unavailable', async () => {
      // Test implementation
    })

    it('should handle 400 bad request without retry', async () => {
      // Test implementation
    })

    it('should handle network error without retry', async () => {
      // Test implementation
    })
  })

  describe('Timeout & Retry', () => {
    it('should timeout after 5 seconds', async () => {
      // Test implementation
    })

    it('should retry once on timeout', async () => {
      // Test implementation
    })

    it('should abort request on timeout', async () => {
      // Test implementation
    })

    it('should not exceed max retry attempts', async () => {
      // Test implementation
    })
  })
})
```

### Test Implementation Examples

#### Test 1: Request Formation

```typescript
it('should send correct request format', async () => {
  const mockResponse = {
    id: 'test-id',
    object: 'chat.completion',
    created: Date.now(),
    model: 'gpt-4-turbo',
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content: 'Test response' },
        finish_reason: 'stop'
      }
    ],
    usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 }
  }

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => mockResponse
  })

  await sendChatMessage('Test message', [], mockConfig)

  expect(global.fetch).toHaveBeenCalledWith(
    'https://api.openai.com/v1/chat/completions',
    expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-test-key'
      }),
      body: expect.stringContaining('"model":"gpt-4-turbo"')
    })
  )
})
```

#### Test 2: Timeout Handling

```typescript
it('should timeout after 5 seconds', async () => {
  vi.useFakeTimers()

  global.fetch = vi.fn().mockImplementation(() =>
    new Promise((resolve) => {
      setTimeout(() => resolve({ ok: true }), 10000) // 10s delay
    })
  )

  const promise = sendChatMessage('Test', [], mockConfig)

  vi.advanceTimersByTime(5000) // Fast-forward 5 seconds

  await expect(promise).rejects.toThrow('timeout')

  vi.useRealTimers()
})
```

#### Test 3: Retry Logic

```typescript
it('should retry once on 500 server error', async () => {
  global.fetch = vi.fn()
    .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({
      error: { message: 'Server error', type: 'server_error' }
    })})
    .mockResolvedValueOnce({ ok: true, json: async () => ({
      choices: [{ message: { role: 'assistant', content: 'Success' } }]
    })})

  const result = await sendChatMessage('Test', [], mockConfig)

  expect(global.fetch).toHaveBeenCalledTimes(2)
  expect(result).toBe('Success')
})
```

#### Test 4: No Retry on Auth Error

```typescript
it('should handle 401 authentication error without retry', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 401,
    json: async () => ({
      error: { message: 'Invalid API key', type: 'invalid_request_error' }
    })
  })

  await expect(sendChatMessage('Test', [], mockConfig)).rejects.toThrow('Authentication')

  expect(global.fetch).toHaveBeenCalledTimes(1) // No retry
})
```

---

## Integration Test Scenarios

### End-to-End Flow

```typescript
// tests/integration/chatbot-api.test.ts

describe('Chatbot OpenAI Integration', () => {
  it('should complete full conversation flow', async () => {
    // 1. User sends first message
    // 2. API returns response
    // 3. User sends follow-up
    // 4. API returns contextual response
    // 5. Verify conversation history maintained
  })

  it('should handle API error with fallback UI', async () => {
    // 1. Mock API error response
    // 2. User sends message
    // 3. Verify fallback message displayed
    // 4. Verify booking button rendered
  })

  it('should handle timeout with retry and fallback', async () => {
    // 1. Mock timeout on first attempt
    // 2. Mock success on retry
    // 3. Verify message delivered
    // 4. Verify only 2 API calls made
  })
})
```

---

## Monitoring & Observability

### Logging Strategy

```typescript
function logAPICall(
  request: ChatCompletionRequest,
  response: ChatCompletionResponse | null,
  error: Error | null,
  duration: number
): void {
  const logEntry = {
    timestamp: Date.now(),
    model: request.model,
    messageCount: request.messages.length,
    tokensUsed: response?.usage.total_tokens ?? 0,
    duration,
    success: error === null,
    errorType: error?.name,
    errorMessage: error?.message
  }

  // In production: Send to logging service
  console.log('[OpenAI API]', logEntry)
}
```

### Metrics to Track

- Request count (total, success, failure)
- Response time (p50, p95, p99)
- Token usage (prompt, completion, total)
- Error rates by type (auth, rate limit, timeout, server)
- Retry rate (% of requests that retry)

---

## Security Considerations

### API Key Protection

1. **Environment Variable**: Store in `VITE_OPENAI_API_KEY`
2. **Build-time Only**: Not exposed in client bundle (validate this)
3. **Alternative**: Proxy through backend endpoint (recommended for production)

### Request Validation

```typescript
function validateRequest(message: string): void {
  if (message.length > 4000) {
    throw new Error('Message exceeds maximum length')
  }

  // Sanitize input (no HTML/script injection)
  const sanitized = message.replace(/<[^>]*>/g, '')
  if (sanitized !== message) {
    throw new Error('Invalid message content')
  }
}
```

### Rate Limiting (Client-Side)

```typescript
// Prevent abuse: Max 10 messages per minute
const rateLimiter = {
  requests: [] as number[],
  limit: 10,
  window: 60000, // 1 minute

  canMakeRequest(): boolean {
    const now = Date.now()
    this.requests = this.requests.filter(t => now - t < this.window)

    if (this.requests.length >= this.limit) {
      return false
    }

    this.requests.push(now)
    return true
  }
}
```

---

## Contract Versioning

**Current Version**: 1.0.0

### Version History

- **1.0.0** (2025-10-02): Initial OpenAI Chat Completions contract

### Breaking Change Policy

If OpenAI API changes require contract updates:

1. Document changes in this file
2. Update client implementation
3. Update contract tests
4. Increment version number
5. Test backward compatibility

---

## Summary

This contract defines:

✅ **Request/Response Formats**: Complete TypeScript interfaces
✅ **Error Handling**: All error types with retry logic
✅ **Timeout Strategy**: 5s timeout with 1 retry
✅ **Contract Tests**: Comprehensive test suite
✅ **Security**: API key protection and validation
✅ **Monitoring**: Logging and metrics strategy

All implementations must conform to this contract to ensure reliable chatbot operation.

---

*Contract version: 1.0.0*
*Last updated: 2025-10-02*
