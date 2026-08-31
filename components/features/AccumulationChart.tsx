import { HourlyForecast } from '@/lib/types/domain';

export function AccumulationChart({ hourly }: { hourly: HourlyForecast[] }) {
  const maxSnow = Math.max(...hourly.map(h => h.snowfallInches), 1); // Avoid div by 0

  return (
    <div className="w-full h-48 flex items-end justify-between gap-1 sm:gap-2 px-2 pt-6">
      {hourly.map((hour, i) => {
        const heightPct = (hour.snowfallInches / maxSnow) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center group relative">
            {/* Tooltip */}
            <div className="absolute -top-8 bg-surface-raised text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-surface">
              {hour.snowfallInches}" / {hour.snowProbability}%
            </div>
            
            {/* Bar */}
            <div className="w-full relative flex items-end justify-center h-32 bg-surface-raised/30 rounded-t-md overflow-hidden">
              <div 
                className="w-full bg-brand transition-all duration-500 rounded-t-sm"
                style={{ height: `${heightPct}%`, minHeight: hour.snowfallInches > 0 ? '4px' : '0' }}
              />
            </div>
            
            {/* Label */}
            <div className="mt-3 text-xs text-text-secondary font-medium">{hour.timestamp}</div>
          </div>
        );
      })}
    </div>
  );
}