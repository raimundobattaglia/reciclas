import SwiftUI

struct RootTabView: View {
    var body: some View {
        TabView {
            HomeView()
                .tabItem { Label("Inicio", systemImage: "arrow.triangle.2.circlepath") }

            ScanView()
                .tabItem { Label("Escanear", systemImage: "barcode.viewfinder") }

            PointsView()
                .tabItem { Label("Puntos", systemImage: "mappin.circle.fill") }
        }
    }
}
