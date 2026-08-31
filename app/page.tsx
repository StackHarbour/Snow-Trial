import { SearchBox } from '@/components/features/SearchBox';
import { ShieldAlert, Mountain, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* HERO */}
      <section className="w-full pt-20 pb-24 px-4 flex flex-col items-center text-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <div className="inline-block px-3 py-1 mb-8 rounded-full border border-ice/20 bg-ice/5 text-ice text-[11px] font-bold uppercase tracking-widest">
          High-Resolution Alpine Weather
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display font-extrabold mb-6 max-w-4xl tracking-tight leading-[1.1]">
          Stop guessing when <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-snow to-ice">the snow falls.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl font-light">
          Built strictly for the mountains. We prioritize elevation grids, moisture density, and model confidence over generic weather data.
        </p>
        
        <SearchBox />
      </section>

      {/* VALUE PROPS / HOW IT WORKS */}
      <section className="w-full max-w-7xl mx-auto py-24 px-4 md:px-6 border-t border-surface-raised grid md:grid-cols-3 gap-12">
        <div className="flex flex-col items-start text-left">
          <div className="w-12 h-12 rounded-2xl bg-surface-raised flex items-center justify-center mb-6 text-brand">
            <Mountain className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold mb-3">Elevation-First Grids</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Standard weather apps fail in the mountains. We utilize high-resolution terrain mapping to calculate accurate freezing lines and local accumulation.
          </p>
        </div>
        
        <div className="flex flex-col items-start text-left">
          <div className="w-12 h-12 rounded-2xl bg-surface-raised flex items-center justify-center mb-6 text-success">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold mb-3">Transparent Confidence</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            We analyze multiple global models (GFS, ECMWF) simultaneously. If models disagree, we lower our confidence score and explain exactly why.
          </p>
        </div>
        
        <div className="flex flex-col items-start text-left">
          <div className="w-12 h-12 rounded-2xl bg-surface-raised flex items-center justify-center mb-6 text-warning">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold mb-3">Contextual AI</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Don't just read data tables. Ask our AI assistant specific questions about storm timing, road conditions, and powder quality.
          </p>
        </div>
      </section>
    </div>
  );
}