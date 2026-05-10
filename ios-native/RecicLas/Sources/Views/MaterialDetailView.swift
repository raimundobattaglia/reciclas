import SwiftUI

struct MaterialDetailView: View {
    let materialId: String

    var body: some View {
        let cat = Catalog.shared
        let recyclable = cat.reciclable(for: materialId)
        let displayName = cat.displayName(for: materialId)
        let consejo = cat.consejo(for: materialId) ?? ""
        let ejemplos = cat.ejemplos(for: materialId)
        let points = cat.cleanPoints(forMaterial: materialId)
        let resin = cat.resinCodes.first(where: { $0.value.id == materialId })

        let heroColor: Color = {
            switch recyclable { case .yes: return Theme.tint; case .partial: return Theme.warning; case .no: return Theme.danger }
        }()

        return ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                ZStack(alignment: .topLeading) {
                    LinearGradient(colors: [heroColor, heroColor.opacity(0.7)], startPoint: .topLeading, endPoint: .bottomTrailing)
                        .clipShape(RoundedRectangle(cornerRadius: 22))
                    VStack(alignment: .leading, spacing: 12) {
                        if let resin {
                            ZStack {
                                Circle().fill(Color.white).frame(width: 56, height: 56)
                                Text(resin.key).font(.system(size: 22, weight: .black)).foregroundColor(heroColor)
                            }
                        }
                        Text(displayName).font(.system(size: 32, weight: .black)).foregroundColor(.white)
                        if let resin {
                            Text(resin.value.nombre_largo).font(.system(size: 14)).foregroundColor(.white.opacity(0.95))
                        }
                        Pill(label: recyclable == .yes ? "Reciclable en Chile" : recyclable == .partial ? "Reciclable parcialmente" : "No reciclable masivamente",
                             tone: recyclable == .yes ? .success : recyclable == .partial ? .warning : .danger)
                    }.padding(22)
                }

                section(label: "CÓMO PREPARARLO") {
                    Card { Text(consejo).font(.system(size: 15)).foregroundColor(Theme.text) }
                }
                if !ejemplos.isEmpty {
                    section(label: "EJEMPLOS TÍPICOS") {
                        FlowLayout(spacing: 8) {
                            ForEach(ejemplos, id: \.self) { e in
                                Text(e).font(.system(size: 13))
                                    .padding(.horizontal, 12).padding(.vertical, 8)
                                    .background(Capsule().fill(Theme.surface))
                                    .overlay(Capsule().stroke(Theme.border, lineWidth: 1))
                            }
                        }
                    }
                }
                if recyclable != .no {
                    section(label: "DÓNDE RECICLARLO (\(points.count))") {
                        if points.isEmpty {
                            Card { Text("No hay puntos mapeados que reciban este material.").foregroundColor(Theme.textMuted) }
                        } else {
                            VStack(spacing: 10) {
                                ForEach(points) { p in
                                    NavigationLink(destination: PointDetailView(point: p)) {
                                        Card {
                                            HStack(spacing: 12) {
                                                ZStack {
                                                    Circle().fill(Theme.tintSoft).frame(width: 36, height: 36)
                                                    Image(systemName: "mappin.circle.fill").foregroundColor(Theme.tint)
                                                }
                                                VStack(alignment: .leading, spacing: 2) {
                                                    Text(p.nombre).font(.system(size: 15, weight: .heavy)).foregroundColor(Theme.text)
                                                    Text(p.direccion).font(.system(size: 13)).foregroundColor(Theme.textMuted)
                                                }
                                                Spacer()
                                                Image(systemName: "chevron.right").foregroundColor(Theme.textMuted)
                                            }
                                        }
                                    }.buttonStyle(.plain)
                                }
                            }
                        }
                    }
                }
            }
            .padding(16)
        }
        .background(Theme.bg.ignoresSafeArea())
        .navigationTitle(displayName)
        .navigationBarTitleDisplayMode(.inline)
    }

    @ViewBuilder
    private func section<Content: View>(label: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(label).font(.system(size: 11, weight: .heavy)).tracking(1.4).foregroundColor(Theme.textMuted)
            content()
        }
    }
}
