import Link from 'next/link';
import { ArrowRight, BarChart3, CheckCircle2, CloudSnow, Database, MapPinned, ShieldCheck } from 'lucide-react';
import { SearchBox } from '@/components/search-box';
import { MapPreview } from '@/components/map-preview';

export default function HomePage() {
  return <main>
    <header className="site-header"><div className="page-width nav-inner"><Link href="/" className="brand"><span className="brand-mark"><CloudSnow size={18} /></span><span>SNOW TRAIL</span></Link><nav><Link href="/methodology">Methodology</Link><a href="#map">Snow map</a><a href="#trust">Data & trust</a></nav></div></header>

    <section className="hero"><div className="page-width hero-inner"><div className="hero-copy"><span className="eyebrow"><CloudSnow size={15} /> Snow-first forecasting</span><h1>Know where the snow is coming.</h1><p>Search a real location and get a snow-first forecast built from authoritative weather data, with freshness, confidence, and source context visible.</p><SearchBox /></div><div className="hero-side"><div className="terrain-art"><div className="mountain mountain-a" /><div className="mountain mountain-b" /><div className="mountain mountain-c" /><div className="art-label"><span>REAL DATA</span><strong>Forecasts, not demos.</strong></div></div></div></div></section>

    <section className="quick-strip"><div className="page-width quick-grid"><div><strong>Search</strong><span>City · ZIP · mountain · resort</span></div><div><strong>Snow first</strong><span>Accumulation · probability · timing</span></div><div><strong>Trust visible</strong><span>Source · freshness · confidence</span></div></div></section>

    <section id="map" className="section page-width"><div className="section-head"><div><span className="eyebrow"><MapPinned size={14} /> Live snow map</span><h2>See the forecast on a map.</h2></div><p>Phase 1 maps the selected real forecast point. Nationwide snow discovery is intentionally not fabricated before its multi-location data pipeline exists.</p></div><MapPreview /></section>

    <section className="section page-width"><div className="section-head"><div><span className="eyebrow"><BarChart3 size={14} /> Significant snow</span><h2>A real storm view requires real coverage.</h2></div></div><div className="empty-storm"><div className="empty-icon"><Database size={20} /></div><div><strong>Nationwide storm ranking is not enabled yet.</strong><p>Snow Trail will add multi-location storm detection when it has a validated provider pipeline for that job. It will not invent regional snowfall scores to fill this section.</p></div><Link href="/methodology" className="text-link">See the data boundary →</Link></div></section>

    <section id="trust" className="section trust-section"><div className="page-width"><div className="section-head"><div><span className="eyebrow"><ShieldCheck size={14} /> Trust & methodology</span><h2>Weather data should show its receipts.</h2></div><p>Snow Trail separates provider data from derived analysis. Missing values stay missing. Conflicts are visible. Forecast uncertainty is communicated.</p></div><div className="trust-grid"><article><CheckCircle2 size={20} /><h3>Authoritative U.S. baseline</h3><p>NOAA / National Weather Service point and grid forecast services provide the Phase 1 forecast baseline.</p></article><article><CheckCircle2 size={20} /><h3>Freshness is explicit</h3><p>Provider update time, Snow Trail retrieval time, and forecast-valid time are distinct pieces of metadata.</p></article><article><CheckCircle2 size={20} /><h3>No fake fallbacks</h3><p>Provider failures become unavailable or partial states. The UI never fills gaps with invented weather.</p></article></div><Link href="/methodology" className="method-link">Read the full methodology <ArrowRight size={16} /></Link></div></section>

    <footer className="footer"><div className="page-width footer-inner"><div><div className="brand"><span className="brand-mark"><CloudSnow size={18} /></span><span>SNOW TRAIL</span></div><p>Snow-first forecast intelligence for real places.</p></div><div><Link href="/methodology">Methodology</Link><span>·</span><span>NOAA/NWS baseline</span><span>·</span><span>OpenFreeMap basemap</span></div></div></footer>
  </main>;
}
