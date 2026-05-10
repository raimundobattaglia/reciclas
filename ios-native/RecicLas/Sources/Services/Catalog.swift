import Foundation

final class Catalog {
    static let shared = Catalog()

    let cleanPoints: [CleanPoint]
    let resinCodes: [String: ResinCode]    // key = "1".."7"
    let categorias: [String: Categoria]    // key = id (papel, vidrio, etc.)
    let localProducts: [String: LocalProduct]

    private init() {
        self.cleanPoints = Self.loadJSON("clean-points", as: CleanPointsFile.self)?.puntos ?? []
        let mats = Self.loadJSON("materials", as: MaterialsFile.self)
        self.resinCodes = mats?.codigos_resina ?? [:]
        self.categorias = mats?.categorias ?? [:]
        self.localProducts = Self.loadJSON("local-products", as: LocalProductsFile.self)?.productos ?? [:]
    }

    private static func loadJSON<T: Decodable>(_ name: String, as: T.Type) -> T? {
        guard let url = Bundle.main.url(forResource: name, withExtension: "json") else {
            print("[Catalog] missing \(name).json in bundle")
            return nil
        }
        do {
            let data = try Data(contentsOf: url)
            return try JSONDecoder().decode(T.self, from: data)
        } catch {
            print("[Catalog] decode error for \(name).json: \(error)")
            return nil
        }
    }

    /// Devuelve nombre legible para un material id ("pet" -> "PET", "vidrio" -> "Vidrio")
    func displayName(for id: String) -> String {
        if let r = resinCodes.values.first(where: { $0.id == id }) { return r.nombre }
        if let cat = categorias[id] { return cat.nombre }
        return id
    }

    func reciclable(for id: String) -> ReciclableValue {
        if let r = resinCodes.values.first(where: { $0.id == id }) { return r.reciclable_chile }
        // Para categorías, asumimos reciclables salvo basura_comun
        if id == "basura_comun" { return .no }
        return .yes
    }

    func consejo(for id: String) -> String? {
        if let r = resinCodes.values.first(where: { $0.id == id }) { return r.consejo }
        return categorias[id]?.consejo
    }

    func ejemplos(for id: String) -> [String] {
        if let r = resinCodes.values.first(where: { $0.id == id }) { return r.ejemplos }
        return categorias[id]?.ejemplos ?? []
    }

    func cleanPoints(forMaterial materialId: String) -> [CleanPoint] {
        cleanPoints.filter { $0.materiales.contains(materialId) }
    }
}
