export default function Methodology() {
  const items = [
    ['Forecast pipeline', 'Provider response → validation → normalization → unit/time normalization → reconciliation → confidence → domain forecast → UI.'],
    ['Confidence', 'Confidence is qualitative unless a defensible statistical methodology exists. Snow Trail considers source quality, forecast horizon, precipitation-type uncertainty, terrain, and source disagreement.'],
    ['Freshness', 'Forecast age is explicit. Stale or unavailable data must never silently appear current.'],
    ['No fake live data', 'This build uses an isolated deterministic demo provider. It is deliberately labeled and replaceable; it is not a live weather source.'],
  ];

  return (
    <main className="section methodology-page">
      <div className="container">
        <div className="eyebrow">Trust & methodology</div>
        <h1>How Snow Trail thinks about a forecast.</h1>
        <p className="methodology-lede">The interface should never make a forecast look more certain, more precise, or more live than the underlying data supports.</p>
        <div className="methodology-grid">
          {items.map(([title, body], index) => (
            <section className={`method-card ${index === 0 ? 'method-card-dark' : ''}`} key={title}>
              <div className="method-number">0{index + 1}</div>
              <h2>{title}</h2>
              <p>{body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
