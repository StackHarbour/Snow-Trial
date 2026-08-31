import { ForecastService } from '@/lib/providers/fixture-provider';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function LocationLayout({ children, params }: { children: React.ReactNode, params: { id: string } }) {
  const location = await ForecastService.getLocation(params.id);
  
  if (!location) {
    notFound();
  }

  return (
    <div className="w-full">
      {/* Location Header Block */}
      <div className="bg-surface border-b border-surface-raised">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-12 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2.5 py-1 bg-background border border-surface-raised rounded-md text-[10px] font-bold uppercase tracking-wider text-brand">
                  {location.type}
                </span>
                {location.elevation && (
                  <span className="text-xs text-text-secondary font-medium">Elev: {location.elevation.toLocaleString()} ft</span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-extrabold text-snow tracking-tight mb-2">
                {location.name}
              </h1>
              <p className="text-text-secondary">{location.region}</p>
            </div>
          </div>
          
          {/* Internal Navigation */}
          <div className="flex gap-8 mt-10 text-sm font-medium border-b-2 border-transparent">
            <Link href={`/location/${params.id}`} className="pb-3 border-b-2 border-brand text-snow">Forecast</Link>
            <Link href={`/location/${params.id}/map`} className="pb-3 border-b-2 border-transparent text-text-secondary hover:text-snow transition-colors">Snow Map</Link>
            <Link href={`/location/${params.id}/alerts`} className="pb-3 border-b-2 border-transparent text-text-secondary hover:text-snow transition-colors">Alerts</Link>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {children}
      </div>
    </div>
  );
}