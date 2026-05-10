import SwiftUI

@main
struct RecicLasApp: App {
    @StateObject private var history = ScanHistoryStore()

    var body: some Scene {
        WindowGroup {
            RootTabView()
                .environmentObject(history)
                .tint(Theme.tint)
                .preferredColorScheme(.light)
        }
    }
}
