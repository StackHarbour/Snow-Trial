export default function MethodologyPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 md:px-6">
      <h1 className="text-4xl md:text-5xl font-display font-extrabold text-snow mb-12">Methodology</h1>
      
      <div className="space-y-12 text-text-secondary leading-relaxed">
        
        <section>
          <h2 className="text-xl font-bold text-snow mb-4 flex items-center gap-3">
            <span className="w-6 h-px bg-brand inline-block" /> Phase 1 Architecture
          </h2>
          <p className="mb-4">
            Currently, Snow Trail is operating in Phase 1 (Product Structure). All numerical data, forecasts, and alerts presented across the application are generated via an internal <strong>Fixture Provider</strong>. This allows us to establish robust UX, UI, and Information Architecture patterns without depending on external API rate limits or state instability.
          </p>
          <div className="bg-surface border border-surface-raised rounded-xl p-5 text-sm text-text-primary">
            <strong>Note:</strong> Do not rely on current Phase 1 data for actual travel or mountain safety planning.
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-snow mb-4 flex items-center gap-3">
            <span className="w-6 h-px bg-brand inline-block" /> Elevation-First Grids
          </h2>
          <p>
            General weather APIs fail in alpine environments because they average data across wide geographic boxes. Our future production architecture evaluates high-resolution topographical models. A town at the base of a mountain may receive rain, while the summit receives heavy snow. Snow Trail separates these grid points to deliver precise forecasting.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-snow mb-4 flex items-center gap-3">
            <span className="w-6 h-px bg-brand inline-block" /> The Confidence Metric
          </h2>
          <p className="mb-4">
            Meteorology is probabilistic. Rather than displaying a single unquestionable number, Snow Trail calculates a <strong>Confidence Score</strong> by comparing outputs from multiple independent global forecast models (such as GFS, ECMWF, HRRR). 
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li><strong className="text-snow">High Confidence:</strong> Models agree on timing, moisture, and temperature.</li>
            <li><strong className="text-snow">Moderate/Low Confidence:</strong> Models are diverging. We expose the exact reason for the divergence so you understand the uncertainty.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}