# Implementation Tasks: Ask Me Anything Chatbot

**Feature**: Ask Me Anything Chatbot
**Branch**: `002-call-this-new`
**Date**: 2025-10-02

## Task Overview

Total tasks: 24 (updated with backend tasks)
Estimated parallel execution: 12 tasks can run concurrently
TDD approach: Tests before implementation
Architecture: Full-stack Node.js (React + Express)

---

## Phase 1: Setup & Foundation

### T001: Backend Dependencies Installation [P]
**File**: `package.json`
**Dependencies**: None
**Parallel**: Yes

Install Express.js, OpenAI SDK, and development dependencies.

**Actions**:
1. Run `npm install express openai dotenv`
2. Run `npm install -D concurrently`
3. Verify `package.json` includes new dependencies
4. Add `"type": "module"` to `package.json` for ES modules

**Validation**:
- `node_modules/` contains express, openai, dotenv, concurrently
- `package.json` has `"type": "module"`
- No installation errors

---

### T002: Environment Setup [P]
**File**: `.env`
**Dependencies**: None
**Parallel**: Yes

Create environment configuration file for backend OpenAI API key.

**Actions**:
1. Create `.env` in project root (NOT `.env.local`)
2. Add `OPENAI_API_KEY=sk-proj-your-key-here` placeholder
3. Add `PORT=3000`
4. Add `.env` to `.gitignore` if not present
5. Remove any `VITE_OPENAI_API_KEY` references (no longer needed)

**Validation**:
- `.env` file exists in project root
- `.gitignore` contains `.env`
- Backend can access `process.env.OPENAI_API_KEY`

---

### T003: TypeScript Type Definitions [P]
**File**: `src/types/chatbot.ts`
**Dependencies**: None
**Parallel**: Yes

Create all TypeScript interfaces for chatbot feature based on data-model.md.

**Actions**:
1. Create `src/types/chatbot.ts`
2. Define `ChatMessage` interface (id, role, content, timestamp, status, error?)
3. Define `Conversation` interface (id, messages, createdAt, lastActiveAt, state, email?)
4. Define `ChatbotConfig` interface (apiKey, apiTimeout, maxRetries, systemPrompt, fallbackMessage, bookingFormUrl)
5. Define `ConversationState` type ('idle' | 'loading' | 'error' | 'fallback')
6. Export all types

**Validation**:
- TypeScript compiles with no errors
- All interfaces have strict typing (no `any`)
- File exports 4+ type definitions

**Reference**: `specs/002-call-this-new/data-model.md`

---

## Phase 2: Backend Implementation

### T004: Express Server Setup
**File**: `server/index.js`
**Dependencies**: T001, T002
**Parallel**: No

Create minimal Express.js server with OpenAI API proxy endpoint.

**Actions**:
1. Create `server/` directory in project root
2. Create `server/index.js` with ES module syntax
3. Import express, openai, dotenv, path, url
4. Configure express app with JSON parser
5. Create POST `/api/chat` endpoint that:
   - Receives `{ messages: [...] }` in request body
   - Calls OpenAI Chat Completions API using `process.env.OPENAI_API_KEY`
   - Returns `{ message: "..." }` on success
   - Returns `{ error: "..." }` on failure with 500 status
6. Add static file serving for production (`dist/` folder)
7. Start server on `process.env.PORT || 3000`

**Validation**:
- Server starts without errors
- `/api/chat` endpoint responds to POST requests
- OpenAI API integration works
- Production static file serving configured

**Reference**: `specs/002-call-this-new/backend-architecture.md`

---

### T005: Vite Proxy Configuration
**File**: `vite.config.ts`
**Dependencies**: T004
**Parallel**: No

Configure Vite dev server to proxy API requests to Express backend.

**Actions**:
1. Open `vite.config.ts`
2. Add `server.proxy` configuration:
   ```typescript
   server: {
     proxy: {
       '/api': {
         target: 'http://localhost:3000',
         changeOrigin: true
       }
     }
   }
   ```
3. Ensure existing alias configuration is preserved

**Validation**:
- Vite dev server proxies `/api/*` requests to port 3000
- No errors when starting dev server
- Proxy works in development mode

