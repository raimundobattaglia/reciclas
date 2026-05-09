import { Stack, useLocalSearchParams } from 'expo-router';
import { Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { Text, useTheme } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { MapView } from '@/components/ui/MapView';
import { Pill } from '@/components/ui/Pill';
import { getCleanPoint, getMaterial } from '@/lib/data';

export default function PuntoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useTheme();
  const point = getCleanPoint(id);

  if (!point) {
    return (
      <View style={[styles.container, { backgroundColor: c.background }]}>
        <Text>Punto no encontrado.</Text>
      </View>
    );
  }

  const openMaps = () => {
    const q = encodeURIComponent(`${point.nombre}, ${point.direccion}, ${point.comuna}`);
    const url =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?q=${q}&ll=${point.lat},${point.lng}`
        : `https://www.google.com/maps/search/?api=1&query=${q}`;
    Linking.openURL(url);
  };

  const tipoPill =
    point.tipo === 'punto_verde'
      ? { label: 'PUNTO VERDE', tone: 'info' as const }
      : { label: 'PUNTO LIMPIO', tone: 'success' as const };

  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: point.nombre }} />

      <Pill label={tipoPill.label} tone={tipoPill.tone} />
      <Text style={styles.title}>{point.nombre}</Text>
      <Text tone="muted" style={styles.sub}>
        {point.direccion} · {point.comuna}
      </Text>

      <View style={{ marginTop: 16 }}>
        <MapView
          markers={[{ id: point.id, lat: point.lat, lng: point.lng, label: point.nombre }]}
          center={{ lat: point.lat, lng: point.lng }}
        />
      </View>

      <Button
        label="Cómo llegar"
        iconRight="external"
        onPress={openMaps}
        style={{ marginTop: 4 }}
      />

      <Card style={{ marginTop: 18 }}>
        <Row icon="clock" label="Horario" value={point.horario} />
        <Divider />
        <Row
          icon="recycle"
          label="Tipo"
          value={
            point.tipo === 'punto_verde'
              ? 'Punto Verde (más materiales)'
              : point.tipo === 'movil'
              ? 'Punto móvil'
              : 'Punto limpio fijo'
          }
        />
        {point.notas ? (
          <>
            <Divider />
            <Text tone="muted" style={{ fontSize: 13, lineHeight: 19 }}>
              {point.notas}
            </Text>
          </>
        ) : null}
      </Card>

      <Text style={styles.sectionLabel}>QUÉ RECIBE</Text>
      <View style={styles.tagWrap}>
        {point.materiales.map((m) => {
          const mat = getMaterial(m);
          return (
            <View
              key={m}
              style={[
                styles.tag,
                { backgroundColor: c.tintSoft, borderColor: c.tintSoft },
              ]}>
              <Text style={{ color: c.tintStrong, fontWeight: '700', fontSize: 13 }}>
                {mat?.nombre ?? m}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function Row({ icon, label, value }: { icon: any; label: string; value: string }) {
  const c = useTheme();
  return (
    <View style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: c.tintSoft }]}>
        <Icon name={icon} size={14} color={c.tint} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text tone="muted" style={{ fontSize: 12 }}>
          {label}
        </Text>
        <Text style={{ fontSize: 15, marginTop: 2 }}>{value}</Text>
      </View>
    </View>
  );
}

function Divider() {
  const c = useTheme();
  return <View style={{ height: 1, backgroundColor: c.border, marginVertical: 8 }} />;
}

const styles = StyleSheet.create({
  container: { padding: 18, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', marginTop: 12 },
  sub: { fontSize: 14, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  rowIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 22,
    marginBottom: 10,
    color: '#5C6B66',
  },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
});
