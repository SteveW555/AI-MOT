# Implementation Tasks: Pricing Modal

**Feature**: Pricing Modal
**Branch**: `003-pricing-modal`
**Date**: 2025-10-03
**Status**: Ready for Implementation

---

## Task List

### Phase 1: Foundation (Contracts & Data Structures)

**Task 1: [P] Create TypeScript interfaces for pricing data**
- **File**: `specs/003-pricing-modal/contracts/component-contracts.ts`
- **Work**:
  - Define `PricingTier`, `PricingModalProps`, `PricingCardProps` interfaces
  - Add validation functions (`validatePricingTier`, `validatePricingTiers`)
  - Add sample data constants (`SAMPLE_PRICING_TIERS`)
- **Estimated**: 30 minutes
- **Dependencies**: None

---

**Task 2: [P] Create data model documentation**
- **File**: `specs/003-pricing-modal/data-model.md`
- **Work**:
  - Document all interfaces with examples
  - Define validation rules
  - Add sample data for all three tiers
  - Document future enhancements
- **Estimated**: 20 minutes
- **Dependencies**: None

---

### Phase 2: Component Implementation

**Task 3: Create PricingModal component shell**
- **File**: `src/components/PricingModal.tsx`
- **Work**:
  - Import Modal component from `src/components/ui/modal.tsx`
  - Define component with PricingModalProps interface
  - Add basic structure (Modal wrapper with title "Pricing")
  - Add TypeScript interfaces inline
- **Estimated**: 15 minutes
- **Dependencies**: Task 1

---

**Task 4: Implement pricing tier data**
- **File**: `src/components/PricingModal.tsx`
- **Work**:
  - Add hardcoded pricing tiers array (Basic, Professional, Enterprise)
  - Use sample data from contracts or define inline
  - Ensure data matches specification requirements
- **Estimated**: 15 minutes
- **Dependencies**: Task 3

---

**Task 5: Create pricing card layout**
- **File**: `src/components/PricingModal.tsx`
- **Work**:
  - Implement responsive grid using Tailwind
  - Mobile (< 768px): `grid-cols-1`
  - Tablet (768px - 1024px): `md:grid-cols-2`
  - Desktop (> 1024px): `lg:grid-cols-3`
  - Add gap spacing (`gap-6`)
- **Estimated**: 20 minutes
- **Dependencies**: Task 4

---

**Task 6: Implement individual pricing card**
- **File**: `src/components/PricingModal.tsx`
- **Work**:
  - Create card container with gradient border
  - Add inner card with gradient background (from-blue-50 via-purple-50 to-pink-50)
  - Structure: header (name, tagline) → price → features → CTA
  - Add shadows (`shadow-lg`) and rounded corners (`rounded-xl`)
- **Estimated**: 30 minutes
- **Dependencies**: Task 5

---

**Task 7: Style pricing card header**
- **File**: `src/components/PricingModal.tsx`
- **Work**:
  - Add tier name styling (`text-2xl font-bold text-slate-900`)
  - Add tagline styling (`text-sm text-slate-600`)
  - Add "Popular" badge for recommended tier
  - Badge: gradient background (blue → purple → pink), white text, rounded-full
- **Estimated**: 20 minutes
- **Dependencies**: Task 6

---

**Task 8: Style price display**
- **File**: `src/components/PricingModal.tsx`
- **Work**:
  - Large price text (`text-4xl font-bold text-slate-900`)
  - Handle "Custom" pricing display for Enterprise tier
  - Add proper spacing (`my-4`)
- **Estimated**: 15 minutes
- **Dependencies**: Task 6

---

**Task 9: Implement feature list**
- **File**: `src/components/PricingModal.tsx`
- **Work**:
  - Create unordered list with checkmark icons
  - Use inline SVG checkmark icon (circle with checkmark path)
  - Style each feature item (`flex items-center gap-3`)
  - Checkmark icon: `w-5 h-5 text-blue-500`
  - Feature text: `text-slate-700`
- **Estimated**: 25 minutes
- **Dependencies**: Task 6

---

**Task 10: Style CTA buttons**
- **File**: `src/components/PricingModal.tsx`
- **Work**:
  - Basic/Enterprise: Border button style (border-2, hover effect)
  - Professional: Gradient button matching form submit button
  - Add hover effects (transform, shadow)
  - Full width (`w-full`), proper padding (`px-6 py-3`)
  - Rounded corners (`rounded-lg`)
- **Estimated**: 20 minutes
- **Dependencies**: Task 6

---

**Task 11: Add recommended tier highlighting**
- **File**: `src/components/PricingModal.tsx`
- **Work**:
  - Add "Popular" badge to Professional tier (if `isRecommended: true`)
  - Enhanced shadow (`shadow-xl` vs `shadow-lg`)
  - Gradient CTA button for recommended tier
  - Optional: Enhanced border or slight scale
- **Estimated**: 15 minutes
- **Dependencies**: Task 7, Task 10

---

### Phase 3: Integration

**Task 12: Add PRICING button to header**
- **File**: `src/App.tsx`
- **Work**:
  - Add button between CONTACT and Under Construction badge
  - Match styling of other nav links (`text-slate-600 hover:text-slate-900`)
  - Add onClick handler placeholder (to be connected in next task)
  - Text: "PRICING"
- **Estimated**: 10 minutes
- **Dependencies**: None

---

**Task 13: Add modal state management**
- **File**: `src/App.tsx`
- **Work**:
  - Add `useState` for `isPricingModalOpen` (boolean)
  - Initialize to `false`
  - Connect to PRICING button onClick (set to `true`)
  - Create `handleClosePricingModal` function (set to `false`)
