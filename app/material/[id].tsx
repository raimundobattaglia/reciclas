import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text, useTheme } from '@/components/Themed';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Pill } from '@/components/ui/Pill';
import { findCleanPointsForMaterial, getMaterial, type MaterialId } from '@/lib/data';

export default function MaterialScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useTheme();
  const material = getMaterial(id as MaterialId);

  if (!material) {
    return (
      <View style={[styles.container, { backgroundColor: c.background }]}>
        <Text>Material no encontrado.</Text>
      </View>
    );
  }

  const points = findCleanPointsForMaterial(material.id);
  const recyclable = material.reciclable_chile;
  const tone =
    recyclable === true ? 'success' : recyclable === 'parcial' ? 'warning' : 'danger';
  const label =
    recyclable === true
      ? 'Reciclable en Chile'
      : recyclable === 'parcial'
      ? 'Reciclable parcialmente'
      : 'No reciclable masivamente';

  const heroBg =
    recyclable === true ? c.tint : recyclable === 'parcial' ? c.warning : c.danger;

  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: material.nombre }} />

      <View style={[styles.hero, { backgroundColor: heroBg }]}>
        {material.codigo_resina ? (
          <View style={styles.codeBadge}>
            <Text style={{ color: heroBg, fontWeight: '900', fontSize: 22 }}>
              {material.codigo_resina}
            </Text>
          </View>
        ) : null}
        <Text style={[styles.heroTitle, { color: '#fff' }]}>{material.nombre}</Text>
        {material.nombre_largo ? (
          <Text style={[styles.heroSub, { color: '#fff' }]}>{material.nombre_largo}</Text>
        ) : null}
        <View style={{ marginTop: 14 }}>
          <Pill label={label} tone={tone} />
        </View>
      </View>

      <Section label="CÓMO PREPARARLO">
        <Card>
          <Text style={{ fontSize: 15, lineHeight: 22 }}>{material.consejo}</Text>
        </Card>
      </Section>

      <Section label="EJEMPLOS TÍPICOS">
        <View style={styles.tagWrap}>
          {material.ejemplos.map((e) => (
            <View
              key={e}
              style={[
                styles.tag,
                { backgroundColor: c.surface, borderColor: c.border },
              ]}>
              <Text style={{ fontSize: 13 }}>{e}</Text>
            </View>
          ))}
        </View>
      </Section>

      {recyclable !== false && (
        <Section label={`DÓNDE RECICLARLO (${points.length})`}>
          {points.length === 0 ? (
            <Card>
              <Text tone="muted">
                Aún no hay puntos limpios mapeados que reciban este material directamente. Revisa
                el Punto Verde.
              </Text>
            </Card>
          ) : (
            points.map((p) => (
              <Link key={p.id} href={`/punto/${p.id}` as any} asChild>
                <Pressable>
                  <Card style={{ marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View
                        style={[
                          styles.pinIcon,
                          { backgroundColor: c.tintSoft },
                        ]}>
                        <Icon name="pin" size={18} color={c.tint} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={{ fontWeight: '700' }}>{p.nombre}</Text>
                        <Text tone="muted" style={{ fontSize: 13, marginTop: 2 }}>
                          {p.direccion}
                        </Text>
                      </View>
                      <Icon name="chevronRight" size={18} color={c.textMuted} />
                    </View>
                  </Card>
                </Pressable>
              </Link>
            ))
          )}
        </Section>
      )}
    </ScrollView>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 22 }}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  hero: { borderRadius: 22, padding: 22 },
  codeBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroTitle: { fontSize: 32, fontWeight: '900' },
  heroSub: { fontSize: 14, marginTop: 4, opacity: 0.95 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
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
  pinIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
