'use client';
import { useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { SnowForecast } from '@/lib/types/domain';

export function AiAssistant({ forecast }: { forecast: SnowForecast }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const simulateAi = (q: string) => {
    setLoading(true);
    setResponse(null);
    setTimeout(() => {
      setResponse(`Based on our structural models for ${forecast.locationId}, the expected ${forecast.totalSnowfallRange} of snow is driven by a strong localized front. Peak intensity will hit around 3 PM.`);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="bg-surface border border-surface-raised rounded-3xl overflow-hidden flex flex-col h-full shadow-alpine">
      <div className="bg-surface-raised/50 p-4 border-b border-surface flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-brand" />
        <h3 className="font-display font-bold">Snow Trail AI</h3>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-text-secondary bg-surface px-2 py-1 rounded-full">Phase 1 Mock</span>
      </div>
      
      <div className="p-6 flex-grow flex flex-col justify-end gap-4">
        {response ? (
          <div className="bg-brand/10 border border-brand/20 p-4 rounded-2xl text-sm leading-relaxed text-snow">
            {response}
          </div>
        ) : (
          <div className="text-sm text-text-secondary">
            Ask questions about this forecast to understand the storm dynamics.
          </div>
        )}
        
        {loading && (
          <div className="flex items-center gap-2 text-sm text-brand">
            <Loader2 className="w-4 h-4 animate-spin" /> Analyzing forecast models...
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {['When will it snow hardest?', 'Why is confidence ' + forecast.confidence.toLowerCase() + '?'].map((suggestion, i) => (
            <button 
              key={i}
              onClick={() => { setQuery(suggestion); simulateAi(suggestion); }}
              className="text-xs bg-surface-raised hover:bg-surface-raised/80 text-text-primary px-3 py-1.5 rounded-full transition-colors text-left"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-surface-raised">
        <form 
          onSubmit={(e) => { e.preventDefault(); simulateAi(query); }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about this forecast..."
            className="w-full bg-background border border-surface-raised rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-brand"
          />
          <button type="submit" disabled={!query.trim() || loading} className="absolute right-2 p-1.5 text-text-secondary hover:text-brand disabled:opacity-50">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}