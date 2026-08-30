'use client';

import { useEffect, useRef } from 'react';
import { Layers3, MapPin } from 'lucide-react';
import { Map, NavigationControl, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { CanonicalLocation } from '@/domain/location/types';
import type { Alert, ForecastResult } from '@/domain/forecast/types';

setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');

export function SnowMap({ location, forecast, alerts }: { location: CanonicalLocation; forecast?: ForecastResult; alerts?: Alert[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const style = process.env.NEXT_PUBLIC_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/liberty';
    const map = new Map({ container: ref.current, style, center: [location.longitude, location.latitude], zoom: 8 });
    map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
    map.on('load', () => {
      map.addSource('snow-context', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({ id: 'snow-context-fill', type: 'circle', source: 'snow-context', paint: { 'circle-radius': ['interpolate', ['linear'], ['get', 'snow'], 0, 10, 12, 28, 36, 48], 'circle-color': '#d9eef8', 'circle-opacity': 0.35, 'circle-stroke-color': '#0f516b', 'circle-stroke-width': 1.5 } });
      map.addSource('location', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Point', coordinates: [location.longitude, location.latitude] }, properties: {} } });
      map.addLayer({ id: 'location-point', type: 'circle', source: 'location', paint: { 'circle-radius': 7, 'circle-color': '#0f516b', 'circle-stroke-color': '#fff', 'circle-stroke-width': 2 } });
    });
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, [location.latitude, location.longitude, location.name]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const source = map.getSource('snow-context');
    if (!source || !('setData' in source)) return;
    const snow = forecast?.snow.next24hIn ?? 0;
    source.setData({ type: 'FeatureCollection', features: snow > 0 ? [{ type: 'Feature', geometry: { type: 'Point', coordinates: [location.longitude, location.latitude] }, properties: { snow } }] : [] });
  }, [forecast, location]);

  return <div className="map-card"><div className="map-toolbar"><div><span className="eyebrow"><Layers3 size={14} /> Snow map</span><strong>{forecast?.snow.next24hIn !== undefined ? `${forecast.snow.next24hIn.toFixed(1)} in next 24h at this forecast point` : 'Snow layer unavailable'}</strong></div><div className="map-status"><MapPin size={15} /> {alerts?.length ? `${alerts.length} active alert${alerts.length > 1 ? 's' : ''}` : 'No active alerts returned'}</div></div><div className="map-wrap" ref={ref} /><div className="map-footnote">Basemap: OpenFreeMap / OpenStreetMap. Snow context: NOAA/NWS forecast at the selected forecast point. This is not a nationwide snow-radar raster.</div></div>;
}
