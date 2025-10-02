# Quickstart Guide: Ask Me Anything Chatbot

**Feature**: Ask Me Anything Chatbot
**Branch**: `002-call-this-new`
**Date**: 2025-10-02

## Overview

This guide provides step-by-step instructions for implementing and validating the "Ask Me Anything" chatbot feature. Follow this guide to ensure all functional requirements are met and the implementation matches the specification.

---

## Prerequisites

### Required Knowledge
- React 19.1 with hooks
- TypeScript 5.7+ (strict mode)
- Tailwind CSS 3.4+
- Vitest testing framework
- OpenAI API basics

### Required Tools
- Node.js 18+ and npm
- Code editor (VS Code recommended)
- Modern web browser (Chrome/Firefox/Safari/Edge)
- OpenAI API key (for testing)

---

## Phase 1: Environment Setup

### Step 1: Configure Environment Variables

Create or update `.env.local` in project root:

```bash
# OpenAI API Configuration
VITE_OPENAI_API_KEY=sk-your-api-key-here
```

**Validation**:
```bash
# Verify environment variable is set
echo $VITE_OPENAI_API_KEY  # Should output your API key
```

### Step 2: Install Dependencies (if needed)

```bash
# All dependencies should already be installed
# Verify current packages
npm list react react-dom typescript vitest
```

**Expected Output**:
- `react@19.1.x`
- `react-dom@19.1.x`
- `typescript@5.7.x`
- `vitest@1.x.x`

---

## Phase 2: Implementation Checklist

### Step 1: Create Type Definitions

**File**: `src/types/chatbot.ts`

```typescript
// Copy interfaces from specs/002-call-this-new/data-model.md
export interface ChatMessage { /* ... */ }
export interface Conversation { /* ... */ }
export interface ChatbotConfig { /* ... */ }
export interface ChatbotSessionStorage { /* ... */ }
```

**Validation**:
```bash
# TypeScript should compile without errors
npm run build
```

### Step 2: Create Knowledge Base

**File**: `src/data/chatbot-knowledge-base.ts`

```typescript
// Copy content from specs/002-call-this-new/site-and-services.md
export const KNOWLEDGE_BASE = `
# AI MOT Knowledge Base
...
` as const
```

**Validation**:
- Open file in editor
- Verify syntax highlighting (no red squiggles)
- Verify `as const` assertion

### Step 3: Implement Services Layer

**Files**:
- `src/services/openai-client.ts` (API integration)
- `src/services/session-storage.ts` (Storage utilities)

**Contract Reference**: `specs/002-call-this-new/contracts/openai-api.md`

**Validation**:
```bash
# Run contract tests
npm test -- openai-client.test.ts
```

### Step 4: Implement Custom Hooks

**Files**:
- `src/hooks/use-chatbot.ts`
- `src/hooks/use-session-storage.ts`
- `src/hooks/use-openai.ts` (optional)

**Contract Reference**: `specs/002-call-this-new/contracts/component-contracts.ts`

**Validation**:
```bash
# Run hook tests
npm test -- use-chatbot.test.ts
npm test -- use-session-storage.test.ts
```

### Step 5: Implement UI Components

**Files**:
- `src/components/ui/chatbot.tsx`
- `src/components/ui/chat-panel.tsx`
- `src/components/ui/chat-message.tsx`
- `src/components/ui/chat-input.tsx`
- `src/components/ui/email-capture.tsx`

**Contract Reference**: `specs/002-call-this-new/contracts/component-contracts.ts`

**Validation**:
```bash
# Run component tests
npm test -- chatbot.test.tsx
npm test -- chat-panel.test.tsx
npm test -- chat-message.test.tsx
npm test -- chat-input.test.tsx
npm test -- email-capture.test.tsx
```

### Step 6: Integrate into App

**File**: `src/App.tsx`

