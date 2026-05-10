import { Linking, Platform, Pressable, StyleSheet, View } from 'react-native';

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
  center,
}: {
  markers: MapMarker[];
  onMarkerPress?: (id: string) => void;
  center?: { lat: number; lng: number };
}) {
  const c = useTheme();

  const openExternal = () => {
    if (markers.length === 0) return;
    const target = markers[0];
    const lat = center?.lat ?? target.lat;
    const lng = center?.lng ?? target.lng;
    const url =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(target.label)}`
        : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: c.tintSoft, borderColor: c.border },
      ]}>
      <Icon name="map" size={36} color={c.tint} />
      <Text style={[styles.title, { color: c.tintStrong }]}>
        {markers.length > 1
          ? `${markers.length} puntos en Las Condes`
          : 'Punto limpio'}
      </Text>
      <Text tone="muted" style={styles.sub}>
        Abre tu app de Mapas para ver y trazar la ruta.
      </Text>
      <Pressable
        onPress={openExternal}
        style={({ pressed }) => [
          styles.btn,
          { backgroundColor: c.tint, opacity: pressed ? 0.9 : 1 },
        ]}>
        <Icon name="external" size={14} color={c.onTint} />
        <Text style={{ color: c.onTint, fontWeight: '700', marginLeft: 8 }}>
          Abrir en Mapas
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 26,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontWeight: '800', fontSize: 16, marginTop: 8 },
  sub: { fontSize: 13, marginTop: 4, marginBottom: 14, textAlign: 'center' },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
});
