import Foundation

enum CleanPointKind: String, Codable {
    case fijo, punto_verde, movil, pilas, organicos
}

struct CleanPoint: Codable, Identifiable, Hashable {
    let id: String
    let nombre: String
    let direccion: String
    let comuna: String
    let horario: String
    let lat: Double
    let lng: Double
    let materiales: [String]
    let tipo: CleanPointKind
    let notas: String?
}

struct CleanPointsFile: Codable {
    let puntos: [CleanPoint]
}

struct ResinCode: Codable {
    let id: String
    let nombre: String
    let nombre_largo: String
    let ejemplos: [String]
    let reciclable_chile: ReciclableValue
    let destino: [String]
    let consejo: String
}

enum ReciclableValue: Codable, Hashable {
    case yes, no, partial

    init(from decoder: Decoder) throws {
        let c = try decoder.singleValueContainer()
        if let b = try? c.decode(Bool.self) {
            self = b ? .yes : .no
        } else if let s = try? c.decode(String.self), s == "parcial" {
            self = .partial
        } else {
            self = .no
        }
    }
    func encode(to encoder: Encoder) throws {
        var c = encoder.singleValueContainer()
        switch self {
        case .yes: try c.encode(true)
        case .no: try c.encode(false)
        case .partial: try c.encode("parcial")
        }
    }

    var label: String {
        switch self {
        case .yes: return "Reciclable"
        case .partial: return "Parcial"
        case .no: return "No reciclable"
        }
    }
}

struct Categoria: Codable {
    let id: String
    let nombre: String
    let ejemplos: [String]
    let destino: [String]
    let consejo: String
}

struct MaterialsFile: Codable {
    let codigos_resina: [String: ResinCode]
    let categorias: [String: Categoria]
}

struct LocalProduct: Codable {
    let name: String
    let brand: String?
    let materials: [String]
    let notes: String?
}

struct LocalProductsFile: Codable {
    let productos: [String: LocalProduct]
}

struct ProductLookupResult: Identifiable {
    var id: String { barcode }
    let barcode: String
    let name: String?
    let brand: String?
    let imageURL: URL?
    let inferredMaterials: [String]
    let notes: String?
    let source: Source

    enum Source: String { case local, openFoodFacts, upcItemDb }
}

struct ScanHistoryEntry: Codable, Identifiable {
    var id: String { "\(barcode)-\(scannedAt)" }
    let barcode: String
    let name: String?
    let brand: String?
    let materials: [String]
    let scannedAt: Date
}
