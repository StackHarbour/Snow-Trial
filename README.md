# Snow Trail

Phase 1 foundation for a snow-first forecasting product. The project is a real Next.js/TypeScript application, not a static mockup.

## Current implementation
- Snow-first homepage and search
- ZIP and location search against an isolated deterministic demo geocoder
- Location forecast pages with snowfall, event, confidence, freshness and source metadata
- Forecast chart using Apache ECharts
- Map architecture placeholder with explicit unavailable state
- Provider interface and isolated demo forecast provider
- Domain confidence evaluation and unit helpers
- API route foundations for search, forecast, map layers, alerts and AI explanation
- Methodology/trust page
- Responsive CSS and basic accessible labels
- Unit test and TypeScript/build scripts

## Demo mode
The application intentionally uses synthetic deterministic data. Every forecast page labels this clearly. It must not be presented as live weather. Replace `DemoForecastProvider` behind the `ForecastProvider` interface when production credentials/data sources are available.

## Architecture
UI → feature/shared components → domain/services → provider adapters → external data sources.
Provider responses should be validated and normalized before entering the domain model. Business logic does not live in React components.

## Run locally
```bash
npm install
npm run dev
```
Then open http://localhost:3000.

## Validation
```bash
npm test
npm run typecheck
npm run lint
npm run build
```
`npm run lint` uses the Next.js lint script where supported by the installed Next version; if the framework removes that command in a future version, replace it with the project's chosen ESLint invocation.

## Environment
Copy `.env.example` to `.env.local`. No external credentials are required for demo mode. Production providers should keep secrets server-side.

## Vercel
The app is structured as a standard Next.js App Router project. Connect the repository to Vercel, configure environment variables, and deploy with the normal Next.js preset.

## Replacing demo providers
Implement `ForecastProvider` and wire it into `ForecastOrchestrator`. Add production geocoding, alert and map adapters without exposing raw provider schemas to UI components. Preserve source metadata, freshness, validation and failure states.

## Known limitations
- Demo geocoder covers four locations and ZIP 80435 only.
- Forecasts are synthetic.
- Interactive MapLibre layers are not connected to a production tile/weather provider.
- Alerts are an explicit unavailable state.
- AI explanation is deterministic and local; it is not connected to an LLM.
- Persistent accounts, saved locations and alerts are intentionally deferred.

## Roadmap
Phase 2: Find Snow, comparison, storm tracker, history, destination ranking. Phase 3: snow intelligence. Phase 4: trip planning. Phase 5: commercial ecosystem.