---

### T006: Development Scripts Update
**File**: `package.json`
**Dependencies**: T004, T005
**Parallel**: No

Update npm scripts for concurrent frontend + backend development.

**Actions**:
1. Add `"dev:server": "node server/index.js"`
2. Add `"dev:client": "vite"`
3. Update `"dev": "concurrently \"npm run dev:server\" \"npm run dev:client\""`
4. Add `"start": "NODE_ENV=production node server/index.js"`
5. Keep existing `build`, `preview` scripts

**Validation**:
- `npm run dev` starts both frontend and backend
- `npm run dev:server` starts only backend
- `npm run dev:client` starts only frontend
- `npm start` runs production server

---

## Phase 3: Knowledge Base Content

### T007: Knowledge Base Content Creation
**File**: `src/data/chatbot-knowledge-base.ts`
**Dependencies**: T003
**Parallel**: No (depends on types)

Convert site-and-services.md to TypeScript constant for OpenAI system prompt.

**Actions**:
1. Create `src/data/chatbot-knowledge-base.ts`
2. Import site-and-services.md content as multiline string constant
3. Export as `CHATBOT_SYSTEM_PROMPT: string`
4. Ensure content includes: company info, services, pricing, FAQs, response guidelines
5. Add TypeScript typing for export

**Validation**:
- File compiles successfully
- Exported constant is >1000 characters
- Content matches site-and-services.md structure
- No hardcoded line breaks that break formatting

**Reference**: `specs/002-call-this-new/site-and-services.md`

---

## Phase 4: Services Layer & Contract Tests

### T008: Backend API Client Service [P]
**File**: `src/services/api-client.ts`
**Dependencies**: T003, T004
**Parallel**: Yes

Implement backend API client with timeout/retry logic.

**Actions**:
1. Create `src/services/api-client.ts`
2. Import `ChatMessage` type
3. Implement `sendChatMessage(messages: ChatMessage[], timeout?: number): Promise<string>`
4. Use native fetch API to call `POST /api/chat`
5. Use AbortController for timeout (default 5s)
6. Implement single retry on timeout/error
7. Handle error responses (500, network errors)
8. Return assistant response content on success
9. Throw descriptive errors on failure

**Validation**:
- Function calls `/api/chat` endpoint
- Timeout triggers after 5s
- Retry logic executes once
- Error handling covers all failure cases

**Reference**: `specs/002-call-this-new/backend-architecture.md`

---

### T009: Session Storage Service [P]
**File**: `src/services/session-storage.ts`
**Dependencies**: T002
**Parallel**: Yes

Implement session storage utilities for conversation persistence.

**Actions**:
1. Create `src/services/session-storage.ts`
2. Import `Conversation` type
3. Implement `saveConversation(conversation: Conversation): void`
4. Implement `loadConversation(): Conversation | null`
5. Implement `clearConversation(): void`
6. Use `sessionStorage.setItem/getItem/removeItem` with key `'aimot_conversation'`
7. Handle JSON serialization/deserialization
8. Handle storage errors gracefully

**Validation**:
- Functions use sessionStorage API correctly
- JSON serialization works with Conversation type
- Returns null when no conversation exists
- Handles errors without throwing

**Reference**: `specs/002-call-this-new/data-model.md` (SessionStorage schema)

---

### T006: OpenAI Contract Tests [P]
**File**: `tests/unit/openai-client.test.ts`
**Dependencies**: T004
**Parallel**: Yes (independent test file)

Write contract tests for OpenAI API client.

**Actions**:
1. Create `tests/unit/openai-client.test.ts`
2. Import `sendChatMessage` from openai-client
3. Mock fetch API responses
4. Test success case (200 OK with valid response)
5. Test timeout case (AbortSignal triggered after 5s)
6. Test retry case (first fails, second succeeds)
7. Test error cases (401, 429, 500)
8. Assert request structure matches OpenAI API spec

**Validation**:
- All tests pass
- Test coverage >80% for api-client.ts
- Mocks properly simulate API behavior
- Tests verify timeout/retry logic

**Reference**: `specs/002-call-this-new/contracts/openai-api.md`

---

