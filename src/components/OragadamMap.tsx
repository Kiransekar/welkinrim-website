"use client";

import { useState } from "react";

// ─── Constants & Projection ──────────────────────────────────────────────────
const SVG_W = 900;
const SVG_H = 840;
const GEO = { minLat: 12.82, maxLat: 12.875, minLng: 79.9, maxLng: 79.955 };
const WK = { lat: 12.8365065, lng: 79.92121 };

function project(lat: number, lng: number) {
  const x = ((lng - GEO.minLng) / (GEO.maxLng - GEO.minLng)) * SVG_W;
  const y = SVG_H - ((lat - GEO.minLat) / (GEO.maxLat - GEO.minLat)) * SVG_H;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

function toPolyline(pts: { lat: number; lng: number }[]): string {
  return pts.map((p) => { const { x, y } = project(p.lat, p.lng); return `${x},${y}`; }).join(" ");
}

function toPolygon(corners: { lat: number; lng: number }[]): string {
  const pts = corners.map((c) => project(c.lat, c.lng));
  return `M ${pts[0].x},${pts[0].y} ` + pts.slice(1).map((p) => `L ${p.x},${p.y}`).join(" ") + " Z";
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Road data ───────────────────────────────────────────────────────────────
const roads = [
  { id: "sh48", type: "primary", colour: "#F2B705", strokeWidth: 3.5, points: [{ lat: 12.872, lng: 79.907 }, { lat: 12.868, lng: 79.912 }, { lat: 12.862, lng: 79.918 }, { lat: 12.856, lng: 79.923 }, { lat: 12.85, lng: 79.928 }, { lat: 12.844, lng: 79.932 }, { lat: 12.838, lng: 79.937 }, { lat: 12.831, lng: 79.942 }, { lat: 12.824, lng: 79.948 }] },
  { id: "walajabad", type: "secondary", colour: "#F2B705", strokeWidth: 2.5, points: [{ lat: 12.85, lng: 79.93 }, { lat: 12.847, lng: 79.926 }, { lat: 12.844, lng: 79.92 }, { lat: 12.841, lng: 79.915 }, { lat: 12.838, lng: 79.908 }, { lat: 12.836, lng: 79.902 }] },
  { id: "vandalur", type: "secondary", colour: "#F2B705", strokeWidth: 2.5, points: [{ lat: 12.826, lng: 79.905 }, { lat: 12.828, lng: 79.912 }, { lat: 12.83, lng: 79.92 }, { lat: 12.831, lng: 79.928 }, { lat: 12.832, lng: 79.935 }, { lat: 12.833, lng: 79.942 }] },
  { id: "sipcot-ns", type: "internal", colour: "rgba(242,183,5,0.55)", strokeWidth: 1.5, points: [{ lat: 12.858, lng: 79.922 }, { lat: 12.852, lng: 79.922 }, { lat: 12.846, lng: 79.921 }, { lat: 12.84, lng: 79.921 }, { lat: 12.835, lng: 79.921 }] },
  { id: "sipcot-ew", type: "internal", colour: "rgba(242,183,5,0.55)", strokeWidth: 1.5, points: [{ lat: 12.844, lng: 79.912 }, { lat: 12.844, lng: 79.917 }, { lat: 12.844, lng: 79.922 }, { lat: 12.844, lng: 79.928 }, { lat: 12.844, lng: 79.933 }] },
  { id: "rn-access", type: "internal", colour: "rgba(242,183,5,0.45)", strokeWidth: 1.2, points: [{ lat: 12.856, lng: 79.928 }, { lat: 12.855, lng: 79.931 }, { lat: 12.853, lng: 79.933 }, { lat: 12.851, lng: 79.935 }] },
  { id: "sez-access", type: "internal", colour: "rgba(242,183,5,0.45)", strokeWidth: 1.2, points: [{ lat: 12.862, lng: 79.918 }, { lat: 12.861, lng: 79.922 }, { lat: 12.86, lng: 79.925 }, { lat: 12.859, lng: 79.928 }] },
];

// ─── Industrial zones ────────────────────────────────────────────────────────
const zones = [
  { id: "sipcot-core", fill: "rgba(242,183,5,0.04)", stroke: "rgba(242,183,5,0.18)", strokeWidth: 0.8, corners: [{ lat: 12.858, lng: 79.91 }, { lat: 12.862, lng: 79.92 }, { lat: 12.86, lng: 79.938 }, { lat: 12.848, lng: 79.94 }, { lat: 12.836, lng: 79.938 }, { lat: 12.83, lng: 79.93 }, { lat: 12.833, lng: 79.912 }, { lat: 12.84, lng: 79.908 }] },
  { id: "hitech-sez", fill: "rgba(59,143,239,0.04)", stroke: "rgba(59,143,239,0.15)", strokeWidth: 0.8, corners: [{ lat: 12.862, lng: 79.918 }, { lat: 12.866, lng: 79.924 }, { lat: 12.864, lng: 79.932 }, { lat: 12.86, lng: 79.934 }, { lat: 12.858, lng: 79.928 }, { lat: 12.86, lng: 79.92 }] },
  { id: "rn-supplier", fill: "rgba(136,102,204,0.04)", stroke: "rgba(136,102,204,0.15)", strokeWidth: 0.8, corners: [{ lat: 12.854, lng: 79.928 }, { lat: 12.857, lng: 79.934 }, { lat: 12.854, lng: 79.938 }, { lat: 12.85, lng: 79.936 }, { lat: 12.849, lng: 79.93 }] },
];

// ─── Company data ────────────────────────────────────────────────────────────
type Sector = "automotive" | "electronics" | "industrial" | "logistics" | "welkinrim";
interface Company { id: string; name: string; shortName: string; lat: number; lng: number; sector: Sector; description: string; plotRef?: string; }

const companies: Company[] = [
  { id: "welkinrim", name: "Welkinrim Technologies Pvt. Ltd.", shortName: "WELKINRIM", lat: 12.8365065, lng: 79.92121, sector: "welkinrim", description: "Electric motor & EV powertrain manufacturer. Air \u00b7 Water \u00b7 Land \u00b7 Robotics.", plotRef: "SIPCOT Industrial Growth Centre" },
  { id: "renault-nissan", name: "Renault\u2013Nissan Automotive India Pvt. Ltd.", shortName: "Renault\u2013Nissan", lat: 12.852, lng: 79.933, sector: "automotive", description: "Major car manufacturer. Production base for Renault and Nissan vehicles.", plotRef: "SH 57, Oragadam Industrial Corridor" },
  { id: "daimler", name: "Daimler India Commercial Vehicles", shortName: "Daimler", lat: 12.848, lng: 79.919, sector: "automotive", description: "BharatBenz trucks and buses manufacturing plant.", plotRef: "SH 48, Oragadam Industrial Corridor" },
  { id: "royal-enfield", name: "Royal Enfield Manufacturing Company", shortName: "Royal Enfield", lat: 12.844, lng: 79.927, sector: "automotive", description: "Iconic two-wheeler manufacturer. Classic, Meteor, and Himalayan models.", plotRef: "State Highway 48, Oragadam" },
  { id: "komatsu", name: "Komatsu India Pvt. Ltd.", shortName: "Komatsu", lat: 12.86, lng: 79.926, sector: "automotive", description: "Heavy construction equipment. Excavators, bulldozers, mining equipment.", plotRef: "SIPCOT Industrial Growth Centre" },
  { id: "apollo-tyres", name: "Apollo Tyres Ltd.", shortName: "Apollo Tyres", lat: 12.8385, lng: 79.936, sector: "automotive", description: "Tyre manufacturing for passenger vehicles, trucks, and two-wheelers.", plotRef: "Oragadam Industrial Corridor" },
  { id: "delphi-tvs", name: "Delphi-TVS Diesel Systems Ltd.", shortName: "Delphi-TVS", lat: 12.843, lng: 79.9155, sector: "automotive", description: "Fuel injection systems. Joint venture between Delphi and TVS Group.", plotRef: "Plot A-19/2, SIPCOT IGC" },
  { id: "bosch", name: "Bosch Electrical Drives India Pvt. Ltd.", shortName: "Bosch", lat: 12.8355, lng: 79.916, sector: "automotive", description: "Electrical drives, automation systems. Adjacent to Welkinrim.", plotRef: "IndoSpace SKCL, Oragadam Walajabad Road" },
  { id: "danfoss", name: "Danfoss Industries Pvt. Ltd.", shortName: "Danfoss", lat: 12.8465, lng: 79.9345, sector: "industrial", description: "Industrial drives, compressors, and hydraulics manufacturing.", plotRef: "Plot A-19/2, SIPCOT IGC" },
  { id: "subros", name: "Subros Ltd. \u2014 Chennai Plant", shortName: "Subros", lat: 12.842, lng: 79.92, sector: "automotive", description: "HVAC systems for automobiles. Supplier to Maruti Suzuki, Tata, Mahindra.", plotRef: "A-20/1, SIPCOT IGC" },
  { id: "tenneco", name: "Tenneco Automotive India Pvt. Ltd.", shortName: "Tenneco", lat: 12.8515, lng: 79.921, sector: "automotive", description: "Ride performance and emission control. Monroe shock absorbers.", plotRef: "RNS2, Nissan Supplier Park" },
  { id: "steel-strips", name: "Steel Strips Wheels Limited", shortName: "Steel Strips", lat: 12.8395, lng: 79.924, sector: "automotive", description: "Steel wheel rims for cars, commercial vehicles, and tractors.", plotRef: "A-10, SIPCOT IGC" },
  { id: "calsonic", name: "Calsonic Kansei Motherson", shortName: "Calsonic", lat: 12.8455, lng: 79.9175, sector: "automotive", description: "Thermal management, exhaust, and cockpit modules for OEMs.", plotRef: "SIPCOT IGC" },
  { id: "nokia", name: "Nokia Solutions & Networks India Pvt. Ltd.", shortName: "Nokia", lat: 12.863, lng: 79.925, sector: "electronics", description: "Telecom equipment manufacturing and R&D. 5G infrastructure.", plotRef: "Plot OZ-08, Hi-Tech SEZ, Oragadam" },
  { id: "sanmina", name: "Sanmina IMS", shortName: "Sanmina", lat: 12.8625, lng: 79.9195, sector: "electronics", description: "PCB assembly, mechanical systems, high-complexity electronics.", plotRef: "OZ-1, SIPCOT Hi-Tech SEZ" },
  { id: "bpcl", name: "BPCL \u2014 Industrial Supply Depot", shortName: "BPCL", lat: 12.834, lng: 79.92, sector: "logistics", description: "Bharat Petroleum industrial supply depot.", plotRef: "SIPCOT IGC" },
  { id: "natrip", name: "NATRIP (National Automotive Testing)", shortName: "NATRIP", lat: 12.8485, lng: 79.903, sector: "industrial", description: "National Automotive Testing and R&D. Test tracks and facility.", plotRef: "SIPCOT Oragadam \u2014 304 acres" },
  { id: "indospace", name: "IndoSpace Industrial Park", shortName: "IndoSpace", lat: 12.833, lng: 79.9225, sector: "logistics", description: "Grade-A warehousing and industrial park. 14+ acres on SH 48.", plotRef: "SH 48, Adjacent to SIPCOT" },
];

// ─── Sector colours ──────────────────────────────────────────────────────────
const SECTOR_COLOURS: Record<string, { pin: string; ring: string; label: string; bg: string }> = {
  welkinrim: { pin: "#F2B705", ring: "#F2B705", label: "#F2B705", bg: "rgba(242,183,5,0.12)" },
  automotive: { pin: "#FFFFFF", ring: "rgba(255,255,255,0.4)", label: "rgba(255,255,255,0.7)", bg: "rgba(255,255,255,0.06)" },
  electronics: { pin: "#3B8FEF", ring: "rgba(59,143,239,0.5)", label: "#3B8FEF", bg: "rgba(59,143,239,0.10)" },
  industrial: { pin: "#00B4CC", ring: "rgba(0,180,204,0.5)", label: "#00B4CC", bg: "rgba(0,180,204,0.08)" },
  logistics: { pin: "#8866CC", ring: "rgba(136,102,204,0.5)", label: "#8866CC", bg: "rgba(136,102,204,0.08)" },
};

// ─── Component ───────────────────────────────────────────────────────────────
export function OragadamMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredCompany = companies.find((c) => c.id === hovered);
  const wkPos = project(WK.lat, WK.lng);

  return (
    <div style={{ position: "relative", width: "100%", background: "#09090B" }}>
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ display: "block", maxWidth: SVG_W }} aria-label="Interactive map of Oragadam Industrial Corridor showing Welkinrim Technologies and surrounding major industries" role="img">
        <defs>
          <radialGradient id="wk-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F2B705" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F2B705" stopOpacity="0" />
          </radialGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(242,183,5,0.04)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width={SVG_W} height={SVG_H} fill="#09090B" />
        <rect width={SVG_W} height={SVG_H} fill="url(#grid)" />
        <rect x="1" y="1" width={SVG_W - 2} height={SVG_H - 2} fill="none" stroke="rgba(242,183,5,0.20)" strokeWidth="1" />

        {/* North arrow */}
        <g transform={`translate(${SVG_W - 48}, 36)`}>
          <polygon points="0,-16 -5,4 0,0 5,4" fill="#F2B705" opacity="0.7" />
          <polygon points="0,16 -5,-4 0,0 5,-4" fill="rgba(255,255,255,0.2)" />
          <text x="0" y="26" textAnchor="middle" fill="#F2B705" fontSize="8" fontFamily="'Space Mono', monospace" letterSpacing="0.1em" opacity="0.7">N</text>
        </g>

        {/* Scale bar */}
        <g transform={`translate(32, ${SVG_H - 28})`}>
          <line x1="0" y1="0" x2="148" y2="0" stroke="#F2B705" strokeWidth="1" opacity="0.5" />
          <line x1="0" y1="-5" x2="0" y2="5" stroke="#F2B705" strokeWidth="1" opacity="0.5" />
          <line x1="74" y1="-3" x2="74" y2="3" stroke="#F2B705" strokeWidth="0.5" opacity="0.35" />
          <line x1="148" y1="-5" x2="148" y2="5" stroke="#F2B705" strokeWidth="1" opacity="0.5" />
          <text x="0" y="12" textAnchor="middle" fill="rgba(242,183,5,0.35)" fontSize="5.5" fontFamily="'Space Mono', monospace">0</text>
          <text x="74" y="12" textAnchor="middle" fill="rgba(242,183,5,0.35)" fontSize="5.5" fontFamily="'Space Mono', monospace">0.5</text>
          <text x="148" y="12" textAnchor="middle" fill="rgba(242,183,5,0.35)" fontSize="5.5" fontFamily="'Space Mono', monospace">1 km</text>
        </g>

        {/* Corner coordinate labels */}
        <text x="8" y={SVG_H - 8} fill="rgba(242,183,5,0.18)" fontSize="7" fontFamily="'Space Mono', monospace">12.820°N · 79.900°E</text>
        <text x={SVG_W - 8} y="14" textAnchor="end" fill="rgba(242,183,5,0.18)" fontSize="7" fontFamily="'Space Mono', monospace">12.875°N · 79.955°E</text>

        {/* Industrial zones */}
        {zones.map((z) => (
          <path key={z.id} d={toPolygon(z.corners)} fill={z.fill} stroke={z.stroke} strokeWidth={z.strokeWidth} strokeDasharray="4 3" />
        ))}

        {/* Zone labels */}
        {(() => { const p = project(12.846, 79.924); return <text x={p.x} y={p.y} textAnchor="middle" fill="rgba(242,183,5,0.18)" fontSize="10" fontFamily="'Space Mono', monospace" letterSpacing="0.3em">SIPCOT IGC</text>; })()}
        {(() => { const p = project(12.862, 79.926); return <text x={p.x} y={p.y} textAnchor="middle" fill="rgba(59,143,239,0.25)" fontSize="7" fontFamily="'Space Mono', monospace" letterSpacing="0.15em">HI-TECH SEZ</text>; })()}
        {(() => { const p = project(12.853, 79.933); return <text x={p.x} y={p.y} textAnchor="middle" fill="rgba(136,102,204,0.25)" fontSize="7" fontFamily="'Space Mono', monospace" letterSpacing="0.12em">RN SUPPLIER PARK</text>; })()}

        {/* Roads */}
        {roads.map((r) => (
          <polyline key={r.id} points={toPolyline(r.points)} fill="none" stroke={r.colour} strokeWidth={r.strokeWidth} strokeLinecap="round" strokeLinejoin="round" opacity={r.type === "primary" ? 1 : r.type === "secondary" ? 0.8 : 0.55} />
        ))}

        {/* Road labels */}
        {(() => { const p = project(12.856, 79.923); return <g transform={`translate(${p.x}, ${p.y}) rotate(-38)`}><text textAnchor="middle" fill="#F2B705" fontSize="8" fontFamily="'Space Mono', monospace" opacity="0.7">{"\u2014 SH 48 \u2014"}</text></g>; })()}
        {(() => { const p = project(12.843, 79.912); return <g transform={`translate(${p.x}, ${p.y}) rotate(25)`}><text textAnchor="middle" fill="rgba(242,183,5,0.45)" fontSize="6" fontFamily="'Space Mono', monospace">WALAJABAD RD</text></g>; })()}
        {(() => { const p = project(12.829, 79.92); return <g transform={`translate(${p.x}, ${p.y}) rotate(-4)`}><text textAnchor="middle" fill="rgba(242,183,5,0.40)" fontSize="6" fontFamily="'Space Mono', monospace">VANDALUR{"\u2013"}WALAJABAD RD</text></g>; })()}

        {/* Connection line from hovered company to Welkinrim */}
        {hoveredCompany && hoveredCompany.id !== "welkinrim" && (() => {
          const cPos = project(hoveredCompany.lat, hoveredCompany.lng);
          const dist = distanceKm(WK.lat, WK.lng, hoveredCompany.lat, hoveredCompany.lng);
          const midX = (cPos.x + wkPos.x) / 2;
          const midY = (cPos.y + wkPos.y) / 2;
          const col = SECTOR_COLOURS[hoveredCompany.sector];
          return (
            <g style={{ pointerEvents: "none" }}>
              <line x1={wkPos.x} y1={wkPos.y} x2={cPos.x} y2={cPos.y} stroke={col.pin} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.5" />
              <rect x={midX - 18} y={midY - 7} width="36" height="14" fill="#09090B" stroke={col.ring} strokeWidth="0.5" rx="2" opacity="0.9" />
              <text x={midX} y={midY + 3} textAnchor="middle" fill={col.pin} fontSize="7" fontFamily="'Space Mono', monospace" fontWeight="700">{dist.toFixed(1)} km</text>
            </g>
          );
        })()}

        {/* Company pins */}
        {companies.map((company) => {
          const { x, y } = project(company.lat, company.lng);
          const col = SECTOR_COLOURS[company.sector];
          const isW = company.id === "welkinrim";
          const isH = hovered === company.id;
          return (
            <g key={company.id} transform={`translate(${x}, ${y})`} cursor="pointer"
              onMouseEnter={() => setHovered(company.id)}
              onMouseLeave={() => setHovered(null)}
              role="button" aria-label={company.name} tabIndex={0}>
              {isW && (
                <>
                  <circle r="48" fill="url(#wk-glow)" opacity="0.6">
                    <animate attributeName="r" values="40;56;40" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle r="28" fill="rgba(242,183,5,0.08)" stroke="rgba(242,183,5,0.3)" strokeWidth="1" strokeDasharray="3 2">
                    <animate attributeName="r" values="24;32;24" dur="3s" repeatCount="indefinite" />
                  </circle>
                </>
              )}
              {isH && <circle r={isW ? 20 : 14} fill={col.bg} stroke={col.ring} strokeWidth="1" />}
              <circle r={isW ? 8 : isH ? 6 : 4} fill={col.pin} stroke={isW ? "#09090B" : "rgba(9,9,11,0.8)"} strokeWidth={isW ? 1.5 : 1} style={{ transition: "r 150ms" }} />
              {isW && (
                <>
                  <circle r="3" fill="#09090B" />
                  <line x1="-4" y1="10" x2="4" y2="-10" stroke="#F2B705" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                </>
              )}
              <text x={isW ? 12 : 8} y={isW ? 4 : 2} fill={col.label} fontSize={isW ? 9 : 7.5} fontFamily="'Space Mono', monospace" letterSpacing={isW ? "0.12em" : "0.08em"} fontWeight={isW ? "700" : "400"} opacity={isH || isW ? 1 : 0.6} style={{ userSelect: "none", pointerEvents: "none", transition: "opacity 150ms" }}>
                {company.shortName}
              </text>
            </g>
          );
        })}

        {/* Hover tooltip */}
        {hoveredCompany && (() => {
          const { x, y } = project(hoveredCompany.lat, hoveredCompany.lng);
          const col = SECTOR_COLOURS[hoveredCompany.sector];
          const dist = distanceKm(WK.lat, WK.lng, hoveredCompany.lat, hoveredCompany.lng);
          const isW = hoveredCompany.id === "welkinrim";
          const tipW = 200;
          const tipH = 70;
          const tipX = x + 16 + tipW > SVG_W ? x - tipW - 16 : x + 16;
          const tipY = Math.max(Math.min(y - tipH / 2, SVG_H - tipH - 8), 8);
          return (
            <g transform={`translate(${tipX}, ${tipY})`} style={{ pointerEvents: "none" }}>
              <rect width={tipW} height={tipH} fill="#0C0C0F" stroke={col.ring} strokeWidth="0.8" rx="2" />
              <line x1="0" y1="0" x2="0" y2={tipH} stroke={col.pin} strokeWidth="2.5" />
              <text x="10" y="18" fill="#FFFFFF" fontSize="9" fontFamily="'Space Mono', monospace" letterSpacing="0.08em" fontWeight="700">{hoveredCompany.shortName}</text>
              <text x="10" y="32" fill="rgba(255,255,255,0.45)" fontSize="6.5" fontFamily="'Space Mono', monospace">{hoveredCompany.name.length > 32 ? hoveredCompany.name.slice(0, 32) + "\u2026" : hoveredCompany.name}</text>
              <text x="10" y="48" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="'Space Mono', monospace">{hoveredCompany.description.length > 48 ? hoveredCompany.description.slice(0, 48) + "\u2026" : hoveredCompany.description}</text>
              {!isW && (
                <text x={tipW - 10} y="18" textAnchor="end" fill="#F2B705" fontSize="7" fontFamily="'Space Mono', monospace" fontWeight="700">{dist.toFixed(1)} km</text>
              )}
              {hoveredCompany.plotRef && (
                <text x="10" y={tipH - 6} fill={col.ring} fontSize="5.5" fontFamily="'Space Mono', monospace" opacity="0.5">{hoveredCompany.plotRef}</text>
              )}
            </g>
          );
        })()}

        {/* Map title */}
        <text x="20" y="24" fill="rgba(242,183,5,0.6)" fontSize="9" fontFamily="'Space Mono', monospace" letterSpacing="0.22em">ORAGADAM INDUSTRIAL CORRIDOR</text>
        <text x="20" y="37" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="'Space Mono', monospace" letterSpacing="0.15em">SIPCOT Industrial Growth Centre · Tamil Nadu · India</text>
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", padding: "14px 20px", borderTop: "1px solid rgba(242,183,5,0.10)", background: "#09090B" }}>
        {([
          { sector: "welkinrim", label: "Welkinrim Technologies" },
          { sector: "automotive", label: "Automotive / Auto-ancillary" },
          { sector: "electronics", label: "Electronics / Telecom" },
          { sector: "industrial", label: "Heavy Industrial" },
          { sector: "logistics", label: "Logistics / Warehousing" },
        ] as const).map((item) => (
          <div key={item.sector} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div style={{
              width: item.sector === "welkinrim" ? 10 : 7,
              height: item.sector === "welkinrim" ? 10 : 7,
              borderRadius: "50%",
              background: SECTOR_COLOURS[item.sector].pin,
              flexShrink: 0,
              boxShadow: item.sector === "welkinrim" ? "0 0 6px #F2B705" : "none",
            }} />
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "8px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: item.sector === "welkinrim" ? "#F2B705" : "rgba(255,255,255,0.35)",
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
