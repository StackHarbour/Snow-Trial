export function Footer() {
  return (
    <footer className="border-t border-surface-raised bg-surface py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <div className="font-display font-bold text-snow text-lg mb-1">SNOW TRAIL</div>
          <p className="text-sm text-text-secondary">Precision alpine forecasting. Phase 1 Prototype.</p>
        </div>
        <div className="text-xs text-text-secondary bg-background px-4 py-2 rounded-full border border-surface-raised">
          System Data: Fixture Environment (No Live Providers)
        </div>
      </div>
    </footer>
  );
}