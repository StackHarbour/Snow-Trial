'use client';

import { useEffect, useRef } from 'react';
import { Map, NavigationControl, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');

export function MapPreview() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const map = new Map({ container: ref.current, style: process.env.NEXT_PUBLIC_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/liberty', center: [-100, 39], zoom: 3.2, interactive: false });
    map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
    return () => map.remove();
  }, []);
  return <div className="preview-map-wrap"><div ref={ref} className="preview-map" /><div className="preview-overlay"><span className="eyebrow">Snow map</span><strong>Explore the forecast spatially</strong><p>Open a location to activate its real forecast context.</p></div></div>;
}
