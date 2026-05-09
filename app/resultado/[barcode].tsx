import { Image } from 'expo-image';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text, useTheme } from '@/components/Themed';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Pill } from '@/components/ui/Pill';
import { findCleanPointsForMaterial, getMaterial, type MaterialId } from '@/lib/data';
import { lookupProduct, type Product } from '@/lib/productLookup';

type State =
  | { kind: 'loading' }
  | { kind: 'found'; product: Product }
  | { kind: 'not_found' }
  | { kind: 'error'; message: string };

export default function ResultadoScreen() {
  const { barcode } = useLocalSearchParams<{ barcode: string }>();
  const c = useTheme();
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;
    setState({ kind: 'loading' });
    lookupProduct(barcode)
      .then((product) => {
        if (cancelled) return;
        setState(product ? { kind: 'found', product } : { kind: 'not_found' });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({ kind: 'error', message: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, [barcode]);

  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: 'Resultado' }} />

      {state.kind === 'loading' && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={c.tint} />
          <Text tone="muted" style={{ marginTop: 14 }}>
            Buscando código {barcode}…
          </Text>
        </View>
      )}

      {state.kind === 'error' && (
        <Card>
          <Text style={styles.cardTitle}>No pudimos consultar el producto</Text>
          <Text tone="muted" style={{ marginTop: 6 }}>
            {state.message}
          </Text>
        </Card>
      )}

      {state.kind === 'not_found' && <NotFound barcode={barcode} />}

      {state.kind === 'found' && <FoundProduct product={state.product} />}
    </ScrollView>
  );
}