### T011: Session Storage Tests [P]
**File**: `tests/unit/session-storage.test.ts`
**Dependencies**: T005
**Parallel**: Yes (independent test file)

Write unit tests for session storage utilities.

**Actions**:
1. Create `tests/unit/session-storage.test.ts`
2. Mock `sessionStorage` API
3. Test `saveConversation` stores data correctly
4. Test `loadConversation` retrieves and deserializes data
5. Test `loadConversation` returns null when empty
6. Test `clearConversation` removes data
7. Test JSON serialization edge cases

**Validation**:
- All tests pass
- Test coverage >90% for session-storage.ts
- Mocks prevent actual browser storage usage
- Edge cases handled (null, invalid JSON)

---

## Phase 4: Custom Hooks

### T012: useSessionStorage Hook [P]
**File**: `src/hooks/use-session-storage.ts`
**Dependencies**: T002, T005
**Parallel**: Yes

Create React hook for session storage with state synchronization.

**Actions**:
1. Create `src/hooks/use-session-storage.ts`
2. Import `Conversation` type and session storage utilities
3. Implement `useSessionStorage(): [Conversation | null, (c: Conversation) => void, () => void]`
4. Use `useState` to track conversation in component state
5. Use `useEffect` to load from sessionStorage on mount
6. Provide save/clear functions that update both state and storage
7. Return tuple of [conversation, save, clear]

**Validation**:
- Hook follows React hooks rules
- State synchronizes with sessionStorage
- Component re-renders on conversation changes
- TypeScript types are correct

**Reference**: `specs/002-call-this-new/contracts/component-contracts.ts`

---

### T013: useApiChat Hook [P]
**File**: `src/hooks/use-api-chat.ts`
**Dependencies**: T002, T003, T004
**Parallel**: Yes

Create React hook for OpenAI API integration.

**Actions**:
1. Create `src/hooks/use-api-chat.ts`
2. Import types, openai-client, and knowledge base constant
3. Implement `useOpenAI(config: ChatbotConfig)`
4. Manage loading state with `useState`
5. Provide `sendMessage(messages: ChatMessage[]): Promise<string>` function
6. Inject `CHATBOT_SYSTEM_PROMPT` into API calls
7. Handle errors and return error messages
8. Use `useCallback` for memoization

**Validation**:
- Hook integrates openai-client correctly
- System prompt injected into all requests
- Loading state updated during API calls
- Errors handled gracefully

**Reference**: `specs/002-call-this-new/contracts/component-contracts.ts`

---

### T014: useChatbot Hook
**File**: `src/hooks/use-chatbot.ts`
**Dependencies**: T002, T008, T009
**Parallel**: No (orchestrates other hooks)

Create main chatbot state management hook.

**Actions**:
1. Create `src/hooks/use-chatbot.ts`
2. Import all types and other hooks
3. Combine `useSessionStorage` and `useOpenAI`
4. Manage conversation state (messages, state, email)
5. Implement `sendUserMessage(content: string): Promise<void>`
6. Implement timeout/retry logic (5s + 1 retry)
7. Update conversation state through all transitions
8. Persist conversation to sessionStorage after each update
9. Provide `isExpanded`, `toggleExpanded`, `setEmail` state/functions

**Validation**:
- Hook orchestrates all chatbot logic
- State transitions follow data-model.md
- Session storage updated after each message
- All edge cases handled (empty input, API errors)

**Reference**: `specs/002-call-this-new/data-model.md` (State Transitions)

---

## Phase 5: UI Components

### T015: ChatMessage Component [P]
**File**: `src/components/ui/chat-message.tsx`
**Dependencies**: T002
**Parallel**: Yes

Create individual chat message display component.

**Actions**:
1. Create `src/components/ui/chat-message.tsx`
2. Import `ChatMessage` type and React types
3. Define `ChatMessageProps` interface (extends `React.HTMLAttributes<HTMLDivElement>`, adds `message: ChatMessage`)
4. Implement component with React.forwardRef
5. Style differently for user vs assistant messages (bg colors, alignment)
6. Display timestamp in readable format
7. Show error state if `message.status === 'error'`
8. Use Tailwind classes, cn() utility
9. Accept `className` prop for extension

