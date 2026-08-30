import Link from 'next/link';
import { searchLocations } from '@/services/geocoding';

export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = (await searchParams).q || '';
  const results = searchLocations(q);

  return (
    <main className="section">
      <div className="container">
        <div className="eyebrow">Location search</div>
        <h1 className="search-title">Results for “{q}”</h1>
        {results.length ? (
          <div className="search-results">
            {results.map((location) => (
              <Link key={location.id} href={`/location/${location.slug}`} className="search-result">
                <div>
                  <strong>{location.name}</strong>
                  <span>{location.region}, {location.country}</span>
                </div>
                <div className="result-arrow">→</div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-result">
            <strong>No supported location found.</strong>
            <p>Try a mountain, town, or ZIP code from the current demo coverage.</p>
            <Link href="/" className="text-link">← Back to search</Link>
          </div>
        )}
      </div>
    </main>
  );
}
