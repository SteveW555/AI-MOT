# Implementation Plan: Ask Me Anything Chatbot

**Branch**: `002-call-this-new` | **Date**: 2025-10-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-call-this-new/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → ✓ Feature spec loaded and analyzed
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → ✓ Project Type detected: Single-page React application (frontend only)
   → ✓ Structure Decision set
3. Fill the Constitution Check section
   → ✓ Constitution check completed
4. Evaluate Constitution Check section
   → ✓ No violations found - all constitutional requirements met
   → ✓ Progress Tracking updated: Initial Constitution Check PASS
5. Execute Phase 0 → research.md
   → ✓ Research completed, NEEDS CLARIFICATION resolved
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, CLAUDE.md
   → ✓ Design artifacts generated
7. Re-evaluate Constitution Check section
   → ✓ No new violations after design
   → ✓ Progress Tracking updated: Post-Design Constitution Check PASS
8. Plan Phase 2 → Task generation approach described
   → ✓ Ready for /tasks command
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 8. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

The Ask Me Anything chatbot is a floating UI component that provides instant answers to visitor questions about AI MOT's services, pricing, booking process, and capabilities. The chatbot integrates with OpenAI's API to generate contextual responses based on a comprehensive knowledge base. Key features include:
- Floating panel (bottom-right) with expand/collapse states
- Conversational AI powered by OpenAI API with 5-second timeout and retry logic
- Session storage for conversation persistence (browser session only)
- Optional email capture for lead generation
- Basic keyboard navigation (Tab/Enter/Escape)
- Responsive design (mobile-first)
- Fallback to booking form on API errors

**Technical Approach**: React functional component with hooks-based state management, browser sessionStorage for persistence, minimal Express.js backend proxy for secure OpenAI API integration, Tailwind CSS for responsive styling following existing design system. Single Node.js deployment with Vite dev server + Express backend.

## Technical Context

**Language/Version**: TypeScript 5.7+ with ES2020 target (frontend), Node.js 18+ with ES modules (backend)
**Primary Dependencies**:
  - Frontend: React 19.1, clsx, tailwind-merge, class-variance-authority
  - Backend: Express.js 4.18+, openai SDK (official)
  - Dev: Vite 6 with proxy configuration
**Storage**: Browser sessionStorage for conversation history (ephemeral), no backend persistence
**Testing**: Vitest + @testing-library/react (as established in project)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge), mobile and desktop
**Project Type**: Full-stack Node.js application - React SPA (frontend) + Express.js API proxy (backend), single deployment
**Performance Goals**: <200ms to interactive, <50ms search/interaction response, 60fps animations, API timeout 5s with 1 retry
**Constraints**: Minimal backend (single endpoint), no database, session storage only, basic keyboard accessibility (no full WCAG), <150KB bundle size increase (including backend)
**Scale/Scope**: Single-user chatbot widget, ~5-10 new UI components, 1 backend API endpoint, 1 minimal Express server (~20 lines), 1 knowledge base markdown document

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Type Safety ✅ PASS
- [x] TypeScript strict mode enabled in project
- [x] All new components will define explicit prop interfaces
- [x] No `any` types unless absolutely necessary
- [x] Hooks will have proper type annotations

### Component Reusability ✅ PASS
- [x] New chatbot components will use React.forwardRef
- [x] All components accept className prop
- [x] Will use cn() utility for class merging
- [x] Follow pattern in `src/components/ui/`

### Responsive-First Development ✅ PASS
- [x] Chatbot panel designed mobile-first (320px minimum)
- [x] Progressive enhancement for tablet/desktop
- [x] All touch targets ≥44px on mobile
- [x] Positioning adapts across viewports

### Visual Consistency ✅ PASS
- [x] Uses existing gradient color scheme (blue → purple → pink)
- [x] Consistent spacing via Tailwind utilities
- [x] Text colors: slate-900 (primary), slate-700 (secondary), slate-600 (descriptions)
- [x] Follows existing card/button patterns

