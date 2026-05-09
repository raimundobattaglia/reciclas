import { Platform, StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from '@/components/Themed';

export function Card({ style, children, ...rest }: ViewProps) {
  const c = useTheme();
  const webShadow =
    Platform.OS === 'web'
      ? ({ boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(15, 64, 20, 0.06)' } as any)
      : null;
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: c.surface,
          borderColor: c.border,
          shadowColor: c.shadow,
        },
        webShadow,
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
});
