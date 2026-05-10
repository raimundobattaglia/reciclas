import SwiftUI
import MapKit

struct PointDetailView: View {
    let point: CleanPoint

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Pill(label: point.tipo == .punto_verde ? "PUNTO VERDE" : "PUNTO LIMPIO",
                     tone: point.tipo == .punto_verde ? .info : .success)
                Text(point.nombre).font(.system(size: 26, weight: .black))
                Text("\(point.direccion) · \(point.comuna)").font(.system(size: 14)).foregroundColor(Theme.textMuted)

                Map(position: .constant(.region(MKCoordinateRegion(
                    center: CLLocationCoordinate2D(latitude: point.lat, longitude: point.lng),
                    span: MKCoordinateSpan(latitudeDelta: 0.01, longitudeDelta: 0.01)
                )))) {
                    Annotation(point.nombre, coordinate: CLLocationCoordinate2D(latitude: point.lat, longitude: point.lng)) {
                        ZStack {
                            Circle().fill(Theme.tint).frame(width: 40, height: 40)
                                .overlay(Circle().stroke(Color.white, lineWidth: 3))
                            Text("♻︎").foregroundColor(.white).font(.system(size: 16, weight: .heavy))
                        }
                    }
                }
                .frame(height: 220)
                .clipShape(RoundedRectangle(cornerRadius: 22))

                Button {
                    openInMaps()
                } label: {
                    HStack {
                        Image(systemName: "map.fill")
                        Text("Cómo llegar").font(.system(size: 15, weight: .heavy))
                        Image(systemName: "arrow.up.right.square")
                    }
                    .frame(maxWidth: .infinity).padding(.vertical, 14)
                    .background(Capsule().fill(Theme.tint))
                    .foregroundColor(.white)
                }

                Card {
                    VStack(alignment: .leading, spacing: 12) {
                        InfoRow(icon: "clock", label: "Horario", value: point.horario)
                        Divider()
                        InfoRow(icon: "arrow.triangle.2.circlepath", label: "Tipo",
                                value: point.tipo == .punto_verde ? "Punto Verde (más materiales)" :
                                       point.tipo == .movil ? "Punto móvil" : "Punto limpio fijo")
                        if let notas = point.notas {
                            Divider()
                            Text(notas).font(.system(size: 13)).foregroundColor(Theme.textMuted).italic()
                        }
                    }
                }

                Text("QUÉ RECIBE").font(.system(size: 11, weight: .heavy)).tracking(1.4).foregroundColor(Theme.textMuted).padding(.top, 4)

                FlowLayout(spacing: 8) {
                    ForEach(point.materiales, id: \.self) { m in
                        Text(Catalog.shared.displayName(for: m))
                            .font(.system(size: 13, weight: .heavy))
                            .foregroundColor(Theme.tintStrong)
                            .padding(.horizontal, 12).padding(.vertical, 8)
                            .background(Capsule().fill(Theme.tintSoft))
                    }
                }
            }
            .padding(18)
        }
        .background(Theme.bg.ignoresSafeArea())
        .navigationTitle(point.nombre)
        .navigationBarTitleDisplayMode(.inline)
    }

    private func openInMaps() {
        let coord = CLLocationCoordinate2D(latitude: point.lat, longitude: point.lng)
        let item = MKMapItem(placemark: MKPlacemark(coordinate: coord))
        item.name = point.nombre
        item.openInMaps(launchOptions: [MKLaunchOptionsMapTypeKey: MKMapType.standard.rawValue])
    }
}

struct InfoRow: View {
    let icon: String
    let label: String
    let value: String
    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            ZStack {
                Circle().fill(Theme.tintSoft).frame(width: 32, height: 32)
                Image(systemName: icon).font(.system(size: 13)).foregroundColor(Theme.tint)
            }
            VStack(alignment: .leading, spacing: 2) {
                Text(label).font(.system(size: 11)).foregroundColor(Theme.textMuted).tracking(0.8)
                Text(value).font(.system(size: 15))
            }
            Spacer()
        }
    }
}
