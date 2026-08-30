export function SnowMap({ location }: { location: { latitude: number; longitude: number } }) {
  return (
    <div className="card snow-map">
      <div className="section-head">
        <div>
          <div className="eyebrow">Snow map</div>
          <h2>Location context</h2>
        </div>
        <span className="mini-label">Preview</span>
      </div>
      <div className="map-surface">
        <div className="map-grid" aria-hidden="true" />
        <div className="map-pin" aria-hidden="true" />
        <div className="map-copy">
          <strong>Map layer not connected</strong>
          <p>{location.latitude.toFixed(3)}, {location.longitude.toFixed(3)} · Production weather tiles will be added behind the map adapter.</p>
        </div>
      </div>
    </div>
  );
}
