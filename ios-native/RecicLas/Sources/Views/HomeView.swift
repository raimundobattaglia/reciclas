import SwiftUI

struct HomeView: View {
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 22) {
                    HeroBlock()
                    StatsRow()
                    StepsBlock()
                    ResinCodesBlock()
                    NavigationLink(destination: HistoryView()) {
                        HistoryEntryCard()
                    }
                    .buttonStyle(.plain)
                    TipBlock()
                }
                .padding(18)
            }
            .background(Theme.bg.ignoresSafeArea())
            .navigationTitle("RecicLas")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(Theme.bg, for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
        }
    }
}

private struct HeroBlock: View {
    var body: some View {
        ZStack(alignment: .topTrailing) {
            LinearGradient(
                colors: [Theme.tint, Theme.tintStrong, Color(red: 0.06, green: 0.25, blue: 0.08)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .clipShape(RoundedRectangle(cornerRadius: 28, style: .continuous))

            // Mascota a la derecha
            MascotView(size: 160)
                .offset(x: -10, y: 20)

            VStack(alignment: .leading, spacing: 14) {
                HStack(spacing: 8) {
                    Circle().fill(Color(red: 0.52, green: 0.82, blue: 0.58)).frame(width: 6, height: 6)
                    Text("LAS CONDES · CHILE")
                        .font(.system(size: 11, weight: .heavy))
                        .tracking(1.4)
                        .foregroundColor(Color(red: 0.91, green: 0.96, blue: 0.91))
                }
                .padding(.horizontal, 12).padding(.vertical, 7)
                .background(Capsule().fill(Color.white.opacity(0.18)))

                VStack(alignment: .leading, spacing: 0) {
                    Text("Reciclar bien,")
                        .font(.system(size: 36, weight: .black))
                        .foregroundColor(.white)
                    Text("sin adivinar.")
                        .font(.system(size: 36, weight: .black))
                        .foregroundColor(Color(red: 0.52, green: 0.82, blue: 0.58))
                }
                Text("Escanea cualquier producto y descubre a dónde va cada parte de su envase, sin googlear.")
                    .font(.system(size: 15))
                    .foregroundColor(Color.white.opacity(0.92))
                    .frame(maxWidth: 380, alignment: .leading)

                HStack(spacing: 10) {
                    NavigationLink(destination: ScanView()) {
                        HStack(spacing: 8) {
                            Image(systemName: "barcode.viewfinder")
                            Text("Escanear")
                                .font(.system(size: 14, weight: .heavy))
                            Image(systemName: "arrow.right")
                        }
                        .padding(.horizontal, 18).padding(.vertical, 12)
                        .background(Capsule().fill(Color.white))
                        .foregroundColor(Theme.tintStrong)
                    }
                    NavigationLink(destination: PointsView()) {
                        HStack(spacing: 6) {
                            Image(systemName: "mappin.circle.fill")
                            Text("Ver puntos").font(.system(size: 14, weight: .heavy))
                        }
                        .padding(.horizontal, 16).padding(.vertical, 11)
                        .background(Capsule().stroke(Color.white.opacity(0.7), lineWidth: 1.5))
                        .foregroundColor(.white)
                    }
                }
                .padding(.top, 8)
            }
            .padding(24)
        }
    }
}

private struct StatsRow: View {
    var body: some View {
        HStack(spacing: 10) {
            statCard(emoji: "♻️", big: "\(Catalog.shared.cleanPoints.count)", small: "puntos limpios", tint: Theme.tint)
            statCard(emoji: "📦", big: "7", small: "materiales", tint: Theme.info)
            statCard(emoji: "🌱", big: "2026", small: "empezando ya", tint: Color(red: 0.05, green: 0.49, blue: 0.4))
        }
    }
    private func statCard(emoji: String, big: String, small: String, tint: Color) -> some View {
        VStack(spacing: 4) {
            Text(emoji).font(.system(size: 22))
            Text(big).font(.system(size: 24, weight: .black)).foregroundColor(tint)
            Text(small).font(.system(size: 11, weight: .semibold)).foregroundColor(Theme.textMuted).multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(14)
        .background(RoundedRectangle(cornerRadius: 18, style: .continuous).fill(Theme.surface))
        .overlay(RoundedRectangle(cornerRadius: 18, style: .continuous).stroke(Theme.border, lineWidth: 1))
    }
}

private struct StepsBlock: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("CÓMO FUNCIONA").font(.system(size: 11, weight: .heavy)).tracking(1.4).foregroundColor(Theme.textMuted)
            VStack(spacing: 12) {
                stepRow(emoji: "📷", n: "1", title: "Escanea", detail: "El código de barra del producto.")
                stepRow(emoji: "🔍", n: "2", title: "Identifica", detail: "De qué material es cada parte del envase.")
                stepRow(emoji: "📍", n: "3", title: "Recicla", detail: "En el punto limpio más cercano que lo recibe.")
            }
        }
    }
    private func stepRow(emoji: String, n: String, title: String, detail: String) -> some View {
        Card {
            HStack(alignment: .top, spacing: 14) {
                Text(emoji).font(.system(size: 28))
                VStack(alignment: .leading, spacing: 4) {
                    Text("PASO \(n)").font(.system(size: 11, weight: .heavy)).foregroundColor(Theme.tintStrong).tracking(1.2)
                    Text(title).font(.system(size: 17, weight: .heavy)).foregroundColor(Theme.text)
                    Text(detail).font(.system(size: 13)).foregroundColor(Theme.textMuted)
                }
                Spacer()
            }
        }
    }
}

