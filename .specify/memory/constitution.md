# AI MOT Constitution

## Core Principles

### I. User-Centric Design
Every feature must prioritize the end-user experience and business value delivery. The primary goal is client acquisition through intuitive interfaces and clear value communication. Features should reduce friction in the booking process while maintaining professional presentation standards.

### II. Responsive-First Development
All UI components and layouts must be designed mobile-first, then progressively enhanced for larger screens. Every visual element must adapt seamlessly across device sizes from mobile phones to desktop displays. Responsive behavior is not optional—it's foundational.

### III. Component Reusability
Build features using composable, reusable UI components. Every component must:
- Use React.forwardRef for proper ref forwarding
- Accept className prop for style extension
- Define clear TypeScript interfaces for type safety
- Leverage the `cn()` utility for class merging
- Follow the established component pattern in `src/components/ui/`

### IV. Type Safety (NON-NEGOTIABLE)
TypeScript strict mode is mandatory. All code must:
- Pass strict type checking without errors
- Define explicit types for all props and state
- Avoid `any` types unless absolutely necessary
- Enforce no unused locals or parameters
- Prevent fallthrough cases in switch statements

### V. Visual Consistency
Maintain cohesive visual identity through:
- Gradient color schemes: blue → purple → pink
- Consistent spacing and typography via Tailwind utilities
- Professional animation and motion design
- Backdrop effects and depth hierarchy
- Custom SVG illustrations that align with brand identity

## Development Standards

### Technology Constraints
- **Framework**: React 19.1 with hooks-based architecture
- **Language**: TypeScript 5.7+ with ES2020 target
- **Build Tool**: Vite 6+ for development and production builds
- **Styling**: Tailwind CSS 3.4+ exclusively (no CSS-in-JS, no styled-components)
- **Component Library**: shadcn/ui-inspired patterns with custom implementations
- **State Management**: React hooks (useState, useEffect, etc.) for local state; no external state libraries unless justified

### Code Quality Requirements
- All components must be functional components using hooks
- No class components allowed
- Path aliases (`@/`) must be used for all internal imports
- Tailwind classes must be merged using `cn()` utility function
- Component variants should use class-variance-authority when needed
- Form state must be managed with React hooks, not uncontrolled components

### Performance Standards
- Production builds must pass TypeScript compilation (`tsc`) with zero errors
- Vite build process must complete without warnings
- Bundle size should be monitored; lazy loading for route-based code splitting when app grows
- Images and SVGs must be optimized for web delivery
- No unnecessary re-renders; use React.memo when appropriate

## Development Workflow

### Feature Development Process
1. **Specification First**: All features must have a clear spec in `specs/` directory before implementation
2. **Component Design**: Identify if feature needs new UI components or uses existing ones
3. **Type Definitions**: Define TypeScript interfaces before implementation
4. **Implementation**: Build feature with responsive design from the start
5. **Visual QA**: Test across multiple viewport sizes (mobile, tablet, desktop)
6. **Form Validation**: Ensure all user inputs have proper validation and error states

### Code Review Requirements
- TypeScript strict mode compliance verified
- Responsive behavior tested on multiple devices
- Tailwind classes properly merged with cn() utility
- Component props properly typed with interfaces
- No hardcoded values that should be in config/constants
- Accessibility considerations addressed (ARIA labels, keyboard navigation)

### Quality Gates
- [ ] TypeScript compilation passes with no errors
- [ ] Vite build succeeds without warnings
- [ ] All form inputs have validation
- [ ] Responsive design tested on mobile, tablet, desktop
- [ ] Component follows established patterns in `src/components/ui/`
- [ ] No console errors or warnings in browser

## Project-Specific Guidelines

### Booking Form Standards
- Multi-step forms must maintain state across steps
- Progress indicators required for all wizards
- Cancel action must reset form state completely
- Submit action must log data (until backend integration)
- Form fields must have proper labels and placeholders
- Date inputs must use native date pickers
- Number inputs must have min/max validation

### Styling Guidelines
- Use Tailwind utility classes; avoid custom CSS unless absolutely necessary
- Gradient backgrounds: `bg-gradient-to-br from-blue-X via-purple-X to-pink-X`
- Card components: minimum border-2, shadow-2xl for prominence
- Backdrop blur: `backdrop-blur-md` for glassmorphism effects
- Spacing: consistent padding/margin scale using Tailwind defaults
- Text colors: slate-900 for primary, slate-700 for secondary, slate-600 for descriptions

### Component Architecture Rules
- Compound components (like Card) must export all sub-components
- Button variants: default (gradient), outline (border)
- All interactive elements need hover and focus states
- Loading states required for async operations
- Error states must be visually distinct

## Governance

This constitution defines the architectural and quality standards for AI MOT. All development must comply with these principles. Deviations require documented justification and approval.

### Compliance Requirements
- All pull requests must verify adherence to type safety and responsive design standards
- New components must follow the established pattern in `src/components/ui/`
- Breaking changes to component APIs require migration plan
- Tech stack additions must be justified and documented

### Amendment Process
- Constitution changes require consensus on architectural impact
- All amendments must update version number and amendment date
- Dependent templates and configurations must be updated in sync

**Version**: 1.0.0 | **Ratified**: 2025-10-02 | **Last Amended**: 2025-10-02
