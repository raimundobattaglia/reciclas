import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Text, useTheme } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

export default function ScanScreen() {
  const c = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [manual, setManual] = useState('');
  const lockRef = useRef(false);

  const goToResult = (barcode: string) => {
    if (lockRef.current) return;
    lockRef.current = true;
    router.push(`/resultado/${encodeURIComponent(barcode)}` as any);
    setTimeout(() => {
      lockRef.current = false;
    }, 1500);
  };

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { backgroundColor: c.background }]}>
        <View style={styles.center}>
          <Card style={{ width: '100%', maxWidth: 460 }}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: c.tintSoft, borderColor: c.tint },
              ]}>
              <Icon name="scan" size={40} color={c.tint} />
            </View>
            <Text style={styles.title}>Escáner de código</Text>
            <Text tone="muted" style={styles.subtitle}>
              En la versión iOS la cámara escanea directo. Aquí en web ingresa el código a mano
              para probar el flujo.
            </Text>

            <View
              style={[
                styles.input,
                { backgroundColor: c.background, borderColor: c.border },
              ]}>
              <Icon name="search" size={18} color={c.textMuted} />
              <TextInput
                value={manual}
                onChangeText={setManual}
                placeholder="Ej: 7802620071079"
                placeholderTextColor={c.textMuted}
                keyboardType="numeric"
                style={[styles.inputField, { color: c.text }]}
              />
            </View>

            <Button
              label="Buscar producto"
              iconRight="arrow"
              onPress={() => goToResult(manual.trim())}
              disabled={manual.trim().length < 6}
              style={{ marginTop: 14 }}
            />

            <Text tone="muted" style={styles.tip}>
              💡 Prueba con: 7802620071079 (Coca-Cola Chile)
            </Text>
          </Card>
        </View>
      </View>
    );
  }

  if (!permission) return <View style={{ flex: 1, backgroundColor: c.background }} />;

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: c.background }]}>
        <View style={styles.center}>
          <Card style={{ width: '100%', maxWidth: 460, alignItems: 'center' }}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: c.tintSoft, borderColor: c.tint },
              ]}>
              <Icon name="scan" size={40} color={c.tint} />
            </View>
            <Text style={styles.title}>Necesitamos tu cámara</Text>
            <Text tone="muted" style={styles.subtitle}>
              La usamos sólo para leer el código de barra del producto. No se sube ninguna foto.
            </Text>
            <Button
              label="Permitir cámara"
              iconRight="arrow"
              onPress={requestPermission}
              style={{ marginTop: 16 }}
            />
          </Card>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'qr'],
        }}
        onBarcodeScanned={(r) => r?.data && goToResult(r.data)}
      />
      <View style={[styles.overlay, { pointerEvents: 'none' }]}>
        <View style={styles.frame} />
        <Text style={styles.overlayText}>Apunta al código de barra del producto</Text>
      </View>
      <Pressable
        onPress={() => router.push('/escanear-manual' as any)}
        style={styles.manualBtn}>
        <Icon name="search" size={14} color="#fff" />
        <Text style={{ color: '#fff', fontWeight: '600', marginLeft: 8 }}>
          Ingresar código a mano
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, lineHeight: 20, textAlign: 'center', marginBottom: 18 },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 52,
  },
  inputField: { flex: 1, fontSize: 16, marginLeft: 10, outlineStyle: 'none' as any },
  tip: { fontSize: 12, marginTop: 14, textAlign: 'center' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 280,
    height: 170,
    borderColor: '#fff',
    borderWidth: 3,
    borderRadius: 18,
    backgroundColor: 'transparent',
  },
  overlayText: {
    marginTop: 22,
    color: '#fff',
    fontSize: 15,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  manualBtn: {
    position: 'absolute',
    bottom: 36,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
  },
});
