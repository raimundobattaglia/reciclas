import { Pressable, StyleSheet, View } from 'react-native';

import { Text, useTheme } from '@/components/Themed';
import { Icon } from './Icon';

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  label: string;
};

export function MapView({
  markers,
  onMarkerPress,
  center,
}: {
  markers: MapMarker[];
  onMarkerPress?: (id: string) => void;
  center?: { lat: number; lng: number };
}) {
  const c = useTheme();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: c.tintSoft, borderColor: c.border },
      ]}>
      <View style={[styles.grid, { borderColor: c.border }]} />
      <View style={styles.pinList}>
        <Icon name="map" size={32} color={c.tint} />
        <Text style={[styles.label, { color: c.tint }]}>Vista de mapa</Text>
        <Text tone="muted" style={styles.sub}>
          Disponible en la versión web. En iOS toca un punto y abre Mapas.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  grid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  pinList: { alignItems: 'center', padding: 18 },
  label: { fontWeight: '700', marginTop: 6 },
  sub: { fontSize: 13, marginTop: 4, textAlign: 'center' },
});
