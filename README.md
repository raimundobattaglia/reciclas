# RecicLas

App para fomentar la cultura de reciclaje en Chile, partiendo por la comuna de **Las Condes**.

Escanea el código de barras de un producto y la app te dice de qué materiales está hecho su envase y a qué punto limpio llevarlo.

## Plataformas

- **iOS** — app nativa (Expo / React Native)
- **Web** — misma base de código, corre en navegador con todas las pantallas

## Stack

- Expo (SDK 54) + Expo Router
- React Native + React Native Web
- TypeScript
- Leaflet + OpenStreetMap (mapa web — gratis, sin API key)
- Open Food Facts API + UPCitemdb como fallback (datos de productos)
- expo-camera para escaneo en iOS
- expo-location para ordenar puntos por cercanía

## Arrancar local

```bash
# Requisitos: Node 20+ y, para iOS, Expo Go instalado en el iPhone
npm install
npx expo start --web      # versión web en localhost:8081
npx expo start             # iOS — escanea el QR con Expo Go
```

## Estructura

```
app/                   # Pantallas (Expo Router)
  (tabs)/              # Tabs: Inicio · Escanear · Puntos
  resultado/[barcode]  # Detalle de producto escaneado
  material/[id]        # Detalle de cada material
  punto/[id]           # Detalle de punto limpio
components/
  ui/                  # Sistema de diseño (Card, Button, Pill, Icon, MapView)
  Themed.tsx           # Texto y colores por tema
data/
  clean-points.json    # 9 puntos de Las Condes con coords y materiales
  materials.json       # Códigos de resina 1-7 + categorías + reciclabilidad CL
lib/
  productLookup.ts     # Cascada Open Food Facts → UPCitemdb
  data.ts              # Helpers de catálogo (tipados)
  distance.ts          # Haversine + formateo
```

## Datos

- **Puntos limpios**: 8 puntos fijos + Punto Verde de Las Condes. Las direcciones del JSON son aproximadas y conviene afinarlas con coordenadas exactas antes de publicar.
- **Códigos de resina (SPI)**: 1-7. En Chile sólo se reciclan masivamente PET (1), HDPE (2), LDPE (4) y PP rígido (5). El resto va a basura común.

## Próximos pasos

- Afinar coordenadas exactas de cada punto limpio
- `react-native-maps` en iOS (hoy sólo el web tiene mapa interactivo)
- Modo offline / caché de productos escaneados
- Reconocimiento del triángulo de reciclaje por foto (OCR del número)
- Expandir a más comunas (Providencia, Vitacura, Lo Barnechea)

## Licencia

MIT
