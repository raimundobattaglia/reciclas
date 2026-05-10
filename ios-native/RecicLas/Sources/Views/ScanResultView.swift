import SwiftUI

struct ScanResultView: View {
    let barcode: String
    @State private var state: LookupState = .loading
    @EnvironmentObject var history: ScanHistoryStore

    enum LookupState {
        case loading
        case found(ProductLookupResult)
        case notFound
        case error(String)
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                switch state {
                case .loading:
                    HStack { Spacer(); ProgressView("Buscando código \(barcode)…"); Spacer() }
                        .padding(.vertical, 60)
                case .found(let p):
                    FoundView(product: p)
                case .notFound:
                    NotFoundView(barcode: barcode)
                case .error(let msg):
                    Card {
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Error consultando").font(.system(size: 17, weight: .heavy))
                            Text(msg).font(.system(size: 14)).foregroundColor(Theme.textMuted)
                        }
                    }
                }
            }
            .padding(16)
        }
        .background(Theme.bg.ignoresSafeArea())
        .navigationTitle("Resultado")
        .navigationBarTitleDisplayMode(.inline)
        .task {
            let result = await ProductLookup.lookup(barcode: barcode)
            await MainActor.run {
                if let result {
                    state = .found(result)
                    history.add(.init(
                        barcode: barcode,
                        name: result.name,
                        brand: result.brand,
                        materials: result.inferredMaterials,
                        scannedAt: Date()
                    ))
                } else {
                    state = .notFound
                    history.add(.init(barcode: barcode, name: nil, brand: nil, materials: [], scannedAt: Date()))
                }
            }
        }
    }
}

private struct FoundView: View {
    let product: ProductLookupResult
    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            Card {
                HStack(spacing: 14) {
                    if let url = product.imageURL {
                        AsyncImage(url: url) { img in
                            img.resizable().scaledToFit()
                        } placeholder: {
                            Image(systemName: "barcode").foregroundColor(Theme.tint)
                        }
                        .frame(width: 64, height: 64)
                        .background(Theme.tintSoft)
                        .cornerRadius(12)
                    } else {
                        ZStack {
                            RoundedRectangle(cornerRadius: 12).fill(Theme.tintSoft).frame(width: 64, height: 64)
                            Image(systemName: "barcode.viewfinder").font(.system(size: 28)).foregroundColor(Theme.tint)
                        }
                    }
                    VStack(alignment: .leading, spacing: 2) {
                        Text(product.name ?? "Producto sin nombre").font(.system(size: 17, weight: .heavy))
                        if let brand = product.brand { Text(brand).font(.system(size: 13)).foregroundColor(Theme.textMuted) }
                        Text("EAN \(product.barcode) · \(sourceLabel(product.source))")
                            .font(.system(size: 11)).foregroundColor(Theme.textMuted)
                    }
                    Spacer()
                }
            }

            Text("MATERIALES DETECTADOS").font(.system(size: 11, weight: .heavy)).tracking(1.4).foregroundColor(Theme.textMuted)

            if product.inferredMaterials.isEmpty {
                Card {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Sin info detallada del envase").font(.system(size: 15, weight: .heavy))
                        Text("Selecciona el envase a mano abajo.").font(.system(size: 13)).foregroundColor(Theme.textMuted)
                    }
                }
                ManualMaterialPicker()
            } else {
                ForEach(product.inferredMaterials, id: \.self) { matId in
                    NavigationLink(destination: MaterialDetailView(materialId: matId)) {
                        MaterialRowCard(materialId: matId)
                    }.buttonStyle(.plain)
                }
            }
        }
    }
    private func sourceLabel(_ s: ProductLookupResult.Source) -> String {
        switch s {
        case .local: return "Catálogo local"
        case .openFoodFacts: return "Open Food Facts"
        case .upcItemDb: return "UPC Database"
        }
    }
}

