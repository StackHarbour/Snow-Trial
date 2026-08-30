# Snow Trail

Snow Trail is a Phase 1 snow-first forecasting product. The current build is intentionally a **demo data product**: forecasts are synthetic and visibly labeled until a production weather provider is integrated.

## Product focus
- Answer snowfall first: amount, timing, and confidence.
- Search a mountain, town, resort, or ZIP code.
- Show a 48-hour snowfall timeline and next snow event.
- Keep source, freshness, grid context, and uncertainty visible.
- Keep provider adapters isolated from the UI and domain model.
- Never represent synthetic data as live weather.

## Current coverage
The deterministic demo geocoder covers Keystone, Breckenridge, Park City, and Mammoth Lakes, plus ZIP 80435 for Keystone.

## Architecture
`UI → shared components → domain/services → provider adapters → external data sources`

Provider responses should be validated and normalized before entering the domain model. Production providers should implement `ForecastProvider` without leaking provider-specific schemas into React components.

## Local development
```bash
npm install
npm run dev
```

## Validation
```bash
npm test
npm run typecheck
npm run lint
npm run build
```

The repository uses ESLint 9 flat configuration with the Next.js 15 configuration bridged through `FlatCompat`.

## Demo mode
The demo provider is deterministic synthetic data. Forecast pages and the homepage explicitly identify demo mode. Do not use the current values as live weather information.

## Production provider replacement
Replace `DemoForecastProvider` in the forecast orchestrator with a production adapter. Keep credentials server-side and preserve:
- source metadata
- retrieval/valid times
- freshness status
- validation and failure states
- normalized units and precipitation types
- qualitative confidence reasoning

## Known Phase 1 limitations
- No live weather provider is connected.
- Map rendering is a contextual preview rather than a production weather layer.
- Alerts are an explicit unavailable state.
- AI explanation is deterministic/local, not an LLM integration.
- Accounts, saved locations, Find Snow ranking, history, and trip planning are deferred.

## Deployment
The project is structured for standard Vercel deployment. Configure production provider secrets only when a real provider adapter is introduced.
