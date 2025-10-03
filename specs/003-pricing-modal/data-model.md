# Data Model: Pricing Modal

**Feature**: Pricing Modal
**Branch**: `003-pricing-modal`
**Date**: 2025-10-03

---

## Core Data Structures

### PricingTier Interface

Represents a single pricing tier/plan.

```typescript
interface PricingTier {
  /** Unique identifier (e.g., 'basic', 'professional', 'enterprise') */
  id: string;

  /** Display name (e.g., 'Basic', 'Professional', 'Enterprise') */
  name: string;

  /** Short description (e.g., 'Perfect for individuals getting started') */
  tagline: string;

  /** Price display (e.g., '$49/month', 'Custom') */
  price: string;

  /** Array of feature descriptions */
  features: string[];

  /** Whether this tier is highlighted as recommended */
  isRecommended: boolean;

  /** Call-to-action button text (e.g., 'Get Started', 'Contact Sales') */
  ctaText: string;
}
```

---

### PricingModalProps Interface

Props for the main PricingModal component.

```typescript
interface PricingModalProps {
  /** Controls modal visibility */
  open: boolean;

  /** Callback when modal should close */
  onClose: () => void;
}
```

---

### PricingCardProps Interface (Internal)

Props for the internal PricingCard component.

```typescript
interface PricingCardProps {
  /** Pricing tier data */
  tier: PricingTier;

  /** Optional additional CSS classes */
  className?: string;
}
```

---

## Sample Data

### Basic Tier

```typescript
{
  id: 'basic',
  name: 'Basic',
  tagline: 'Perfect for individuals getting started',
  price: '$49/month',
  features: [
    'AI consultation (1 hour/month)',
    'Email support',
    'Basic automation setup',
    'Documentation access',
    'Community forum access'
  ],
  isRecommended: false,
  ctaText: 'Get Started'
}
```

---

### Professional Tier (Recommended)

```typescript
{
  id: 'professional',
  name: 'Professional',
  tagline: 'Ideal for growing businesses',
  price: '$149/month',
  features: [
    'AI consultation (4 hours/month)',
    'Priority email & chat support',
    'Advanced automation workflows',
    'Custom AI integration',
    'Monthly strategy sessions',
    'API access'
  ],
  isRecommended: true,
  ctaText: 'Get Started'
}
```

---

### Enterprise Tier

```typescript
{
  id: 'enterprise',
  name: 'Enterprise',
  tagline: 'For large-scale operations',
  price: 'Custom',
  features: [
    'Unlimited AI consultation',
    '24/7 dedicated support',
    'Enterprise automation suite',
    'Custom AI model training',
    'Dedicated account manager',
    'SLA guarantee',
    'On-premise deployment option'
  ],
  isRecommended: false,
  ctaText: 'Contact Sales'
}
```

---

## Type Exports

All interfaces should be exported from a central types file or defined inline in the component file for MVP.

**Recommended Location**: `src/components/PricingModal.tsx` (inline for MVP)

**Alternative Location**: `src/types/pricing.ts` (if types need to be shared)

---

## Validation Rules

### PricingTier Validation
- `id` must be unique across all tiers
- `name` must not be empty
- `price` must be a non-empty string
- `features` array must contain at least 1 feature
- Only one tier should have `isRecommended: true`
- `ctaText` must be a non-empty string

### Example Validation Function

```typescript
function validatePricingTier(tier: PricingTier): boolean {
  return (
    typeof tier.id === 'string' && tier.id.length > 0 &&
    typeof tier.name === 'string' && tier.name.length > 0 &&
    typeof tier.tagline === 'string' &&
    typeof tier.price === 'string' && tier.price.length > 0 &&
    Array.isArray(tier.features) && tier.features.length > 0 &&
    typeof tier.isRecommended === 'boolean' &&
    typeof tier.ctaText === 'string' && tier.ctaText.length > 0
  );
}

function validatePricingTiers(tiers: PricingTier[]): boolean {
  if (!Array.isArray(tiers) || tiers.length === 0) return false;

  // Check all tiers are valid
  if (!tiers.every(validatePricingTier)) return false;

  // Check IDs are unique
  const ids = tiers.map(t => t.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) return false;

  // Check only one tier is recommended
  const recommendedCount = tiers.filter(t => t.isRecommended).length;
  if (recommendedCount > 1) return false;

  return true;
}
```

---

## Future Enhancements

For future iterations, consider:

### PricingFeature Interface
```typescript
interface PricingFeature {
  text: string;
  included: boolean; // For feature comparison tables
}
```

### Billing Period Toggle
```typescript
interface PricingTier {
  // ... existing fields
  billingPeriod: 'monthly' | 'annual';
  monthlyPrice: string;
  annualPrice: string;
  discount?: string; // e.g., "Save 20%"
}
```

### Additional Fields
- `popular: boolean` (separate from `isRecommended`)
- `highlight: string` (e.g., "Most Popular", "Best Value")
- `color: string` (custom color scheme per tier)
- `order: number` (explicit ordering)

### Backend Integration
```typescript
interface PricingTierAPI {
  // ... existing fields
  stripePriceId?: string; // For Stripe integration
  features: Array<{
    id: string;
    name: string;
    included: boolean;
    limit?: number;
  }>;
}
```

---

## Data Flow

### MVP (Static)
```
PricingModal.tsx (hardcoded data)
  ↓
PRICING_TIERS constant
  ↓
PricingCard components (mapped)
```

### Future (Dynamic)
```
API/CMS (pricing data)
  ↓
React Query / SWR (data fetching)
  ↓
PricingModal.tsx (rendered from API data)
  ↓
PricingCard components (mapped)
```

---

**Data Model Complete**: Ready for component implementation
