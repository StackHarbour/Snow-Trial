# Snow Trail - Phase 1 (Greenfield)

## Overview
Snow Trail is a snow-first weather forecasting platform. This is the **Phase 1** greenfield implementation, built from scratch with zero legacy code.

**CRITICAL:** Phase 1 establishes Product Structure, UX, UI, and Component Architecture. It uses an isolated Fixture Provider system. **NO REAL WEATHER APIs ARE CONNECTED YET.** Data is explicitly non-production.

## Architecture
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS (Custom Alpine Semantic Palette)
- **Data Model:** Typed domain models (`lib/types/domain.ts`)
- **Isolation:** The UI components only consume the `IForeastProvider` contract, currently fulfilled by `FixtureProvider`. In Phase 2, this will be swapped for `RealForecastProvider` with zero UI rewrites.

## Setup Instructions
1. `npm install`
2. `npm run dev`
3. Navigate to `http://localhost:3000`

## Testing Commands
- `npm run lint` - Validates strict linting rules.
- `npm run typecheck` - Compiles TypeScript with no emit to verify strict typings across models.
- `npm run build` - Verifies the production build process.