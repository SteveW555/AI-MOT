# Technical Research: Help Documentation System

**Feature**: Help Documentation System
**Branch**: 001-help
**Date**: 2025-10-02

## Research Summary

This document consolidates technical research findings for implementing the help documentation system. All decisions prioritize compatibility with the existing stack (React 19.1, TypeScript 5.7+, Vite 6, Tailwind CSS 3.4+).

---

## 1. React Component Testing Framework

**Decision**: **Vitest** with **@testing-library/react**

**Rationale**:
- **Native Vite Integration**: Vitest is built by the Vite team, ensuring zero-config compatibility
- **Fast Execution**: Uses Vite's transformation pipeline, significantly faster than Jest
- **Modern Features**: Native ESM support, TypeScript out-of-box, watch mode built-in
- **Testing Library Support**: Full compatibility with @testing-library/react for component testing
- **Minimal Setup**: Add `vitest` and `@testing-library/react` to devDependencies, create `vitest.config.ts`

**Alternatives Considered**:
- **Jest**: Requires additional configuration for ESM/TypeScript with Vite, slower transformation
- **React Testing Library alone**: Not a test runner, needs Vitest or Jest underneath
- **Playwright Component Testing**: Overkill for unit/component tests, better for E2E

**Implementation Notes**:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

---

## 2. Client-Side Search Library

**Decision**: **match-sorter** (by Kent C. Dodds)

**Rationale**:
- **Lightweight**: ~3KB gzipped, minimal bundle impact
- **Simple API**: Single function call, no indexing setup required
- **Smart Ranking**: Built-in relevance scoring (exact match > starts-with > contains)
- **TypeScript Native**: Written in TypeScript with excellent type definitions
- **Perfect for Small Datasets**: Optimized for <1000 items, our scale is ~20-30 items
- **React Integration**: Works seamlessly with useState/useMemo patterns

**Alternatives Considered**:
- **fuse.js**: More powerful but heavier (~12KB), overkill for our scale
- **lunr.js**: Requires pre-indexing, adds complexity unnecessary for 20 items
- **Native String.includes()**: Too basic, no ranking or fuzzy matching

**Implementation Notes**:
```typescript
import { matchSorter } from 'match-sorter'
const results = matchSorter(items, searchText, { keys: ['question', 'answer', 'content'] })
```

---

## 3. Accordion Accessibility Pattern

**Decision**: **Basic ARIA with Keyboard Nav (Non-WCAG Compliance)**

**Rationale**:
- **Specification Requirement**: FR-012 explicitly states "does NOT require screen reader accessibility features"
- **Keyboard Support**: Implement basic Enter/Space for expand/collapse
- **Minimal ARIA**: Use `aria-expanded` for state indication (helps all users, not just screen readers)
- **Focus Management**: Standard browser focus, no complex focus trapping
- **React Hooks**: `useState` for expanded state, event handlers for keyboard

**Pattern**:
```typescript
const [expandedSections, setExpandedSections] = useState<string[]>([])

const toggleSection = (id: string) => {
  setExpandedSections(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  )
}

// In JSX:
<button
  onClick={() => toggleSection(id)}
  onKeyDown={(e) => e.key === 'Enter' && toggleSection(id)}
  aria-expanded={expandedSections.includes(id)}
>
```

**Alternatives Considered**:
- **Full WCAG 2.1 Compliance**: Out of scope per FR-012
- **Radix UI Accordion**: Adds dependency, more complex than needed
- **Headless UI**: Similar to Radix, unnecessary for basic pattern

---

## 4. Text Highlighting for Search Results

**Decision**: **Custom React Component** (no external library)

**Rationale**:
- **Simplicity**: Splitting text and wrapping matches is ~20 lines of code
- **Bundle Size**: Zero additional KB
- **Tailwind Integration**: Direct className control for highlight styling
- **TypeScript Safety**: Full type control over props and logic
- **Performance**: No library overhead for such a simple task

**Implementation Approach**:
```typescript
const HighlightText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query) return <>{text}</>

  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 font-semibold">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}
```

**Alternatives Considered**:
- **react-highlight-words**: 15KB+ for functionality we can implement in 20 lines
- **mark.js**: DOM manipulation library, not React-friendly

---

## 5. React Routing Solution

**Decision**: **Conditional Rendering** (no router needed)

**Rationale**:
- **Single Additional Page**: Adding routing library for one page is overkill
- **Simplicity**: useState to track current page, render conditionally
- **Bundle Size**: Zero additional KB vs 45KB+ for React Router
- **Browser History**: Can use window.history.pushState for URL updates if needed
- **Future**: If app grows to 3+ pages, migrate to React Router then