private struct ResinCodesBlock: View {
    let items: [(id: String, n: Int, name: String, ex: String, status: ReciclableValue)] = [
        ("pet", 1, "PET", "Botella", .yes),
        ("hdpe", 2, "HDPE", "Detergente", .yes),
        ("pvc", 3, "PVC", "Tubería", .no),
        ("ldpe", 4, "LDPE", "Bolsa", .yes),
        ("pp", 5, "PP", "Yogurt", .partial),
        ("ps", 6, "PS", "Plumavit", .no),
    ]
    let columns = Array(repeating: GridItem(.flexible(), spacing: 10), count: 3)

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("CÓDIGOS DEL TRIÁNGULO").font(.system(size: 11, weight: .heavy)).tracking(1.4).foregroundColor(Theme.textMuted)
            Text("En Chile sólo se reciclan masivamente PET (1), HDPE (2), LDPE (4) y PP rígido (5). Toca uno para ver dónde va.")
                .font(.system(size: 14))
                .foregroundColor(Theme.textMuted)
            LazyVGrid(columns: columns, spacing: 10) {
                ForEach(items, id: \.id) { item in
                    NavigationLink(destination: MaterialDetailView(materialId: item.id)) {
                        codeChip(n: item.n, name: item.name, ex: item.ex, status: item.status)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }
    private func codeChip(n: Int, name: String, ex: String, status: ReciclableValue) -> some View {
        let color: Color = {
            switch status { case .yes: return Theme.tint; case .partial: return Theme.warning; case .no: return Theme.danger }
        }()
        return VStack(spacing: 6) {
            ZStack {
                Circle().fill(color).frame(width: 44, height: 44)
                Text("\(n)").font(.system(size: 18, weight: .black)).foregroundColor(.white)
            }
            Text(name).font(.system(size: 14, weight: .heavy))
            Text(ex).font(.system(size: 11)).foregroundColor(Theme.textMuted)
        }
        .frame(maxWidth: .infinity)
        .padding(12)
        .background(RoundedRectangle(cornerRadius: 18, style: .continuous).fill(Theme.surface))
        .overlay(RoundedRectangle(cornerRadius: 18, style: .continuous).stroke(Theme.border, lineWidth: 1))
    }
}

private struct HistoryEntryCard: View {
    var body: some View {
        Card {
            HStack(spacing: 14) {
                ZStack {
                    RoundedRectangle(cornerRadius: 14, style: .continuous).fill(Theme.tintSoft)
                        .frame(width: 52, height: 52)
                    Text("📋").font(.system(size: 26))
                }
                VStack(alignment: .leading, spacing: 2) {
                    Text("Tus escaneos").font(.system(size: 16, weight: .heavy))
                    Text("Vuelve a ver los productos que ya escaneaste").font(.system(size: 13)).foregroundColor(Theme.textMuted)
                }
                Spacer()
                Image(systemName: "chevron.right").foregroundColor(Theme.textMuted)
            }
        }
    }
}

private struct TipBlock: View {
    var body: some View {
        Card {
            VStack(alignment: .leading, spacing: 8) {
                Text("💡").font(.system(size: 26))
                Text("Sabías que…").font(.system(size: 17, weight: .heavy))
                Text("Las Condes tiene 8 puntos limpios fijos + Punto Verde + recolección de orgánicos puerta a puerta. La mayoría recibe vidrio, papel, PET y TetraPak. El Punto Verde es el único que recibe pilas y electrónicos.")
                    .font(.system(size: 14))
                    .foregroundColor(Theme.textMuted)
            }
        }
    }
}
