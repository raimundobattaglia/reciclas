import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Text, useTheme } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export default function EscanearManualScreen() {
  const c = useTheme();
  const [code, setCode] = useState('');
  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Stack.Screen options={{ title: 'Código manual' }} />
      <Text style={styles.title}>Ingresa el código</Text>
      <Text tone="muted" style={styles.sub}>
        Busca el código de barras impreso en el envase del producto.
      </Text>

      <View
        style={[
          styles.input,
          { backgroundColor: c.surface, borderColor: c.border },
        ]}>
        <Icon name="search" size={20} color={c.textMuted} />
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="Ej: 7802620071079"
          placeholderTextColor={c.textMuted}
          keyboardType="numeric"
          autoFocus
          style={[styles.inputField, { color: c.text }]}
        />
      </View>

      <Button
        label="Buscar producto"
        iconRight="arrow"
        onPress={() => router.replace(`/resultado/${encodeURIComponent(code.trim())}` as any)}
        disabled={code.trim().length < 6}
        style={{ marginTop: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: '800', marginTop: 8 },
  sub: { fontSize: 14, marginTop: 6, marginBottom: 20 },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  inputField: { flex: 1, fontSize: 18, marginLeft: 12, outlineStyle: 'none' as any },
});
