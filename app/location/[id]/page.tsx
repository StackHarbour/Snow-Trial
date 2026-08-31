import { ForecastService } from '@/lib/providers/fixture-provider';
import { AccumulationChart } from '@/components/features/AccumulationChart';
import { AiAssistant } from '@/components/features/AiAssistant';
import { Clock, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function LocationForecastPage({ params }: { params: { id: string } }) {
  const forecast = await ForecastService.getForecast(params.id);
  if (!forecast) notFound();

  // Determine Confidence Styling
  const confidenceColor = 
    forecast.confidence === 'High' ? 'text-success bg-success/10 border-success/20' : 
    forecast.confidence === 'Moderate' ? 'text-warning bg-warning/10 border-warning/20' : 
    'text-danger bg-danger/10 border-danger/20';

  const ConfidenceIcon = 
    forecast.confidence === 'High' ? CheckCircle2 : AlertTriangle;

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      
      {/* LEFT COLUMN: Data View */}
      <div className="lg:col-span-8 space-y-8">
        
        {/* Primary Summary Panel */}
        <section className="bg-gradient-to-br from-surface to-background border border-surface-raised rounded-3xl p-6 md:p-10 shadow-alpine relative overflow-hidden">
          {/* Freshness Badge */}
          <div className="absolute top-6 right-6 flex items-center gap-2 text-xs font-medium text-text-secondary bg-surface border border-surface-raised px-3 py-1.5 rounded-full">
            <Clock className="w-3 h-3 text-brand" />
            Updated {forecast.freshness.updatedAt}
          </div>

          <div className="text-brand font-bold uppercase tracking-wider text-xs mb-4">Current Outlook</div>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold text-snow mb-4">{forecast.totalSnowfallRange}</h2>
          <p className="text-xl text-text-secondary font-light mb-8">{forecast.summary}</p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-surface/50 border border-surface-raised rounded-2xl p-5">
              <div className="text-xs text-text-secondary uppercase tracking-wider font-bold mb-1">Max Probability</div>
              <div className="text-2xl font-bold text-snow">{forecast.maxProbability}%</div>
            </div>
            <div className={`border rounded-2xl p-5 ${confidenceColor}`}>
              <div className="text-xs uppercase tracking-wider font-bold mb-1 opacity-80">Model Confidence</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                <ConfidenceIcon className="w-5 h-5" />
                {forecast.confidence}
              </div>
            </div>
          </div>
        </section>

        {/* Confidence Explanation */}
        <section className="bg-surface border border-surface-raised rounded-2xl p-5 flex gap-4 items-start">
          <Info className="w-5 h-5 text-text-secondary shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-snow mb-1">Why is confidence {forecast.confidence}?</h4>
            <p className="text-sm text-text-secondary leading-relaxed">{forecast.confidenceReason}</p>
          </div>
        </section>

        {/* Timeline Chart */}
        <section className="bg-surface border border-surface-raised rounded-3xl p-6 md:p-8">
          <h3 className="text-lg font-display font-bold text-snow mb-6">Accumulation Timeline</h3>
          <AccumulationChart hourly={forecast.hourly} />
        </section>

        {/* Hourly Detail Strip */}
        <section>
          <h3 className="text-lg font-display font-bold text-snow mb-4">Detailed Grid</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scroll">
            {forecast.hourly.map((hr, i) => (
              <div key={i} className="min-w-[100px] flex-shrink-0 bg-surface border border-surface-raised rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <div className="text-xs text-text-secondary font-medium mb-3">{hr.timestamp}</div>
                <div className="text-2xl font-bold text-snow mb-1">{hr.temperature}°</div>
                <div className="text-sm text-brand font-bold mb-1">{hr.snowfallInches}"</div>
                <div className="text-[10px] text-text-secondary uppercase tracking-widest">{hr.precipType}</div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* RIGHT COLUMN: AI & Tools */}
      <div className="lg:col-span-4 h-full min-h-[500px]">
        <AiAssistant forecast={forecast} />
      </div>

    </div>
  );
}