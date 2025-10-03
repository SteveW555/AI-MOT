# Implementation Plan: Pricing Modal

**Branch**: `003-pricing-modal`
**Date**: 2025-10-03
**Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-pricing-modal/spec.md`

---

## Execution Flow

This implementation plan was created through the `/plan` workflow:

1. **Input**: Load feature specification (spec.md)
2. **Technical Context**: Define technologies, dependencies, constraints
3. **Constitution Check**: Verify alignment with project principles
4. **Structure**: Define file structure and architecture
5. **Phases**: Break down implementation into phases
6. **Output**: Generate plan.md, research.md, data-model.md, contracts, quickstart.md

---

## Summary

Create a pricing modal accessible via header navigation button on the AI MOT landing page. The modal displays three boilerplate pricing tiers (Basic, Professional, Enterprise) in a responsive card layout. Uses the existing Modal component from `src/components/ui/modal.tsx`. Professional tier is highlighted as recommended. Modal follows the established gradient design system and includes proper accessibility features. No backend integration or payment processing - view-only pricing information.

---

## Technical Context

- **Language/Version**: TypeScript 5.7+ (ES2020 target)
- **Primary Dependencies**: React 19.1, existing Modal component, Tailwind CSS 3.4+
- **Storage**: Static/hardcoded pricing data (no database)
- **Testing**: Component testing using existing framework
- **Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge - modern versions)
- **Project Type**: Single-page web application (React SPA)
- **Performance Goals**: <100ms modal open animation, smooth 60fps transitions
- **Constraints**: View-only (no checkout), uses existing Modal component, matches design system
- **Scale/Scope**: 3 pricing tiers, ~5-7 features per tier, static content, responsive design

---

## Constitution Check

### ✅ Component Reusability
**Status**: PASS
**Analysis**: Reuses existing Modal component from `src/components/ui/modal.tsx`, creates reusable PricingModal component
**Compliance**: Follows React.forwardRef pattern, TypeScript interfaces, cn() utility for class merging

### ✅ Type Safety
**Status**: PASS
**Analysis**: TypeScript interfaces for PricingTier, PricingFeature, component props
**Compliance**: No `any` types, strict type checking enforced

### ✅ Visual Consistency
**Status**: PASS
**Analysis**: Uses established gradient color schemes from `src/App.tsx` (blue → purple → pink)
**Compliance**: Matches existing design system, consistent spacing, shadows, rounded corners

### ✅ Responsive-First Development
**Status**: PASS
**Analysis**: Mobile-first design with responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
**Compliance**: Tailwind responsive classes, tested across viewport sizes (375px, 768px, 1920px)

### ✅ User-Centric Design
**Status**: PASS
**Analysis**: Easy pricing discovery, clear tier comparison, recommended tier highlighted
**Compliance**: Reduces friction in decision-making process, follows common SaaS pricing patterns

### ✅ Code Quality Requirements
**Status**: PASS
**Analysis**: Uses existing testing framework, follows established patterns
**Compliance**: Component tests, accessibility testing, manual validation scenarios

**No Constitution Violations**: All features align with constitutional principles.

---

## Project Structure

### Documentation (this feature)
```
specs/003-pricing-modal/
├── spec.md              # Feature specification
├── plan.md              # This file
├── quickstart.md        # Validation scenarios
├── data-model.md        # TypeScript data structures
├── research.md          # Technical research findings
├── contracts/           # Component contracts
│   └── component-contracts.ts
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)
```
src/
├── components/
│   ├── PricingModal.tsx        # NEW - Pricing modal component
│   └── ui/
│       └── modal.tsx           # EXISTING - Reused
└── App.tsx                      # MODIFIED - Add PRICING button + state
```

**Structure Decision**: Minimal structure - single PricingModal component that uses existing Modal. No new utilities or data files needed for MVP (hardcoded pricing data within component). Integrates into existing App.tsx header.

