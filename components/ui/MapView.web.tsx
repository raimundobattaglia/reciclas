import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  label: string;
};

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

let leafletLoaded = false;
function ensureLeafletCss() {
  if (typeof document === 'undefined' || leafletLoaded) return;
  if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = LEAFLET_CSS;
    document.head.appendChild(link);
  }
  leafletLoaded = true;
}

export function MapView({
  markers,
  onMarkerPress,
  center,
}: {
  markers: MapMarker[];
  onMarkerPress?: (id: string) => void;
  center?: { lat: number; lng: number };
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    ensureLeafletCss();
    if (typeof window === 'undefined') return;
    let cancelled = false;
    (async () => {
      const L = await import('leaflet');
      if (cancelled || !ref.current) return;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      const startCenter = center
        ? [center.lat, center.lng]
        : markers.length > 0
        ? [markers[0].lat, markers[0].lng]
        : [-33.4096, -70.5664];
      const map = L.map(ref.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView(startCenter as [number, number], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      const customIcon = L.divIcon({
        className: 'reciclas-pin',
        html:
          '<div style="background:#2E7D32;color:#fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:700;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-family:sans-serif;font-size:14px;">♻︎</div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const bounds: [number, number][] = [];
      markers.forEach((m) => {
        const marker = L.marker([m.lat, m.lng], { icon: customIcon }).addTo(map);
        marker.bindTooltip(m.label, { direction: 'top' });
        marker.on('click', () => onMarkerPress?.(m.id));
        bounds.push([m.lat, m.lng]);
      });
      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [30, 30] });
      }
      mapRef.current = map;
    })().catch(() => {});

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [markers, onMarkerPress, center]);

  return (
    <View style={styles.container}>
      <div ref={ref} style={{ width: '100%', height: '100%', borderRadius: 18 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 320,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
  },
});
