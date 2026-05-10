import { Link } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text, useTheme } from '@/components/Themed';
import { Card } from '@/components/ui/Card';
import { Blob } from '@/components/ui/Decorative';
import { Icon } from '@/components/ui/Icon';
import { Mascot } from '@/components/ui/Mascot';

export default function HomeScreen() {
  const c = useTheme();
  const isWeb = Platform.OS === 'web';

  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={styles.content}>
      {/* HERO */}
      <View
        style={[
          styles.hero,
          isWeb
            ? ({ background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 60%, #0F4014 100%)' } as any)
            : { backgroundColor: c.tintStrong },
        ]}>
        <Blob size={260} color="#86D094" style={{ top: -60, right: -60 }} />
        <Blob size={200} color="#5DBE6A" style={{ bottom: -40, left: -40 }} />

        <View style={styles.heroInner}>
          <View style={styles.heroLeft}>
            <View style={styles.heroBadge}>
              <View style={styles.heroBadgeDot} />
              <Text style={styles.heroBadgeText}>LAS CONDES · CHILE</Text>
            </View>

            <Text style={styles.heroTitle}>
              Reciclar bien,{'\n'}
              <Text style={styles.heroTitleAccent}>sin adivinar.</Text>
            </Text>
            <Text style={styles.heroSub}>
              Escanea cualquier producto y descubre a dónde va cada parte de su envase, sin
              googlear.
            </Text>

            <View style={styles.heroCtas}>
              <Link href="/escanear" asChild>
                <Pressable style={({ pressed }) => [styles.ctaPrimary, { opacity: pressed ? 0.9 : 1 }]}>
                  <Icon name="scan" size={18} color="#1B5E20" />
                  <Text style={styles.ctaPrimaryText}>Escanear producto</Text>
                  <Icon name="arrow" size={18} color="#1B5E20" />
                </Pressable>
              </Link>
              <Link href="/puntos" asChild>
                <Pressable
                  style={({ pressed }) => [styles.ctaSecondary, { opacity: pressed ? 0.85 : 1 }]}>
                  <Icon name="pin" size={16} color="#fff" />
                  <Text style={styles.ctaSecondaryText}>Ver puntos limpios</Text>
                </Pressable>
              </Link>
            </View>
          </View>

          <View style={styles.heroMascot}>
            <Mascot size={200} animated />
          </View>
        </View>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <StatPill emoji="♻️" big="9" small="puntos limpios" tone={c.tint} />
        <StatPill emoji="📦" big="7" small="materiales" tone={c.info} />
        <StatPill emoji="🌱" big="2026" small="empezando ya" tone={c.accent} />
      </View>

      {/* CÓMO FUNCIONA */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>CÓMO FUNCIONA</Text>
        <View style={styles.stepsGrid}>
          <StepCard n="1" emoji="📷" title="Escanea" detail="El código de barra del producto." />
          <StepCard n="2" emoji="🔍" title="Identifica" detail="De qué material es cada parte del envase." />
          <StepCard n="3" emoji="📍" title="Recicla" detail="En el punto limpio más cercano que lo recibe." />
        </View>
      </View>

      {/* CÓDIGOS DEL TRIÁNGULO */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>CÓDIGOS DEL TRIÁNGULO</Text>
        <Text tone="muted" style={{ fontSize: 14, lineHeight: 20, marginBottom: 14 }}>
          ¿Ves un triangulito con un número al reverso del envase? En Chile sólo se reciclan
          masivamente los <Text style={{ fontWeight: '800', color: c.tint }}>1, 2, 4 y 5 rígido</Text>.
          Toca uno para saber a dónde va.
        </Text>
        <View style={styles.codeGrid}>
          {[
            { id: 'pet', n: 1, name: 'PET', recyclable: true, ex: 'Botella' },
            { id: 'hdpe', n: 2, name: 'HDPE', recyclable: true, ex: 'Detergente' },
            { id: 'pvc', n: 3, name: 'PVC', recyclable: false, ex: 'Tubería' },
            { id: 'ldpe', n: 4, name: 'LDPE', recyclable: true, ex: 'Bolsa' },
            { id: 'pp', n: 5, name: 'PP', recyclable: 'partial' as const, ex: 'Yogurt' },
            { id: 'ps', n: 6, name: 'PS', recyclable: false, ex: 'Plumavit' },
          ].map((m) => (
            <Link key={m.id} href={`/material/${m.id}` as any} asChild>
              <Pressable style={({ pressed }) => [styles.codeChip, { opacity: pressed ? 0.85 : 1 }]}>
                <View
                  style={[
                    styles.codeNum,
                    {
                      backgroundColor:
                        m.recyclable === true ? c.tint : m.recyclable === 'partial' ? c.warning : c.danger,
                    },
                  ]}>
                  <Text style={styles.codeNumText}>{m.n}</Text>
                </View>
                <Text style={styles.codeName}>{m.name}</Text>
                <Text tone="muted" style={styles.codeEx}>{m.ex}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </View>

      {/* HISTORIAL */}
      <Link href="/historial" asChild>
        <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
          <Card style={styles.historialCard}>
            <View style={styles.historialIcon}>
              <Text style={{ fontSize: 26 }}>📋</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.historialTitle}>Tus escaneos</Text>
              <Text tone="muted" style={{ fontSize: 13, marginTop: 2 }}>
                Vuelve a ver los productos que ya escaneaste
              </Text>
            </View>
            <Icon name="chevronRight" size={20} color={c.textMuted} />
          </Card>
        </Pressable>
      </Link>

      {/* SABÍAS QUE */}
      <Card style={styles.tipCard}>
        <Text style={styles.tipEmoji}>💡</Text>
        <Text style={styles.tipTitle}>Sabías que…</Text>
        <Text tone="muted" style={styles.tipBody}>
          Las Condes tiene <Text style={{ fontWeight: '700', color: c.text }}>8 puntos limpios fijos</Text>{' '}
          + Punto Verde + recolección de orgánicos puerta a puerta. La mayoría recibe vidrio, papel,
          PET y TetraPak. El Punto Verde es el único que recibe pilas y electrónicos.
        </Text>
      </Card>
    </ScrollView>
  );
}

function StatPill({
  emoji,
  big,
  small,
  tone,
}: {
  emoji: string;
  big: string;
  small: string;
  tone: string;
}) {
  const c = useTheme();
  return (
    <View style={[styles.stat, { backgroundColor: c.surface, borderColor: c.border }]}>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text style={[styles.statBig, { color: tone }]}>{big}</Text>
      <Text tone="muted" style={styles.statSmall}>
        {small}
      </Text>
    </View>
  );
}

function StepCard({
  n,
  emoji,
  title,
  detail,
}: {
  n: string;
  emoji: string;
  title: string;
  detail: string;
}) {
  const c = useTheme();
  return (
    <View style={[styles.stepCard, { backgroundColor: c.surface, borderColor: c.border }]}>
      <Text style={styles.stepEmoji}>{emoji}</Text>
      <View style={[styles.stepNum, { backgroundColor: c.tintSoft }]}>
        <Text style={{ color: c.tintStrong, fontWeight: '900', fontSize: 12 }}>PASO {n}</Text>
      </View>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text tone="muted" style={styles.stepDetail}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 60, maxWidth: 1100, alignSelf: 'center', width: '100%' },

  hero: {
    borderRadius: 28,
    paddingHorizontal: 28,
    paddingVertical: 32,
    marginBottom: 22,
    overflow: 'hidden',
    position: 'relative',
  },
  heroInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    flexWrap: 'wrap',
    position: 'relative',
    zIndex: 2,
  },
  heroLeft: { flex: 1, minWidth: 280 },
  heroMascot: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginBottom: 18,
  },
  heroBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#86D094',
    marginRight: 8,
  },
  heroBadgeText: { color: '#E8F5E9', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  heroTitle: {
    color: '#fff',
    fontSize: 44,
    fontWeight: '900',
    lineHeight: 50,
    letterSpacing: -1.5,
  },
  heroTitleAccent: { color: '#86D094' },
  heroSub: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 16,
    marginTop: 14,
    lineHeight: 24,
    maxWidth: 460,
  },
  heroCtas: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 26 },
  ctaPrimary: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 999,
    marginRight: 12,
    marginBottom: 8,
  },
  ctaPrimaryText: { color: '#1B5E20', fontWeight: '800', fontSize: 15, marginHorizontal: 6 },
  ctaSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  ctaSecondaryText: { color: '#fff', fontWeight: '700', fontSize: 15, marginLeft: 8 },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 26,
    flexWrap: 'wrap',
  },
  stat: {
    flex: 1,
    minWidth: 100,
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 8,
  },
  statBig: { fontSize: 26, fontWeight: '900', marginTop: 4, letterSpacing: -1 },
  statSmall: { fontSize: 11, fontWeight: '600', textAlign: 'center' },

  section: { marginBottom: 26 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
    marginBottom: 12,
    color: '#5C6B66',
  },

  stepsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  stepCard: {
    flex: 1,
    minWidth: 220,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginRight: 12,
    marginBottom: 12,
  },
  stepEmoji: { fontSize: 32, marginBottom: 8 },
  stepNum: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 4,
    marginBottom: 10,
  },
  stepTitle: { fontSize: 18, fontWeight: '800' },
  stepDetail: { fontSize: 13, marginTop: 4, lineHeight: 18 },

  codeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  codeChip: {
    width: 110,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E7E2',
    backgroundColor: '#fff',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  codeNum: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeNumText: { color: '#fff', fontWeight: '900', fontSize: 18 },
  codeName: { fontWeight: '800', marginTop: 8 },
  codeEx: { fontSize: 11, marginTop: 2 },

  historialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  historialIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historialTitle: { fontSize: 16, fontWeight: '800' },

  tipCard: { paddingVertical: 22 },
  tipEmoji: { fontSize: 28, marginBottom: 6 },
  tipTitle: { fontSize: 17, fontWeight: '800', marginBottom: 8 },
  tipBody: { fontSize: 14, lineHeight: 22 },
});
