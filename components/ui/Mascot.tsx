import { Platform, View } from 'react-native';

const MASCOT_SVG = `
<svg viewBox="0 0 220 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Reci, mascota de RecicLas">
  <defs>
    <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#5DBE6A"/>
      <stop offset="60%" stop-color="#2E7D32"/>
      <stop offset="100%" stop-color="#1B5E20"/>
    </radialGradient>
    <radialGradient id="cheekGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(255,180,180,0.85)"/>
      <stop offset="100%" stop-color="rgba(255,180,180,0)"/>
    </radialGradient>
    <radialGradient id="shineGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.55)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#86D094"/>
      <stop offset="100%" stop-color="#34D399"/>
    </linearGradient>
  </defs>

  <!-- Sombra suave bajo Reci -->
  <ellipse cx="110" cy="222" rx="58" ry="8" fill="rgba(15,64,20,0.18)"/>

  <!-- Tallito de hoja arriba -->
  <path d="M 110 50 C 102 30, 90 20, 78 25 C 86 38, 100 46, 110 52 Z" fill="url(#leafGrad)"/>
  <path d="M 78 25 C 88 30, 100 40, 110 50" stroke="#0F4014" stroke-width="1.5" fill="none" stroke-linecap="round"/>

  <!-- Cuerpo principal (gota redonda) -->
  <path d="M 110 60
           C 60 60, 30 110, 30 150
           C 30 195, 65 220, 110 220
           C 155 220, 190 195, 190 150
           C 190 110, 160 60, 110 60 Z"
        fill="url(#bodyGrad)"/>

  <!-- Brillo arriba -->
  <ellipse cx="80" cy="100" rx="34" ry="22" fill="url(#shineGrad)"/>

  <!-- Ojos -->
  <ellipse cx="85" cy="140" rx="11" ry="13" fill="white"/>
  <ellipse cx="135" cy="140" rx="11" ry="13" fill="white"/>
  <circle cx="87" cy="143" r="6" fill="#0F1F14"/>
  <circle cx="137" cy="143" r="6" fill="#0F1F14"/>
  <circle cx="89" cy="141" r="2" fill="white"/>
  <circle cx="139" cy="141" r="2" fill="white"/>

  <!-- Cachetes rosados -->
  <ellipse cx="62" cy="170" rx="14" ry="9" fill="url(#cheekGrad)"/>
  <ellipse cx="158" cy="170" rx="14" ry="9" fill="url(#cheekGrad)"/>

  <!-- Sonrisita -->
  <path d="M 96 178 Q 110 192, 124 178" stroke="white" stroke-width="4" stroke-linecap="round" fill="none"/>

  <!-- Símbolo reciclaje en el cuerpo -->
  <g transform="translate(110 200) scale(0.55) translate(-32 -32)" opacity="0.9">
    <path d="M 32 6
             L 42 22
             L 36 22
             L 36 30
             L 28 30
             L 28 22
             L 22 22 Z" fill="white"/>
    <path d="M 6 36
             L 16 36
             L 16 30
             L 22 36
             L 22 44
             L 16 44
             L 12 50
             L 6 36 Z" fill="white" transform="rotate(120 32 32)"/>
    <path d="M 6 36
             L 16 36
             L 16 30
             L 22 36
             L 22 44
             L 16 44
             L 12 50
             L 6 36 Z" fill="white" transform="rotate(240 32 32)"/>
  </g>
</svg>
`.trim();

export function Mascot({ size = 180, animated = false }: { size?: number; animated?: boolean }) {
  if (Platform.OS === 'web') {
    return (
      <div
        className={animated ? 'reciclas-float' : undefined}
        style={{
          width: size,
          height: size * (240 / 220),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        dangerouslySetInnerHTML={{ __html: MASCOT_SVG }}
      />
    );
  }
  return <View style={{ width: size, height: size * (240 / 220) }} />;
}
