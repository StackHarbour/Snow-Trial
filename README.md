# Snow Trail

Snow-first forecasting product prototype focused on clear snowfall information, location resolution, freshness, confidence, and graceful failure states.

## Current scope

- Homepage with snow-first information hierarchy
- City / mountain / resort / ZIP search
- Ambiguous-location disambiguation
- Invalid and not-found states
- Explicit Near Me permission flow
- Location forecast page with demo snowfall, probability, confidence, freshness, alerts, chart, map treatment, and AI explanation boundary
- Methodology page
- Responsive design system
- Isolated synthetic forecast domain module

## Demo-data policy

This project does **not** connect to a live weather provider. Forecast values are synthetic and explicitly labeled. The provider boundary in `lib/forecast.ts` is the seam where real geocoding, forecast, alert, and map providers can be introduced later.

## Requirements

Node.js 20.9+ is required by the current Next.js 16 documentation.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

## Architecture direction

The production target is provider-agnostic: location resolution, forecast data, alerts, and map layers should be supplied by replaceable adapters. Forecast values should retain source, retrieval time, valid period, geographic resolution, and confidence metadata.

The AI assistant is intentionally constrained to explain normalized forecast context supplied by Snow Trail. It is not a weather-data source and must never invent values.

## Real provider integration

When live providers are selected, add server-side provider adapters and credentials through environment variables. Do not expose provider secrets to the browser. Evaluate licensing, rate limits, coverage, latency, historical retention, and forecast accuracy before selecting production providers.

> The supplied archive intentionally does not include `node_modules` or a generated dependency lockfile because this execution environment cannot resolve the npm registry. Run `npm install` once after extraction to generate a complete `package-lock.json` for your machine/CI environment.
