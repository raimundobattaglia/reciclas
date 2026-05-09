import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Text, useTheme } from '@/components/Themed';
import { Icon, type IconName } from './Icon';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  disabled,
  style,
  fullWidth = true,
}: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  iconLeft?: IconName;
  iconRight?: IconName;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
}) {
  const c = useTheme();
  const heights = { sm: 36, md: 48, lg: 56 };
  const pad = { sm: 12, md: 18, lg: 22 };
  const fontSizes = { sm: 13, md: 15, lg: 16 };

  const bg =
    variant === 'primary'
      ? c.tint
      : variant === 'danger'
      ? c.danger
      : 'transparent';
  const borderColor =
    variant === 'outline' ? c.tint : variant === 'ghost' ? 'transparent' : bg;
  const fg =
    variant === 'primary' || variant === 'danger'
      ? c.onTint
      : variant === 'outline'
      ? c.tint
      : c.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        {
          height: heights[size],
          paddingHorizontal: pad[size],
          backgroundColor: disabled ? c.border : bg,
          borderColor: disabled ? c.border : borderColor,
          opacity: pressed ? 0.85 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}>
      {iconLeft && <Icon name={iconLeft} size={fontSizes[size] + 4} color={fg} />}
      <Text
        style={{
          color: fg,
          fontSize: fontSizes[size],
          fontWeight: '700',
          marginHorizontal: 6,
        }}>
        {label}
      </Text>
      {iconRight && <Icon name={iconRight} size={fontSizes[size] + 4} color={fg} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1.5,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
