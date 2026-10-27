function Pine({ x, y, s, fill }: { x: number; y: number; s: number; fill: string }) {
  return (
    <path
      d={`M${x} ${y} l${-9 * s} 0 l${5 * s} ${-13 * s} l${-4 * s} 0 l${6 * s} ${-14 * s} l${-4 * s} 0 l${6 * s} ${-16 * s} l${6 * s} ${16 * s} l${-4 * s} 0 l${6 * s} ${14 * s} l${-4 * s} 0 l${5 * s} ${13 * s}z`}
      fill={fill}
    />
  );
}

const STARS: [number, number][] = [[30, 24], [88, 52], [150, 18], [214, 40], [262, 16], [352, 36], [18, 86], [120, 90], [390, 70]];
const TOWERS: [number, number, number][] = [
  [196, 22, 40], [214, 14, 28], [226, 20, 52], [244, 16, 34], [258, 24, 62], [280, 14, 30], [292, 22, 46], [312, 16, 26],
];

function Sky({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B0908" />
          <stop offset="0.5" stopColor="#2B1A18" />
          <stop offset="0.8" stopColor="#8A3A22" />
          <stop offset="1" stopColor="#F26A2E" />
        </linearGradient>
        <linearGradient id={`sun-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFB347" />
          <stop offset="1" stopColor="#FF4F1A" />
        </linearGradient>
        <clipPath id={`sunclip-${id}`}>
          <circle cx="300" cy="150" r="52" />
        </clipPath>
        <radialGradient id={`glow-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FF6A2A" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FF6A2A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="330" fill={`url(#sky-${id})`} />
      {STARS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.5 : 1} fill="#fff" opacity="0.65" />
      ))}
      <circle cx="300" cy="150" r="120" fill={`url(#glow-${id})`} />
      <circle cx="300" cy="150" r="52" fill={`url(#sun-${id})`} />
      <g clipPath={`url(#sunclip-${id})`} fill="#2A1E3F">
        <rect x="240" y="148" width="120" height="3" />
        <rect x="240" y="160" width="120" height="4" />
        <rect x="240" y="172" width="120" height="5" />
        <rect x="240" y="184" width="120" height="7" />
      </g>
    </>
  );
}

export function MountainScene({ variant = "hero", className = "" }: { variant?: "hero" | "climb"; className?: string }) {
  if (variant === "climb") {
    return (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMaxYMid slice" className={className} aria-hidden role="presentation">
        <defs>
          <linearGradient id="sky-c" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0B0908" />
            <stop offset="0.6" stopColor="#2B1A18" />
            <stop offset="1" stopColor="#B24A2C" />
          </linearGradient>
          <linearGradient id="rock-c" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3A2A24" />
            <stop offset="1" stopColor="#14100E" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#sky-c)" />
        {STARS.slice(0, 6).map(([x, y], i) => (
          <circle key={i} cx={x + 20} cy={y + 10} r="1" fill="#fff" opacity="0.6" />
        ))}
        <path d="M0 230 L60 150 L110 190 L170 110 L230 190 L300 130 L400 200 V300 H0Z" fill="#1B1412" />
        <path d="M0 300 V200 L110 172 L230 112 L320 74 L400 58 V300Z" fill="url(#rock-c)" />
        <path d="M110 172 L230 112 L320 74 L400 58" fill="none" stroke="#FF7A3D" strokeWidth="2" opacity="0.7" />
        <path d="M130 188 C 175 176, 215 156, 250 128 S 320 94, 352 64" fill="none" stroke="#FF5A1F" strokeWidth="3.5" strokeDasharray="1 8" strokeLinecap="round" />
        {[[172, 172], [214, 152], [255, 125], [300, 100]].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="5.5" fill="#FF5A1F" stroke="#fff" strokeWidth="2" />
        ))}
        <path d="M352 64 V30" stroke="#fff" strokeWidth="2" />
        <path d="M352 30 l26 9 l-26 9z" fill="#FF5A1F" />
        <g transform="translate(140 122) scale(0.9)" fill="#07091A">
          <ellipse cx="14" cy="22" rx="14" ry="22" transform="rotate(-18 14 22)" />
          <path d="M20 10 l24 -4 l4 12 l-20 8z M26 26 l24 6 l-2 8 l-24 -4z" />
          <circle cx="46" cy="2" r="7" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 400 330" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden role="presentation">
      <Sky id="h" />
      <path d="M0 232 L36 130 L74 170 L124 84 L186 176 L224 214 V232Z" fill="#1B1412" />
      <path d="M0 232 L36 130 L74 170 L124 84 L186 176" fill="none" stroke="#FF7A3D" strokeWidth="1.5" opacity="0.55" />
      <path d="M0 250 L60 190 L110 226 L170 170 L230 232 V250Z" fill="#120D0C" />
      {TOWERS.map(([x, w, h], i) => (
        <g key={i}>
          <rect x={x} y={236 - h} width={w} height={h} fill="#0E0A09" />
          {Array.from({ length: Math.floor(h / 9) }, (_, r) => (
            <rect key={r} x={x + 3 + ((r * 5) % (w - 6))} y={236 - h + 5 + r * 8} width="2" height="2" fill="#FFC15A" opacity="0.8" />
          ))}
        </g>
      ))}
      <rect y="236" width="400" height="40" fill="#1E1210" />
      <rect y="236" width="400" height="40" fill="#F26A2E" opacity="0.18" />
      {[250, 264, 280, 298].map((x, i) => (
        <rect key={x} x={x - (30 - i * 4)} y={242 + i * 7} width={60 - i * 8} height="2.5" fill="#FF8A3D" opacity={0.7 - i * 0.12} />
      ))}
      {[10, 34, 60].map((x, i) => (
        <Pine key={x} x={x} y={330} s={1.6 + i * 0.2} fill="#070A18" />
      ))}
      <path d="M262 330 L292 252 L340 238 L400 226 V330Z" fill="#070A18" />
      <g transform="translate(346 178)" fill="#05070F">
        <rect x="-4" y="38" width="8" height="26" rx="3" />
        <rect x="4" y="38" width="8" height="26" rx="3" />
        <rect x="-6" y="12" width="20" height="30" rx="7" />
        <rect x="-16" y="10" width="13" height="30" rx="5" />
        <circle cx="4" cy="4" r="7" />
        <path d="M14 18 l12 -10 l3 3 l-12 12z" />
      </g>
    </svg>
  );
}
