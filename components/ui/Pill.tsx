import { StyleSheet, View } from 'react-native';

import { Text, useTheme } from '@/components/Themed';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export function Pill({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const c = useTheme();
  const map = {
    neutral: { bg: c.surface, fg: c.textMuted, border: c.border },
    success: { bg: c.tintSoft, fg: c.tint, border: c.tintSoft },
    warning: { bg: '#FFF7E6', fg: '#A05A00', border: '#FBE3B5' },
    danger: { bg: '#FEE2E2', fg: c.danger, border: '#FCA5A5' },
    info: { bg: '#E0F2FE', fg: c.info, border: '#BAE6FD' },
  } as const;
  const t = map[tone];
  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: t.bg, borderColor: t.border },
      ]}>
      <Text style={{ color: t.fg, fontSize: 12, fontWeight: '700' }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
});
