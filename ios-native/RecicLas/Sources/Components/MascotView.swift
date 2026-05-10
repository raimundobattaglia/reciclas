import SwiftUI

/// Mascota "Reci": una gota verde con cara amigable, dibujada nativa con SwiftUI.
struct MascotView: View {
    var size: CGFloat = 180
    @State private var float: CGFloat = 0

    var body: some View {
        ZStack {
            // Cuerpo
            ZStack {
                Circle()
                    .fill(
                        RadialGradient(
                            colors: [
                                Color(red: 0.36, green: 0.75, blue: 0.42),
                                Theme.tint,
                                Theme.tintStrong
                            ],
                            center: .topLeading,
                            startRadius: 4,
                            endRadius: size
                        )
                    )

                // Brillo
                Ellipse()
                    .fill(Color.white.opacity(0.35))
                    .frame(width: size * 0.45, height: size * 0.28)
                    .offset(x: -size * 0.18, y: -size * 0.22)
                    .blur(radius: 6)

                // Hojita arriba
                LeafShape()
                    .fill(LinearGradient(colors: [Color(red: 0.52, green: 0.82, blue: 0.58), Color(red: 0.20, green: 0.83, blue: 0.60)], startPoint: .top, endPoint: .bottom))
                    .frame(width: size * 0.22, height: size * 0.20)
                    .offset(x: -size * 0.05, y: -size * 0.55)
                    .rotationEffect(.degrees(-18))

                // Ojos
                HStack(spacing: size * 0.18) {
                    EyeView(size: size * 0.12)
                    EyeView(size: size * 0.12)
                }
                .offset(y: size * 0.04)

                // Cachetes
                HStack(spacing: size * 0.42) {
                    Capsule()
                        .fill(Color(red: 1, green: 0.7, blue: 0.7).opacity(0.7))
                        .frame(width: size * 0.16, height: size * 0.08)
                    Capsule()
                        .fill(Color(red: 1, green: 0.7, blue: 0.7).opacity(0.7))
                        .frame(width: size * 0.16, height: size * 0.08)
                }
                .offset(y: size * 0.16)
                .blur(radius: 2)

                // Sonrisa
                SmileShape()
                    .stroke(Color.white, style: StrokeStyle(lineWidth: size * 0.035, lineCap: .round))
                    .frame(width: size * 0.32, height: size * 0.12)
                    .offset(y: size * 0.20)
            }
            .frame(width: size, height: size)
            .offset(y: float)
            .shadow(color: Color.black.opacity(0.18), radius: 14, x: 0, y: 10)
        }
        .onAppear {
            withAnimation(.easeInOut(duration: 2.4).repeatForever(autoreverses: true)) {
                float = -8
            }
        }
    }
}

private struct EyeView: View {
    let size: CGFloat
    var body: some View {
        ZStack {
            Ellipse()
                .fill(Color.white)
                .frame(width: size, height: size * 1.15)
            Circle()
                .fill(Color(red: 0.06, green: 0.12, blue: 0.08))
                .frame(width: size * 0.55, height: size * 0.55)
                .offset(x: size * 0.05, y: size * 0.10)
            Circle()
                .fill(Color.white)
                .frame(width: size * 0.18, height: size * 0.18)
                .offset(x: size * 0.12, y: size * 0.04)
        }
    }
}

private struct SmileShape: Shape {
    func path(in rect: CGRect) -> Path {
        var p = Path()
        p.move(to: CGPoint(x: rect.minX, y: rect.minY))
        p.addQuadCurve(
            to: CGPoint(x: rect.maxX, y: rect.minY),
            control: CGPoint(x: rect.midX, y: rect.maxY * 1.5)
        )
        return p
    }
}

private struct LeafShape: Shape {
    func path(in rect: CGRect) -> Path {
        var p = Path()
        p.move(to: CGPoint(x: rect.midX, y: rect.maxY))
        p.addQuadCurve(
            to: CGPoint(x: rect.maxX, y: rect.minY),
            control: CGPoint(x: rect.maxX, y: rect.maxY * 0.6)
        )
        p.addQuadCurve(
            to: CGPoint(x: rect.midX, y: rect.maxY),
            control: CGPoint(x: rect.minX, y: rect.maxY * 0.6)
        )
        p.closeSubpath()
        return p
    }
}