### Technology Constraints ✅ PASS
- [x] React 19.1 with hooks only (no class components)
- [x] TypeScript 5.7+ with strict mode
- [x] Vite 6 build tool (no changes needed)
- [x] Tailwind CSS 3.4+ exclusively (no CSS-in-JS)
- [x] Uses @/ path aliases for imports
- [x] State managed with React hooks (useState, useEffect, etc.)

**Initial Constitution Check**: ✅ PASS - No violations detected
**Post-Design Constitution Check**: ✅ PASS - Design complies with all constitutional requirements

## Project Structure

### Documentation (this feature)
```
specs/002-call-this-new/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command) ✓
├── data-model.md        # Phase 1 output (/plan command) ✓
├── quickstart.md        # Phase 1 output (/plan command) ✓
├── site-and-services.md # Knowledge base content ✓
├── contracts/           # Phase 1 output (/plan command) ✓
│   └── openai-api.md    # OpenAI API contract documentation ✓
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
server/
└── index.js                         # Express.js backend (~20 lines)
                                     # - Single /api/chat endpoint
                                     # - Proxies OpenAI requests
                                     # - Serves static frontend in production

src/
├── components/
│   └── ui/
│       ├── chatbot.tsx              # Main chatbot container component
│       ├── chat-message.tsx         # Individual message component
│       ├── chat-input.tsx           # Input field with validation
│       ├── chat-panel.tsx           # Floating panel wrapper
│       └── email-capture.tsx        # Optional email field component
├── hooks/
│   ├── use-chatbot.ts               # Chatbot state management hook
│   ├── use-session-storage.ts      # Session storage persistence hook
│   └── use-api-chat.ts              # Backend API client hook (renamed from use-openai.ts)
├── services/
│   ├── api-client.ts                # Backend /api/chat client (renamed from openai-client.ts)
│   └── session-storage.ts           # Session storage utilities
├── types/
│   └── chatbot.ts                   # TypeScript interfaces for chatbot
├── data/
│   └── chatbot-knowledge-base.ts    # Knowledge base content as TypeScript constant
└── App.tsx                          # Import and mount chatbot

tests/
├── unit/
│   ├── chatbot.test.tsx             # Chatbot component tests
│   ├── use-chatbot.test.ts          # Hook tests
│   └── api-client.test.ts           # API client tests
└── integration/
    └── chatbot-flow.test.tsx        # End-to-end chatbot interaction tests

vite.config.ts                       # Add proxy: { '/api': 'http://localhost:3000' }
package.json                         # Add scripts: "dev:server", "dev:client", "dev" (concurrently)
.env                                 # OPENAI_API_KEY (backend only, no VITE_ prefix)
```

**Structure Decision**: Full-stack Node.js application with React frontend + Express backend in single deployment. The chatbot frontend is implemented as a reusable component tree following the established `src/components/ui/` pattern. Custom hooks encapsulate state management and API integration. A minimal Express.js backend (~20 lines) provides a single `/api/chat` endpoint that proxies requests to OpenAI, keeping the API key secure on the server. In development, Vite dev server proxies `/api` requests to Express. In production, Express serves the built React app from `dist/` folder. TypeScript types defined in `src/types/chatbot.ts` ensure type safety across frontend modules.

## Phase 0: Outline & Research ✅ COMPLETE

See [research.md](./research.md) for full details.

**Decisions Made**:
1. **API Integration**: OpenAI Chat Completions API with native fetch
2. **Storage**: Custom hook wrapping sessionStorage
3. **Timeout/Retry**: AbortController + setTimeout pattern
4. **Email Validation**: HTML5 + regex
5. **Knowledge Base**: Markdown → TypeScript constant
6. **Keyboard Nav**: Native event handlers

## Phase 1: Design & Contracts ✅ COMPLETE