**Validation**:
- Component uses React.forwardRef
- Accepts className prop
- Displays user/assistant messages differently
- Shows error state appropriately
- TypeScript strict typing enforced

**Reference**: `specs/002-call-this-new/contracts/component-contracts.ts`

---

### T016: ChatInput Component [P]
**File**: `src/components/ui/chat-input.tsx`
**Dependencies**: T002
**Parallel**: Yes

Create message input field with validation.

**Actions**:
1. Create `src/components/ui/chat-input.tsx`
2. Define `ChatInputProps` interface (value, onChange, onSubmit, disabled, placeholder)
3. Implement component with React.forwardRef
4. Use HTML input or textarea element
5. Prevent empty/whitespace-only submission (FR-010)
6. Submit on Enter key press (FR-038b)
7. Disable input when loading
8. Style with Tailwind (gradient border on focus)
9. Accept className prop

**Validation**:
- Component uses React.forwardRef
- Empty input blocked
- Enter key triggers submit
- Disabled state works correctly
- Mobile-friendly (44px touch target)

**Reference**: `specs/002-call-this-new/contracts/component-contracts.ts`

---

### T017: EmailCapture Component [P]
**File**: `src/components/ui/email-capture.tsx`
**Dependencies**: T002
**Parallel**: Yes

Create optional email capture field.

**Actions**:
1. Create `src/components/ui/email-capture.tsx`
2. Define `EmailCaptureProps` interface (email, onChange, error, disabled)
3. Implement component with React.forwardRef
4. Use HTML input type="email"
5. Validate email format with regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
6. Display "Optional" label clearly (FR-034a)
7. Show validation error if invalid
8. Style with Tailwind
9. Accept className prop

**Validation**:
- Component uses React.forwardRef
- Email validation works correctly
- "Optional" label visible
- Error state displays properly
- Type="email" for HTML5 validation

**Reference**: `specs/002-call-this-new/contracts/component-contracts.ts`

---

### T018: ChatPanel Component [P]
**File**: `src/components/ui/chat-panel.tsx`
**Dependencies**: T002
**Parallel**: Yes

Create floating panel wrapper with expand/collapse.

**Actions**:
1. Create `src/components/ui/chat-panel.tsx`
2. Define `ChatPanelProps` interface (isExpanded, onToggle, children)
3. Implement component with React.forwardRef
4. Position fixed at bottom-right (bottom-4 right-4) (FR-001)
5. Implement expand/collapse animation
6. Add "Ask Me Anything" title (FR-006)
7. Add close button that triggers onToggle
8. Handle Escape key to close (FR-038c)
9. Responsive sizing (mobile: full width -4px margin, desktop: 400px width)
10. Style with gradient colors, backdrop-blur
11. Accept className prop

**Validation**:
- Component uses React.forwardRef
- Positioned bottom-right correctly
- Expands/collapses smoothly
- Escape key closes panel
- Responsive on mobile/desktop
- Z-index prevents interference with page content (FR-036)

**Reference**: `specs/002-call-this-new/contracts/component-contracts.ts`

---

### T019: Chatbot Container Component
**File**: `src/components/ui/chatbot.tsx`
**Dependencies**: T010, T011, T012, T013, T014
**Parallel**: No (uses all other components)

Create main chatbot container that orchestrates all subcomponents.

**Actions**:
1. Create `src/components/ui/chatbot.tsx`
2. Define `ChatbotProps` interface (className, onEmailCapture)
3. Import all child components and `useChatbot` hook
4. Use `useChatbot` hook for state management
5. Render `ChatPanel` as wrapper
6. Map conversation messages to `ChatMessage` components
7. Render `ChatInput` with submit handler
8. Render `EmailCapture` component
9. Display fallback message on API error (FR-030)
10. Show loading indicator during API call (FR-008)
11. Implement React.forwardRef
12. Accept className prop

**Validation**:
- Component uses React.forwardRef
- All child components integrated
- useChatbot hook provides state
- Fallback message displays on error
- Loading indicator shows during API call
- TypeScript strict typing enforced

**Reference**: `specs/002-call-this-new/contracts/component-contracts.ts`

---

## Phase 6: Integration

