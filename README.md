# RecicLas

App para fomentar la cultura de reciclaje en Chile, partiendo por la comuna de **Las Condes**.

Escanea el código de barras de un producto y la app te dice de qué materiales está hecho su envase y a qué punto limpio llevarlo.

## Dos plataformas, dos codebases

| | Web | iOS |
|---|---|---|
| Código | `app/`, `components/`, `lib/`, `data/` (Expo Router + RN Web) | `ios-native/` (SwiftUI + MapKit + VisionKit) |
| Lenguaje | TypeScript | Swift |
| Mapa | Leaflet + OpenStreetMap | MapKit nativo |
| Escáner | (no aplica — input manual) | DataScannerViewController |
| Persistencia | localStorage | UserDefaults |

Los JSONs de **`data/`** son la fuente de verdad. La app iOS los copia a `ios-native/RecicLas/Resources/`.

## Web

```bash
npm install
npx expo start --web      # localhost:8081
```

Stack: Expo (SDK 54) + Expo Router + React Native Web + TypeScript + Leaflet + Plus Jakarta Sans.

### Estructura web

```
app/                   # Pantallas (Expo Router)
  (tabs)/              # Inicio · Escanear · Puntos
  resultado/[barcode]  # Resultado del escaneo
  material/[id]        # Detalle de material
  punto/[id]           # Detalle de punto limpio
  historial.tsx        # Historial de escaneos
components/
  Themed.tsx
  ui/                  # Card, Button, Pill, Icon, MapView, Mascot, Decorative
data/                  # JSONs compartidos (puntos limpios, materiales, productos chilenos)
lib/                   # productLookup, scanHistory, distance, data
```

## iOS (Swift native)

Ver [ios-native/README.md](./ios-native/README.md) para detalles. Resumen:

```bash
brew install xcodegen        # primera vez
cd ios-native
xcodegen                     # genera RecicLas.xcodeproj
open RecicLas.xcodeproj      # abre en Xcode 15+, target iOS 17+
```

Stack: SwiftUI + MapKit + VisionKit (DataScanner) + CoreLocation. Sin dependencias externas.

## Datos

- **Puntos limpios**: 8 puntos fijos + Punto Verde de Las Condes. Coords aproximadas — hay que afinar antes de publicar.
- **Códigos de resina (SPI)**: 1-7. En Chile sólo se reciclan masivamente PET (1), HDPE (2), LDPE (4) y PP rígido (5).
- **Productos chilenos**: catálogo curado en `data/local-products.json` que se consulta antes que las APIs externas. Crece con cada PR.

## Lookup de productos (en cascada)

1. Catálogo local (`data/local-products.json`) — productos chilenos curados
2. [Open Food Facts](https://world.openfoodfacts.org/) — base mundial gratis
3. [UPCitemdb trial](https://www.upcitemdb.com/) — fallback sin auth

Si ninguna lo encuentra, la app igual ofrece selector visual de envases para que el usuario elija a mano.

## Próximos pasos

- Afinar coordenadas reales de cada punto limpio
- Expandir catálogo de productos chilenos (escanear y aportar PR)
- App Icon real para iOS
- Modo oscuro pulido
- Reconocimiento del triángulo por foto (OCR)
- Expandir a otras comunas (Providencia, Vitacura, Lo Barnechea)

## Licencia

MIT
