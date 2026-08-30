'use client';
import { useState } from 'react';

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState('');
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  function nearMe() {
    setLocationError('');
    if (!navigator.geolocation) { setLocationError('Location is not available in this browser.'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        const params = new URLSearchParams({ lat: position.coords.latitude.toFixed(5), lon: position.coords.longitude.toFixed(5) });
        window.location.href = `/search?${params.toString()}`;
      },
      () => { setLocating(false); setLocationError('Location permission was denied. Search manually instead.'); },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 },
    );
  }

  return <div>
    <form className={`search-box ${compact ? 'search-box-compact' : ''}`} action="/search">
      <span className="search-symbol" aria-hidden="true">⌕</span>
      <input name="q" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Mountain, resort, city or ZIP code" aria-label="Search location" />
      <button type="submit">Search</button>
    </form>
    <div className="search-actions">
      <button type="button" onClick={nearMe} disabled={locating} className="near-me"><span>⌖</span>{locating ? 'Finding you…' : 'Near Me'}</button>
      <span>Location permission is only requested when you choose Near Me.</span>
    </div>
    {locationError && <p className="inline-error" role="alert">{locationError}</p>}
  </div>;
}