```typescript
import { Chatbot } from '@/components/ui/chatbot'
import { KNOWLEDGE_BASE } from '@/data/chatbot-knowledge-base'

function App() {
  return (
    <>
      {/* Existing app content */}

      {/* Chatbot */}
      <Chatbot
        config={{
          apiKey: import.meta.env.VITE_OPENAI_API_KEY,
          model: 'gpt-4-turbo',
          systemPrompt: KNOWLEDGE_BASE
        }}
      />
    </>
  )
}
```

**Validation**:
```bash
# Start dev server
npm run dev

# Open browser to http://localhost:5173
# Verify chatbot appears in bottom-right corner
```

---

## Phase 3: Functional Validation

### Acceptance Scenario Testing

Use these scenarios from `spec.md` to validate implementation:

#### Scenario 1: Panel Visibility (FR-001, FR-006)

**Given**: User is browsing the AI MOT landing page
**When**: They look toward the bottom right corner
**Then**: They see a floating chatbot panel labeled "Ask Me Anything"

**Manual Test**:
1. Navigate to `http://localhost:5173`
2. Scroll to bottom-right corner
3. ✅ Verify panel is visible
4. ✅ Verify "Ask Me Anything" title

#### Scenario 2: Panel Expansion (FR-002, FR-003, FR-004)

**Given**: Chatbot panel is visible
**When**: User clicks on it
**Then**: Panel expands showing input box and response area

**Manual Test**:
1. Click chatbot panel
2. ✅ Verify panel expands (animation should be smooth)
3. ✅ Verify input box is visible
4. ✅ Verify response area is visible
5. ✅ Verify close button is visible

#### Scenario 3: Question Answering (FR-011, FR-016)

**Given**: Chatbot is open
**When**: User types "What services do you offer?" and submits
**Then**: System displays comprehensive answer about services

**Manual Test**:
1. Expand chatbot
2. Type "What services do you offer?"
3. Click Send or press Enter
4. ✅ Verify loading indicator appears
5. ✅ Verify response includes: consultation, audit, implementation, training
6. ✅ Verify response context is relevant

**Automated Test**:
```bash
npm test -- chatbot-flow.test.tsx
```

#### Scenario 4: Pricing Questions (FR-014)

**Given**: Chatbot is open
**When**: User asks "How much does an initial consultation cost?"
**Then**: System provides pricing information or guidance

**Manual Test**:
1. Type "How much does an initial consultation cost?"
2. Submit message
3. ✅ Verify response mentions pricing or booking process

#### Scenario 5: Conversation History (FR-016, FR-033)

**Given**: Chatbot has answered a question
**When**: User asks a follow-up question
**Then**: Conversation history is maintained and response is contextual

**Manual Test**:
1. Ask: "What services do you offer?"
2. Wait for response
3. Ask: "How much does that cost?"
4. ✅ Verify second response references first question context
5. Refresh page
6. ✅ Verify conversation is restored from sessionStorage

#### Scenario 6: Panel Close (FR-009)

**Given**: Chatbot is expanded
**When**: User clicks outside panel or closes it
**Then**: Panel collapses/minimizes

**Manual Test**:
1. Expand chatbot
2. Click outside panel
3. ✅ Verify panel collapses
4. Expand again
5. Click close button (X)
6. ✅ Verify panel collapses
7. Expand again
8. Press Escape key
9. ✅ Verify panel collapses

#### Scenario 7: Out-of-Scope Questions (FR-017, FR-018)

**Given**: User asks off-topic question
**When**: System processes query
**Then**: It politely redirects to relevant topics

**Manual Test**:
1. Ask: "What's the weather today?"
2. ✅ Verify response redirects to AI MOT services

#### Scenario 8: Mobile Responsiveness (FR-007)

**Given**: User is on mobile device
**When**: They interact with chatbot
**Then**: Panel is appropriately sized

**Manual Test**:
1. Open browser DevTools
2. Toggle device emulation (iPhone SE, 375px width)
3. ✅ Verify chatbot is visible and accessible
4. ✅ Verify panel doesn't overflow viewport
5. ✅ Verify touch targets are ≥44px

#### Scenario 9: Email Capture (FR-034)

**Given**: Chatbot is open
**When**: User provides email in email field
**Then**: Email is validated and stored

