/**
 * Component Contracts for Pricing Modal Feature
 * Feature: 003-pricing-modal
 * Date: 2025-10-03
 *
 * This file defines the TypeScript interfaces that serve as contracts
 * between components in the pricing modal feature.
 */

// ============================================================================
// Data Structures
// ============================================================================

/**
 * Represents a single pricing tier/plan
 */
export interface PricingTier {
  /** Unique identifier for the tier (e.g., 'basic', 'professional', 'enterprise') */
  id: string;

  /** Display name of the tier (e.g., 'Basic', 'Professional', 'Enterprise') */
  name: string;

  /** Short description/tagline for the tier */
  tagline: string;

  /** Price display string (e.g., '$49/month', 'Custom') */
  price: string;

  /** Array of feature descriptions included in this tier */
  features: string[];

  /** Whether this tier should be highlighted as recommended/popular */
  isRecommended: boolean;

  /** Text for the call-to-action button (e.g., 'Get Started', 'Contact Sales') */
  ctaText: string;
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * Props for the PricingModal component
 *
 * This is the main modal component that displays all pricing tiers.
 */
export interface PricingModalProps {
  /** Controls whether the modal is visible */
  open: boolean;

  /** Callback function called when the modal should close */
  onClose: () => void;
}

/**
 * Props for the PricingCard component (internal)
 *
 * This component renders a single pricing tier card.
 */
export interface PricingCardProps {
  /** The pricing tier data to display */
  tier: PricingTier;

  /** Optional additional CSS classes for styling */
  className?: string;
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validates a PricingTier object
 * @param tier - The pricing tier to validate
 * @returns true if valid, false otherwise
 */
export function validatePricingTier(tier: PricingTier): boolean {
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

/**
 * Validates an array of pricing tiers
 * @param tiers - Array of pricing tiers to validate
 * @returns true if all tiers are valid and IDs are unique
 */
export function validatePricingTiers(tiers: PricingTier[]): boolean {
  if (!Array.isArray(tiers) || tiers.length === 0) {
    return false;
  }

  // Check all tiers are valid
  if (!tiers.every(validatePricingTier)) {
    return false;
  }

  // Check IDs are unique
  const ids = tiers.map(t => t.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    return false;
  }

  // Check only one tier is recommended
  const recommendedCount = tiers.filter(t => t.isRecommended).length;
  if (recommendedCount > 1) {
    return false;
  }

  return true;
}

// ============================================================================
// Sample Data (for testing)
// ============================================================================

/**
 * Sample pricing tiers for testing and development
 */
export const SAMPLE_PRICING_TIERS: PricingTier[] = [
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
  },
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
  },
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
];
