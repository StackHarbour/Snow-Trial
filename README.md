# Snow Trail

Snow-first forecast platform for real U.S. locations.

## Current implementation

- Next.js App Router 16.3.3 with React 19.2.8.
- NWS API as the authoritative U.S. forecast/alert source.
- Open-Meteo geocoding for city/ZIP/mountain search, with an explicit commercial-license boundary.
- OpenFreeMap + MapLibre GL JS for the production-capable map baseline; commercial use is explicitly permitted by OpenFreeMap's current terms.
- Recharts for forecast visualization.
- Server-side provider adapters and a normalized forecast domain model.
- Freshness, confidence, source metadata, partial failure handling, and no fabricated fallback data.
- Browser geolocation only after an explicit Near Me click.

## Provider architecture

`provider -> adapter -> validation -> normalization -> domain model -> UI`

The main services are:

- `LocationResolver`
- `ForecastOrchestrator`
- `ForecastNormalizer`
- `ConfidenceEvaluator`
- `AlertService`
- `AIExplanationService`

NWS provides point-to-grid mapping, hourly forecast data, grid snowfall amounts, and official alerts. The NWS API requires a descriptive User-Agent header.

## Environment

Copy `.env.example` to `.env.local`.

### Required before commercial launch

`OPEN_METEO_API_KEY` must be configured for commercial Open-Meteo usage where the provider's current licensing requires a customer key. The public endpoint is not treated as a commercial entitlement by this project.

`NWS_USER_AGENT` must identify the application and a contact method.

The default basemap uses OpenFreeMap. OpenFreeMap states that commercial usage is allowed, requires attribution, and provides no SLA. For higher operational guarantees, configure a commercial map provider through `NEXT_PUBLIC_MAP_STYLE_URL`.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Validation

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

The current execution environment did not provide npm registry access, so dependency installation and the Next.js production build must be run in an environment with registry/network access. This is intentionally reported as NOT VERIFIED rather than being represented as a pass.

## Production deployment

Vercel is supported. Configure the environment variables in Preview and Production separately. Never expose provider secrets through `NEXT_PUBLIC_*` variables.

## Data freshness

The application distinguishes provider update time, Snow Trail retrieval time, and forecast-valid intervals. Cached responses must not be presented as live without their age.

## Forecast methodology

Snow Trail does not manufacture a single “truth” from conflicting providers. The current Phase 1 implementation treats NWS as the authoritative U.S. baseline and records source metadata. When a supplemental provider is enabled, disagreement is retained and contributes to confidence evaluation.

## Known limitations

- The initial build uses NWS as the production U.S. baseline; NWS does not expose every snow-specific metric uniformly for every grid.
- Open-Meteo is integrated as a search/supplemental provider boundary but requires the correct commercial entitlement for commercial deployment.
- The snow map currently visualizes real selected-location forecast context rather than pretending to have a nationwide proprietary weather-radar/snowfall raster layer. A true nationwide weather raster layer should be added as a dedicated licensed data provider in a later increment.
- AI explanation is disabled unless an AI provider is configured. It never fabricates missing weather data.
