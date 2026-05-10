import SwiftUI
import MapKit
import CoreLocation

struct PointsView: View {
    @StateObject private var locationModel = UserLocationModel()
    @State private var filter: String = "todos"
    @State private var cameraPosition: MapCameraPosition = .region(MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: -33.4096, longitude: -70.5664),
        span: MKCoordinateSpan(latitudeDelta: 0.05, longitudeDelta: 0.05)
    ))

    private let filters: [(id: String, label: String)] = [
        ("todos", "Todos"),
        ("pet", "PET"),
        ("vidrio", "Vidrio"),
        ("papel", "Papel/cartón"),
        ("tetrapak", "TetraPak"),
        ("latas_aluminio", "Latas"),
        ("aceite_cocina", "Aceite"),
        ("pilas", "Pilas"),
        ("electronicos_pequenos", "Electrónicos"),
    ]

    var filteredPoints: [CleanPoint] {
        let all = Catalog.shared.cleanPoints
        let base = filter == "todos" ? all : all.filter { $0.materiales.contains(filter) }
        if let user = locationModel.location {
            return base.sorted { a, b in
                distance(from: user, to: a) < distance(from: user, to: b)
            }
        }
        return base
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Puntos limpios").font(.system(size: 28, weight: .black))
                    Text("\(filteredPoints.count) puntos en Las Condes\(locationModel.location != nil ? " · ordenados por cercanía" : "")")
                        .font(.system(size: 13)).foregroundColor(Theme.textMuted)

                    Map(position: $cameraPosition) {
                        ForEach(filteredPoints) { p in
                            Annotation(p.nombre, coordinate: CLLocationCoordinate2D(latitude: p.lat, longitude: p.lng)) {
                                ZStack {
                                    Circle().fill(Theme.tint).frame(width: 36, height: 36)
                                        .overlay(Circle().stroke(Color.white, lineWidth: 3))
                                        .shadow(color: .black.opacity(0.3), radius: 4, y: 2)
                                    Text("♻︎").foregroundColor(.white).font(.system(size: 14, weight: .heavy))
                                }
                            }
                        }
                        UserAnnotation()
                    }
                    .mapControls { MapUserLocationButton(); MapCompass() }
                    .frame(height: 320)
                    .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ForEach(filters, id: \.id) { f in
                                Button {
                                    filter = f.id
                                } label: {
                                    Text(f.label).font(.system(size: 13, weight: .heavy))
                                        .padding(.horizontal, 14).padding(.vertical, 8)
                                        .background(Capsule().fill(filter == f.id ? Theme.tint : Theme.surface))
                                        .foregroundColor(filter == f.id ? .white : Theme.text)
                                        .overlay(Capsule().stroke(filter == f.id ? Theme.tint : Theme.border, lineWidth: 1))
                                }
                            }
                        }
                    }

                    ForEach(filteredPoints) { p in
                        NavigationLink(destination: PointDetailView(point: p)) {
                            PointCardView(point: p, userLocation: locationModel.location)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(16)
            }
            .background(Theme.bg.ignoresSafeArea())
            .navigationBarHidden(true)
            .task { locationModel.start() }
        }
    }

    private func distance(from coord: CLLocationCoordinate2D, to p: CleanPoint) -> CLLocationDistance {
        CLLocation(latitude: coord.latitude, longitude: coord.longitude)
            .distance(from: CLLocation(latitude: p.lat, longitude: p.lng))
    }
}

struct PointCardView: View {
    let point: CleanPoint
    let userLocation: CLLocationCoordinate2D?
    var body: some View {
        Card {
            VStack(alignment: .leading, spacing: 10) {
                HStack(spacing: 8) {
                    Pill(label: point.tipo == .punto_verde ? "PUNTO VERDE" : "PUNTO LIMPIO",
                         tone: point.tipo == .punto_verde ? .info : .success)
                    if let user = userLocation {
                        let km = CLLocation(latitude: user.latitude, longitude: user.longitude)
                            .distance(from: CLLocation(latitude: point.lat, longitude: point.lng)) / 1000.0
                        Text(km < 1 ? "\(Int(km * 1000)) m" : String(format: "%.1f km", km))
                            .font(.system(size: 13, weight: .heavy)).foregroundColor(Theme.tint)
                    }
                }
                Text(point.nombre).font(.system(size: 17, weight: .heavy))
                Text(point.direccion).font(.system(size: 13)).foregroundColor(Theme.textMuted)
                HStack(spacing: 4) {
                    Image(systemName: "clock").font(.system(size: 12)).foregroundColor(Theme.textMuted)
                    Text(point.horario).font(.system(size: 12)).foregroundColor(Theme.textMuted)
                }

                FlowLayout(spacing: 6) {
                    ForEach(point.materiales.prefix(5), id: \.self) { m in
                        Text(Catalog.shared.displayName(for: m))
                            .font(.system(size: 11, weight: .heavy))
                            .foregroundColor(Theme.tintStrong)
                            .padding(.horizontal, 8).padding(.vertical, 4)
                            .background(Capsule().fill(Theme.tintSoft))
                            .overlay(Capsule().stroke(Theme.border, lineWidth: 1))
                    }
                }
            }
        }
    }
}

/// Layout simple tipo "wrap" para tags.
struct FlowLayout: Layout {
    var spacing: CGFloat = 6
    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let maxW = proposal.width ?? .infinity
        var x: CGFloat = 0; var y: CGFloat = 0; var lineH: CGFloat = 0
        for v in subviews {
            let s = v.sizeThatFits(.unspecified)
            if x + s.width > maxW { x = 0; y += lineH + spacing; lineH = 0 }
            x += s.width + spacing
            lineH = max(lineH, s.height)
        }
        return CGSize(width: maxW, height: y + lineH)
    }
    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var x: CGFloat = bounds.minX; var y: CGFloat = bounds.minY; var lineH: CGFloat = 0
        for v in subviews {
            let s = v.sizeThatFits(.unspecified)
            if x + s.width > bounds.maxX { x = bounds.minX; y += lineH + spacing; lineH = 0 }
            v.place(at: CGPoint(x: x, y: y), proposal: ProposedViewSize(s))
            x += s.width + spacing
            lineH = max(lineH, s.height)
        }
    }
}

@MainActor
final class UserLocationModel: ObservableObject {
    @Published var location: CLLocationCoordinate2D?
    private let manager = CLLocationManager()
    private let delegate = LocationDelegate()

    func start() {
        manager.delegate = delegate
        manager.desiredAccuracy = kCLLocationAccuracyHundredMeters
        manager.requestWhenInUseAuthorization()
        manager.startUpdatingLocation()
        delegate.onUpdate = { [weak self] coord in
            DispatchQueue.main.async { self?.location = coord }
        }
    }
}

private final class LocationDelegate: NSObject, CLLocationManagerDelegate {
    var onUpdate: ((CLLocationCoordinate2D) -> Void)?
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        if let last = locations.last { onUpdate?(last.coordinate) }
    }
}