### T016: Mount Chatbot in App
**File**: `src/App.tsx`
**Dependencies**: T015
**Parallel**: No (modifies main app file)

Integrate chatbot into main application.

**Actions**:
1. Open `src/App.tsx`
2. Import `Chatbot` component from `@/components/ui/chatbot`
3. Add `<Chatbot />` component at end of app (after main content)
4. Ensure chatbot doesn't block existing UI
5. Verify no z-index conflicts
6. Test on mobile and desktop viewports

**Validation**:
- Chatbot visible on page load
- Positioned correctly (bottom-right)
- Doesn't interfere with existing content
- No console errors
- TypeScript compiles successfully

---

### T017: Component Tests [P]
**File**: `tests/unit/chatbot.test.tsx`
**Dependencies**: T015
**Parallel**: Yes (independent test file)

Write unit tests for all chatbot components.

**Actions**:
1. Create `tests/unit/chatbot.test.tsx`
2. Import all components and testing library
3. Test ChatMessage renders user/assistant messages differently
4. Test ChatInput prevents empty submission
5. Test EmailCapture validates email format
6. Test ChatPanel expand/collapse behavior
7. Test Chatbot container orchestration
8. Mock useChatbot hook
9. Test keyboard navigation (Tab, Enter, Escape)

**Validation**:
- All tests pass
- Test coverage >75% for components
- Keyboard navigation verified
- Edge cases tested (empty input, invalid email)

**Reference**: `specs/002-call-this-new/quickstart.md`

---

### T018: Integration Tests [P]
**File**: `tests/integration/chatbot-flow.test.tsx`
**Dependencies**: T016
**Parallel**: Yes (independent test file)

Write end-to-end integration tests for user scenarios.

**Actions**:
1. Create `tests/integration/chatbot-flow.test.tsx`
2. Import App component and testing library
3. Mock OpenAI API responses
4. Test Acceptance Scenario #1: Chatbot visible on load
5. Test Acceptance Scenario #2: Panel expands on click
6. Test Acceptance Scenario #3: Send message and receive response
7. Test Acceptance Scenario #5: Conversation history maintained
8. Test Acceptance Scenario #9: Email capture and validation
9. Test Acceptance Scenario #10: Timeout and fallback message
10. Mock sessionStorage API

**Validation**:
- All acceptance scenarios tested
- API mocks work correctly
- Session storage persistence verified
- Timeout/fallback logic tested
- Tests run in <5 seconds

**Reference**: `specs/002-call-this-new/spec.md` (Acceptance Scenarios)

---

## Phase 7: Validation

### T023: Quickstart Validation Checklist
**File**: N/A (Manual validation)
**Dependencies**: T001-T018
**Parallel**: No (final validation)

Execute quickstart validation checklist to verify all requirements.

**Actions**:
1. Run `npm run dev` and open app
2. Verify chatbot visible bottom-right
3. Test expand/collapse behavior
4. Send test message "What services do you offer?"
5. Verify AI response appears
6. Refresh page and verify conversation restored
7. Test email capture field (valid/invalid)
8. Test keyboard navigation (Tab, Enter, Escape)
9. Test mobile viewport (375px width)
10. Test API error fallback (disconnect network)
11. Run `npm run build` and verify no errors
12. Run `npm test` and verify all tests pass
13. Check Bundle size increase <150KB (including backend dependencies)
14. Verify all 44 functional requirements from spec.md

**Validation**:
- All quickstart phases completed
- All acceptance scenarios pass manual testing
- All automated tests pass
- Build succeeds with no errors
- Bundle size within constraints
- Performance targets met (<200ms load, <50ms interaction)

**Reference**: `specs/002-call-this-new/quickstart.md`

---

## Parallel Execution Guide

### Group 1: Setup & Foundation (Run in parallel)
```bash
# T001: Environment Setup
# T002: TypeScript Type Definitions
```

### Group 2: Backend Setup (Run sequentially after Group 1)
```bash
# T004: Express Server Setup
# T005: Vite Proxy Configuration
# T006: Development Scripts Update
```

### Group 3: Knowledge Base (Run after Group 1)
```bash
# T007: Knowledge Base Content Creation
```