private struct NotFoundView: View {
    let barcode: String
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            ZStack(alignment: .topLeading) {
                LinearGradient(colors: [Theme.tintSoft, Color.white], startPoint: .topLeading, endPoint: .bottomTrailing)
                    .clipShape(RoundedRectangle(cornerRadius: 22))
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        ZStack {
                            Circle().fill(Color.white).frame(width: 64, height: 64)
                                .overlay(Circle().stroke(Theme.tint, lineWidth: 2))
                            Image(systemName: "magnifyingglass").font(.system(size: 28)).foregroundColor(Theme.tint)
                        }
                        Spacer()
                    }
                    Text("No tenemos ese producto").font(.system(size: 22, weight: .heavy))
                    Text("El código \(barcode) no está en nuestras bases. Pero igual podemos ayudarte: elige el tipo de envase y te decimos qué hacer.")
                        .font(.system(size: 14)).foregroundColor(Theme.textMuted)
                }
                .padding(20)
            }

            Text("¿QUÉ ENVASE TIENES?").font(.system(size: 11, weight: .heavy)).tracking(1.4).foregroundColor(Theme.textMuted)
            ManualMaterialPicker()
        }
    }
}

private struct ManualMaterialPicker: View {
    let items: [(id: String, emoji: String, name: String, sub: String)] = [
        ("pet", "🥤", "Botella plástica", "Bebida, agua, aceite"),
        ("vidrio", "🍾", "Vidrio", "Botella, frasco"),
        ("tetrapak", "📦", "TetraPak", "Leche, jugo, vino"),
        ("latas_aluminio", "🥫", "Lata aluminio", "Bebida, cerveza"),
        ("carton", "📦", "Cartón", "Caja, embalaje"),
        ("papel", "📄", "Papel", "Hoja, diario"),
        ("pp", "🥣", "Pote rígido", "Yogurt, margarina"),
        ("ldpe", "🛍️", "Bolsa plástica", "Pan, supermercado"),
        ("aceite_cocina", "🫙", "Aceite usado", "En botella cerrada"),
        ("pilas", "🔋", "Pilas", "AA, AAA, pequeñas")
    ]
    let columns = Array(repeating: GridItem(.flexible(), spacing: 10), count: 3)
    var body: some View {
        LazyVGrid(columns: columns, spacing: 10) {
            ForEach(items, id: \.id) { item in
                NavigationLink(destination: MaterialDetailView(materialId: item.id)) {
                    VStack(spacing: 6) {
                        Text(item.emoji).font(.system(size: 30))
                        Text(item.name).font(.system(size: 13, weight: .heavy)).foregroundColor(Theme.text)
                        Text(item.sub).font(.system(size: 11)).foregroundColor(Theme.textMuted).multilineTextAlignment(.center)
                    }
                    .frame(maxWidth: .infinity).padding(12)
                    .background(RoundedRectangle(cornerRadius: 16).fill(Theme.surface))
                    .overlay(RoundedRectangle(cornerRadius: 16).stroke(Theme.border, lineWidth: 1))
                }
                .buttonStyle(.plain)
            }
        }
    }
}

struct MaterialRowCard: View {
    let materialId: String
    var body: some View {
        let recyclable = Catalog.shared.reciclable(for: materialId)
        let consejo = Catalog.shared.consejo(for: materialId) ?? ""
        let pointCount = Catalog.shared.cleanPoints(forMaterial: materialId).count
        let tone: PillTone = {
            switch recyclable { case .yes: return .success; case .partial: return .warning; case .no: return .danger }
        }()
        return Card {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text(Catalog.shared.displayName(for: materialId)).font(.system(size: 16, weight: .heavy))
                    Spacer()
                    Pill(label: recyclable.label, tone: tone)
                }
                if !consejo.isEmpty {
                    Text(consejo).font(.system(size: 13)).foregroundColor(Theme.textMuted).lineLimit(3)
                }
                if recyclable != .no && pointCount > 0 {
                    HStack(spacing: 6) {
                        Image(systemName: "mappin.circle.fill").foregroundColor(Theme.tint)
                        Text("\(pointCount) \(pointCount == 1 ? "punto limpio" : "puntos limpios") lo reciben")
                            .font(.system(size: 13, weight: .heavy)).foregroundColor(Theme.tint)
                        Image(systemName: "chevron.right").font(.system(size: 11)).foregroundColor(Theme.tint)
                    }
                }
            }
        }
    }
}