**Manual Test**:
1. Expand chatbot
2. Locate email input (should say "optional")
3. Enter invalid email: "test"
4. ✅ Verify validation error appears
5. Enter valid email: "test@example.com"
6. ✅ Verify no error
7. Send a message
8. Open browser DevTools → Application → Session Storage
9. ✅ Verify email is saved in conversation object

#### Scenario 10: Timeout and Retry (FR-030, FR-031)

**Given**: API request times out
**When**: System retries once and fails again
**Then**: Fallback message with booking redirect is displayed

**Manual Test** (requires network throttling):
1. Open browser DevTools → Network
2. Set throttling to "Offline"
3. Type message and submit
4. ✅ Verify loading indicator appears
5. ✅ Verify timeout after 5 seconds
6. ✅ Verify retry attempt
7. ✅ Verify fallback message: "I'm unavailable right now. Would you like to book a consultation directly?"
8. ✅ Verify booking button/link is present

**Automated Test**:
```bash
npm test -- openai-client.test.ts --grep "timeout"
```

---

## Phase 4: Edge Case Validation

### Edge Case 1: Empty Message Submission (FR-010)

**Test**:
1. Expand chatbot
2. Leave input empty and click Send
3. ✅ Verify submit button is disabled OR
4. ✅ Verify validation error appears

### Edge Case 2: Very Long Message (Spec: Edge Cases)

**Test**:
1. Paste 500-word message into input
2. ✅ Verify character count indicator (if enabled)
3. ✅ Verify validation at 4000 character limit
4. If under limit, submit and verify API handles it

### Edge Case 3: Rapid Message Submission (Spec: Edge Cases)

**Test**:
1. Type message and click Send
2. Immediately type another message and click Send
3. ✅ Verify second message is queued (input disabled during loading)
4. ✅ Verify both messages appear in order

### Edge Case 4: Session Refresh (FR-033)

**Test**:
1. Send 3-4 messages
2. Refresh browser page (F5 or Cmd+R)
3. ✅ Verify conversation is restored
4. ✅ Verify all messages are present
5. Close browser tab
6. Open new tab to same URL
7. ✅ Verify conversation is cleared (new session)

### Edge Case 5: API Rate Limiting (FR-032)

**Test** (requires API key with low quota):
1. Send 10+ messages rapidly
2. ✅ Verify rate limit error is caught
3. ✅ Verify fallback message is displayed

---

## Phase 5: Performance Validation

### Load Time (FR-037)

**Test**:
```bash
# Build production bundle
npm run build

# Serve production build
npm run preview

# Open browser DevTools → Performance
# Record page load
```

**Validation**:
- ✅ Page loads in <200ms to interactive
- ✅ Chatbot doesn't block main page rendering
- ✅ No layout shift when chatbot loads

### Bundle Size (Spec: Performance)

**Test**:
```bash
npm run build

# Check dist/ folder size
ls -lh dist/assets/*.js
```

**Validation**:
- ✅ Total chatbot code <100KB (components + hooks + services)
- ✅ No duplicate dependencies
- ✅ Tree-shaking removes unused code

### Animation Performance (Spec: Performance)

**Test**:
1. Open DevTools → Performance
2. Start recording
3. Click chatbot to expand
4. Stop recording

**Validation**:
- ✅ Animation runs at 60fps (16.67ms per frame)
- ✅ No layout thrashing
- ✅ GPU-accelerated transforms used

### API Response Time (FR-031)

**Test**:
1. Open DevTools → Network
2. Send message
3. Monitor API request timing

**Validation**:
- ✅ Timeout set to 5000ms
- ✅ Request aborted after timeout
- ✅ Retry attempt made
- ✅ Total max time: 10 seconds (5s × 2 attempts)

---

## Phase 6: Accessibility Validation

### Keyboard Navigation (FR-038)

**Test**:
1. Navigate page using Tab key only
2. ✅ Verify chatbot panel is reachable
3. ✅ Verify focus order: panel → input → send button → email → close
4. Press Enter on panel (when collapsed)
5. ✅ Verify panel expands
6. Type message and press Enter
7. ✅ Verify message submits
8. Press Escape
9. ✅ Verify panel closes

