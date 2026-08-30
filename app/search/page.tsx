import Link from 'next/link';
import { SearchBox } from '../components/search-box';
import { SiteNav } from '../components/site-nav';
import { resolveLocation } from '../../lib/forecast';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; lat?: string; lon?: string }> }) {
  const params = await searchParams;
  const query = params.q ?? '';
  const result = query ? resolveLocation(query) : null;
  return <main className="page-shell"><SiteNav/><section className="search-page">
    <div className="eyebrow">LOCATION SEARCH</div><h1>Find the place<br/><em>you care about.</em></h1><p className="lead">Search a city, mountain, resort or ZIP code. If a name is ambiguous, Snow Trail asks you to choose instead of guessing.</p><SearchBox compact />
    {params.lat && params.lon && <div className="notice"><strong>Location received.</strong> Your coordinates were captured after you chose Near Me. A production resolver would reverse-geocode them and select the nearest supported forecast grid.</div>}
    {!result && <div className="search-empty"><span>Try a location</span><strong>Breckenridge, 80424, Park City…</strong></div>}
    {result?.kind === 'resolved' && <div className="result-panel"><div className="result-kicker">LOCATION FOUND</div>{result.locations.map((location)=><Link className="location-result" key={location.id} href={`/location/${location.slug}`}><div><strong>{location.name}, {location.region}</strong><span>{location.type} · {location.elevationFt.toLocaleString()} ft · {location.country}</span></div><b>→</b></Link>)}</div>}
    {result?.kind === 'ambiguous' && <div className="result-panel"><div className="result-kicker">WHICH {query.toUpperCase()}?</div><p className="result-help">Multiple locations match your search. Choose the exact one.</p>{result.locations.map((location)=><Link className="location-result" key={location.id} href={`/location/${location.slug}`}><div><strong>{location.name}, {location.region}</strong><span>{location.country} · {location.postalCodes.join(', ')}</span></div><b>→</b></Link>)}</div>}
    {result?.kind === 'invalid' && <div className="state-panel error"><strong>That ZIP code is not valid.</strong><span>Enter a five-digit U.S. ZIP code or search by place name.</span></div>}
    {result?.kind === 'not-found' && <div className="state-panel"><strong>We couldn't find that location.</strong><span>Check the spelling, try a ZIP code, or search for a nearby city or resort.</span></div>}
  </section></main>
}
