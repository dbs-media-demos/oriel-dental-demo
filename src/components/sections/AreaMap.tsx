import { InView } from "@/components/ui/InView";
import { MARK } from "@/components/brand/Logo";

const hoods = [
  { name: "Uptown", x: 430, y: 300, big: true },
  { name: "Victory Park", x: 170, y: 470 },
  { name: "Oak Lawn", x: 150, y: 250 },
  { name: "Turtle Creek", x: 300, y: 130 },
  { name: "Highland Park", x: 470, y: 60 },
  { name: "Knox-Henderson", x: 650, y: 150 },
  { name: "State Thomas", x: 640, y: 330 },
  { name: "Downtown", x: 620, y: 560 },
];

/**
 * An illustrated (not to scale) map of the neighborhoods around the studio.
 * Roads draw themselves in when the map scrolls into view.
 */
export function AreaMap() {
  return (
    <InView className="group relative overflow-hidden rounded-[2rem] bg-linen">
      <svg viewBox="0 0 800 620" className="block h-auto w-full" role="img" aria-labelledby="map-title map-desc">
        <title id="map-title">Illustrated map of Uptown Dallas</title>
        <desc id="map-desc">
          Oriel Dental Studio sits in the middle of Uptown, between the Katy Trail and McKinney Avenue, a few minutes from Victory Park, Oak Lawn, Turtle Creek,
          State Thomas, Highland Park and Downtown.
        </desc>
        <defs>
          <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#1e2926" opacity="0.08" />
          </pattern>
        </defs>
        <rect width="800" height="620" fill="url(#dots)" />

        {/* Turtle Creek (water + park) */}
        <path d="M60 60 C160 120 210 90 260 170 S300 300 250 360 S180 420 90 430" fill="none" stroke="#b9cbbe" strokeWidth="26" strokeLinecap="round" opacity="0.55" />
        <path
          className="map-draw"
          d="M60 60 C160 120 210 90 260 170 S300 300 250 360 S180 420 90 430"
          fill="none"
          stroke="#8fb0c0"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Klyde Warren Park */}
        <rect x="430" y="468" width="170" height="44" rx="22" fill="#b9cbbe" opacity="0.8" />
        <text x="515" y="495" textAnchor="middle" fontSize="13" fill="#3b5447" fontWeight="600">
          Klyde Warren Park
        </text>

        {/* Woodall Rodgers Fwy */}
        <path className="map-draw" d="M20 520 C220 500 420 530 790 505" fill="none" stroke="#d8c2a3" strokeWidth="14" strokeLinecap="round" />
        <text x="120" y="545" fontSize="12" fill="#55615c" letterSpacing="2">
          WOODALL RODGERS FWY
        </text>

        {/* Streets */}
        <path className="map-draw" d="M120 600 L700 20" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
        <text x="540" y="200" fontSize="12" fill="#55615c" transform="rotate(-45 540 200)" letterSpacing="1.5">
          MCKINNEY AVE
        </text>
        <path className="map-draw" d="M40 330 L780 250" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
        <text x="690" y="244" fontSize="12" fill="#55615c" letterSpacing="1.5" transform="rotate(-6 690 244)">
          CEDAR SPRINGS
        </text>
        <path className="map-draw" d="M240 610 L560 0" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />

        {/* Katy Trail */}
        <path d="M150 600 C260 460 300 420 360 330 S520 120 610 10" fill="none" stroke="#4e6b5c" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
        <text x="250" y="430" fontSize="12" fill="#4e6b5c" fontWeight="600" transform="rotate(-50 250 430)" letterSpacing="1.5">
          KATY TRAIL
        </text>

        {/* Drive-time rings */}
        <circle cx="430" cy="300" r="120" fill="none" stroke="#4e6b5c" strokeDasharray="3 7" opacity="0.5" />
        <circle cx="430" cy="300" r="230" fill="none" stroke="#4e6b5c" strokeDasharray="3 7" opacity="0.3" />
        <text x="530" y="240" fontSize="11" fill="#4e6b5c" fontWeight="600">
          5 MIN
        </text>
        <text x="620" y="175" fontSize="11" fill="#4e6b5c" fontWeight="600" opacity="0.8">
          10 MIN
        </text>

        {hoods.map((h) =>
          h.big ? null : (
            <text key={h.name} x={h.x} y={h.y} textAnchor="middle" fontSize="15" fill="#1e2926" fontWeight="500" className="map-label">
              {h.name}
            </text>
          ),
        )}

        {/* Studio pin */}
        <g transform="translate(430 300)">
          <circle r="22" fill="#4e6b5c" opacity="0.25" className="map-pulse" />
          <circle r="34" fill="#f7f4ee" stroke="#4e6b5c" strokeWidth="2" />
          <g transform="translate(-14 -18) scale(0.7)">
            <path d={MARK.arch} stroke="#1e2926" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <path d={MARK.sill} stroke="#1e2926" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <path d={MARK.smile} stroke="#1e2926" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <circle {...MARK.sun} fill="#e2a93b" />
          </g>
          <text y="62" textAnchor="middle" fontSize="16" fill="#1e2926" fontWeight="700">
            Oriel · Uptown
          </text>
        </g>
      </svg>
    </InView>
  );
}
