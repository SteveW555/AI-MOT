# Project Overview

## 1. Project Purpose, Goals and Features

### Purpose
AI MOT is a landing page application for an AI consultancy service that helps businesses diagnose their potential and drive efficiency through AI implementation. The service provides tactical blueprints for maximizing business profitability through automation and artificial intelligence.

### Goals
- **Client Acquisition**: Capture leads for AI consultancy services through a streamlined booking process
- **Service Education**: Communicate the value proposition of AI MOT's audit and consultation services
- **User Experience**: Provide an intuitive, multi-step form for service booking requests
- **Professional Presentation**: Present a modern, visually appealing brand identity through gradient designs and animated SVG illustrations

### Key Features

#### Visual Design
- **Responsive Layout**: Mobile-first design that adapts seamlessly across all device sizes
- **Gradient Styling**: Modern gradient color schemes (blue → purple → pink) throughout the interface
- **Animated Gear Illustrations**: Custom SVG gear graphics symbolizing mechanical precision and automation
- **Backdrop Effects**: Subtle blur effects and gradient backgrounds for depth

#### Booking Form System
- **Multi-Step Form**: Three-step wizard interface for gathering client information
  - Step 1: Event details (title, category, description)
  - Step 2: Scheduling (date and location)
  - Step 3: Participants (guest count)
- **Service Categories**:
  - Initial Consultation
  - Business Audit
  - AI Implementation
  - Team Training
  - Other
- **Form State Management**: React hooks for tracking form progress and data
- **Step Navigation**: Tab-based navigation with visual indicators for current step

#### UI Components
- **Custom Component Library**: shadcn/ui-inspired components including:
  - Button (with default and outline variants)
  - Card (with header, title, description, content sections)
  - Input fields
  - Textarea
  - Select dropdowns
  - Label components
- **Consistent Styling**: Centralized utility function (`cn`) for merging Tailwind classes

#### Content & Messaging
- **Value Proposition**: Clear messaging about delivering tactical blueprints for business profitability
- **Service Description**: Detailed explanation of the AI MOT audit process
- **Call-to-Action**: Prominent form placement with compelling copy

---

## 2. Tech Stack

### Frontend Framework
- **React 18.3.1**: Modern React with hooks for component state management
- **TypeScript 5.7.3**: Type-safe development with strict compiler options
  - Target: ES2020
  - JSX: react-jsx
  - Strict mode enabled
  - Module resolution: bundler mode

### Build Tools & Development
- **Vite 6.0.11**: Lightning-fast build tool and dev server
  - HMR (Hot Module Replacement) for instant updates
  - Optimized production builds
  - Plugin: @vitejs/plugin-react (4.3.4)
- **Path Aliasing**: `@/` alias configured for `./src` directory

### Styling & UI
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
  - PostCSS 8.4.49 for processing
  - Autoprefixer 10.4.20 for browser compatibility
  - Custom configuration in `tailwind.config.js`
- **CSS Architecture**:
  - Tailwind directives: @tailwind base, components, utilities
  - Custom utility functions: `cn()` for class merging
- **Styling Utilities**:
  - clsx 2.1.1: Conditional className construction
  - tailwind-merge 2.5.5: Intelligent Tailwind class merging
  - class-variance-authority 0.7.1: Component variant management

### Component Architecture
- **Custom UI Components**: Reusable component library in `src/components/ui/`
  - All components use React.forwardRef for ref forwarding
  - TypeScript interfaces for prop typing
  - Consistent className merging with `cn()` utility
- **Component Pattern**: Composition-based design with Card compound components

### Type Safety & Linting
- **TypeScript Configuration**:
  - Strict type checking enabled
  - No unused locals/parameters enforcement
  - No fallthrough cases in switches
  - Bundler module resolution
- **Type Definitions**:
  - @types/react 18.3.18
  - @types/react-dom 18.3.5

### Project Structure
```
src/
├── App.tsx              # Main application component with landing page
├── main.tsx             # React app entry point
├── index.css            # Tailwind CSS imports
├── lib/
│   └── utils.ts         # Utility functions (cn)
└── components/
    └── ui/              # Reusable UI components
        ├── button.tsx
        ├── card.tsx
        ├── input.tsx
        ├── textarea.tsx
        ├── label.tsx
        └── select.tsx
```

### Configuration Files
- **vite.config.ts**: Vite configuration with React plugin and path aliases
- **tsconfig.json**: Main TypeScript configuration for source files
- **tsconfig.node.json**: TypeScript config for Vite config file
- **tailwind.config.js**: Tailwind CSS configuration
- **postcss.config.js**: PostCSS plugins (Tailwind + Autoprefixer)
- **package.json**: Dependencies and build scripts

### Development Workflow
- **Scripts**:
  - `npm run dev`: Start Vite dev server
  - `npm run build`: TypeScript compilation + Vite production build
  - `npm run preview`: Preview production build locally
