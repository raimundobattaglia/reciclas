import SwiftUI

enum Theme {
    static let tint = Color(red: 0x2E/255.0, green: 0x7D/255.0, blue: 0x32/255.0)
    static let tintStrong = Color(red: 0x1B/255.0, green: 0x5E/255.0, blue: 0x20/255.0)
    static let tintSoft = Color(red: 0xE8/255.0, green: 0xF5/255.0, blue: 0xE9/255.0)
    static let bg = Color(red: 0xF5/255.0, green: 0xF7/255.0, blue: 0xF4/255.0)
    static let surface = Color.white
    static let border = Color(red: 0xE2/255.0, green: 0xE7/255.0, blue: 0xE2/255.0)
    static let text = Color(red: 0x0E/255.0, green: 0x16/255.0, blue: 0x12/255.0)
    static let textMuted = Color(red: 0x5C/255.0, green: 0x6B/255.0, blue: 0x66/255.0)
    static let warning = Color(red: 0xF5/255.0, green: 0x9E/255.0, blue: 0x0B/255.0)
    static let danger = Color(red: 0xDC/255.0, green: 0x26/255.0, blue: 0x26/255.0)
    static let info = Color(red: 0x25/255.0, green: 0x63/255.0, blue: 0xEB/255.0)
}

struct Card<Content: View>: View {
    let content: Content
    init(@ViewBuilder content: () -> Content) { self.content = content() }
    var body: some View {
        content
            .padding(18)
            .background(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .fill(Theme.surface)
            )
            .overlay(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .stroke(Theme.border, lineWidth: 1)
            )
            .shadow(color: Color.black.opacity(0.04), radius: 12, x: 0, y: 4)
    }
}

enum PillTone { case neutral, success, warning, danger, info }

struct Pill: View {
    let label: String
    var tone: PillTone = .neutral
    var body: some View {
        let (bg, fg): (Color, Color) = {
            switch tone {
            case .neutral: return (Theme.surface, Theme.textMuted)
            case .success: return (Theme.tintSoft, Theme.tintStrong)
            case .warning: return (Color(red: 1, green: 0.97, blue: 0.9), Color(red: 0.63, green: 0.35, blue: 0))
            case .danger:  return (Color(red: 1, green: 0.89, blue: 0.89), Theme.danger)
            case .info:    return (Color(red: 0.88, green: 0.95, blue: 1), Theme.info)
            }
        }()
        Text(label)
            .font(.system(size: 11, weight: .heavy))
            .foregroundColor(fg)
            .padding(.horizontal, 10).padding(.vertical, 4)
            .background(Capsule().fill(bg))
            .overlay(Capsule().stroke(fg.opacity(0.15), lineWidth: 1))
    }
}
