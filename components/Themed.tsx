import {
  Text as RNText,
  View as RNView,
  type TextProps as RNTextProps,
  type ViewProps as RNViewProps,
} from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

type Tone = 'default' | 'muted' | 'tint' | 'danger' | 'onTint';

export type TextProps = RNTextProps & { tone?: Tone };
export type ViewProps = RNViewProps;

export function useTheme() {
  const scheme = useColorScheme() ?? 'light';
  return Colors[scheme];
}

export function Text({ tone = 'default', style, ...rest }: TextProps) {
  const c = useTheme();
  const colorMap = {
    default: c.text,
    muted: c.textMuted,
    tint: c.tint,
    danger: c.danger,
    onTint: c.onTint,
  } as const;
  return <RNText style={[{ color: colorMap[tone] }, style]} {...rest} />;
}

export function View({ style, ...rest }: ViewProps) {
  return <RNView style={style} {...rest} />;
}
