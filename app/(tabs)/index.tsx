import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text, useTheme } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Pill } from '@/components/ui/Pill';

export default function HomeScreen() {
  const c = useTheme();
  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={styles.content}>
      <View style={[styles.hero, { backgroundColor: c.tint }]}>
        <Pill label="LAS CONDES · CHILE" tone="success" />
        <Text style={[styles.heroTitle, { color: c.onTint }]}>
          Reciclar bien,{'\n'}sin adivinar.
        </Text>
        <Text style={[styles.heroSub, { color: c.onTint }]}>
          Escanea un producto y te decimos a dónde va cada parte de su envase.
        </Text>
        <View style={{ marginTop: 18, flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/escanear" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.heroBtn,
                { backgroundColor: c.onTint, opacity: pressed ? 0.9 : 1 },
              ]}>
              <Icon name="scan" size={18} color={c.tint} />
              <Text style={{ color: c.tint, fontWeight: '700', marginLeft: 8 }}>
                Escanear producto
              </Text>
            </Pressable>
          </Link>
          <Link href="/puntos" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.heroBtn,
                {
                  backgroundColor: 'transparent',
                  borderWidth: 1.5,
                  borderColor: c.onTint,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}>
              <Icon name="pin" size={16} color={c.onTint} />
              <Text style={{ color: c.onTint, fontWeight: '700', marginLeft: 8 }}>
                Ver puntos
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>CÓMO FUNCIONA</Text>
        <Card style={{ paddingVertical: 8 }}>
          <Step n={1} title="Escanea" detail="El código de barra del producto." />
          <Divider />
          <Step
            n={2}
            title="Identifica"
            detail="Te decimos de qué material es cada parte del envase."
          />
          <Divider />
          <Step
            n={3}
            title="Recicla"
            detail="Encuentra el punto limpio más cercano que lo recibe."
          />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>CÓDIGOS DEL TRIÁNGULO</Text>
        <Text tone="muted" style={{ fontSize: 14, lineHeight: 20, marginBottom: 12 }}>
          En Chile sólo se reciclan masivamente PET (1), HDPE (2), LDPE (4) y PP rígido (5). Toca
          uno para saber dónde va.
        </Text>
        <View style={styles.codeGrid}>
          {[
            { id: 'pet', n: 1, name: 'PET', recyclable: true },
            { id: 'hdpe', n: 2, name: 'HDPE', recyclable: true },
            { id: 'pvc', n: 3, name: 'PVC', recyclable: false },
            { id: 'ldpe', n: 4, name: 'LDPE', recyclable: true },
            { id: 'pp', n: 5, name: 'PP', recyclable: 'partial' as const },
            { id: 'ps', n: 6, name: 'PS', recyclable: false },
          ].map((m) => (
            <Link key={m.id} href={`/material/${m.id}` as any} asChild>
              <Pressable
                style={({ pressed }) => [
                  styles.codeChip,
                  {
                    backgroundColor: c.surface,
                    borderColor: c.border,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}>
                <View
                  style={[
                    styles.codeNum,
                    {
                      backgroundColor:
                        m.recyclable === true
                          ? c.tint
                          : m.recyclable === 'partial'
                          ? c.warning
                          : c.danger,
                    },
                  ]}>
                  <Text style={{ color: c.onTint, fontWeight: '800' }}>{m.n}</Text>
                </View>
                <Text style={{ fontWeight: '700', marginTop: 6 }}>{m.name}</Text>
                <Text tone="muted" style={{ fontSize: 11, marginTop: 2 }}>
                  {m.recyclable === true
                    ? 'Reciclable'
                    : m.recyclable === 'partial'
                    ? 'Parcial'
                    : 'No reciclable'}
                </Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </View>

      <View style={[styles.section, { paddingBottom: 40 }]}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Icon name="info" size={16} color={c.tint} />
            <Text style={{ marginLeft: 10, fontWeight: '700' }}>Sabías que…</Text>
          </View>
          <Text tone="muted" style={{ lineHeight: 20 }}>
            Las Condes tiene 8 puntos limpios fijos + Punto Verde + recolección de orgánicos
            puerta a puerta. La mayoría recibe vidrio, papel/cartón, PET y TetraPak. Sólo el Punto
            Verde recibe pilas y electrónicos pequeños.
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
}

function Step({ n, title, detail }: { n: number; title: string; detail: string }) {
  const c = useTheme();
  return (
    <View style={styles.step}>
      <View style={[styles.stepNum, { backgroundColor: c.tintSoft }]}>
        <Text style={{ color: c.tintStrong, fontWeight: '800' }}>{n}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '700', fontSize: 15 }}>{title}</Text>
        <Text tone="muted" style={{ marginTop: 2, fontSize: 13, lineHeight: 18 }}>
          {detail}
        </Text>
      </View>
    </View>
  );
}

function Divider() {
  const c = useTheme();
  return <View style={{ height: 1, backgroundColor: c.border, marginVertical: 6 }} />;
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40 },
  hero: {
    borderRadius: 22,
    padding: 22,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    marginTop: 12,
    lineHeight: 34,
  },
  heroSub: { marginTop: 8, fontSize: 15, lineHeight: 21, opacity: 0.95 },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
  },
  section: { marginBottom: 22 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 10,
    color: '#5C6B66',
  },
  step: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  codeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  codeChip: {
    width: 100,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  codeNum: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
