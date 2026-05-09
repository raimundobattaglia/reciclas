import * as Location from 'expo-location';
import { Link, router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Text, useTheme } from '@/components/Themed';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { MapView, type MapMarker } from '@/components/ui/MapView';
import { Pill } from '@/components/ui/Pill';
import { getCleanPoints, getMaterial, type CleanPoint, type MaterialId } from '@/lib/data';
import { formatDistance, haversineKm } from '@/lib/distance';

const FILTERS: { id: MaterialId | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'pet', label: 'PET' },
  { id: 'vidrio', label: 'Vidrio' },
  { id: 'papel', label: 'Papel/cartón' },
  { id: 'tetrapak', label: 'TetraPak' },
  { id: 'latas_aluminio', label: 'Latas' },
  { id: 'aceite_cocina', label: 'Aceite' },
  { id: 'pilas', label: 'Pilas' },
  { id: 'electronicos_pequenos', label: 'Electrónicos' },
];

export default function PuntosScreen() {
  const c = useTheme();
  const [filter, setFilter] = useState<MaterialId | 'todos'>('todos');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Geolocation web sólo si user permite
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => {},
          { timeout: 5000 },
        );
      }
      return;
    }
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    })().catch(() => {});
  }, []);

  const points = useMemo(() => {
    const all = getCleanPoints();
    const filtered =
      filter === 'todos' ? all.slice() : all.filter((p) => p.materiales.includes(filter));
    if (!coords) return filtered;
    return filtered
      .map((p) => ({ ...p, _dist: haversineKm(coords, { lat: p.lat, lng: p.lng }) }))
      .sort((a, b) => (a._dist ?? 0) - (b._dist ?? 0));
  }, [filter, coords]);

  const markers: MapMarker[] = points.map((p) => ({
    id: p.id,
    lat: p.lat,
    lng: p.lng,
    label: p.nombre,
  }));

  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Puntos limpios</Text>
          <Text tone="muted" style={styles.subtitle}>
            {points.length} {points.length === 1 ? 'punto' : 'puntos'} en Las Condes
            {coords ? ' · ordenados por cercanía' : ''}
          </Text>
        </View>
      </View>

      <MapView
        markers={markers}
        onMarkerPress={(id) => router.push(`/punto/${id}` as any)}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}>
        {FILTERS.map((f) => {
          const active = f.id === filter;
          return (
            <Pressable
              key={f.id}
              onPress={() => setFilter(f.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? c.tint : c.surface,
                  borderColor: active ? c.tint : c.border,
                },
              ]}>
              <Text
                style={{
                  color: active ? c.onTint : c.text,
                  fontWeight: '700',
                  fontSize: 13,
                }}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {!coords && Platform.OS !== 'web' && (
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name="info" size={18} color={c.info} />
          <Text tone="muted" style={{ flex: 1, fontSize: 13, marginLeft: 8 }}>
            Activa la ubicación para ordenar por cercanía.
          </Text>
        </Card>
      )}

      {points.length === 0 ? (
        <Card>
          <Text tone="muted" style={{ textAlign: 'center', padding: 8 }}>
            No hay puntos limpios para este material todavía.
          </Text>
        </Card>
      ) : (
        points.map((p) => (
          <PointCard key={p.id} point={p as CleanPoint & { _dist?: number }} />
        ))
      )}
    </ScrollView>
  );
}

function PointCard({ point }: { point: CleanPoint & { _dist?: number } }) {
  const c = useTheme();
  const openMaps = () => {
    const q = encodeURIComponent(`${point.nombre}, ${point.direccion}`);
    const url =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?q=${q}&ll=${point.lat},${point.lng}`
        : `https://www.google.com/maps/search/?api=1&query=${q}`;
    Linking.openURL(url);
  };

  const tipo =
    point.tipo === 'punto_verde'
      ? { label: 'PUNTO VERDE', tone: 'info' as const }
      : { label: 'PUNTO LIMPIO', tone: 'success' as const };

  return (
    <Card style={{ marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Pill label={tipo.label} tone={tipo.tone} />
            {point._dist !== undefined && (
              <Text style={{ fontWeight: '700', color: c.tint }}>
                {formatDistance(point._dist)}
              </Text>
            )}
          </View>
          <Text style={{ fontWeight: '700', fontSize: 17, marginTop: 8 }}>{point.nombre}</Text>
          <Text tone="muted" style={{ marginTop: 2, fontSize: 13 }}>
            {point.direccion}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
            <Icon name="clock" size={14} color={c.textMuted} />
            <Text tone="muted" style={{ fontSize: 12, marginLeft: 6 }}>
              {point.horario}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 6 }}>
            {point.materiales.slice(0, 5).map((m) => {
              const mat = getMaterial(m);
              return (
                <View
                  key={m}
                  style={[
                    styles.matChip,
                    { backgroundColor: c.tintSoft, borderColor: c.border },
                  ]}>
                  <Text style={{ color: c.tintStrong, fontSize: 11, fontWeight: '700' }}>
                    {mat?.nombre ?? m}
                  </Text>
                </View>
              );
            })}
            {point.materiales.length > 5 && (
              <Text tone="muted" style={{ fontSize: 11, alignSelf: 'center' }}>
                +{point.materiales.length - 5}
              </Text>
            )}
          </View>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            <Link href={`/punto/${point.id}` as any} asChild>
              <Pressable style={[styles.cardBtn, { backgroundColor: c.tint }]}>
                <Text style={{ color: c.onTint, fontWeight: '700', fontSize: 13 }}>
                  Detalle
                </Text>
              </Pressable>
            </Link>
            <Pressable
              onPress={openMaps}
              style={[styles.cardBtn, { borderWidth: 1.5, borderColor: c.tint, marginLeft: 10 }]}>
              <Icon name="external" size={14} color={c.tint} />
              <Text style={{ color: c.tint, fontWeight: '700', fontSize: 13, marginLeft: 6 }}>
                Cómo llegar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 13, marginTop: 2 },
  filterRow: { paddingVertical: 4, paddingRight: 16, gap: 8, marginBottom: 16 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
  },
  matChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 6,
    marginBottom: 4,
  },
  cardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
});
