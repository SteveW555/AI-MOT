# Phase 0: Research & Technical Decisions

**Feature**: Ask Me Anything Chatbot
**Branch**: `002-call-this-new`
**Date**: 2025-10-02

## Research Scope

This document captures all technical research and architectural decisions made during Phase 0 to resolve the NEEDS CLARIFICATION items from the feature specification and establish the foundation for implementation.

---

## Research Question 1: OpenAI API Integration

**Question**: How should we integrate with OpenAI's API given the requirement for GPT model access with user-provided credentials?

### Options Evaluated

1. **OpenAI Official SDK** (`openai` npm package)
   - ✅ Type-safe, well-documented
   - ✅ Built-in retry logic and error handling
   - ❌ Additional dependency (~50KB)
   - ❌ Adds complexity for simple chat completion use case

2. **Native Fetch API with Custom Client**
   - ✅ Zero dependencies
   - ✅ Full control over timeout/retry logic
   - ✅ Lightweight implementation
   - ❌ Manual error handling required
   - ❌ No built-in streaming support

3. **Axios with Interceptors**
   - ✅ Easy timeout configuration
   - ✅ Request/response interceptors for retry
   - ❌ Additional dependency (~15KB)
   - ❌ Overkill for single API endpoint

### Decision: Native Fetch API with Custom Client ✅

**Rationale**:
- Zero additional dependencies maintains bundle size targets (<100KB increase)
- Full control over timeout/retry implementation meets FR-031 requirements
- TypeScript types can be manually defined for API contract
- Sufficient for single endpoint (Chat Completions API)
- Aligns with project's minimal dependency philosophy

**Implementation Details**:
```typescript
// Service: src/services/openai-client.ts
interface OpenAIConfig {
  apiKey: string
  model: string
  timeout: number
  maxRetries: number
}

async function chatCompletion(
  messages: Array<{role: string, content: string}>,
  config: OpenAIConfig
): Promise<string>
```

**API Endpoint**: `https://api.openai.com/v1/chat/completions`
**Authentication**: Bearer token in Authorization header
**Timeout Strategy**: AbortController + setTimeout (5s timeout, 1 retry)

---

## Research Question 2: Session Storage Implementation

**Question**: How should conversation history be persisted in browser session storage to meet FR-033 requirements?

### Options Evaluated

1. **Direct sessionStorage API**
   - ✅ Native browser API, zero dependencies
   - ✅ Simple get/set operations
   - ❌ Manual JSON serialization/deserialization
   - ❌ No type safety

2. **Custom Hook with Type Safety**
   - ✅ Encapsulates sessionStorage logic
   - ✅ TypeScript generics for type safety
   - ✅ Reusable across application
   - ❌ Slight overhead for small implementation

