import SwiftUI
import VisionKit

struct PickedCode: Identifiable, Hashable {
    var id: String { value }
    let value: String
}

struct ScanView: View {
    @State private var manualCode: String = ""
    @State private var pickedBarcode: PickedCode?
    @State private var scannerAvailable = DataScannerViewController.isSupported && DataScannerViewController.isAvailable

    var body: some View {
        NavigationStack {
            VStack(spacing: 18) {
                if scannerAvailable {
                    ZStack {
                        BarcodeScannerView { code in
                            pickedBarcode = PickedCode(value: code)
                        }
                        .ignoresSafeArea(edges: .bottom)
                        .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))

                        // Marco visual
                        RoundedRectangle(cornerRadius: 16, style: .continuous)
                            .stroke(Color.white, lineWidth: 3)
                            .frame(width: 280, height: 170)
                            .allowsHitTesting(false)
                            .overlay(
                                Text("Apunta al código de barra")
                                    .font(.system(size: 14, weight: .semibold))
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 12).padding(.vertical, 6)
                                    .background(Capsule().fill(Color.black.opacity(0.5)))
                                    .offset(y: 130)
                                    .allowsHitTesting(false)
                            )
                    }
                    .frame(maxHeight: 360)
                    .padding(.horizontal, 16)
                } else {
                    Card {
                        VStack(spacing: 12) {
                            Image(systemName: "exclamationmark.triangle").font(.system(size: 32)).foregroundColor(Theme.warning)
                            Text("Tu dispositivo no soporta escaneo automático")
                                .font(.system(size: 15, weight: .semibold))
                                .multilineTextAlignment(.center)
                            Text("Ingresa el código a mano abajo.")
                                .font(.system(size: 13)).foregroundColor(Theme.textMuted)
                        }
                    }
                    .padding(.horizontal, 16)
                }

                Card {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("o ingresa el código a mano")
                            .font(.system(size: 13))
                            .foregroundColor(Theme.textMuted)
                        HStack(spacing: 8) {
                            Image(systemName: "magnifyingglass").foregroundColor(Theme.textMuted)
                            TextField("Ej: 7806500000018", text: $manualCode)
                                .keyboardType(.numberPad)
                                .font(.system(size: 17, weight: .medium))
                        }
                        .padding(14)
                        .background(RoundedRectangle(cornerRadius: 12).fill(Theme.bg))
                        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Theme.border, lineWidth: 1))

                        Button {
                            let code = manualCode.trimmingCharacters(in: .whitespaces)
                            if code.count >= 6 {
                                pickedBarcode = PickedCode(value: code)
                            }
                        } label: {
                            HStack {
                                Text("Buscar producto").font(.system(size: 15, weight: .heavy))
                                Image(systemName: "arrow.right")
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(Capsule().fill(manualCode.count < 6 ? Theme.border : Theme.tint))
                            .foregroundColor(.white)
                        }
                        .disabled(manualCode.count < 6)
                    }
                }
                .padding(.horizontal, 16)

                Spacer(minLength: 0)
            }
            .padding(.vertical, 16)
            .background(Theme.bg.ignoresSafeArea())
            .navigationTitle("Escanear")
            .navigationDestination(item: $pickedBarcode) { code in
                ScanResultView(barcode: code.value)
            }
        }
    }
}

/// Wrapper de DataScannerViewController (iOS 16+).
struct BarcodeScannerView: UIViewControllerRepresentable {
    let onCode: (String) -> Void

    func makeUIViewController(context: Context) -> DataScannerViewController {
        let scanner = DataScannerViewController(
            recognizedDataTypes: [.barcode()],
            qualityLevel: .balanced,
            recognizesMultipleItems: false,
            isHighFrameRateTrackingEnabled: false,
            isHighlightingEnabled: true
        )
        scanner.delegate = context.coordinator
        try? scanner.startScanning()
        return scanner
    }

    func updateUIViewController(_ uiViewController: DataScannerViewController, context: Context) {}

    func makeCoordinator() -> Coordinator { Coordinator(onCode: onCode) }

    class Coordinator: NSObject, DataScannerViewControllerDelegate {
        let onCode: (String) -> Void
        private var fired = false
        init(onCode: @escaping (String) -> Void) { self.onCode = onCode }
        func dataScanner(_ dataScanner: DataScannerViewController, didTapOn item: RecognizedItem) {
            handle(item)
        }
        func dataScanner(_ dataScanner: DataScannerViewController, didAdd addedItems: [RecognizedItem], allItems: [RecognizedItem]) {
            for item in addedItems { handle(item) }
        }
        private func handle(_ item: RecognizedItem) {
            guard !fired else { return }
            if case .barcode(let bc) = item, let code = bc.payloadStringValue {
                fired = true
                DispatchQueue.main.async { self.onCode(code) }
            }
        }
    }
}
