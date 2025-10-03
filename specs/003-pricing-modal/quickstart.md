# Quickstart Validation: Pricing Modal

**Feature**: Pricing Modal
**Branch**: `003-pricing-modal`
**Purpose**: Manual validation test scenarios
**Date**: 2025-10-03

---

## Prerequisites

### Environment Setup
1. Development server running (`npm run dev`)
2. Browser with DevTools open (for responsive testing)
3. Keyboard for accessibility testing

### Test Data
Pricing modal should display:
- **Basic tier**: $49/month with 5 features
- **Professional tier**: $149/month with 6 features (marked as recommended)
- **Enterprise tier**: Custom pricing with 7 features

---

## Test Scenarios

### Scenario 1: Modal Open/Close

**Steps**:
1. Navigate to the landing page
2. Locate the "PRICING" button in the header navigation (between CONTACT and Under Construction badge)
3. Click the PRICING button
4. Verify modal opens with smooth animation
5. Click the backdrop (outside the modal content)
6. Verify modal closes
7. Click PRICING button again
8. Press ESC key
9. Verify modal closes
10. Click PRICING button again
11. Click the X close button in the modal header
12. Verify modal closes

**Expected Results**:
- ✅ Modal opens smoothly with fade-in animation
- ✅ Modal closes via backdrop click, ESC key, and close button
- ✅ Body scroll is prevented when modal is open
- ✅ Focus is trapped within modal when open

---

### Scenario 2: Pricing Tier Display

**Steps**:
1. Open the pricing modal
2. Verify three pricing cards are displayed
3. **Check Basic tier**:
   - Name: "Basic"
   - Tagline: "Perfect for individuals getting started"
   - Price: "$49/month"
   - Features: 5 items with checkmarks
   - CTA button: "Get Started"
4. **Check Professional tier**:
   - Name: "Professional"
   - Tagline: "Ideal for growing businesses"
   - Price: "$149/month"
   - Features: 6 items with checkmarks
   - CTA button: "Get Started"
   - Visual indicator: "Popular" or "Recommended" badge
   - Enhanced styling (gradient button)
5. **Check Enterprise tier**:
   - Name: "Enterprise"
   - Tagline: "For large-scale operations"
   - Price: "Custom"
   - Features: 7 items with checkmarks
   - CTA button: "Contact Sales"

**Expected Results**:
- ✅ All three tiers display correctly
- ✅ Professional tier is visually distinguished (badge, gradient button)
- ✅ All features have checkmark icons
- ✅ Pricing information is clear and readable

---

### Scenario 3: Responsive Design

**Steps**:
1. Open pricing modal on desktop (1920px width)
2. Verify cards are displayed in 3-column grid
3. Resize browser to tablet width (768px)
4. Verify cards adjust to 2-column grid or appropriate layout
5. Resize browser to mobile width (375px)
6. Verify cards stack vertically in single column
7. Scroll within modal on mobile
8. Verify all content is accessible

**Expected Results**:
- ✅ Desktop (> 1024px): 3 cards side-by-side
- ✅ Tablet (768px - 1024px): 2 cards per row or stacked
- ✅ Mobile (< 768px): Single column, vertically stacked
- ✅ Modal is scrollable on small screens
- ✅ All content remains readable at all sizes

---

### Scenario 4: Visual Design Consistency

**Steps**:
1. Open pricing modal
2. Verify modal uses gradient border (blue → purple → pink)
3. Verify modal background uses gradient (from-blue-50 via-purple-50 to-pink-50)
4. Verify pricing cards have consistent styling with rest of site
5. Verify shadows and rounded corners match design system
6. Verify hover effects on CTA buttons
7. Check Professional tier gradient button matches form submit button

**Expected Results**:
- ✅ Modal styling matches `App.tsx` design system
- ✅ Gradient colors are consistent throughout (blue → purple → pink)
- ✅ Shadows, borders, and rounded corners match existing components
- ✅ Hover effects are smooth and consistent

---

### Scenario 5: Accessibility

**Steps**:
1. Open pricing modal
2. Press Tab key repeatedly
3. Verify focus moves through: close button → Basic CTA → Professional CTA → Enterprise CTA → back to close button
4. Verify focus is trapped within modal (doesn't escape to page behind)
5. Verify focus indicators are visible
6. Press ESC key
7. Verify modal closes and focus returns to PRICING button
8. Inspect modal with DevTools
9. Verify ARIA attributes: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`

**Expected Results**:
- ✅ Keyboard navigation works correctly
- ✅ Focus trap prevents tabbing outside modal
- ✅ Focus indicators are visible
- ✅ ESC key closes modal
- ✅ Proper ARIA attributes present
- ✅ Modal title is properly labeled

---

### Scenario 6: CTA Button Interaction

**Steps**:
1. Open pricing modal
2. Click "Get Started" button on Basic tier
3. Verify button has hover effect but no action (view-only)
4. Click "Get Started" button on Professional tier
5. Verify button has gradient hover effect but no action
6. Click "Contact Sales" button on Enterprise tier
7. Verify button has hover effect but no action

**Expected Results**:
- ✅ All CTA buttons have visual hover effects
- ✅ No buttons trigger navigation or actions (view-only for MVP)
- ✅ Professional tier button has enhanced gradient styling
- ✅ Buttons are styled consistently with design system

---

## Performance Validation

### Modal Animation Performance

**Steps**:
1. Open/close modal multiple times rapidly
2. Verify smooth 60fps animations
3. Check for any layout shifts or jank
4. Verify modal opens in <100ms

**Expected Results**:
- ✅ Smooth fade-in/fade-out animations
- ✅ No layout shifts
- ✅ Fast modal rendering (<100ms)

---

## Browser Compatibility

Test in:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

Verify all scenarios pass in each browser.

---

## Known Limitations (MVP)

- CTA buttons are non-functional (no checkout/contact integration)
- Pricing data is hardcoded (no backend)
- No analytics tracking on modal interactions
- No A/B testing for pricing display

---

## Success Criteria

All scenarios must pass for feature to be considered complete:

- [ ] Modal opens/closes correctly (Scenario 1)
- [ ] All three pricing tiers display with correct data (Scenario 2)
- [ ] Responsive design works on mobile/tablet/desktop (Scenario 3)
- [ ] Visual design matches established design system (Scenario 4)
- [ ] Accessibility features work (keyboard nav, ARIA, focus trap) (Scenario 5)
- [ ] CTA buttons styled correctly (even if non-functional) (Scenario 6)
- [ ] Performance is smooth (60fps animations, <100ms open time)
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

---

**Quickstart Guide Complete**: Ready for manual validation during implementation