### Generated Artifacts
- [x] **data-model.md**: Entity schemas, validation rules, state transitions
- [x] **contracts/openai-api.md**: OpenAI API contract and test specifications
- [x] **contracts/component-contracts.ts**: TypeScript component prop interfaces
- [x] **quickstart.md**: Developer setup and validation guide
- [x] **site-and-services.md**: Comprehensive knowledge base content
- [x] **CLAUDE.md**: Updated agent context with chatbot feature

### Key Design Decisions

**Data Model**: 4 core entities (ChatMessage, Conversation, ChatbotConfig, SessionStorage schema)
**API Contract**: OpenAI Chat Completions with timeout/retry logic
**Component Hierarchy**:
```
Chatbot (container)
├── ChatPanel (floating wrapper)
│   ├── ChatMessage[] (message list)
│   ├── ChatInput (user input)
│   └── EmailCapture (optional)
```

**State Management**: Custom `useChatbot` hook managing conversation state, API calls, session storage
**Testing Strategy**: TDD with contract tests → unit tests → integration tests

## Phase 2: Task Planning Approach

*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
1. Load `.specify/templates/tasks-template.md` as base template
2. Generate tasks from Phase 1 design artifacts:
   - **From data-model.md**: Type definition tasks
   - **From contracts/**: API client + contract test tasks
   - **From component-contracts.ts**: Component scaffold tasks
   - **From quickstart.md**: Integration test tasks
3. Order tasks using TDD approach:
   - Tests before implementation
   - Models → Services → Hooks → Components → Integration

**Task Categories**:
- **Setup**: (1 task) Environment variables, dependencies
- **Type Definitions**: (1 task) `src/types/chatbot.ts`
- **Knowledge Base**: (1 task) `site-and-services.md` → TypeScript
- **Services Layer**: (3 tasks) OpenAI client, session storage, utilities
- **Contract Tests**: (2 tasks) API contract tests, component tests
- **Custom Hooks**: (3 tasks) useChatbot, useSessionStorage, useOpenAI
- **UI Components**: (5 tasks) ChatPanel, ChatMessage, ChatInput, EmailCapture, Chatbot
- **Integration**: (2 tasks) Mount in App.tsx, end-to-end tests
- **Quickstart Validation**: (1 task) Run quickstart checklist

**Ordering Strategy**:
```
1. Setup & Types (parallel)
2. Knowledge Base Content
3. Services + Contract Tests (parallel)
4. Custom Hooks + Unit Tests (parallel)
5. UI Components + Component Tests (parallel with dependencies)
6. Integration (App.tsx mount + E2E tests)
7. Validation (Quickstart checklist)
```

**Estimated Output**: 18-20 numbered, dependency-ordered tasks in tasks.md

**Parallel Execution Markers**:
- Tasks marked [P] can run concurrently (independent files)
- Most component, hook, and service tasks can be parallelized
- Integration tasks must run sequentially after all components complete

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following constitutional principles)
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

*No constitutional violations detected - this section is empty*

## Progress Tracking

**Phase Status**:
- [x] Phase 0: Research complete (/plan command) ✓
- [x] Phase 1: Design complete (/plan command) ✓
- [x] Phase 2: Task planning approach described (/plan command) ✓
- [ ] Phase 3: Tasks generated (/tasks command) - READY TO RUN
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS ✓
- [x] Post-Design Constitution Check: PASS ✓
- [x] All NEEDS CLARIFICATION resolved ✓
- [x] Complexity deviations documented (N/A - no violations)

**Artifact Generation**:
- [x] research.md created
- [x] data-model.md created
- [x] contracts/openai-api.md created
- [x] contracts/component-contracts.ts created
- [x] quickstart.md created
- [x] site-and-services.md created
- [x] CLAUDE.md updated

---

## Next Steps

✅ **Planning Complete** - All Phase 0 and Phase 1 artifacts generated successfully.

**Ready for**: `/tasks` command to generate implementation tasks

**Command**: Run `/tasks` to create `tasks.md` with 18-20 dependency-ordered implementation tasks

---

*Based on Constitution v1.0.0 - See `/.specify/memory/constitution.md`*
