'use client';

import { useEffect, useRef, useState } from 'react';
import { LocateFixed, Search, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { LocationSearchResult } from '@/providers/types';
import { encodeLocation } from '@/domain/location/codec';

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    const value = query.trim();
    if (value.length < 2) {
      setResults([]); setOpen(false); setLoading(false); return () => controller.abort();
    }
    const timer = setTimeout(async () => {
      setLoading(true); setError('');
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`, { signal: controller.signal });
        const data = await response.json() as { results?: LocationSearchResult[]; error?: string };
        if (!response.ok) throw new Error(data.error ?? 'Search failed');
        setResults(data.results ?? []); setOpen(true); setActive(0);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setError('Search is temporarily unavailable.');
      } finally { setLoading(false); }
    }, 220);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);

  function select(result: LocationSearchResult) {
    setOpen(false);
    router.push(`/location/${encodeLocation(result)}`);
  }

  function nearMe() {
    if (!navigator.geolocation) { setError('This browser does not provide geolocation.'); return; }
    setLoading(true); setError('');
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const response = await fetch(`/api/search?lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
        if (!response.ok) throw new Error('Reverse geocoding failed');
        const data = await response.json() as { result?: LocationSearchResult | null };
        if (!data.result) throw new Error('No supported location found');
        select(data.result);
      } catch {
        setError('We could not resolve your location. Search instead.');
      } finally { setLoading(false); }
    }, () => { setLoading(false); setError('Location permission was denied or unavailable.'); }, { enableHighAccuracy: false, maximumAge: 300_000, timeout: 8_000 });
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || !results.length) {
      if (event.key === 'Enter' && results.length === 1) select(results[0]);
      return;
    }
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((i: number) => Math.min(i + 1, results.length - 1)); }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActive((i: number) => Math.max(i - 1, 0)); }
    if (event.key === 'Enter') { event.preventDefault(); select(results[active]); }
    if (event.key === 'Escape') setOpen(false);
  }

  return <div className={`search-shell ${compact ? 'search-shell-compact' : ''}`}>
    <div className="search-input-wrap">
      <Search size={20} aria-hidden="true" />
      <input ref={inputRef} value={query} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)} onKeyDown={onKeyDown} onFocus={() => results.length && setOpen(true)} aria-label="Search for a location" placeholder="Search a city, mountain, resort, or ZIP code" autoComplete="off" />
      {loading && <LoaderCircle className="spin" size={18} aria-label="Loading" />}
    </div>
    <button className="near-button" type="button" onClick={nearMe}><LocateFixed size={17} /> <span>Near Me</span></button>
    {open && <div className="search-results" role="listbox" aria-label="Location results">
      {results.length ? results.map((result: LocationSearchResult, index: number) => <button key={result.id} type="button" className={`search-result ${index === active ? 'active' : ''}`} onMouseEnter={() => setActive(index)} onClick={() => select(result)}>
        <span className="result-main"><strong>{result.name}</strong><span>{[result.admin1, result.admin2].filter(Boolean).join(', ')}</span></span>
        <span className="result-meta">{result.type}{result.elevationM ? ` · ${Math.round(result.elevationM * 3.28084).toLocaleString()} ft` : ''}</span>
      </button>) : <div className="search-empty">No supported locations found.</div>}
    </div>}
    {error && <div className="search-error" role="alert">{error}</div>}
  </div>;
}
