import SwiftUI

struct HistoryView: View {
    @EnvironmentObject var history: ScanHistoryStore

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Historial de escaneos").font(.system(size: 26, weight: .black))
                Text("Últimos \(history.entries.count) productos escaneados en este dispositivo. No se sincroniza ni sube a ningún servidor.")
                    .font(.system(size: 13)).foregroundColor(Theme.textMuted)

                if history.entries.isEmpty {
                    Card {
                        VStack(spacing: 12) {
                            ZStack {
                                Circle().fill(Theme.tintSoft).frame(width: 80, height: 80)
                                Image(systemName: "barcode.viewfinder").font(.system(size: 32)).foregroundColor(Theme.tint)
                            }
                            Text("Aún no escaneas nada").font(.system(size: 16, weight: .heavy))
                            Text("Cada producto que escanees aparecerá acá.")
                                .font(.system(size: 13)).foregroundColor(Theme.textMuted).multilineTextAlignment(.center)
                            NavigationLink(destination: ScanView()) {
                                Text("Escanear ahora")
                                    .font(.system(size: 14, weight: .heavy))
                                    .padding(.horizontal, 20).padding(.vertical, 10)
                                    .background(Capsule().fill(Theme.tint))
                                    .foregroundColor(.white)
                            }
                        }
                        .padding(.vertical, 12)
                        .frame(maxWidth: .infinity)
                    }
                } else {
                    ForEach(history.entries) { entry in
                        NavigationLink(destination: ScanResultView(barcode: entry.barcode)) {
                            HistoryRow(entry: entry)
                        }.buttonStyle(.plain)
                    }
                    Button {
                        history.clear()
                    } label: {
                        Text("Borrar historial")
                            .font(.system(size: 14, weight: .heavy))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(Capsule().stroke(Theme.danger, lineWidth: 1.5))
                            .foregroundColor(Theme.danger)
                    }
                    .padding(.top, 8)
                }
            }
            .padding(16)
        }
        .background(Theme.bg.ignoresSafeArea())
        .navigationTitle("Historial")
        .navigationBarTitleDisplayMode(.inline)
    }
}

private struct HistoryRow: View {
    let entry: ScanHistoryEntry
    var body: some View {
        Card {
            HStack(spacing: 12) {
                ZStack {
                    Circle().fill(entry.materials.isEmpty ? Theme.border : Theme.tintSoft)
                        .frame(width: 48, height: 48)
                    Image(systemName: entry.materials.isEmpty ? "magnifyingglass" : "arrow.triangle.2.circlepath")
                        .foregroundColor(entry.materials.isEmpty ? Theme.textMuted : Theme.tint)
                }
                VStack(alignment: .leading, spacing: 4) {
                    Text(entry.name ?? "EAN \(entry.barcode)").font(.system(size: 15, weight: .heavy)).lineLimit(1)
                    if let brand = entry.brand {
                        Text(brand).font(.system(size: 13)).foregroundColor(Theme.textMuted).lineLimit(1)
                    }
                    HStack(spacing: 6) {
                        if entry.materials.isEmpty {
                            Pill(label: "No encontrado", tone: .warning)
                        } else {
                            ForEach(entry.materials.prefix(3), id: \.self) { m in
                                Text(Catalog.shared.displayName(for: m))
                                    .font(.system(size: 11, weight: .heavy))
                                    .foregroundColor(Theme.tintStrong)
                                    .padding(.horizontal, 8).padding(.vertical, 3)
                                    .overlay(Capsule().stroke(Theme.border, lineWidth: 1))
                            }
                        }
                        Text(formatDate(entry.scannedAt)).font(.system(size: 11)).foregroundColor(Theme.textMuted)
                    }
                }
                Spacer()
                Image(systemName: "chevron.right").foregroundColor(Theme.textMuted)
            }
        }
    }
    private func formatDate(_ d: Date) -> String {
        let f = DateFormatter()
        f.dateFormat = "d/M · HH:mm"
        return f.string(from: d)
    }
}
