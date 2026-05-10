import Foundation

enum ProductLookup {

    /// Busca un producto por código de barra:
    /// 1) Catálogo local (productos chilenos curados)
    /// 2) Open Food Facts (mundial, gratis)
    /// 3) UPCitemdb trial (sin auth, ~100 req/día)
    static func lookup(barcode: String) async -> ProductLookupResult? {
        if let local = tryLocal(barcode: barcode) { return local }
        if let off = try? await tryOpenFoodFacts(barcode: barcode), off != nil { return off }
        if let upc = try? await tryUpcItemDb(barcode: barcode), upc != nil { return upc }
        return nil
    }

    private static func tryLocal(barcode: String) -> ProductLookupResult? {
        guard let p = Catalog.shared.localProducts[barcode] else { return nil }
        return ProductLookupResult(
            barcode: barcode,
            name: p.name,
            brand: p.brand,
            imageURL: nil,
            inferredMaterials: p.materials,
            notes: p.notes,
            source: .local
        )
    }

    private static func tryOpenFoodFacts(barcode: String) async throws -> ProductLookupResult? {
        let urlStr = "https://world.openfoodfacts.org/api/v2/product/\(barcode).json?fields=product_name,brands,image_front_small_url,packaging,packaging_tags,categories"
        guard let url = URL(string: urlStr) else { return nil }
        var req = URLRequest(url: url)
        req.setValue("RecicLas-iOS/0.1 (Chile)", forHTTPHeaderField: "User-Agent")
        let (data, _) = try await URLSession.shared.data(for: req)
        guard
            let raw = try JSONSerialization.jsonObject(with: data) as? [String: Any],
            let status = raw["status"] as? Int, status == 1,
            let product = raw["product"] as? [String: Any]
        else { return nil }

        let tags = (product["packaging_tags"] as? [String]) ?? []
        let packaging = (product["packaging"] as? String) ?? ""
        let categories = (product["categories"] as? String) ?? ""
        var found = Set<String>()
        for tag in tags {
            if let m = tagToMaterial[tag] { found.insert(m) }
        }
        for m in inferFromText("\(packaging) \(categories)") { found.insert(m) }

        return ProductLookupResult(
            barcode: barcode,
            name: product["product_name"] as? String,
            brand: product["brands"] as? String,
            imageURL: (product["image_front_small_url"] as? String).flatMap(URL.init),
            inferredMaterials: Array(found),
            notes: nil,
            source: .openFoodFacts
        )
    }

    private static func tryUpcItemDb(barcode: String) async throws -> ProductLookupResult? {
        let urlStr = "https://api.upcitemdb.com/prod/trial/lookup?upc=\(barcode)"
        guard let url = URL(string: urlStr) else { return nil }
        let (data, _) = try await URLSession.shared.data(from: url)
        guard
            let raw = try JSONSerialization.jsonObject(with: data) as? [String: Any],
            let items = raw["items"] as? [[String: Any]],
            let item = items.first
        else { return nil }

        let title = item["title"] as? String ?? ""
        let desc = item["description"] as? String ?? ""
        let category = item["category"] as? String ?? ""
        let brand = item["brand"] as? String ?? ""
        let corpus = "\(title) \(desc) \(category) \(brand)"

        let images = item["images"] as? [String] ?? []
        return ProductLookupResult(
            barcode: barcode,
            name: title,
            brand: brand.isEmpty ? nil : brand,
            imageURL: images.first.flatMap(URL.init),
            inferredMaterials: inferFromText(corpus),
            notes: nil,
            source: .upcItemDb
        )
    }

    private static let tagToMaterial: [String: String] = [
        "en:plastic": "pet",
        "en:pet-1-polyethylene-terephthalate": "pet",
        "en:pet": "pet",
        "en:hdpe-2-high-density-polyethylene": "hdpe",
        "en:hdpe": "hdpe",
        "en:pvc-3-polyvinyl-chloride": "pvc",
        "en:pvc": "pvc",
        "en:ldpe-4-low-density-polyethylene": "ldpe",
        "en:ldpe": "ldpe",
        "en:pp-5-polypropylene": "pp",
        "en:pp": "pp",
        "en:ps-6-polystyrene": "ps",
        "en:other-plastics-7": "otros",
        "en:glass": "vidrio",
        "en:glass-bottle": "vidrio",
        "en:paper": "papel",
        "en:cardboard": "carton",
        "en:tetra-pak": "tetrapak",
        "en:brick": "tetrapak",
        "en:aluminium": "latas_aluminio",
        "en:aluminium-can": "latas_aluminio",
        "en:can": "latas_acero",
        "en:steel": "latas_acero",
        "en:tin": "latas_acero"
    ]

    private static func inferFromText(_ raw: String) -> [String] {
        let r = raw.lowercased()
        var found = Set<String>()
        if r.contains("vidrio") || r.contains("glass") { found.insert("vidrio") }
        if r.contains("cartón") || r.contains("carton") || r.contains("cardboard") || r.contains("caja") { found.insert("carton") }
        if r.contains("papel") || r.contains("paper") { found.insert("papel") }
        if r.contains("tetra") || r.contains("brick") { found.insert("tetrapak") }
        if r.contains("aluminio") || r.contains("aluminium") || r.contains("beverage can") { found.insert("latas_aluminio") }
        if r.contains("lata") || r.contains("tin") { found.insert("latas_acero") }
        if r.contains("plástico") || r.contains("plastic") || r.contains("pet") || r.contains("botella") { found.insert("pet") }
        if r.contains("hdpe") || r.contains("pead") { found.insert("hdpe") }
        if r.contains("ldpe") || r.contains("pebd") || r.contains("bolsa") { found.insert("ldpe") }
        if r.contains("polipropileno") || r.contains("polypropylene") { found.insert("pp") }
        return Array(found)
    }
}
