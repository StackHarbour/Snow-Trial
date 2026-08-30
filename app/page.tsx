import Link from 'next/link';
import { SearchBox } from './components/search-box';
import { SiteFooter } from './components/site-footer';
import { SiteNav } from './components/site-nav';

const bars = [18, 26, 34, 48, 67, 82, 71, 54, 38, 28];

export default function Home() {
  return <main>
    <SiteNav />
    <section className="hero-shell">
      <div className="hero-copy">
        <div className="eyebrow">SNOW-FIRST FORECASTING</div>
        <h1>Know the snow<br/><em>before you go.</em></h1>
        <p>Snowfall, probability, timing, accumulation and confidence — organized around the one thing you actually need to know: what the snow will do where you are going.</p>
        <SearchBox />
      </div>
      <div className="forecast-preview" aria-label="Demo forecast preview">
        <div className="preview-sky"><span className="preview-orb">◐</span><span className="flake one">✦</span><span className="flake two">✦</span><span className="flake three">·</span><span className="mountain-line"/></div>
        <div className="preview-body">
          <div className="preview-top"><div><strong>Breckenridge, Colorado</strong><span>9,600 ft · resort</span></div><span className="demo-badge">LIVE DEMO</span></div>
          <span className="fresh">Updated 18 min ago</span>
          <div className="snow-number"><strong>8–12</strong><span>in</span></div>
          <p className="snow-caption">expected snowfall · next 24 hours</p>
          <div className="preview-metrics"><div><strong>82%</strong><span>snow probability</span></div><div><strong>29°</strong><span>low overnight</span></div><div><strong>HIGH</strong><span>forecast confidence</span></div></div>
        </div>
      </div>
    </section>

    <section className="statement"><div className="eyebrow">THE SNOW TRAIL APPROACH</div><p>Competitors often give you everything. Snow Trail gives you the <strong>right thing first</strong>, then lets you go deeper.</p></section>

    <section className="section forecast-story" id="forecast">
      <div className="section-heading"><div><div className="eyebrow">FORECAST, WITHOUT THE NOISE</div><h2>See what matters<br/><em>at a glance.</em></h2></div><p>Snow information is grouped by the questions people ask before a trip — not by whatever fields an API happens to return.</p></div>
      <div className="story-grid">
        <article className="story-card story-primary"><span className="card-index">01 / SNOWFALL</span><h3>Put snow first.</h3><p>The expected accumulation gets the visual weight it deserves. Timing and range sit beside it, not buried underneath it.</p><div className="bars" aria-label="Demo hourly snowfall chart">{bars.map((height,index)=><i key={index} style={{height: `${height}%`}}/> )}</div><div className="axis"><span>Now</span><span>Tonight</span><span>Tomorrow</span></div></article>
        <article className="story-card"><span className="card-index">02 / CONFIDENCE</span><h3>Show uncertainty.</h3><p>Forecast confidence is visible and explainable. Low confidence is not hidden behind a polished number.</p><div className="confidence-display"><strong>HIGH</strong><span><i/></span><small>Good source agreement + recent grid coverage</small></div></article>
        <article className="story-card"><span className="card-index">03 / FRESHNESS</span><h3>Tell people when it changed.</h3><p>A forecast is only useful when its age and valid period are obvious.</p><div className="fresh-display"><span>Last update</span><strong>18 min ago</strong><small>Valid through 2:00 PM tomorrow</small></div></article>
      </div>
    </section>

    <section className="storm-section" id="map">
      <div className="storm-copy"><div className="eyebrow">SNOW MAP / PHASE 1</div><h2>See the storm,<br/><em>not just the number.</em></h2><p>The map experience will turn regional snowfall into something you can understand spatially: accumulation, probability, alerts, terrain and forecast timing — each with its own source and valid time.</p><Link href="/methodology" className="arrow-link">Understand the data →</Link></div>
      <div className="map-visual" aria-label="Illustrative snow map"><div className="map-grid"/><div className="contour contour-a"/><div className="contour contour-b"/><div className="contour contour-c"/><span className="map-pin pin-a">●</span><span className="map-pin pin-b">●</span><span className="map-pin pin-c">●</span><div className="map-legend"><span>24H SNOWFALL</span><strong>8–12 in</strong><small>Illustrative demo layer</small></div></div>
    </section>

    <section className="storm-strip"><div><div className="eyebrow">SIGNIFICANT SNOW</div><h2>Know when a storm is worth paying attention to.</h2></div><div className="storm-cards"><div><span>COLORADO</span><strong>8–12 in</strong><small>Next 24h · high confidence</small></div><div><span>UTAH</span><strong>5–8 in</strong><small>Tonight · moderate confidence</small></div><div><span>SIERRA NEVADA</span><strong>3–6 in</strong><small>Tomorrow · moderate confidence</small></div></div></section>

    <section className="ai-section"><div className="ai-mark">AI</div><div><div className="eyebrow">ASK THE FORECAST</div><h2>Confused by the numbers?</h2><p>Ask Snow Trail to explain the forecast you are looking at. The assistant works from Snow Trail's normalized forecast context; it does not invent weather or replace the underlying data source.</p></div><Link href="/location/breckenridge-co" className="dark-button">See an example →</Link></section>

    <section className="trust-section"><div className="eyebrow">TRANSPARENT BY DESIGN</div><h2>A forecast should explain<br/><em>itself.</em></h2><p>Every future live forecast is designed to carry source, freshness, geographic coverage and confidence context. When data is unavailable, Snow Trail should say so instead of filling the gap with fiction.</p><div className="trust-grid"><div><strong>01</strong><span>Source-aware</span><p>Provider provenance stays attached to the forecast.</p></div><div><strong>02</strong><span>Freshness-aware</span><p>Update and valid times are separated clearly.</p></div><div><strong>03</strong><span>Failure-aware</span><p>Partial failures do not become fake successful states.</p></div></div><Link href="/methodology" className="outline-button">Read the methodology</Link></section>

    <SiteFooter />
  </main>;
}