- **Estimated**: 10 minutes
- **Dependencies**: Task 12

---

**Task 14: Render PricingModal component**
- **File**: `src/App.tsx`
- **Work**:
  - Import PricingModal component
  - Add component at end of JSX (after form section)
  - Pass `open={isPricingModalOpen}` prop
  - Pass `onClose={handleClosePricingModal}` prop
- **Estimated**: 10 minutes
- **Dependencies**: Task 3, Task 13

---

### Phase 4: Refinement

**Task 15: Responsive design testing and fixes**
- **Work**:
  - Test on mobile (375px width)
  - Test on tablet (768px width)
  - Test on desktop (1920px width)
  - Fix any layout issues (card stacking, overflow, spacing)
  - Ensure modal scrolling works on small screens
  - Verify grid layout changes appropriately
- **Estimated**: 30 minutes
- **Dependencies**: Task 5, Task 6

---

**Task 16: Visual design polish**
- **Work**:
  - Verify gradient colors match design system (blue → purple → pink)
  - Check shadows, borders, rounded corners match existing components
  - Ensure hover effects are smooth (transitions)
  - Match styling with `src/App.tsx` design patterns
  - Verify Professional tier stands out visually
- **Estimated**: 20 minutes
- **Dependencies**: All component tasks (3-11)

---

**Task 17: Accessibility enhancements**
- **Work**:
  - Verify Modal component handles focus trap (should be automatic)
  - Test keyboard navigation (Tab through CTA buttons, ESC to close)
  - Check ARIA attributes in Modal component
  - Test with keyboard only (no mouse)
  - Verify focus returns to PRICING button after close
- **Estimated**: 20 minutes
- **Dependencies**: Task 14

---

### Phase 5: Testing & Validation

**Task 18: Manual testing - Modal behavior**
- **Work**:
  - Test open via PRICING button click
  - Test close via backdrop click
  - Test close via ESC key
  - Test close via close button (X)
  - Verify animations are smooth (fade-in/fade-out)
  - Check body scroll prevention when modal is open
- **Estimated**: 15 minutes
- **Dependencies**: Task 14

---

**Task 19: Manual testing - Pricing display**
- **Work**:
  - Verify all three tiers display correctly
  - Check Basic: $49/month, 5 features, "Get Started" button
  - Check Professional: $149/month, 6 features, "Popular" badge, gradient button
  - Check Enterprise: "Custom" price, 7 features, "Contact Sales" button
  - Verify all features render with checkmarks
  - Verify Professional tier is visually highlighted
- **Estimated**: 15 minutes
- **Dependencies**: Tasks 6-11

---

**Task 20: Manual testing - Responsive**
- **Work**:
  - Test on multiple screen sizes (375px, 768px, 1024px, 1920px)
  - Verify grid layout changes appropriately (1 col → 2 col → 3 col)
  - Check mobile scrolling within modal
  - Test on actual devices if possible (phone, tablet)
  - Verify all content remains readable at all sizes
- **Estimated**: 20 minutes
- **Dependencies**: Task 15

---

**Task 21: Cross-browser testing**
- **Work**:
  - Test in Chrome (latest)
  - Test in Firefox (latest)
  - Test in Safari (latest)
  - Test in Edge (latest)
  - Verify consistent behavior across browsers
  - Fix any browser-specific issues (CSS, JavaScript)
- **Estimated**: 30 minutes
- **Dependencies**: All previous tasks

---

**Task 22: Execute quickstart.md validation**
- **Work**:
  - Run through all scenarios in `specs/003-pricing-modal/quickstart.md`
  - Scenario 1: Modal open/close
  - Scenario 2: Pricing tier display
  - Scenario 3: Responsive design
  - Scenario 4: Visual design consistency
  - Scenario 5: Accessibility
  - Scenario 6: CTA button interaction
  - Document any issues found
  - Fix issues and re-test
  - Mark all scenarios as passing
- **Estimated**: 45 minutes
- **Dependencies**: All previous tasks

---

## Task Summary

- **Total Tasks**: 22
- **Parallel Tasks**: 2 (Task 1, Task 2 marked with [P])
- **Estimated Total Time**: 6-7 hours
- **Critical Path**: Tasks 1 → 3 → 4 → 5 → 6 → 9 → 14 → 22

---

## Dependencies Graph

```
Phase 1 (Foundation)
├─ Task 1 [P] → Task 3
└─ Task 2 [P]

Phase 2 (Components)
├─ Task 3 → Task 4 → Task 5 → Task 6
├─ Task 6 → Task 7 → Task 11
├─ Task 6 → Task 8
├─ Task 6 → Task 9
└─ Task 6 → Task 10 → Task 11

Phase 3 (Integration)
├─ Task 12 → Task 13 → Task 14
└─ Task 3 → Task 14

Phase 4 (Refinement)
├─ Task 5, 6 → Task 15
├─ All component tasks → Task 16
└─ Task 14 → Task 17

Phase 5 (Testing)
├─ Task 14 → Task 18
├─ Task 6-11 → Task 19
├─ Task 15 → Task 20
└─ All tasks → Task 21 → Task 22
```

---

## Implementation Notes

- Tasks marked **[P]** can be executed in parallel
- All other tasks should follow dependency order
- Estimated times are for a developer familiar with React and TypeScript
- Testing tasks may reveal issues requiring additional time
- Consider adding automated component tests (not included in this task list for MVP)

---

**Tasks Complete**: Ready for implementation
