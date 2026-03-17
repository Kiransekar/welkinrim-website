# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server on localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint (Next.js linting)
```

## Architecture

**Framework:** Next.js 14.2 (App Router) with TypeScript, React 18, and Tailwind CSS.

**Core stack:**
- `framer-motion` for all animations and scroll-triggered reveals
- Custom font system: Syncopate (headlines), Work Sans (body), Space Mono (labels/technical)
- Canvas-based visualizations for technical charts and analysis frames

**Directory structure:**
- `src/app/` — Next.js App Router pages (layout.tsx, page.tsx for each route)
- `src/components/` — React components organized as:
  - `components/pages/` — Page-level wrapper components (LandingPage, AboutPage, etc.)
  - `components/calc/` — Calculator UI components and domain-specific calculators
  - `components/*.tsx` — Shared UI components (Navbar, Footer, MotorVisual, etc.)
- `src/lib/` — Utilities (calcUtils.ts for physics calculations, unit conversions, formatters)

**Domain system:** Four product domains with dedicated color tokens:
- `air` (#3B8FEF) — UAV/eVTOL propulsion
- `water` (#00B4CC) — Marine propulsion
- `land` (#F2B705) — Automotive/ground vehicles
- `robotics` (#8866CC) — Precision actuators

**Styling conventions:**
- Custom spacing scale: `sp1`–`sp9` (8px to 192px)
- Custom easings: `motor`, `precise`, `wire`, `thermal` (cubic-bezier)
- Dark theme (`sb-*` colors) and light theme (`dw-*` colors) with `data-theme` attribute
- Use `RevealWrapper` for scroll-triggered animations throughout

**Calculator system:** Domain-specific calculators in `components/calc/calculators/` use shared utils from `lib/calcUtils.ts` (physics constants, unit conversions, canvas chart drawing).
