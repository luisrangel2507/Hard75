export function MountainScene({ variant = "hero", className = "" }: { variant?: "hero" | "climb"; className?: string }) {
  const id = variant;
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
      role="presentation"
    >
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B1630" />
          <stop offset="0.55" stopColor="#1B2F5E" />
          <stop offset="0.85" stopColor="#6B4A6B" />
          <stop offset="1" stopColor="#D9683A" />
        </linearGradient>
        <linearGradient id={`sun-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC24D" />
          <stop offset="1" stopColor="#FF5A1F" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#sky-${id})`} />
      {[[40, 30], [90, 60], [150, 22], [230, 48], [300, 26], [352, 70], [20, 96], [270, 90]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.6 : 1} fill="#fff" opacity="0.7" />
      ))}
      <circle cx="285" cy="150" r="34" fill={`url(#sun-${id})`} />
      <path d="M251 150h68M254 160h62M258 170h54" stroke="#6B4A6B" strokeWidth="3" opacity="0.55" />
      <path d="M0 210 L60 140 L100 175 L170 95 L240 180 L290 130 L360 190 L400 150 L400 300 L0 300Z" fill="#2A3F6B" opacity="0.8" />
      <path d="M0 240 L70 175 L120 215 L200 140 L270 225 L330 170 L400 225 L400 300 L0 300Z" fill="#162744" />
      <path d="M0 270 L90 215 L150 250 L230 195 L310 255 L400 215 L400 300 L0 300Z" fill="#0C1830" />
      {[18, 44, 70, 330, 362, 388].map((x, i) => (
        <path key={x} d={`M${x} 300 l-9 -${34 + (i % 3) * 6} l5 0 l-7 -16 l5 0 l-6 -14 l24 30 l-7 0 l8 16 l-6 0 l8 18z`} fill="#06101F" />
      ))}
      {variant === "climb" && (
        <g>
          <path d="M120 285 C 170 250, 220 235, 255 200 S 330 140, 356 96" fill="none" stroke="#FF5A1F" strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" />
          {[[150, 268], [205, 238], [255, 200], [305, 160]].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="5" fill="#FF5A1F" stroke="#fff" strokeWidth="2" />
          ))}
          <path d="M356 96 V66" stroke="#fff" strokeWidth="2" />
          <path d="M356 66 l24 8 l-24 8z" fill="#FF5A1F" />
        </g>
      )}
    </svg>
  );
}
