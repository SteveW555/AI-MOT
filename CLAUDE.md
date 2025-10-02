# AI MOT - Claude Code Context

**Project**: AI MOT Landing Page
**Tech Stack**: React 19.1, TypeScript 5.7+, Vite 6, Tailwind CSS 3.4+
**Architecture**: Single-page application (SPA)

## Project Overview

AI MOT is a landing page for an AI consultancy service featuring:
- Responsive booking form (multi-step wizard)
- Gradient visual design (blue → purple → pink)
- Help documentation system with search

## Current Architecture

### Component Structure
```
src/components/ui/
├── button.tsx       - Reusable button (default, outline variants)
├── card.tsx         - Card compound component (Card, CardHeader, CardTitle, CardDescription, CardContent)
├── input.tsx        - Form input component
├── textarea.tsx     - Multi-line text input
├── label.tsx        - Form label component
├── select.tsx       - Dropdown select component
├── accordion.tsx    - NEW: Collapsible sections for help content
└── search-input.tsx - NEW: Search bar with debouncing
```

### Styling System
- **Tailwind CSS 3.4+**: Utility-first styling
- **cn() utility**: Merges Tailwind classes using clsx + tailwind-merge
- **Gradients**: `bg-gradient-to-br from-blue-X via-purple-X to-pink-X`
- **Mobile-first**: All components designed for mobile, enhanced for desktop

### TypeScript Configuration
- **Strict mode**: Enabled
- **ES2020 target**: Modern JavaScript features
- **Path aliases**: `@/` maps to `./src`
- **No `any` types**: Explicit typing required

## Recent Changes (Feature: 001-help)

### Help Documentation System
**Branch**: `001-help`
**Status**: Planning complete, ready for implementation

#### Architecture Decisions
1. **Routing**: Conditional rendering (no React Router) - useState to toggle between home/help pages
2. **Search**: match-sorter library (~3KB) with 300ms debounce
3. **Testing**: Vitest + @testing-library/react
4. **Content Storage**: TypeScript data files in `src/data/help-content.ts`
5. **Highlighting**: Custom React component (no external library)

#### New Components
- **Accordion**: Collapsible sections with independent expansion, keyboard nav (Enter/Space)
- **SearchInput**: Debounced input with clear button
- **HighlightText**: Highlights search terms in results using `<mark>` tags
- **HelpPage**: Top-level page with search bar + accordion sections

#### Data Model
```typescript
interface HelpSection {
  id: string
  title: string
  content: string
  order: number
  type: 'service' | 'booking' | 'faq'
}

interface FAQItem {
  id: string
  question: string
  answer: string
  order: number
  keywords?: string[]
}

interface SearchResult {
  sourceId: string
  sourceType: 'section' | 'faq'
  title: string
  snippet: string
  matches: Array<{ start: number; end: number }>
  score: number
}
```

#### File Structure
```
src/
├── components/ui/
│   ├── accordion.tsx      - NEW
│   └── search-input.tsx   - NEW
├── pages/
│   └── Help.tsx           - NEW
├── data/
│   └── help-content.ts    - NEW
├── lib/
│   └── search.ts          - NEW: Search logic with match-sorter
├── types/
│   └── help.ts            - NEW: TypeScript interfaces
└── App.tsx                - MODIFIED: Add help page routing
```

## Constitutional Principles

### Component Reusability
- Use React.forwardRef for all UI components
- Accept className prop for style extension
- Define TypeScript interfaces for all props
- Use cn() utility for class merging

### Type Safety (NON-NEGOTIABLE)
- TypeScript strict mode mandatory
- No `any` types unless absolutely necessary
- Explicit types for all props and state

### Visual Consistency
- Gradient color schemes: blue → purple → pink
- Consistent spacing via Tailwind utilities
- Text colors: slate-900 (primary), slate-700 (secondary), slate-600 (descriptions)

### Responsive-First
- Mobile-first design (320px minimum)
- Progressive enhancement for tablet (768px) and desktop (1440px)
- Touch targets minimum 44x44px on mobile

## Development Workflow

### Before Implementing
1. Check `specs/001-help/` for feature documentation
2. Review `data-model.md` for TypeScript interfaces
3. Review `component-contracts.ts` for prop interfaces
4. Follow TDD: Write tests before implementation

### Component Pattern
```typescript
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline'
  // ... other props
}

const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'base-classes',
          variantClasses[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Component.displayName = 'Component'

export { Component }
```

### Testing Pattern
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Component } from './component'

describe('Component', () => {
  it('renders with default props', () => {
    render(<Component />)
    expect(screen.getByRole('...')).toBeInTheDocument()
  })
})
```

## Performance Targets

- **Page Load**: <200ms to interactive
- **Search Response**: <50ms (client-side, after debounce)
- **Animations**: 60fps (16.67ms per frame)
- **Bundle Size**: Keep increases <100KB per feature

## Key Files

- **Constitution**: `.specify/memory/constitution.md`
- **Feature Specs**: `specs/001-help/`
- **Component Contracts**: `specs/001-help/contracts/component-contracts.ts`
- **Quickstart Guide**: `specs/001-help/quickstart.md`

## Common Commands

```bash
# Development
npm run dev

# Type checking
npm run build  # Runs tsc + vite build

# Testing (when implemented)
npm test
```

## Dependencies

### Production
- react: ^19.1
- react-dom: ^19.1
- tailwindcss: ^3.4.17
- clsx: ^2.1.1
- tailwind-merge: ^2.5.5
- class-variance-authority: ^0.7.1
- match-sorter: ^6.3.1 (NEW)

### Development
- typescript: ^5.7.3
- vite: ^6.0.11
- @vitejs/plugin-react: ^4.3.4
- vitest: ^1.0.0 (NEW)
- @testing-library/react: ^14.0.0 (NEW)

## Notes for Claude Code

- Always use `@/` path alias for imports
- Follow existing component patterns in `src/components/ui/`
- Use Tailwind utilities, avoid custom CSS
- Gradient backgrounds follow brand palette
- Test responsive design at 375px, 768px, 1440px viewports
- No screen reader accessibility required (FR-012), standard HTML only

---

*Last Updated: 2025-10-02 (Feature 001-help planning complete)*