### Group 4: Services & Tests (Run in parallel after Group 2)
```bash
# T008: Backend API Client Service
# T009: Session Storage Service
# T010: Contract Tests
# T011: Session Storage Tests
```

### Group 5: Hooks (Run in parallel after Group 4)
```bash
# T012: useSessionStorage Hook
# T013: useApiChat Hook
```

### Group 6: UI Components (Run in parallel after Group 5)
```bash
# T015: ChatMessage Component
# T016: ChatInput Component
# T017: EmailCapture Component
# T018: ChatPanel Component
```

### Group 7: Integration & Testing (Run sequentially after Group 6)
```bash
# T014: useChatbot Hook
# T019: Chatbot Container Component
# T020: Integration (Mount in App)
# T021: End-to-End Tests
# T022: Test Suite Run
# T023: Quickstart Validation
```

**Total Parallelizable Tasks**: 12 tasks can run concurrently
**Sequential Tasks**: 12 tasks must run in order
**Estimated Time Savings**: ~40-50% with parallel execution
**Backend Note**: Tasks T001-T006 set up Express.js backend for secure API key handling

---

## Dependencies Graph

```
T001 (Backend Deps) ───┐
T002 (Env Setup)       ├──> T004 (Express Server) ──> T005 (Vite Proxy) ──> T006 (Dev Scripts)
T003 (Types) ──────────┤                                                            │
                       │                                                            │
                       ├──> T007 (Knowledge Base)                                   │
                       │                                                            │
                       ├──> T008 (API Client) ────> T010 (Contract Tests)           │
                       │         │                                                  │
                       ├──> T009 (Session Storage)──> T011 (Storage Tests)          │
                       │         │                                                  │
                       │         ├──> T012 (useSessionStorage)                      │
                       │         │                                                  │
                       │         ├──> T013 (useApiChat) ─────────────────────────> T014 (useChatbot)
                       │         │                                                        │
                       ├──> T015 (ChatMessage)                                            │
                       ├──> T016 (ChatInput)                                              │
                       ├──> T017 (EmailCapture)                                           │
                       └──> T018 (ChatPanel)                                              │
                                                                                          │
                                                                 ├──> T019 (Chatbot Container)
                                                                        │
                                                                        ├──> T020 (Mount in App)
                                                                        │      │
                                                                        │      ├──> T021 (E2E Tests)
                                                                        │      │
                                                                        │      ├──> T022 (Test Suite)
                                                                        │      │
                                                                        │      └──> T023 (Validation)
                                                       │             │
                                                       └─────────────┴──> T019 (Validation)
```

---

## Success Criteria

- [ ] All 24 tasks completed (including backend setup)
- [ ] All automated tests passing (unit + integration)
- [ ] TypeScript compilation successful with no errors
- [ ] Vite build successful with no warnings
- [ ] Bundle size increase <150KB (including backend dependencies)
- [ ] All 44 functional requirements from spec.md satisfied
- [ ] All 10 acceptance scenarios pass manual testing
- [ ] Performance targets met (<200ms load, 60fps animations)
- [ ] Chatbot deployed and functional on branch `002-call-this-new`

---

## Architecture Summary

**Backend**: Express.js (~20 lines) with single `/api/chat` endpoint
**Frontend**: React 19.1 with hooks-based components
**Deployment**: Single Node.js application (both frontend + backend)
**Security**: OpenAI API key stored in backend `.env`, never exposed to browser
**Development**: Vite proxies `/api` requests to Express (port 3000)
**Production**: Express serves static frontend from `dist/` + handles API requests

**Key Files Created**:
- `server/index.js` - Express backend
- `src/services/api-client.ts` - Calls `/api/chat` instead of OpenAI directly
- `vite.config.ts` - Proxy configuration
- `.env` - Backend environment variables (OPENAI_API_KEY)

**Backend Tasks**: T001-T006 set up Express.js backend for secure API key handling
**Frontend Tasks**: T007-T023 implement React chatbot UI and integration

---

*Tasks updated with backend architecture on 2025-10-02*
*Original tasks generated from plan.md, data-model.md, contracts/, and quickstart.md*
*See backend-architecture.md for detailed backend implementation guide*
