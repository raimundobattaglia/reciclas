import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1"
        />
        <meta
          name="description"
          content="RecicLas — escanea productos y descubre dónde reciclar cada parte de su envase en Las Condes."
        />
        <meta name="theme-color" content="#2E7D32" />
        <title>RecicLas — Reciclar bien, sin adivinar</title>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: globalCss }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const globalCss = `
:root {
  --tint: #2E7D32;
  --tint-strong: #1B5E20;
  --tint-soft: #E8F5E9;
  --bg: #F5F7F4;
}
html, body {
  background-color: var(--bg);
}
@media (prefers-color-scheme: dark) {
  html, body { background-color: #0B1410; }
}
body, button, input, textarea, select {
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  letter-spacing: -0.01em;
}
* { box-sizing: border-box; }
button { cursor: pointer; }
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 999px; }
::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.25); }
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, -10px) scale(1.05); }
  66% { transform: translate(-10px, 15px) scale(0.95); }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.reciclas-blob { animation: blob 12s ease-in-out infinite; }
.reciclas-float { animation: float 4s ease-in-out infinite; }
`;
