import { Text } from 'react-native';

const GLYPHS = {
  recycle: '♻︎',
  scan: '◫',
  pin: '◉',
  arrow: '→',
  check: '✓',
  cross: '✕',
  clock: '⏱',
  warn: '!',
  info: 'i',
  external: '↗',
  chevronRight: '›',
  search: '⌕',
  map: '◎',
  list: '☰',
} as const;

export type IconName = keyof typeof GLYPHS;

export function Icon({
  name,
  size = 18,
  color = 'currentColor',
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return (
    <Text
      style={{
        fontSize: size,
        lineHeight: size + 2,
        color,
        textAlign: 'center',
        width: size + 4,
      }}>
      {GLYPHS[name]}
    </Text>
  );
}