function NotFound({ barcode }: { barcode: string }) {
  const c = useTheme();
  return (
    <View>
      <View style={[styles.notFoundHero, { backgroundColor: c.tintSoft }]}>
        <View style={[styles.bigIcon, { backgroundColor: c.surface, borderColor: c.tint }]}>
          <Icon name="search" size={36} color={c.tint} />
        </View>
        <Text style={styles.notFoundTitle}>No tenemos ese producto</Text>
        <Text tone="muted" style={styles.notFoundSub}>
          El código <Text style={{ fontWeight: '700' }}>{barcode}</Text> no está en nuestras
          bases. Pero igual podemos ayudarte: <Text style={{ fontWeight: '700' }}>elige el tipo
          de envase</Text> y te decimos qué hacer.
        </Text>
      </View>

      <Text style={styles.sectionLabel}>¿QUÉ ENVASE TIENES EN LA MANO?</Text>
      <View style={styles.grid}>
        {QUICK_PICK.map((item) => (
          <QuickPickCard key={item.id} {...item} />
        ))}
      </View>

      <Text style={styles.sectionLabel}>¿VES UN TRIÁNGULO CON NÚMERO?</Text>
      <View style={styles.codeRow}>
        {[1, 2, 3, 4, 5, 6, 7].map((n) => {
          const map: Record<number, MaterialId> = {
            1: 'pet',
            2: 'hdpe',
            3: 'pvc',
            4: 'ldpe',
            5: 'pp',
            6: 'ps',
            7: 'otros',
          };
          const recyclable = [1, 2, 4, 5].includes(n);
          return (
            <Link key={n} href={`/material/${map[n]}` as any} asChild>
              <Pressable
                style={[
                  styles.codeChip,
                  {
                    backgroundColor: c.surface,
                    borderColor: c.border,
                  },
                ]}>
                <View
                  style={[
                    styles.codeNum,
                    { backgroundColor: recyclable ? c.tint : c.danger },
                  ]}>
                  <Text style={{ color: c.onTint, fontWeight: '900' }}>{n}</Text>
                </View>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </View>
  );
}

const QUICK_PICK: { id: MaterialId; emoji: string; name: string; sub: string }[] = [
  { id: 'pet', emoji: '🥤', name: 'Botella plástica', sub: 'Bebida, agua, aceite' },
  { id: 'vidrio', emoji: '🍾', name: 'Vidrio', sub: 'Botella, frasco' },
  { id: 'tetrapak', emoji: '📦', name: 'TetraPak', sub: 'Leche, jugo, vino' },
  { id: 'latas_aluminio', emoji: '🥫', name: 'Lata aluminio', sub: 'Bebida, cerveza' },
  { id: 'carton', emoji: '📦', name: 'Cartón', sub: 'Caja, embalaje' },
  { id: 'papel', emoji: '📄', name: 'Papel', sub: 'Hoja, diario' },
  { id: 'pp', emoji: '🥣', name: 'Pote rígido', sub: 'Yogurt, margarina' },
  { id: 'ldpe', emoji: '🛍️', name: 'Bolsa plástica', sub: 'Pan, supermercado' },
  { id: 'aceite_cocina', emoji: '🫙', name: 'Aceite usado', sub: 'En botella cerrada' },
  { id: 'pilas', emoji: '🔋', name: 'Pilas', sub: 'AA, AAA, pequeñas' },
];

function QuickPickCard({
  id,
  emoji,
  name,
  sub,
}: {
  id: MaterialId;
  emoji: string;
  name: string;
  sub: string;
}) {
  const c = useTheme();
  const material = getMaterial(id);
  const recyclable = material?.reciclable_chile;
  const dot =
    recyclable === true ? c.tint : recyclable === 'parcial' ? c.warning : c.danger;

  return (
    <Link href={`/material/${id}` as any} asChild>
      <Pressable
        style={({ pressed }) => [
          styles.gridItem,
          {
            backgroundColor: c.surface,
            borderColor: c.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}>
        <View style={[styles.dot, { backgroundColor: dot }]} />
        <Text style={{ fontSize: 32 }}>{emoji}</Text>
        <Text style={{ fontWeight: '700', marginTop: 8, textAlign: 'center' }}>{name}</Text>
        <Text tone="muted" style={{ fontSize: 11, marginTop: 2, textAlign: 'center' }}>
          {sub}
        </Text>
      </Pressable>
    </Link>
  );
}

function FoundProduct({ product }: { product: Product }) {
  const c = useTheme();
  return (
    <View>
      <Card style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {product.image ? (
            <Image source={{ uri: product.image }} style={styles.thumb} contentFit="contain" />
          ) : (
            <View
              style={[
                styles.thumb,
                {
                  backgroundColor: c.tintSoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                },
              ]}>
              <Icon name="scan" size={28} color={c.tint} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: '800' }}>
              {product.name || 'Producto sin nombre'}
            </Text>
            {product.brand ? (
              <Text tone="muted" style={{ marginTop: 2 }}>
                {product.brand}
              </Text>
            ) : null}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 6, alignItems: 'center' }}>
              <Text tone="muted" style={{ fontSize: 11 }}>
                EAN {product.barcode}
              </Text>
              <Text tone="muted" style={{ fontSize: 11 }}>
                ·
              </Text>
              <Text tone="muted" style={{ fontSize: 11 }}>
                {product.source === 'openfoodfacts' ? 'Open Food Facts' : 'UPC Database'}
              </Text>
            </View>
          </View>
        </View>
      </Card>

      <Text style={styles.sectionLabel}>MATERIALES DETECTADOS</Text>
      {product.inferredMaterials.length === 0 ? (
        <Card>
          <Text tone="muted">
            Encontramos el producto pero no tiene info detallada del envase. Selecciona el envase
            que tienes:
          </Text>
          <View style={{ height: 12 }} />
          <View style={styles.grid}>
            {QUICK_PICK.map((item) => (
              <QuickPickCard key={item.id} {...item} />
            ))}
          </View>
        </Card>
      ) : (
        product.inferredMaterials.map((m) => <MaterialRow key={m} materialId={m} />)
      )}
    </View>
  );
}

function MaterialRow({ materialId }: { materialId: MaterialId }) {
  const c = useTheme();
  const material = getMaterial(materialId);
  if (!material) return null;
  const points = findCleanPointsForMaterial(materialId);
  const recyclable = material.reciclable_chile;
  const tone =
    recyclable === true ? 'success' : recyclable === 'parcial' ? 'warning' : 'danger';
  const label =
    recyclable === true ? 'Reciclable' : recyclable === 'parcial' ? 'Parcial' : 'No reciclable';

  return (
    <Link href={`/material/${material.id}` as any} asChild>
      <Pressable>
        <Card style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '800' }}>
                {material.nombre}
                {material.codigo_resina ? ` · #${material.codigo_resina}` : ''}
              </Text>
              {material.nombre_largo && (
                <Text tone="muted" style={{ fontSize: 13, marginTop: 2 }}>
                  {material.nombre_largo}
                </Text>
              )}
            </View>
            <Pill label={label} tone={tone} />
          </View>
          <Text tone="muted" style={{ fontSize: 13, marginTop: 10, lineHeight: 19 }}>
            {material.consejo}
          </Text>
          {recyclable !== false && points.length > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
              <Icon name="pin" size={14} color={c.tint} />
              <Text style={{ color: c.tint, fontSize: 13, fontWeight: '700', marginLeft: 6 }}>
                {points.length} {points.length === 1 ? 'punto limpio' : 'puntos limpios'} lo reciben
              </Text>
              <Icon name="chevronRight" size={14} color={c.tint} />
            </View>
          )}
        </Card>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  center: { alignItems: 'center', padding: 40 },
  cardTitle: { fontSize: 17, fontWeight: '800' },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 22,
    color: '#5C6B66',
  },
  thumb: { width: 64, height: 64, borderRadius: 12, marginRight: 14 },
  notFoundHero: {
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    marginBottom: 8,
  },
  bigIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  notFoundTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  notFoundSub: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginRight: -10,
  },
  gridItem: {
    width: '30%',
    minWidth: 100,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  codeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  codeChip: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  codeNum: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