### Focus Management

**Test**:
1. Click chatbot to expand
2. ✅ Verify focus moves to input field
3. Send message
4. ✅ Verify focus returns to input after response
5. Click close button
6. ✅ Verify focus returns to panel toggle

### Visual Indicators

**Test**:
1. Use Tab to focus each interactive element
2. ✅ Verify focus ring is visible (blue outline)
3. ✅ Verify focus ring color contrast ≥3:1
4. ✅ Verify hover states are distinct from focus states

---

## Phase 7: Cross-Browser Validation

### Browser Matrix

Test in the following browsers (FR-039):

| Browser | Version | Viewport | Status |
|---------|---------|----------|--------|
| Chrome | Latest | Desktop | ☐ |
| Chrome | Latest | Mobile | ☐ |
| Firefox | Latest | Desktop | ☐ |
| Firefox | Latest | Mobile | ☐ |
| Safari | Latest | Desktop | ☐ |
| Safari | Latest | Mobile (iOS) | ☐ |
| Edge | Latest | Desktop | ☐ |

**For each browser**:
1. ✅ Panel renders correctly
2. ✅ Expand/collapse animation works
3. ✅ Message submission works
4. ✅ API integration works
5. ✅ Session storage persists
6. ✅ Email validation works
7. ✅ Keyboard navigation works

---

## Phase 8: Security Validation

### API Key Protection

**Test**:
```bash
# Build production bundle
npm run build

# Search for API key in bundle
grep -r "sk-" dist/

# Expected: No matches (key should not be in bundle if using proxy)
```

**Validation**:
- ✅ API key not exposed in client bundle
- ✅ Environment variable loaded at build time only
- ✅ Consider backend proxy for production (recommended)

### Input Sanitization

**Test**:
1. Enter HTML in message: `<script>alert('xss')</script>`
2. Submit message
3. ✅ Verify script tags are not executed
4. ✅ Verify message displays as plain text

**Test**:
1. Enter SQL injection attempt: `'; DROP TABLE users; --`
2. ✅ Verify message is sent as-is (no server-side execution)

### Session Storage Security

**Test**:
1. Open DevTools → Application → Session Storage
2. ✅ Verify only conversation data is stored
3. ✅ Verify no sensitive data (passwords, tokens) stored
4. ✅ Verify data clears on browser close

---

## Phase 9: Test Suite Validation

### Unit Tests

**Run all unit tests**:
```bash
npm test
```

**Expected Coverage**:
- ✅ Hooks: 100% coverage
- ✅ Services: 100% coverage
- ✅ Components: ≥80% coverage
- ✅ All tests passing

**Coverage Report**:
```bash
npm test -- --coverage
```

### Integration Tests

**Run integration tests**:
```bash
npm test -- chatbot-flow.test.tsx
```

**Scenarios Covered**:
- ✅ Full conversation flow (user message → API → response)
- ✅ Error handling with fallback
- ✅ Session storage persistence
- ✅ Email capture flow

### Contract Tests

**Run contract tests**:
```bash
npm test -- openai-client.test.ts
```

**Scenarios Covered**:
- ✅ Request format validation
- ✅ Response parsing
- ✅ Error handling (401, 429, 500, 503)
- ✅ Timeout and retry logic

---

## Phase 10: Final Validation Checklist

### Functional Requirements

**UI & Interaction**:
- [ ] FR-001: Floating panel in bottom-right corner
- [ ] FR-002: Collapsed/expanded states
- [ ] FR-003: Prompt input box
- [ ] FR-004: Response display area
- [ ] FR-005: Message submission (type + submit)
- [ ] FR-006: "Ask Me Anything" title
- [ ] FR-007: Responsive design (mobile/tablet/desktop)
- [ ] FR-008: Loading indicator
- [ ] FR-009: Close/minimize functionality
- [ ] FR-010: Empty message prevention

