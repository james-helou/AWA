// EY brand logo component
// The iconic EY mark with the yellow beam

interface EYLogoProps {
  className?: string;
  size?: number;
}

export function EYLogo({ className = '', size = 40 }: EYLogoProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Yellow beam */}
      <polygon
        points="120,10 50,35 120,28"
        fill="#FFE600"
      />
      {/* E letter */}
      <path
        d="M10,50 L10,110 L50,110 L50,100 L24,100 L24,85 L45,85 L45,75 L24,75 L24,60 L50,60 L50,50 Z"
        fill="#2E2E38"
      />
      {/* Y letter */}
      <path
        d="M58,50 L72,78 L86,50 L100,50 L78,90 L78,110 L66,110 L66,90 L44,50 Z"
        fill="#2E2E38"
      />
    </svg>
  );
}
