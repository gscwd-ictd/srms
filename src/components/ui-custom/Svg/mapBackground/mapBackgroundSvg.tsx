import * as React from "react";
import { SVGProps } from "react";

const MapBackgroundSvg = (props: SVGProps<SVGSVGElement>) => (
  <div>
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 1600 900"
      aria-hidden
      {...props}
    >
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ecf7ff" />
        </linearGradient>
        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="6" stdDeviation="20" floodOpacity="0.08" floodColor="#2b85ff" />
        </filter>
      </defs>

      {/* soft paper gradient */}
      <rect x="0" y="0" width="1600" height="900" fill="url(#g1)" />

      {/* organic map tile lines (curvy) */}
      <g transform="translate(0, -30)" stroke="#2b85ff" strokeOpacity="0.12" strokeWidth="2" fill="none">
        <path d="M -20 80 C 120 10, 300 120, 520 60 S 920 -20, 1140 40 S 1500 140, 1620 80" />
        <path d="M -40 220 C 150 140, 360 300, 560 220 S 900 120, 1160 240 S 1520 380, 1660 260" />
        <path d="M -20 420 C 140 360, 340 520, 580 420 S 920 300, 1180 430 S 1500 600, 1680 480" />
      </g>

      {/* dashed animated routes */}
      <g stroke="#2b85ff" strokeWidth="3" fill="none" strokeLinecap="round">
        <path
          className="route"
          d="M80 740 C 200 580, 560 840, 820 680 S 900 340, 1480 280"
          strokeDasharray="8 8"
        />
        <path
          className="route slow"
          d="M160 690 C 300 800, 460 900, 640 740 S 1400 300, 1420 740"
          strokeDasharray="6 6"
        />
      </g>

      {/* glowing route highlight */}
      <g stroke="#2b85ff" strokeWidth="1.5" fill="none" opacity="0.22">
        <path d="M80 780 C 200 680, 360 740, 520 680 S 900 540, 1200 680" filter="url(#softShadow)" />
      </g>

      {/* animated markers */}
      <g className="markers" fill="#2b85ff">
        <circle className="marker" cx="520" cy="680" r="10" />
        <circle className="marker delay" cx="1200" cy="680" r="9" />
        <circle className="marker delay2" cx="640" cy="640" r="8" />
      </g>

      {/* subtle grid */}
      <g stroke="#2b85ff" strokeOpacity="0.04">
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={i} x1={i * 80} y1="0" x2={i * 80} y2="900" />
        ))}
      </g>
    </svg>

    {/* Embedded styles for animations */}
    <style>{`
        .route {
          animation: dashMove 5s linear infinite;
        }
        .route.slow { animation-duration: 9s; opacity: 0.85 }
        .marker { fill: #2b85ff; stroke: white; stroke-width: 2px; filter: drop-shadow(0 6px 18px rgba(43,133,255,0.18)); animation: pop 2.6s infinite; }
        .marker.delay { animation-delay: 0.6s }
        .marker.delay2 { animation-delay: 1.2s }

        @keyframes dashMove {
          to { stroke-dashoffset: -1000; }
        }

        @keyframes pop {
          0% { transform: translateY(0) scale(1); opacity: 1 }
          50% { transform: translateY(-6px) scale(1.06); opacity: 0.9 }
          100% { transform: translateY(0) scale(1); opacity: 1 }
        }

        svg { shape-rendering: geometricPrecision; }

        @media (max-width: 768px) {
          aside { display: none; }
        }
      `}</style>
  </div>
);
export default MapBackgroundSvg;
