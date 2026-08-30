import Link from 'next/link';
import { SiteNav } from '../../components/site-nav';
import { SiteFooter } from '../../components/site-footer';
import { getDemoForecast, getLocations, inchesToCm } from '../../../lib/forecast';

export default async function LocationPage({ params }: { params: Promise<{ locationSlug: string }> }) {
  const { locationSlug } = await params;
  const location = getLocations(locationSlug)[0];
  if (!location) return <main className="page-shell"><SiteNav/><section className="not-found"><div className="eyebrow">LOCATION NOT FOUND</div><h1>We couldn't resolve that place.</h1><p>Search again and choose a supported location.</p><Link href="/search" className="dark-button">Back to search</Link></section></main>;
  const forecast = getDemoForecast(location);
  const maxBar = Math.max(...forecast.hourly.map((item) => item.snowIn), 1);
  return <main className="page-shell"><SiteNav/>
    <section className="location-hero"><div><div className="eyebrow">SNOW FORECAST · DEMO DATA</div><h1>{location.name}, <em>{location.region}</em></h1><p>{location.type} · {location.elevationFt.toLocaleString()} ft · {location.latitude.toFixed(3)}, {location.longitude.toFixed(3)}</p></div><div className="fresh-card"><span>FORECAST FRESHNESS</span><strong>18 min ago</strong><small>Source: {forecast.source}</small></div></section>
    <section className="forecast-main">
      <div className="demo-warning"><strong>Demo forecast</strong><span>Synthetic values are used in this prototype. This is not live weather data.</span></div>
      <div className="snow-summary"><div><span className="summary-label">EXPECTED SNOWFALL · NEXT 24 HOURS</span><div className="summary-number">{forecast.snowfallRangeIn[0]}–{forecast.snowfallRangeIn[1]}<small> in</small></div><p>≈ {inchesToCm(forecast.snowfall24hIn)} cm central estimate · {forecast.precipitationType}</p></div><div className="probability"><span>SNOW PROBABILITY</span><strong>{forecast.snowProbability}%</strong><small>Confidence: {forecast.confidence}</small></div></div>
      <div className="metric-grid"><div><span>Temperature</span><strong>{forecast.temperatureF}°F</strong></div><div><span>Precipitation</span><strong>{forecast.precipitationType}</strong></div><div><span>Forecast status</span><strong>{forecast.status}</strong></div><div><span>Valid through</span><strong>Tomorrow 2 PM</strong></div></div>
      <div className="detail-grid"><section className="data-card wide"><div className="card-head"><div><span className="eyebrow">HOURLY SNOWFALL</span><h2>When does it arrive?</h2></div><span className="unit-note">in / hour</span></div><div className="forecast-chart">{forecast.hourly.map((item) => <div className="chart-column" key={item.label}><strong>{item.snowIn}</strong><i style={{height: `${Math.max(5, (item.snowIn / maxBar) * 100)}%`}}/><span>{item.label}</span></div>)}</div></section>
        <section className="data-card"><span className="eyebrow">CONFIDENCE</span><h2>{forecast.confidence.toUpperCase()}</h2><div className="confidence-meter"><i/></div><p>{forecast.confidenceReason}</p><Link href="/methodology" className="inline-link">How confidence works →</Link></section>
        <section className="data-card"><span className="eyebrow">ALERTS</span><h2>{forecast.alerts.length ? 'Worth watching' : 'No active alerts'}</h2>{forecast.alerts.length ? forecast.alerts.map((alert)=><div className="alert-item" key={alert.title}><strong>{alert.title}</strong><p>{alert.detail}</p></div>) : <p>No demo alert is active for this location.</p>}</section>
      </div>
      <section className="map-panel"><div><span className="eyebrow">SNOW MAP</span><h2>Spatial context comes next.</h2><p>Phase 1 includes the map architecture and visual treatment. Live provider tiles and forecast layers will be connected when licensed data sources are selected.</p></div><div className="map-visual small"><div className="map-grid"/><div className="contour contour-a"/><div className="contour contour-b"/><span className="map-pin pin-a">●</span><span className="map-pin pin-b">●</span><div className="map-legend"><span>DEMO LAYER</span><strong>{forecast.snowfallRangeIn[0]}–{forecast.snowfallRangeIn[1]} in</strong></div></div></section>
      <section className="ai-card"><div className="ai-mark">AI</div><div><span className="eyebrow">FORECAST EXPLANATION</span><h2>Ask about these numbers.</h2><p>In the production product, the assistant will explain only the normalized forecast context shown here. It will not invent weather or make unsupported go/no-go decisions.</p></div><button className="dark-button" disabled>AI assistant · coming next</button></section>
      <section className="source-row"><div><span>DATA SOURCE</span><strong>{forecast.source}</strong></div><div><span>RETRIEVED</span><strong>18 min ago</strong></div><div><span>VALID PERIOD</span><strong>Next 24 hours</strong></div><div><span>GRID BASIS</span><strong>Nearest available grid</strong></div></section>
    </section><SiteFooter/>
  </main>;
}
