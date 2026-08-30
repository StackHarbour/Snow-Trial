import { notFound } from 'next/navigation';
import { getForecastForLocation } from '@/services/forecast-orchestrator';
import { ForecastChart } from '@/components/shared/ForecastChart';
import { SnowMap } from '@/components/shared/SnowMap';

function formatTime(value: string, timezone: string) {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: timezone }).format(new Date(value));
}

export default async function LocationPage({ params }: { params: Promise<{ locationSlug: string }> }) {
  const { locationSlug } = await params;
  const data = await getForecastForLocation(locationSlug);
  if (!data) notFound();

  const { location, forecast } = data;
  const next = forecast.nextSnowEvent;
  const eventStart = next ? formatTime(next.start, forecast.timezone) : '—';
  const eventEnd = next ? formatTime(next.end, forecast.timezone) : '—';

  return (
    <main>
      <section className="forecast-hero">
        <div className="container">
          <div className="forecast-topline">
            <div>
              <div className="eyebrow">48-hour snowfall forecast</div>
              <h1>{location.name}</h1>
              <p>{location.region}, {location.country} · {location.elevationFt?.toLocaleString()} ft</p>
            </div>
            <span className="demo-badge">DEMO DATA</span>
          </div>

          <div className="forecast-answer">
            <div className="answer-number">{forecast.totalSnowfallIn}<span> in</span></div>
            <div className="answer-label">expected snowfall</div>
            <div className="answer-meta">Next 48 hours · {forecast.freshness.label}</div>
          </div>

          <div className="forecast-stats">
            <div><span>Next snow event</span><strong>{next?.totalIn ?? 0}"</strong><small>{eventStart}–{eventEnd}</small></div>
            <div><span>Confidence</span><strong className="capitalize">{forecast.confidence.level}</strong><small>{forecast.confidence.reasons[0]}</small></div>
            <div><span>Current</span><strong>{forecast.current.temperatureF}°</strong><small>{forecast.current.precipitationType}</small></div>
          </div>
        </div>
      </section>

      <section className="section forecast-body">
        <div className="container">
          <div className="demo-notice"><strong>Demo forecast.</strong> This is synthetic development data, not a live weather forecast. It is intentionally isolated from production provider integrations.</div>

          <div className="forecast-layout">
            <ForecastChart data={forecast.hourly} />
            <SnowMap location={location} />
          </div>

          <div className="explanation-grid">
            <article className="explanation-card">
              <div className="eyebrow">What this means</div>
              <h2>The snow is concentrated in the next major event.</h2>
              <p>{forecast.totalSnowfallIn} inches are modeled across the available window. The next event contributes {next?.totalIn ?? 0} inches.</p>
            </article>
            <article className="explanation-card">
              <div className="eyebrow">Why the confidence is {forecast.confidence.level}</div>
              <ul>{forecast.confidence.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
            </article>
          </div>

          <details className="provenance-card">
            <summary>Forecast source & methodology</summary>
            <div className="provenance-grid">
              <div><span>Provider</span><strong>{forecast.source.provider}</strong></div>
              <div><span>Model</span><strong>{forecast.source.model}</strong></div>
              <div><span>Grid resolution</span><strong>{forecast.source.gridResolutionKm} km</strong></div>
              <div><span>Retrieved</span><strong>{new Date(forecast.source.retrievedAt).toLocaleString()}</strong></div>
            </div>
          </details>
        </div>
      </section>
    </main>
  );
}
