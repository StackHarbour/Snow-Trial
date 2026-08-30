import Link from 'next/link';
import { ArrowLeft, CloudSnow, Clock3, Gauge, ShieldAlert, Thermometer, Wind } from 'lucide-react';
import { decodeLocation } from '@/domain/location/codec';
import type { Alert } from '@/domain/forecast/types';
import { ForecastOrchestrator } from '@/services/forecast-orchestrator';
import { AlertService } from '@/services/alert-service';
import { ForecastChart } from '@/components/forecast-chart';
import { SnowMap } from '@/components/snow-map';
import { AiExplainer } from '@/components/ai-explainer';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

function fmt(value?: number, unit = 'in') { return value === undefined ? '—' : `${value.toFixed(1)} ${unit}`; }
function relative(time?: string) { if (!time) return 'Unknown'; const minutes = Math.max(0, Math.round((Date.now() - new Date(time).getTime()) / 60_000)); return minutes < 60 ? `${minutes} min ago` : `${Math.round(minutes / 60)} hr ago`; }

export default async function LocationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const location = decodeLocation(id);
  if (!location) { notFound(); return null; }
  const forecast = await new ForecastOrchestrator().get(location);
  let alerts: Alert[] = [];
  try { alerts = await new AlertService().get(location); } catch { /* partial page is preferable to a failed page */ }

  return <main>
    <div className="location-topbar"><Link href="/" className="back-link"><ArrowLeft size={16} /> Snow Trail</Link><span>Forecast point: {location.latitude.toFixed(3)}, {location.longitude.toFixed(3)}</span></div>
    <section className="location-hero page-width">
      <div className="location-copy"><span className="eyebrow"><CloudSnow size={15} /> Snow forecast</span><h1>{location.name}{location.admin1 ? <span>, {location.admin1}</span> : null}</h1><p>{location.type} · {location.elevationM ? `${Math.round(location.elevationM * 3.28084).toLocaleString()} ft elevation · ` : ''}{location.timezone}</p></div>
      <div className={`confidence-pill confidence-${forecast.confidence.level.toLowerCase()}`}><Gauge size={16} /><span><strong>{forecast.confidence.level} confidence</strong><small>{forecast.confidence.explanation}</small></span></div>
    </section>

    {alerts.length > 0 && <section className="alert-banner page-width"><ShieldAlert size={22} /><div><strong>{alerts[0].title}</strong><span>{alerts[0].severity} · {alerts[0].area ?? location.name} · expires {alerts[0].expiresAt ? new Date(alerts[0].expiresAt).toLocaleString() : 'not specified'}</span></div></section>}

    <section className="page-width hero-grid">
      <div className="snow-answer panel"><div className="panel-kicker">Next 24 hours</div><div className="snow-total">{fmt(forecast.snow.next24hIn)}</div><div className="snow-label">expected snowfall</div><div className="answer-row"><div><strong>{forecast.snow.snowfallProbability !== undefined ? `${forecast.snow.snowfallProbability}%` : '—'}</strong><span>snow probability</span></div><div><strong>{fmt(forecast.snow.next6hIn)}</strong><span>next 6 hours</span></div><div><strong>{fmt(forecast.snow.next3dIn)}</strong><span>next 3 days</span></div></div></div>
      <div className="current panel"><div className="panel-kicker">Current observation</div><div className="current-temp">{forecast.current.temperatureF !== undefined ? `${Math.round(forecast.current.temperatureF)}°` : '—'}</div><div className="current-condition">{forecast.current.condition}</div><div className="current-meta"><span><Thermometer size={15} /> Air temperature</span><span><Wind size={15} /> {forecast.current.windMph !== undefined ? `${Math.round(forecast.current.windMph)} mph` : '—'}</span></div></div>
    </section>

    <section className="page-width freshness-row"><span><Clock3 size={15} /> Provider update: {relative(forecast.freshness.providerUpdatedAt)}</span><span>Snow Trail retrieval: {relative(forecast.freshness.retrievedAt)}</span><span>{forecast.freshness.isStale ? 'Forecast data is stale' : 'Forecast data is fresh enough for display'}</span></section>

    <section className="section page-width"><div className="section-head"><div><span className="eyebrow">Forecast timeline</span><h2>Snow first. Weather context second.</h2></div><p>Hourly data is shown in the location's local timezone. Missing snow values stay unavailable rather than being invented.</p></div><ForecastChart hourly={forecast.hourly} /></section>

    <section className="section page-width"><SnowMap location={location} forecast={forecast} alerts={alerts} /></section>

    {alerts.length > 0 && <section className="section page-width"><div className="section-head"><div><span className="eyebrow"><ShieldAlert size={14} /> Official alerts</span><h2>Authoritative warnings near this point</h2></div></div><div className="alerts-list">{alerts.map((alert) => <article className="alert-card" key={alert.id}><div><strong>{alert.title}</strong><span>{alert.severity} · {alert.source}</span></div><p>{alert.description ?? 'No alert description supplied.'}</p><small>{alert.effectiveAt ? `Effective ${new Date(alert.effectiveAt).toLocaleString()}` : ''}{alert.expiresAt ? ` · Expires ${new Date(alert.expiresAt).toLocaleString()}` : ''}</small></article>)}</div></section>}

    {forecast.warnings.length > 0 && <section className="page-width data-warning"><strong>Data quality note</strong>{forecast.warnings.map((warning) => <p key={warning}>{warning}</p>)}</section>}
    <AiExplainer locationId={id} />

    <section className="section page-width source-strip"><div><span className="eyebrow">Sources & methodology</span><h2>Trace every important number.</h2><p>Primary U.S. forecast source: NOAA / National Weather Service. The NWS point service maps coordinates to a local forecast grid, and Snow Trail keeps retrieval and provider update times separate.</p></div><Link href="/methodology" className="text-link">Read methodology →</Link></section>
  </main>;
}
