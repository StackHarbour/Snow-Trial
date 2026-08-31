import { Map } from 'lucide-react';

export default function MapPlaceholder() {
  return (
    <div className="w-full h-[60vh] bg-surface border-2 border-dashed border-surface-raised rounded-3xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-snow via-background to-background" />
      <Map className="w-16 h-16 text-surface-raised mb-6" />
      <h2 className="text-2xl font-display font-bold text-snow mb-3">Interactive Map System</h2>
      <p className="text-text-secondary max-w-md mx-auto text-sm leading-relaxed mb-6">
        Map infrastructure is scheduled for Phase 2. This layer will provide high-resolution radar, elevation grids, and localized storm tracking directly overlaid on topographic data.
      </p>
      <div className="px-4 py-2 bg-background border border-surface-raised rounded-full text-xs font-bold text-brand uppercase tracking-wider">
        Architecture Placeholder
      </div>
    </div>
  );
}