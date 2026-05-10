import { Platform, View, type ViewStyle } from 'react-native';

export function Blob({
  size = 240,
  color = '#86D094',
  style,
  animated = true,
}: {
  size?: number;
  color?: string;
  style?: ViewStyle;
  animated?: boolean;
}) {
  if (Platform.OS !== 'web') return null;
  return (
    <div
      className={animated ? 'reciclas-blob' : undefined}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
        filter: 'blur(40px)',
        pointerEvents: 'none',
        opacity: 0.8,
        ...(style as any),
      }}
    />
  );
}

export function GradientBg({
  from,
  to,
  angle = 135,
  style,
  children,
}: {
  from: string;
  to: string;
  angle?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
}) {
  if (Platform.OS === 'web') {
    return (
      <div
        style={{
          background: `linear-gradient(${angle}deg, ${from}, ${to})`,
          ...(style as any),
        }}>
        {children}
      </div>
    );
  }
  return <View style={[{ backgroundColor: from }, style]}>{children}</View>;
}
