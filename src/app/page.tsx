'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const featured = [
  { slug: 'keystone-co', name: 'Keystone', region: 'Colorado', snow: '6.8"' },
  { slug: 'breckenridge-co', name: 'Breckenridge', region: 'Colorado', snow: '5.9"' },
  { slug: 'park-city-ut', name: 'Park City', region: 'Utah', snow: '3.7"' },
  { slug: 'mammoth-lakes-ca', name: 'Mammoth Lakes', region: 'California', snow: '4.4"' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function search() {
    const value = query.trim();
    if (!value) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      const data = await response.json();
      if (data.results?.length === 1) router.push(`/location/${data.results[0].slug}`);
      else router.push(`/search?q=${encodeURIComponent(value)}`);
    } finally {
      setBusy(false);
    }
  }

  function nearMe() {
    if (!navigator.geolocation) return;
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      () => router.push('/location/keystone-co'),
      () => setBusy(false),
      { timeout: 7000 },
    );
  }

  return (
    <main>
      <section className="hero-home">
        <div className="hero-glow" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="eyebrow hero-eyebrow">Snow intelligence</div>
          <h1>Know when the snow is coming.</h1>
          <p className="hero-copy">
            Snow Trail puts the snowfall answer first: how much, when, and how confident we are.
          </p>

          <div className="search-panel">
            <div className="search-icon" aria-hidden="true">⌕</div>
            <input
              aria-label="Search a mountain, town, resort, or ZIP code"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && void search()}
              placeholder="Mountain, resort, town, or ZIP code"
            />
            <button className="near-button" onClick={nearMe} disabled={busy}>Near me</button>
            <button className="primary-button" onClick={() => void search()} disabled={busy}>
              {busy ? 'Finding…' : 'Find snow'}
            </button>
          </div>

          <div className="search-hints">
            <span>Try</span>
            <button onClick={() => setQuery('Keystone')}>Keystone</button>
            <button onClick={() => setQuery('80435')}>80435</button>
            <button onClick={() => setQuery('Breckenridge')}>Breckenridge</button>
          </div>

          <div className="hero-trust">
            <span className="status-dot" /> Demo forecast mode
            <span>•</span>
            Synthetic data, clearly labeled
          </div>
        </div>
      </section>

      <section className="answer-strip">
        <div className="container answer-grid">
          <div>
            <div className="eyebrow">The answer we optimize for</div>
            <h2>Snowfall, not dashboard clutter.</h2>
          </div>
          <p>
            Every forecast is structured around the decision a skier actually needs to make: whether to go, when to go, and what the storm is likely to deliver.
          </p>
        </div>
      </section>

      <section className="section locations-section">
        <div className="container">
          <div className="section-head wide-head">
            <div>
              <div className="eyebrow">Explore forecasts</div>
              <h2>Popular snow destinations</h2>
            </div>
            <Link href="/search?q=Colorado" className="text-link">View search →</Link>
          </div>

          <div className="location-grid">
            {featured.map((item) => (
              <Link key={item.slug} href={`/location/${item.slug}`} className="location-card">
                <div className="mountain-art" aria-hidden="true">
                  <span className="mountain-back" />
                  <span className="mountain-front" />
                  <span className="snow-line" />
                </div>
                <div className="location-info">
                  <div>
                    <div className="location-name">{item.name}</div>
                    <div className="location-region">{item.region}</div>
                  </div>
                  <div className="location-snow">
                    <strong>{item.snow}</strong>
                    <span>48h snow</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section trust-section">
        <div className="container trust-grid">
          <article className="trust-card trust-card-dark">
            <div className="eyebrow">01 / Snow first</div>
            <h3>See the storm before the weather dashboard.</h3>
            <p>Snowfall totals, timing, and the next meaningful event stay at the center of the experience.</p>
          </article>
          <article className="trust-card">
            <div className="eyebrow">02 / Confidence</div>
            <h3>Uncertainty is part of the forecast.</h3>
            <p>Confidence is qualitative and explained instead of pretending every forecast number is equally reliable.</p>
          </article>
          <article className="trust-card">
            <div className="eyebrow">03 / Provenance</div>
            <h3>Know where the number came from.</h3>
            <p>Source, model, freshness, and grid context remain visible so the forecast can be judged on its evidence.</p>
          </article>
        </div>
      </section>

      <section className="section methodology-preview">
        <div className="container methodology-card">
          <div>
            <div className="eyebrow">Transparent by design</div>
            <h2>Forecasts should explain themselves.</h2>
            <p>Read how Snow Trail handles source quality, freshness, forecast horizons, and synthetic demo data.</p>
          </div>
          <Link href="/methodology" className="primary-button">Read methodology</Link>
        </div>
      </section>
    </main>
  );
}