3. **Third-party Library (use-local-storage-state, etc.)**
   - ✅ Feature-rich (sync across tabs, etc.)
   - ❌ Unnecessary features (we don't need tab sync)
   - ❌ Additional dependency

### Decision: Custom Hook with Type Safety ✅

**Rationale**:
- Provides type safety for conversation data structures
- Encapsulates serialization/deserialization logic
- Allows easy mocking for tests
- No additional dependencies
- Follows established project pattern (custom hooks for state logic)

**Implementation Details**:
```typescript
// Hook: src/hooks/use-session-storage.ts
function useSessionStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Returns [storedValue, setValue] tuple
  // Handles JSON serialization/deserialization
  // Handles errors gracefully (fallback to initialValue)
}
```

**Storage Key**: `ai-mot-chatbot-conversation`
**Data Structure**: Array of ChatMessage objects with timestamps
**Persistence Scope**: Browser session only (cleared on browser close)

---

## Research Question 3: Timeout and Retry Logic

**Question**: How should we implement 5-second timeout with single retry as specified in FR-031?

### Options Evaluated

1. **AbortController with setTimeout**
   - ✅ Native browser API
   - ✅ Clean timeout handling
   - ✅ Works with fetch API
   - ❌ Requires manual retry logic

2. **Promise.race with setTimeout**
   - ✅ Simple implementation
   - ✅ Easy to understand
   - ❌ Cannot cancel underlying request
   - ❌ Potential memory leak

3. **Recursive async/await with counter**
   - ✅ Clear retry flow
   - ✅ Easy error propagation
   - ❌ Stack depth concerns (minimal at 1 retry)

### Decision: AbortController with Recursive Retry ✅

**Rationale**:
- AbortController properly cancels fetch requests (no hanging connections)
- Recursive pattern with attempt counter provides clear retry logic
- Meets FR-031 requirements exactly (5s timeout, 1 retry)
- TypeScript types ensure correct error handling

**Implementation Details**:
```typescript
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  timeout: number = 5000,
  maxAttempts: number = 2
): Promise<Response> {
  // Attempt 1: Initial request with AbortController
  // On timeout/error: Attempt 2 (retry once)
  // On second failure: throw error for fallback UI
}
```

**Timeout**: 5000ms per attempt
**Max Attempts**: 2 (initial + 1 retry)
**Error States**: timeout, network error, API error (4xx/5xx)

---

## Research Question 4: Email Validation

**Question**: How should we validate optional email addresses for FR-034b?

### Options Evaluated

1. **HTML5 Input Type Email**
   - ✅ Native browser validation
   - ✅ Zero implementation cost
   - ❌ Basic validation only (accepts `a@b`)
   - ❌ Inconsistent across browsers

2. **Regex Pattern Validation**
   - ✅ Consistent validation
   - ✅ Customizable strictness
   - ❌ Complex regex maintenance
   - ❌ Cannot validate deliverability

3. **Third-party Library (validator.js, etc.)**
   - ✅ Comprehensive validation
   - ❌ Additional dependency
   - ❌ Overkill for simple email check

4. **HTML5 + Regex Pattern Attribute**
   - ✅ Native browser support
   - ✅ Consistent validation
   - ✅ Accessible error messages
   - ✅ Zero dependencies

### Decision: HTML5 Input with Regex Pattern ✅

**Rationale**:
- Combines native browser validation with custom pattern
- No dependencies
- Accessible validation errors (built-in browser messages)
- Sufficient for optional email capture use case

**Implementation Details**:
```typescript
// Component: src/components/ui/email-capture.tsx
<input
  type="email"
  pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
  placeholder="your@email.com (optional)"
  aria-label="Email address (optional)"
/>
```

**Validation Pattern**: RFC 5322 simplified (sufficient for 95% of use cases)
**Error Handling**: Browser native validation messages
**Optional Behavior**: Empty input always valid (no required attribute)

---

## Research Question 5: Knowledge Base Format

**Question**: How should the knowledge base content be structured for use as OpenAI system prompt?

### Options Evaluated

1. **Plain Markdown File**
   - ✅ Human-readable
   - ✅ Easy to edit
   - ❌ Requires runtime file loading
   - ❌ Additional fetch during app init

2. **TypeScript Constant (Markdown String)**
   - ✅ Bundled at build time
   - ✅ Type-safe
   - ✅ No runtime loading
   - ✅ Template literals preserve formatting
   - ❌ Requires rebuild for content changes

3. **JSON Structure**
   - ✅ Structured data
   - ✅ Programmatic access
   - ❌ Loses markdown formatting
   - ❌ Harder to read/edit

### Decision: TypeScript Constant (Markdown String) ✅

**Rationale**:
- Zero runtime overhead (bundled at compile time)
- Preserves markdown formatting for readability
- Type-safe constant ensures no runtime errors
- Easy to maintain as single-source-of-truth
- Aligns with existing data pattern (`src/data/help-content.ts`)

**Implementation Details**:
```typescript
// Data: src/data/chatbot-knowledge-base.ts
export const KNOWLEDGE_BASE = `
# AI MOT Knowledge Base

## Services
...

## Pricing
...

## FAQs
...
` as const
```

**Content Source**: `specs/002-call-this-new/site-and-services.md`
**Update Process**: Edit markdown → rebuild app
**System Prompt Usage**: Prepend to OpenAI conversation messages

---

## Research Question 6: Keyboard Navigation

**Question**: How should basic keyboard navigation (FR-038) be implemented?

### Options Evaluated

1. **Native HTML Semantics**
   - ✅ Built-in browser support
   - ✅ Accessible by default
   - ✅ Zero implementation cost
   - ❌ Limited customization

2. **Custom Event Handlers**
   - ✅ Full control
   - ✅ Can customize all behaviors
   - ❌ More code to maintain
   - ❌ Risk of breaking defaults

3. **Focus Management Library**
   - ✅ Advanced features (focus trapping, etc.)
   - ❌ Unnecessary for basic requirements
   - ❌ Additional dependency

### Decision: Native HTML Semantics + Minimal Event Handlers ✅

**Rationale**:
- FR-038 only requires Tab/Enter/Escape (basic navigation)
- Native `<button>`, `<input>` elements provide Tab/Enter for free
- Single Escape key handler for panel close
- No full WCAG compliance required (per spec)

**Implementation Details**:
```typescript
// Component: src/components/ui/chatbot.tsx
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isExpanded) {
      setIsExpanded(false)
    }
  }
  window.addEventListener('keydown', handleEscape)
  return () => window.removeEventListener('keydown', handleEscape)
}, [isExpanded])
```

**Keyboard Support**:
- Tab: Native focus management (input → buttons → close)
- Enter: Native submit on input field
- Escape: Custom handler to close/collapse panel

---

## Additional Technical Decisions

### Error Handling Strategy

**API Error States**:
1. **Timeout**: After 5s, retry once (AbortController)
2. **Network Error**: Retry once, then fallback
3. **4xx Client Error**: No retry, show fallback
4. **5xx Server Error**: Retry once, then fallback

**Fallback Message** (FR-030):
```
I'm unavailable right now. Would you like to book a consultation directly?
[Book Consultation Button]
```

### State Management Architecture

**Primary State Hook**: `useChatbot`
```typescript
interface ChatbotState {
  messages: ChatMessage[]
  isExpanded: boolean
  isLoading: boolean
  error: string | null
  email: string | null
}
```

**State Flow**:
1. User submits message → `isLoading = true`
2. Call OpenAI API (with timeout/retry)
3. On success → append response, `isLoading = false`
4. On error → show fallback, `isLoading = false`
5. Persist to sessionStorage on every message

### Component Composition

**Hierarchy**:
```
<Chatbot>
  <ChatPanel>
    <ChatMessage /> (repeated)
    <ChatInput />
    <EmailCapture />
  </ChatPanel>
</Chatbot>
```

**Responsibilities**:
- `Chatbot`: State management, API integration, session storage
- `ChatPanel`: Layout, positioning, expand/collapse
- `ChatMessage`: Message rendering, timestamp formatting
- `ChatInput`: Input validation, submit handling
- `EmailCapture`: Email validation, optional display

---

## Dependencies Assessment

**New Dependencies**: NONE ✅

**Rationale**:
- All functionality achieved with native browser APIs
- Existing dependencies sufficient (React, TypeScript, Tailwind)
- Maintains bundle size target (<100KB increase)

**Existing Dependencies Used**:
- `react`: State hooks, component lifecycle
- `clsx` + `tailwind-merge`: Class name merging (via `cn()`)
- `class-variance-authority`: Component variants (optional)

---

## Performance Considerations

**API Call Optimization**:
- Debounce not needed (submit-based, not keystroke)
- Single conversation context (no pagination)
- Session storage limit: ~5MB (sufficient for 100+ messages)

**Render Optimization**:
- Message list: React.memo for individual messages
- Auto-scroll: useRef + useEffect on new messages
- Expand/collapse: CSS transitions (GPU-accelerated)

**Bundle Impact Estimate**:
- Components: ~8KB (5 components × ~1.5KB avg)
- Hooks: ~4KB (3 hooks × ~1.3KB avg)
- Services: ~3KB (API client + storage utils)
- Types: ~1KB (interfaces only, erased at runtime)
- **Total**: ~16KB (well under 100KB target)

---

## Security Considerations

**API Key Storage**:
- Environment variable: `VITE_OPENAI_API_KEY`
- Loaded at build time (not exposed to client)
- Alternative: Backend proxy endpoint (future enhancement)

**Input Sanitization**:
- No HTML rendering in messages (text only)
- Email validation prevents injection
- sessionStorage isolated per origin

**Data Privacy**:
- No backend storage (session-only)
- Email opt-in only (FR-034a)
- Clear privacy disclaimer (FR-035)

---

## Testing Strategy

**Test Types**:
1. **Contract Tests**: OpenAI API response validation
2. **Unit Tests**: Hooks, utilities, individual components
3. **Integration Tests**: Full chatbot flow (user input → API → display)

**Test Framework**: Vitest + @testing-library/react (established in project)

**Coverage Targets**:
- Hooks: 100% (critical business logic)
- Components: 80% (UI interactions)
- Services: 100% (API integration)

---

## Constitutional Compliance Summary

All research decisions comply with project constitution:

✅ **Type Safety**: TypeScript strict mode, no `any` types
✅ **Component Reusability**: forwardRef, className props, cn() utility
✅ **Responsive-First**: Mobile-first design, progressive enhancement
✅ **Visual Consistency**: Tailwind utilities, gradient palette
✅ **Zero New Dependencies**: Native APIs only
✅ **Performance**: <100KB bundle increase, <200ms interaction

---

## Next Steps

With Phase 0 research complete, proceed to Phase 1:

1. Generate `data-model.md` with entity schemas
2. Generate `contracts/openai-api.md` with API contract
3. Generate `contracts/component-contracts.ts` with component interfaces
4. Generate `quickstart.md` with developer guide
5. Generate `site-and-services.md` with knowledge base content

All decisions documented here inform Phase 1 design artifacts.

---

*Research completed: 2025-10-02*
