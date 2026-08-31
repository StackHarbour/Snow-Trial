import { ForecastService } from '@/lib/providers/fixture-provider';
import Link from 'next/link';
import { MapPin, ChevronRight, AlertCircle } from 'lucide-react';

export default async function SearchResultsPage({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q || '';
  const results = await ForecastService.searchLocations(query);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-6 w-full">
      <h1 className="text-2xl font-display font-bold mb-2">Search Results</h1>
      <p className="text-text-secondary mb-10 text-sm">Showing matches for "{query}"</p>

      {results.length === 0 ? (
        <div className="bg-surface border border-surface-raised rounded-3xl p-12 text-center flex flex-col items-center">
          <AlertCircle className="w-12 h-12 text-text-secondary/50 mb-4" />
          <h2 className="text-lg font-bold mb-2">No locations found</h2>
          <p className="text-text-secondary text-sm max-w-md">
            We couldn't find a mountain, resort, or city matching your query. Try searching by a major region or ZIP code.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {results.length > 1 && (
            <div className="text-xs uppercase tracking-wider text-brand font-bold mb-2">Disambiguation Required</div>
          )}
          
          {results.map((loc) => (
            <Link 
              key={loc.id} 
              href={`/location/${loc.id}`}
              className="bg-surface hover:bg-surface-raised border border-surface-raised rounded-2xl p-5 flex items-center justify-between transition-colors group shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-brand">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-snow">{loc.name}</h3>
                  <div className="text-sm text-text-secondary flex gap-2 items-center">
                    <span>{loc.region}</span>
                    <span className="w-1 h-1 bg-surface-raised rounded-full" />
                    <span className="text-brand">{loc.type}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-snow transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}