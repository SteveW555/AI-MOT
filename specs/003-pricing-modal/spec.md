# Feature Specification: Pricing Modal

**Feature Branch**: `003-pricing-modal`
**Created**: 2025-10-03
**Status**: Ready for Implementation
**Input**: User request to add pricing button and modal with tiered pricing

---

## Execution Flow

This specification was created through the `/specify` workflow:

1. **User Input**: Request to add pricing modal with tiered pricing structure
2. **Clarification**: Resolved 4 key questions (modal vs page, pricing model, purchase capability, specific pricing)
3. **User Scenarios**: Defined primary user story and 5 acceptance scenarios
4. **Requirements**: Generated 13 functional requirements
5. **Entities**: Identified key entities (PricingTier, PricingModal, etc.)
6. **Validation**: Passed review checklist

---

## Quick Guidelines

- **Focus**: WHAT users need and WHY
- **Avoid**: HOW to implement (that's in plan.md)
- **Audience**: Written for business stakeholders, product managers, designers
- **Testability**: All requirements must be verifiable

---

## Clarifications

### Q1: Should pricing be a separate page or modal?
**A**: Modal overlay on the landing page

**Reasoning**: Keeps users on the main page, reduces navigation friction, better for conversion. Modal allows quick pricing review without losing context.

---

### Q2: What pricing model should be used?
**A**: Tiered pricing (Basic, Pro, Enterprise)

**Reasoning**: Three tiers provide clear value progression, common SaaS pattern, supports different customer segments.

---

### Q3: Do you have specific pricing amounts?
**A**: Not yet, use boilerplate pricing

**Reasoning**: Feature focuses on UI/UX implementation. Actual pricing will be determined later based on market research.

---

### Q4: Should users be able to purchase directly?
**A**: No, view-only for MVP

**Reasoning**: Pricing modal is informational only. Purchase/checkout integration is out of scope for this feature.

---

## User Scenarios & Testing

### Primary User Story

**As a** potential customer visiting the AI MOT landing page
**I want to** view pricing information for different service tiers
**So that** I can make an informed decision about which service level suits my needs before booking a consultation

**User Journey**:
1. User lands on AI MOT homepage
2. User sees "PRICING" button in header navigation
3. User clicks PRICING button
4. Modal opens displaying three pricing tiers
5. User reviews Basic, Professional, and Enterprise options
6. User compares features and pricing
7. User identifies Professional tier as recommended
8. User closes modal (backdrop/ESC/close button)
9. User proceeds to booking form or contact

---

### Acceptance Scenarios

**Scenario 1: Modal Open/Close**

**Given** a user is on the landing page
**When** they click the "PRICING" button in the header
**Then** a modal should open displaying three pricing tiers

**And When** the user clicks the backdrop OR presses ESC OR clicks the close button
**Then** the modal should close smoothly

---

**Scenario 2: Pricing Tier Display**

**Given** the pricing modal is open
**When** the user views the modal
**Then** they should see:
- Basic tier: $49/month with 5 features
- Professional tier: $149/month with 6 features (marked as recommended)
- Enterprise tier: Custom pricing with 7 features

**And** each tier should display: name, tagline, price, feature list, CTA button

---

**Scenario 3: Recommended Tier Highlighting**

**Given** the pricing modal is displaying three tiers
**When** the user views the Professional tier
**Then** it should be visually distinguished with:
- "Popular" or "Recommended" badge
- Enhanced styling (gradient button, stronger shadow)
- Clear visual hierarchy showing it's the suggested choice

---

**Scenario 4: Responsive Design**

**Given** a user opens the pricing modal
**When** viewing on different screen sizes:
- Mobile (< 768px): Cards stack vertically in single column
- Tablet (768px - 1024px): Cards display in 2-column grid
- Desktop (> 1024px): Cards display in 3-column grid

**Then** all pricing information remains readable and properly formatted at all sizes

---

**Scenario 5: Accessibility**

**Given** a keyboard-only user opens the pricing modal
**When** they press Tab repeatedly
**Then** focus should move through: close button → Basic CTA → Professional CTA → Enterprise CTA → back to close button

**And When** they press ESC
**Then** the modal should close and focus should return to the PRICING button

---

### Edge Cases

**Edge Case 1: Very Small Mobile Screens (< 375px)**
- **Scenario**: User opens pricing modal on iPhone SE (320px width)
- **Expected**: Modal remains scrollable, cards stack vertically, all text remains readable

**Edge Case 2: Long Feature Lists**
- **Scenario**: Enterprise tier has 10+ features
- **Expected**: Card expands vertically, modal becomes scrollable if needed, layout remains balanced

**Edge Case 3: JavaScript Disabled**
- **Scenario**: User has JavaScript disabled in browser
- **Expected**: PRICING button is visible but non-functional (graceful degradation)

**Edge Case 4: Modal and Form Interaction**
- **Scenario**: User has partially filled out the booking form, then opens pricing modal
- **Expected**: Form state is preserved, modal doesn't interfere with form data

---

## Functional Requirements

**FR-001: Header Navigation Button**
System MUST provide a "PRICING" button in the header navigation between "CONTACT" and the "Under Construction" badge.

---

**FR-002: Modal Trigger**
Clicking the PRICING button MUST open a modal overlay displaying pricing information.

---

**FR-003: Three Pricing Tiers**
Pricing modal MUST display exactly three tiers:
- **Basic**: $49/month
- **Professional**: $149/month
- **Enterprise**: Custom pricing

---

**FR-004: Tier Information Display**
Each pricing tier MUST include:
- Tier name (e.g., "Basic", "Professional", "Enterprise")
- Tagline (short description)
- Price (e.g., "$49/month" or "Custom")
- Feature list (minimum 5 features per tier)
- Call-to-action button (e.g., "Get Started", "Contact Sales")

---

**FR-005: Recommended Tier Highlighting**
Professional tier MUST be visually distinguished as the recommended/popular option through:
- Badge label (e.g., "Popular", "Recommended")
- Enhanced visual styling (gradient button, stronger shadow, or border)
- Visual hierarchy that clearly indicates this is the suggested choice

---

**FR-006: Modal Close Mechanisms**
Modal MUST be closable via:
- Clicking the backdrop (area outside modal content)
- Clicking the close button (X icon in modal header)
- Pressing ESC key on keyboard

---

**FR-007: Responsive Layout**
Pricing cards MUST adapt to screen size:
- **Mobile (< 768px)**: Single column layout (cards stack vertically)
- **Tablet (768px - 1024px)**: Two-column grid layout
- **Desktop (> 1024px)**: Three-column grid layout

---

**FR-008: Design System Consistency**
Modal MUST use the established gradient design system:
- Gradient colors: blue → purple → pink
- Consistent shadows, borders, and rounded corners
- Typography matching existing components
- Spacing matching existing design tokens

---

**FR-009: Non-Functional CTA Buttons**
CTA buttons MUST be fully styled with hover effects BUT remain non-functional (view-only, no checkout/contact integration) for MVP.

---

**FR-010: Accessibility Compliance**
Modal MUST include:
- Proper ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`)
- Keyboard focus management (focus trap within modal)
- Keyboard navigation (Tab, ESC keys)
- Focus indicators for all interactive elements

---

**FR-011: Static Content**
Pricing information MUST be static/hardcoded (no backend API integration required for MVP).

---

**FR-012: Body Scroll Prevention**
When modal is open, page body scrolling MUST be prevented to avoid background scroll.

---

**FR-013: React Portal Rendering**
Modal MUST render using React Portal at `document.body` level to ensure proper z-index stacking and accessibility.

---

## Key Entities

### User-Facing Entities

**Pricing Tier** (technical name: `PricingTier`)
A pricing plan/package offered to customers. Contains tier name, description, price, and list of included features.

**Attributes**:
- Name (e.g., "Basic", "Professional", "Enterprise")
- Tagline (short description)
- Price (e.g., "$49/month", "Custom")
- Features (array of feature descriptions)
- Recommended flag (boolean)
- CTA text (e.g., "Get Started", "Contact Sales")

---

**Pricing Feature** (technical name: `PricingFeature`)
An individual feature/benefit included in a pricing tier.

**Attributes**:
- Feature description (text)
- Inclusion status (always true for MVP)

---

**Modal State** (technical name: `ModalState`)
Boolean state controlling whether the pricing modal is visible or hidden.

**States**:
- Open (true): Modal is visible
- Closed (false): Modal is hidden

---

### Component Entities

**Pricing Modal** (technical name: `PricingModal`)
Main modal component that displays all pricing tiers in a grid layout.

**Responsibilities**:
- Render modal container
- Display pricing tier cards
- Handle close events
- Manage focus trap

---

**Pricing Card** (technical name: `PricingCard`)
Individual card component representing one pricing tier.

**Responsibilities**:
- Display tier information (name, tagline, price)
- Render feature list with checkmarks
- Display CTA button
- Apply recommended tier styling if applicable

---

**Modal Component** (technical name: `Modal`)
Reusable modal wrapper component (already exists in codebase).

**Responsibilities**:
- Render backdrop overlay
- Handle click-outside detection
- Manage ESC key handling
- Provide close button
- Implement focus trap
- Prevent body scroll

---

## Review & Acceptance Checklist

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain (all 4 clarifications resolved)
- [x] Requirements are testable and unambiguous (all 13 functional requirements are testable)
- [x] Success criteria are measurable (defined in acceptance scenarios)
- [x] Scope is clearly bounded (modal-only, view-only, no backend)
- [x] Dependencies identified (uses existing Modal component)

### Execution Status
- [x] User description parsed
- [x] Key concepts extracted (pricing display, modal UI, tiered plans)
- [x] Ambiguities marked (4 clarification points identified)
- [x] Clarifications resolved (all 4 resolved in initial session)
- [x] User scenarios defined (5 acceptance scenarios with edge cases)
- [x] Requirements generated (13 requirements: all actionable and testable)
- [x] Entities identified (PricingTier, PricingFeature, ModalState, PricingModal, PricingCard)
- [x] Review checklist passed (all requirements testable and scoped)

---

**Specification Complete**: Ready for implementation planning (/plan command)
