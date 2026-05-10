import { Link, Stack, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text, useTheme } from '@/components/Themed';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Pill } from '@/components/ui/Pill';
import { getMaterial } from '@/lib/data';
import { clearHistory, getHistory, type HistoryEntry } from '@/lib/scanHistory';

export default function HistorialScreen() {
  const c = useTheme();
  const [items, setItems] = useState<HistoryEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      getHistory().then((list) => {
        if (!cancelled) setItems(list);
      });
      return () => {
        cancelled = true;
      };
    }, []),
  );

  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: 'Historial' }} />

      <Text style={styles.title}>Historial de escaneos</Text>
      <Text tone="muted" style={styles.sub}>
        Últimos {items.length} {items.length === 1 ? 'producto' : 'productos'} escaneados en este
        dispositivo. No se sincroniza ni se sube a ningún servidor.
      </Text>

      {items.length === 0 ? (
        <Card style={{ alignItems: 'center', paddingVertical: 32, marginTop: 18 }}>
          <View
            style={[
              styles.emptyIcon,
              { backgroundColor: c.tintSoft, borderColor: c.tint },
            ]}>
            <Icon name="scan" size={32} color={c.tint} />
          </View>
          <Text style={{ fontWeight: '700', fontSize: 16 }}>Aún no escaneas nada</Text>
          <Text tone="muted" style={{ marginTop: 6, textAlign: 'center' }}>
            Cada producto que escanees aparecerá acá para que puedas volver a verlo.
          </Text>
          <Link href="/escanear" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.cta,
                { backgroundColor: c.tint, opacity: pressed ? 0.9 : 1 },
              ]}>
              <Text style={{ color: c.onTint, fontWeight: '700' }}>Escanear ahora</Text>
            </Pressable>
          </Link>
        </Card>
      ) : (
        <>
          <View style={{ height: 16 }} />
          {items.map((item) => (
            <HistoryRow key={`${item.barcode}-${item.scannedAt}`} entry={item} />
          ))}

          <Pressable
            onPress={async () => {
              await clearHistory();
              setItems([]);
            }}
            style={[styles.clearBtn, { borderColor: c.danger }]}>
            <Text style={{ color: c.danger, fontWeight: '700' }}>Borrar historial</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

function HistoryRow({ entry }: { entry: HistoryEntry }) {
  const c = useTheme();
  const date = new Date(entry.scannedAt);
  const fmt = `${date.getDate()}/${date.getMonth() + 1} · ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

  return (
    <Link href={`/resultado/${encodeURIComponent(entry.barcode)}` as any} asChild>
      <Pressable>
        <Card style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={[
                styles.thumb,
                { backgroundColor: entry.materials.length > 0 ? c.tintSoft : c.border },
              ]}>
              <Icon
                name={entry.materials.length > 0 ? 'recycle' : 'search'}
                size={20}
                color={entry.materials.length > 0 ? c.tint : c.textMuted}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontWeight: '700' }} numberOfLines={1}>
                {entry.name || `EAN ${entry.barcode}`}
              </Text>
              {entry.brand ? (
                <Text tone="muted" style={{ fontSize: 13 }} numberOfLines={1}>
                  {entry.brand}
                </Text>
              ) : null}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, gap: 6 }}>
                {entry.materials.length === 0 ? (
                  <Pill label="No encontrado" tone="warning" />
                ) : (
                  entry.materials.slice(0, 3).map((m) => (
                    <View key={m} style={[styles.matChip, { borderColor: c.border }]}>
                      <Text style={{ fontSize: 11, color: c.tintStrong, fontWeight: '700' }}>
                        {getMaterial(m as any)?.nombre ?? m}
                      </Text>
                    </View>
                  ))
                )}
                <Text tone="muted" style={{ fontSize: 11, alignSelf: 'center' }}>
                  · {fmt}
                </Text>
              </View>
            </View>
            <Icon name="chevronRight" size={18} color={c.textMuted} />
          </View>
        </Card>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '800' },
  sub: { fontSize: 13, marginTop: 6, lineHeight: 18 },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  cta: {
    marginTop: 16,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 6,
    marginBottom: 4,
  },
  clearBtn: {
    marginTop: 16,
    borderWidth: 1.5,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
});