**Implementation Pattern**:
```typescript
// In App.tsx
const [currentPage, setCurrentPage] = useState<'home' | 'help'>('home')

// Update URL when page changes
useEffect(() => {
  const path = currentPage === 'help' ? '/help' : '/'
  window.history.pushState(null, '', path)
}, [currentPage])

// Handle browser back/forward
useEffect(() => {
  const handlePopState = () => {
    setCurrentPage(window.location.pathname === '/help' ? 'help' : 'home')
  }
  window.addEventListener('popstate', handlePopState)
  return () => window.removeEventListener('popstate', handlePopState)
}, [])

return currentPage === 'help' ? <HelpPage /> : <LandingPage />
```

**Alternatives Considered**:
- **React Router v6**: 45KB minified, unnecessary complexity for 2 pages
- **Tanstack Router**: Newer, less stable, still overkill
- **Hash routing**: Works but conditional rendering is cleaner

**Migration Path**: If app reaches 3+ routes, refactor to React Router in future sprint

---

## 6. Search Performance Optimization

**Decision**: **Debounced Input + useMemo** (no pre-indexing)

**Rationale**:
- **Scale**: 20-30 items is tiny, no indexing needed
- **Debouncing**: 300ms delay prevents excessive re-renders during typing
- **Memoization**: useMemo caches search results between renders
- **Performance Target**: <50ms achieved easily with match-sorter on this scale
- **Simplicity**: Two hooks (useDebounce, useMemo), no complex indexing logic

**Implementation Pattern**:
```typescript
// Custom hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// In component
const [searchQuery, setSearchQuery] = useState('')
const debouncedQuery = useDebounce(searchQuery, 300)

const searchResults = useMemo(() => {
  if (!debouncedQuery) return []
  return matchSorter(helpContent, debouncedQuery, {
    keys: ['title', 'content', 'question', 'answer']
  })
}, [debouncedQuery, helpContent])
```

**Alternatives Considered**:
- **Pre-indexing with lunr.js**: Complex setup, no benefit for 20 items
- **Web Workers**: Overkill, search completes in <10ms on this scale
- **Lodash debounce**: Custom hook is lighter and more React-idiomatic

---

## Technology Stack Summary

| Category | Technology | Version | Rationale |
|----------|-----------|---------|-----------|
| Testing | Vitest | Latest | Native Vite integration, fast |
| Testing Utils | @testing-library/react | Latest | Standard React testing |
| Search | match-sorter | Latest | Lightweight, smart ranking |
| Highlighting | Custom component | N/A | Zero bundle cost, Tailwind integrated |
| Routing | Conditional rendering | N/A | Simplest solution for 2 pages |
| Debouncing | Custom hook | N/A | Lightweight, React-idiomatic |

**Total Bundle Impact**: ~3KB (match-sorter only)

---

## Implementation Dependencies

### Production Dependencies
```json
{
  "match-sorter": "^6.3.1"
}
```

### Development Dependencies
```json
{
  "vitest": "^1.0.0",
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.1.0",
  "jsdom": "^23.0.0"
}
```

### Configuration Files Needed
- `vitest.config.ts`: Test runner configuration
- `tests/setup.ts`: Test environment setup (@testing-library/jest-dom)

---

## Open Questions / Deferred Decisions

These items are marked as [NEEDS CLARIFICATION] in the spec but are non-blocking for MVP implementation:

1. **Content Management** (FR-13): Who updates help content? How often?
   - **MVP Decision**: Content hardcoded in TypeScript file, updated via code commits
   - **Future**: Consider CMS integration if frequent updates needed

2. **Localization** (FR-14): Multi-language support? Print-friendly format?
   - **MVP Decision**: English only, standard web printing (browser print dialog)
   - **Future**: i18n library if internationalization required

3. **Analytics** (FR-15): Track help usage, search queries, popular topics?
   - **MVP Decision**: No analytics tracking
   - **Future**: Add Google Analytics or Plausible if metrics needed

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| No routing limits future scalability | Medium | Clean conditional rendering makes React Router migration straightforward |
| Custom highlighting may have edge cases | Low | Thorough testing, regex escaping for special characters |
| No pre-indexing may slow with growth | Low | Current scale (20 items) performs well; can add indexing if content 10x+ |

---

## Next Steps (Phase 1)

1. Create data-model.md defining TypeScript interfaces
2. Create component contracts (prop interfaces)
3. Generate data-model.md and quickstart.md
4. Set up Vitest configuration
5. Create failing component tests
6. Update CLAUDE.md with architecture decisions

---

*Research complete. Ready for Phase 1: Design & Contracts.*
