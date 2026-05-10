# RecicLas iOS — Swift native

App nativa para iOS escrita en **Swift + SwiftUI**, hermana de la versión web del repo.

## Requisitos

- macOS con **Xcode 15+** (no basta con Command Line Tools)
- iOS 17+ (deployment target)
- Cuenta de Apple Developer para firmar y publicar (gratis para correr en simulador)

## Cómo abrir y correr

```bash
# Si necesitas regenerar el proyecto Xcode tras tocar project.yml:
brew install xcodegen
cd ios-native
xcodegen

# Luego abre el proyecto:
open RecicLas.xcodeproj
```

En Xcode:
1. Selecciona el target **RecicLas**
2. Pestaña **Signing & Capabilities** → elige tu Team (Apple Developer)
3. Elige un simulador o tu iPhone como destino
4. ⌘R para correr

## Stack y dependencias

- **SwiftUI** — toda la UI
- **MapKit** — mapa de puntos limpios + detalles
- **VisionKit / DataScannerViewController** — escáner nativo de códigos de barra (iOS 16+)
- **CoreLocation** — geolocalización del usuario
- **UserDefaults** — persistencia del historial (50 últimos escaneos)
- Sin librerías externas. Todo Apple frameworks.

## Estructura

```
ios-native/
├── project.yml              # Config para xcodegen
├── RecicLas.xcodeproj/      # Proyecto generado (no editar a mano)
└── RecicLas/
    ├── Info.plist           # (auto-generado por xcodegen)
    ├── Assets.xcassets/     # Colors, AppIcon
    ├── Resources/           # JSONs (clean-points, materials, local-products)
    └── Sources/
        ├── App/             # @main + RootTabView
        ├── Theme/           # Colores y componentes (Card, Pill)
        ├── Models/          # Codable models
        ├── Services/        # Catalog, ProductLookup, ScanHistoryStore
        ├── Components/      # MascotView (Reci, dibujada en SwiftUI)
        └── Views/           # HomeView, ScanView, PointsView, etc.
```

## Datos compartidos con el proyecto web

Los JSONs en `RecicLas/Resources/` son **copias** de `../data/`. Cuando se actualiza la base de productos o puntos limpios, hay que copiar:

```bash
cp ../data/clean-points.json RecicLas/Resources/
cp ../data/materials.json RecicLas/Resources/
cp ../data/local-products.json RecicLas/Resources/
```

(Idealmente esto sería un build script — pendiente automatizar.)

## Pendientes

- Vista de Material (detalle) está conectada pero falta pulir copy y casos extremos
- Modo oscuro (la app fuerza light por ahora)
- Compartir resultado vía ShareLink
- App Icon real (hoy es placeholder)
- Reemplazar coords aproximadas de los puntos limpios por las reales
