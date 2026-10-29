/*
 * Soft layered lavender waves behind the whole app.
 * An inline SVG with "slice" scaling: it covers any screen size without
 * stretching, so the curves stay smooth.
 */
export default function WaveBackground() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="wv-base" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e0daf9" />
          <stop offset="1" stopColor="#c9bff7" />
        </linearGradient>
        <linearGradient id="wv-mid" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#b9acf5" />
          <stop offset="1" stopColor="#c9bff8" />
        </linearGradient>
        <linearGradient id="wv-right" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#cfc4f9" />
          <stop offset="1" stopColor="#dcd2fb" />
        </linearGradient>
        <linearGradient id="wv-deep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b9acf5" />
          <stop offset="1" stopColor="#b3a5f2" />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#wv-base)" />

      <path
        d="M0,0 H905 C868,150 790,285 650,325 C480,372 260,265 0,95 Z"
        fill="#e6e1fc"
        fillOpacity="0.95"
      />

      <path
        d="M0,720 C180,620 380,580 560,555 C760,528 850,420 905,0 H1600 V900 H0 Z"
        fill="url(#wv-mid)"
        fillOpacity="0.9"
      />

      <path
        d="M0,800 C150,700 330,600 560,562 C820,520 1050,330 1350,298 C1470,286 1550,326 1600,368 V900 H0 Z"
        fill="url(#wv-right)"
        fillOpacity="0.85"
      />

      <path
        d="M0,865 C300,790 600,705 900,693 C1200,681 1450,780 1600,822 V900 H0 Z"
        fill="url(#wv-deep)"
        fillOpacity="0.75"
      />

      <path
        d="M1240,900 C1370,832 1500,792 1600,778 V900 Z"
        fill="#a99bef"
        fillOpacity="0.85"
      />
    </svg>
  );
}
