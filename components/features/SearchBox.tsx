'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Loader2 } from 'lucide-react';

export function SearchBox() {
  const [query, setQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleNearMe = () => {
    setIsLocating(true);
    // Simulate permission request and geo resolution
    setTimeout(() => {
      setIsLocating(false);
      router.push('/location/aspen-co');
    }, 1500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative w-full group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-text-secondary group-focus-within:text-ice transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a city, mountain, resort, or ZIP code"
          className="w-full bg-surface border-2 border-surface-raised rounded-2xl py-5 pl-12 pr-4 text-snow placeholder:text-text-secondary/70 focus:outline-none focus:border-ice focus:bg-surface-raised/50 shadow-alpine transition-all text-lg"
        />
        <button type="submit" className="absolute inset-y-2 right-2 px-6 bg-brand hover:bg-brand/80 text-snow rounded-xl font-medium transition-colors">
          Search
        </button>
      </form>
      
      <div className="mt-6 flex justify-center">
        <button 
          onClick={handleNearMe}
          disabled={isLocating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-ice/10 text-ice hover:bg-ice/20 border border-ice/20 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
          {isLocating ? 'Locating...' : 'Conditions Near Me'}
        </button>
      </div>
    </div>
  );
}