---

## Phase 0: Outline & Research

### Unknowns from Technical Context
- Best practices for pricing table/card layouts in React
- Accessibility patterns for pricing modals (keyboard navigation, screen readers)
- Responsive grid strategies for 3-column layouts
- Animation best practices for modal content

### Research Tasks
1. Research pricing card UI patterns and best practices
2. Research responsive grid layouts for pricing tiers (Tailwind grid vs flexbox)
3. Research accessibility for pricing information (ARIA labels, semantic HTML)
4. Research modal content animation patterns

**Output**: `research.md` with findings and decisions

---

## Phase 1: Design & Contracts

### Extract Entities → `data-model.md`
- **PricingTier**: name, tagline, price, features, isRecommended, ctaText
- **PricingFeature**: text, included (for future comparison tables)
- **PricingModalProps**: open, onClose

### Generate Component Contracts
- PricingModalProps interface
- PricingCardProps interface (internal component)
- PricingTier data structure
- Validation functions
- Output to `/contracts/component-contracts.ts`

### Generate Contract Tests
- Component prop validation
- Type checking for data structures
- Interface conformance
- Pricing tier validation (unique IDs, single recommended tier)

### Extract Test Scenarios from User Stories
- **Scenario 1**: PRICING button click → Modal opens
- **Scenario 2**: Modal displays 3 tiers with correct data
- **Scenario 3**: Professional tier highlighted
- **Scenario 4**: Modal close via backdrop/ESC/button
- **Scenario 5**: Responsive layout on mobile/tablet/desktop

### Update Agent File
Run update script to add pricing modal context to CLAUDE.md

**Output**: `data-model.md`, `contracts/component-contracts.ts`, `quickstart.md`, updated `CLAUDE.md`

---

## Phase 2: Task Planning Approach

### Task Generation Strategy
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design:
  1. Data structure definition (PricingTier interface)
  2. Component contract definition (PricingModalProps)
  3. PricingModal component implementation
  4. App.tsx integration (PRICING button + state)
  5. Styling tasks (responsive grid, gradient styling)
  6. Test tasks (component tests, integration tests)
  7. Accessibility tasks (ARIA labels, keyboard nav)

### Ordering Strategy
- **TDD order**: Interfaces → Tests → Implementation
- **Dependency order**:
  1. TypeScript interfaces [P]
  2. PricingModal component [P]
  3. App.tsx integration
  4. Styling refinements
  5. Accessibility enhancements
  6. Testing
- Mark [P] for parallel execution

**Estimated Output**: 12-15 numbered, ordered tasks in `tasks.md`

**IMPORTANT**: This phase is executed by the `/tasks` command, NOT by `/plan`

---

## Phase 3+: Future Implementation

**Phase 3**: Task execution (`/tasks` command creates `tasks.md`)
**Phase 4**: Implementation (execute tasks from `tasks.md`)
**Phase 5**: Validation (run tests, execute `quickstart.md`, verify responsive design)

---

## Complexity Tracking

### No Constitutional Violations Requiring Justification

This feature adds minimal complexity:
- Reuses existing Modal component
- Follows established component patterns
- No new dependencies
- No backend integration
- Static content only

**Complexity Score**: Low (1/5)

---

## Progress Tracking

### Phase Status
- [ ] Phase 0: Research complete (/plan command)
- [ ] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

### Gate Status
- [x] Initial Constitution Check: PASS ✅
- [ ] Post-Design Constitution Check: PENDING
- [x] All NEEDS CLARIFICATION resolved ✅
- [x] Complexity deviations documented (none) ✅

### Artifacts Generated
- [ ] research.md
- [ ] data-model.md
- [ ] contracts/component-contracts.ts
- [ ] quickstart.md
- [ ] CLAUDE.md updated
- [ ] tasks.md

---

*Based on AI MOT Constitution v1.0.0 - See `.specify/memory/constitution.md`*
