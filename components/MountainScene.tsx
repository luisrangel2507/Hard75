const PINES = Array.from({ length: 26 }, (_, i) => i);

function Pine({ x, y, s, fill }: { x: number; y: number; s: number; fill: string }) {
  return (
    <path
      d={`M${x} ${y} l${-9 * s} 0 l${5 * s} ${-13 * s} l${-4 * s} 0 l${6 * s} ${-14 * s} l${-4 * s} 0 l${6 * s} ${-16 * s} l${6 * s} ${16 * s} l${-4 * s} 0 l${6 * s} ${14 * s} l${-4 * s} 0 l${5 * s} ${13 * s}z`}
      fill={fill}
    />
  );
}

function Texture({ id, clip, h }: { id: string; clip: string; h: number }) {
  return (
    <>
      <filter id={`noise-${id}`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="4" />
        <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" />
      </filter>
      <rect width="400" height={h} filter={`url(#noise-${id})`} clipPath={`url(#${clip})`} opacity="0.45" style={{ mixBlendMode: "multiply" }} />
    </>
  );
}

function Clouds({ y = 0 }: { y?: number }) {
  return (
    <g fill="#fff" opacity="0.9" filter="url(#soft)">
      <ellipse cx="90" cy={70 + y} rx="55" ry="12" />
      <ellipse cx="130" cy={62 + y} rx="40" ry="11" />
      <ellipse cx="300" cy={110 + y} rx="70" ry="13" />
      <ellipse cx="340" cy={100 + y} rx="40" ry="10" />
      <ellipse cx="200" cy={36 + y} rx="50" ry="8" opacity="0.7" />
    </g>
  );
}

export function MountainScene({ variant = "hero", className = "" }: { variant?: "hero" | "climb"; className?: string }) {
  if (variant === "climb") {
    return (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden role="presentation">
        <defs>
          <linearGradient id="sky-c" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2C6FD1" />
            <stop offset="1" stopColor="#A5CFF3" />
          </linearGradient>
          <linearGradient id="rock-c" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#B9B2A4" />
            <stop offset="1" stopColor="#6D675C" />
          </linearGradient>
          <filter id="soft"><feGaussianBlur stdDeviation="3" /></filter>
          <clipPath id="clip-c"><path d="M0 300V190L110 165L230 105L320 70L400 55V300Z" /></clipPath>
        </defs>
        <rect width="400" height="300" fill="url(#sky-c)" />
        <Clouds y={-10} />
        <path d="M0 300V190L110 165L230 105L320 70L400 55V300Z" fill="url(#rock-c)" />
        <Texture id="c" clip="clip-c" h={300} />
        <path d="M230 105L320 70L400 55V120L330 135L260 160Z" fill="#fff" opacity="0.14" />
        {[10, 34, 58].map((x, i) => (
          <Pine key={x} x={x} y={300} s={1.5 + (i % 2) * 0.3} fill="#17301F" />
        ))}
        <path d="M130 178 C 175 168, 215 152, 250 126 S 320 92, 352 62" fill="none" stroke="#FF5A1F" strokeWidth="3.5" strokeDasharray="1 8" strokeLinecap="round" />
        {[[172, 170], [214, 150], [255, 122], [300, 98]].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="5.5" fill="#FF5A1F" stroke="#fff" strokeWidth="2" />
        ))}
        <path d="M352 62 V28" stroke="#fff" strokeWidth="2" />
        <path d="M352 28 l26 9 l-26 9z" fill="#FF5A1F" />
        <g transform="translate(138 118) scale(0.9)">
          <ellipse cx="14" cy="22" rx="14" ry="22" fill="#14171F" transform="rotate(-18 14 22)" />
          <path d="M20 10 l24 -4 l4 12 l-20 8z" fill="#B6D2D8" />
          <path d="M26 26 l24 6 l-2 8 l-24 -4z" fill="#B09A78" />
          <circle cx="46" cy="2" r="7" fill="#C08E6C" />
          <path d="M40 0 a8 7 0 0 1 14 -2 l0 4 l-14 0z" fill="#EFEFEF" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 400 480" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden role="presentation">
      <defs>
        <linearGradient id="sky-h" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1F62C8" />
          <stop offset="0.6" stopColor="#6FA9E6" />
          <stop offset="1" stopColor="#BFDDF5" />
        </linearGradient>
        <linearGradient id="cliff-h" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#D2CBBE" />
          <stop offset="0.62" stopColor="#B7B0A3" />
          <stop offset="0.63" stopColor="#8B8579" />
          <stop offset="1" stopColor="#6F695E" />
        </linearGradient>
        <linearGradient id="far-h" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8EA7C4" />
          <stop offset="1" stopColor="#5F7E9C" />
        </linearGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="3" /></filter>
        <clipPath id="clip-h"><path d="M10 360 L44 160 Q56 96 120 84 Q190 70 228 106 L262 360Z" /></clipPath>
      </defs>
      <rect width="400" height="480" fill="url(#sky-h)" />
      <Clouds y={20} />
      <path d="M200 270 L260 200 L300 225 L350 170 L400 215 V330 H200Z" fill="url(#far-h)" />
      <path d="M10 360 L44 160 Q56 96 120 84 Q190 70 228 106 L262 360Z" fill="url(#cliff-h)" />
      <Texture id="h" clip="clip-h" h={480} />
      <path d="M96 100 V350 M130 96 V350 M170 90 V350" stroke="#7A7468" strokeWidth="2" opacity="0.28" />
      <path d="M250 260 L320 215 L360 240 L400 205 V360 H250Z" fill="#46606C" />
      <rect y="330" width="400" height="150" fill="#1C3A29" />
      {PINES.map((i) => (
        <Pine key={`b${i}`} x={i * 17 + 4} y={372 + (i % 4) * 8} s={1.05 + (i % 3) * 0.1} fill="#183222" />
      ))}
      {PINES.map((i) => (
        <Pine key={`f${i}`} x={i * 19} y={420 + (i % 3) * 9} s={1.35 + (i % 4) * 0.12} fill="#0F2218" />
      ))}
      <path d="M215 480 L248 422 L300 410 L400 392 V480Z" fill="#6A645A" />
      <path d="M215 480 L248 422 L300 410 L330 440 L290 480Z" fill="#857F73" />
      <g transform="translate(318 292)">
        <rect x="-5" y="74" width="9" height="40" rx="3" fill="#B9A683" />
        <rect x="5" y="74" width="9" height="40" rx="3" fill="#A8946F" />
        <rect x="-8" y="26" width="26" height="54" rx="9" fill="#BED5DA" />
        <rect x="-26" y="22" width="22" height="56" rx="8" fill="#15171D" />
        <rect x="-8" y="30" width="6" height="26" rx="3" fill="#A9C2C9" />
        <rect x="16" y="32" width="6" height="30" rx="3" fill="#BED5DA" />
        <circle cx="5" cy="14" r="10" fill="#C18F6D" />
        <path d="M-6 13 a11 10 0 0 1 22 -2 l0 3 l-22 0z" fill="#F1F1F1" />
        <path d="M14 13 l9 1 l0 3 l-9 -1z" fill="#D9D9D9" />
      </g>
    </svg>
  );
}
