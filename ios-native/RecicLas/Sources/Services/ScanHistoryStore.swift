import Foundation
import SwiftUI

final class ScanHistoryStore: ObservableObject {
    @Published private(set) var entries: [ScanHistoryEntry] = []

    private let key = "reciclas.history.v1"
    private let max = 50

    init() { load() }

    func load() {
        guard let data = UserDefaults.standard.data(forKey: key) else { return }
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        if let list = try? decoder.decode([ScanHistoryEntry].self, from: data) {
            entries = list
        }
    }

    func save() {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        if let data = try? encoder.encode(entries) {
            UserDefaults.standard.set(data, forKey: key)
        }
    }

    func add(_ entry: ScanHistoryEntry) {
        var next = entries.filter { $0.barcode != entry.barcode }
        next.insert(entry, at: 0)
        if next.count > max { next = Array(next.prefix(max)) }
        entries = next
        save()
    }

    func clear() {
        entries = []
        UserDefaults.standard.removeObject(forKey: key)
    }
}