**Content & Responses**:
- [ ] FR-011: Answers about services
- [ ] FR-012: Answers about booking process
- [ ] FR-013: Answers about value proposition
- [ ] FR-014: Answers about pricing
- [ ] FR-015: Answers technical questions
- [ ] FR-016: Maintains conversation context
- [ ] FR-017: Fallback responses
- [ ] FR-018: Redirects off-topic questions

**API & Integration**:
- [ ] FR-028: Connects to OpenAI API
- [ ] FR-029: Uses API credentials
- [ ] FR-030: Fallback message on errors
- [ ] FR-030a: Clickable booking link in fallback
- [ ] FR-031: 5s timeout with retry
- [ ] FR-031a: Loading indicator during retry
- [ ] FR-032: Handles rate limiting

**Data & Privacy**:
- [ ] FR-033: Session storage persistence
- [ ] FR-033a: Restore on page refresh
- [ ] FR-033b: Clear on browser close
- [ ] FR-034: Optional email capture
- [ ] FR-034a: Email marked as optional
- [ ] FR-034b: Email validation
- [ ] FR-034c: No other PII collected

**Performance & Accessibility**:
- [ ] FR-036: Doesn't interfere with page
- [ ] FR-037: Non-blocking load
- [ ] FR-038: Keyboard navigation (Tab/Enter/Escape)
- [ ] FR-038a: Tab navigation works
- [ ] FR-038b: Enter submits message
- [ ] FR-038c: Escape closes panel
- [ ] FR-039: Works in modern browsers

### Constitutional Compliance

- [ ] TypeScript strict mode (no `any` types)
- [ ] All components use React.forwardRef
- [ ] All components accept className prop
- [ ] cn() utility used for class merging
- [ ] Mobile-first responsive design
- [ ] Gradient color scheme (blue → purple → pink)
- [ ] Tailwind utilities only (no custom CSS)
- [ ] @/ path aliases for imports
- [ ] Bundle size <100KB increase

---

## Troubleshooting

### Common Issues

#### Issue: "API key not found"
**Solution**: Verify `.env.local` exists with `VITE_OPENAI_API_KEY=sk-...`

#### Issue: "TypeScript errors on build"
**Solution**: Run `npm run build` and fix type errors. No `any` types allowed.

#### Issue: "Conversation not persisting"
**Solution**: Check browser DevTools → Application → Session Storage for data.

#### Issue: "Chatbot not visible"
**Solution**: Check z-index, positioning (fixed), and bottom-right coordinates.

#### Issue: "API timeout not working"
**Solution**: Verify AbortController implementation and timeout value (5000ms).

#### Issue: "Tests failing"
**Solution**: Run `npm test -- --watch` and check error messages. Mock API calls properly.

---

## Success Criteria

Implementation is complete when:

✅ All 44 functional requirements pass validation
✅ All acceptance scenarios work as specified
✅ All edge cases handled gracefully
✅ Performance targets met (<200ms load, 60fps animations)
✅ Test suite passes (100% hooks/services, 80% components)
✅ Cross-browser compatibility confirmed
✅ Security validation passed
✅ Constitutional compliance verified

---

## Next Steps After Validation

1. **Code Review**: Request review from team
2. **QA Testing**: Share with QA for exploratory testing
3. **Staging Deployment**: Deploy to staging environment
4. **User Acceptance**: Get stakeholder approval
5. **Production Deployment**: Merge to main and deploy
6. **Monitoring**: Track API usage, error rates, user engagement

---

## Support Resources

- **Specification**: `specs/002-call-this-new/spec.md`
- **Planning Doc**: `specs/002-call-this-new/plan.md`
- **Data Model**: `specs/002-call-this-new/data-model.md`
- **API Contract**: `specs/002-call-this-new/contracts/openai-api.md`
- **Component Contracts**: `specs/002-call-this-new/contracts/component-contracts.ts`
- **Knowledge Base**: `specs/002-call-this-new/site-and-services.md`

---

*Quickstart guide version: 1.0.0*
*Last updated: 2025-10-02*
