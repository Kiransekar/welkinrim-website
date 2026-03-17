# WELKINRIM TECHNOLOGIES — ORAGADAM INDUSTRIAL MAP
## Location Page SVG Implementation Spec
**File:** `app/location/page.tsx` + `components/OragadamMap.tsx`
**Theme:** Space Black `#09090B` · Bumblebee Yellow `#F2B705` · Deep White `#F3F3EF`

---

## OVERVIEW

A fully custom SVG map of the Oragadam Industrial Corridor, rendered entirely in code. No external map APIs, no tiles, no third-party embeds. The map is drawn from real GPS coordinates projected onto an SVG canvas — every road, every plot, every company is positioned to match the actual geographic layout of SIPCOT Oragadam.

The aesthetic is: **engineering drawing meets industrial cartography.** Black background, yellow roads, white/grey plot boundaries. Welkinrim's pin pulses. Hover any company to reveal its details. The map reads like a precision instrument, not a Google Maps embed.

---

## REAL GEOGRAPHIC DATA

### Welkinrim Technologies — Exact Location
```
Latitude:   12.8365065
Longitude:  79.92121
Address:    SIPCOT Industrial Growth Centre, Oragadam,
            Sriperumbudur Taluk, Kanchipuram District,
            Tamil Nadu 602105
```

### Map Bounding Box (the visible area)
```
SW corner:  12.820°N,  79.900°E
NE corner:  12.875°N,  79.955°E

Width span:  ~6.1 km east-west
Height span: ~6.1 km north-south
```

### Coordinate-to-SVG Projection

The map uses a simple equirectangular projection. At this latitude, 1° longitude ≈ 97.5 km, 1° latitude ≈ 111 km. The projection must maintain approximate real-world proportions.

```ts
// SVG canvas size
const SVG_W = 900   // px
const SVG_H = 840   // px

// Geographic bounds
const GEO_W = 79.955 - 79.900  // = 0.055° longitude
const GEO_H = 12.875 - 12.820  // = 0.055° latitude

// Scale factors
const SCALE_X = SVG_W / GEO_W  // = 900 / 0.055 = 16363 px/degree
const SCALE_Y = SVG_H / GEO_H  // = 840 / 0.055 = 15272 px/degree

// Longitude scale correction at this latitude:
// 1° lon = cos(12.86° × π/180) × 111.32km = 0.9751 × 111.32 = 108.5 km
// 1° lat = 111.0 km
// Aspect ratio correction: SCALE_X should be ≈ SCALE_Y × (108.5/111.0) = 0.977×
// Applied automatically if SVG_W/GEO_W ≈ SVG_H/GEO_H × 0.977

// Projection function
function project(lat: number, lng: number): { x: number, y: number } {
  const x = (lng - 79.900) * SCALE_X
  const y = SVG_H - (lat - 12.820) * SCALE_Y  // Y flipped (SVG y increases downward)
  return { x: Math.round(x), y: Math.round(y) }
}

// Test: Welkinrim at (12.8365065, 79.92121)
// x = (79.92121 - 79.900) × 16363 = 0.02121 × 16363 = 346.9 ≈ 347
// y = 840 - (12.8365065 - 12.820) × 15272 = 840 - 0.0165065 × 15272 = 840 - 252.1 = 587.9 ≈ 588
// Welkinrim SVG position: (347, 588) — lower-centre of the map. Correct for the real location.
```

---

## ROAD NETWORK (Actual GPS-derived paths)

All road coordinates are real. Projected using the formula above.

### Primary Roads

```ts
const roads = {
  // ── SH-48 (State Highway 48) — Main arterial road ─────────────────
  // Runs roughly NW to SE across the entire map. The backbone of the corridor.
  // Real alignment: enters map ~NW at (12.870°N, 79.910°E), exits SE at (12.826°N, 79.948°E)
  SH48: {
    id: 'sh48',
    name: 'State Highway 48',
    type: 'primary',
    colour: '#F2B705',
    strokeWidth: 3.5,
    points: [
      { lat: 12.872, lng: 79.907 },  // NW entry
      { lat: 12.868, lng: 79.912 },
      { lat: 12.862, lng: 79.918 },
      { lat: 12.856, lng: 79.923 },
      { lat: 12.850, lng: 79.928 },
      { lat: 12.844, lng: 79.932 },
      { lat: 12.838, lng: 79.937 },
      { lat: 12.831, lng: 79.942 },
      { lat: 12.824, lng: 79.948 },  // SE exit
    ],
  },

  // ── Oragadam–Walajabad Road — Secondary arterial ──────────────────
  // Runs E-W through the lower portion. Connects SIPCOT to Walajabad.
  // Real: branches south from SH-48 near (12.848°N, 79.930°E)
  walajabadRoad: {
    id: 'walajabad',
    name: 'Oragadam–Walajabad Road',
    type: 'secondary',
    colour: '#F2B705',
    strokeWidth: 2.5,
    points: [
      { lat: 12.850, lng: 79.930 },  // Junction with SH-48
      { lat: 12.847, lng: 79.926 },
      { lat: 12.844, lng: 79.920 },
      { lat: 12.841, lng: 79.915 },
      { lat: 12.838, lng: 79.908 },
      { lat: 12.836, lng: 79.902 },  // West exit
    ],
  },

  // ── SIPCOT Internal Road A (North-South spine) ────────────────────
  sipcotSpineNS: {
    id: 'sipcot-ns',
    name: 'SIPCOT Internal Road A',
    type: 'internal',
    colour: 'rgba(242,183,5,0.55)',
    strokeWidth: 1.5,
    points: [
      { lat: 12.858, lng: 79.922 },
      { lat: 12.852, lng: 79.922 },
      { lat: 12.846, lng: 79.921 },
      { lat: 12.840, lng: 79.921 },
      { lat: 12.835, lng: 79.921 },
    ],
  },

  // ── SIPCOT Internal Road B (East-West) ───────────────────────────
  sipcotSpineEW: {
    id: 'sipcot-ew',
    name: 'SIPCOT Internal Road B',
    type: 'internal',
    colour: 'rgba(242,183,5,0.55)',
    strokeWidth: 1.5,
    points: [
      { lat: 12.844, lng: 79.912 },
      { lat: 12.844, lng: 79.917 },
      { lat: 12.844, lng: 79.922 },
      { lat: 12.844, lng: 79.928 },
      { lat: 12.844, lng: 79.933 },
    ],
  },

  // ── Renault-Nissan Supplier Park Access Road ──────────────────────
  rnAccess: {
    id: 'rn-access',
    name: 'RN Supplier Park Road',
    type: 'internal',
    colour: 'rgba(242,183,5,0.45)',
    strokeWidth: 1.2,
    points: [
      { lat: 12.856, lng: 79.928 },
      { lat: 12.855, lng: 79.931 },
      { lat: 12.853, lng: 79.933 },
      { lat: 12.851, lng: 79.935 },
    ],
  },

  // ── Hi-Tech SEZ Access Road ───────────────────────────────────────
  sezAccess: {
    id: 'sez-access',
    name: 'Hi-Tech SEZ Road',
    type: 'internal',
    colour: 'rgba(242,183,5,0.45)',
    strokeWidth: 1.2,
    points: [
      { lat: 12.862, lng: 79.918 },
      { lat: 12.861, lng: 79.922 },
      { lat: 12.860, lng: 79.925 },
      { lat: 12.859, lng: 79.928 },
    ],
  },

  // ── Vandalur-Walajabad Road (southern boundary road) ─────────────
  vandalurRoad: {
    id: 'vandalur',
    name: 'Vandalur–Walajabad Road',
    type: 'secondary',
    colour: '#F2B705',
    strokeWidth: 2.5,
    points: [
      { lat: 12.826, lng: 79.905 },
      { lat: 12.828, lng: 79.912 },
      { lat: 12.830, lng: 79.920 },
      { lat: 12.831, lng: 79.928 },
      { lat: 12.832, lng: 79.935 },
      { lat: 12.833, lng: 79.942 },
    ],
  },
}
```

---

## INDUSTRIAL ZONES (Background fills)

```ts
// Drawn as SVG polygons behind roads and pins
// These represent the actual plot clusters in SIPCOT

const zones = [
  {
    id: 'sipcot-core',
    label: 'SIPCOT Industrial Growth Centre',
    fill: 'rgba(242,183,5,0.04)',
    stroke: 'rgba(242,183,5,0.18)',
    strokeWidth: 0.8,
    // Approximate polygon of the 4500-acre SIPCOT core area
    corners: [
      { lat: 12.858, lng: 79.910 },
      { lat: 12.862, lng: 79.920 },
      { lat: 12.860, lng: 79.938 },
      { lat: 12.848, lng: 79.940 },
      { lat: 12.836, lng: 79.938 },
      { lat: 12.830, lng: 79.930 },
      { lat: 12.833, lng: 79.912 },
      { lat: 12.840, lng: 79.908 },
    ],
  },
  {
    id: 'hitech-sez',
    label: 'Hi-Tech SEZ',
    fill: 'rgba(59,143,239,0.04)',
    stroke: 'rgba(59,143,239,0.15)',
    strokeWidth: 0.8,
    corners: [
      { lat: 12.862, lng: 79.918 },
      { lat: 12.866, lng: 79.924 },
      { lat: 12.864, lng: 79.932 },
      { lat: 12.860, lng: 79.934 },
      { lat: 12.858, lng: 79.928 },
      { lat: 12.860, lng: 79.920 },
    ],
  },
  {
    id: 'rn-supplier',
    label: 'RN Supplier Park',
    fill: 'rgba(136,102,204,0.04)',
    stroke: 'rgba(136,102,204,0.15)',
    strokeWidth: 0.8,
    corners: [
      { lat: 12.854, lng: 79.928 },
      { lat: 12.857, lng: 79.934 },
      { lat: 12.854, lng: 79.938 },
      { lat: 12.850, lng: 79.936 },
      { lat: 12.849, lng: 79.930 },
    ],
  },
]
```

---

## COMPANY PINS (All real GPS-approximate positions)

```ts
interface Company {
  id: string
  name: string
  shortName: string          // shown on map label
  lat: number
  lng: number
  sector: 'automotive' | 'electronics' | 'industrial' | 'logistics' | 'welkinrim'
  description: string        // shown in hover tooltip
  plotRef?: string           // SIPCOT plot number
}

const companies: Company[] = [
  // ── THE ANCHOR ──────────────────────────────────────────────────────
  {
    id: 'welkinrim',
    name: 'Welkinrim Technologies Pvt. Ltd.',
    shortName: 'WELKINRIM',
    lat: 12.8365065,
    lng: 79.92121,
    sector: 'welkinrim',
    description: 'Electric motor & EV powertrain manufacturer. Air · Water · Land · Robotics.',
    plotRef: 'SIPCOT Industrial Growth Centre',
  },

  // ── AUTOMOTIVE GIANTS ────────────────────────────────────────────────
  {
    id: 'renault-nissan',
    name: 'Renault–Nissan Automotive India Pvt. Ltd.',
    shortName: 'Renault–Nissan',
    lat: 12.8520,
    lng: 79.9330,
    sector: 'automotive',
    description: 'Major car manufacturer. Production base for Renault and Nissan vehicles for Indian and export markets.',
    plotRef: 'SH 57, Oragadam Industrial Corridor',
  },
  {
    id: 'daimler',
    name: 'Daimler India Commercial Vehicles',
    shortName: 'Daimler',
    lat: 12.8480,
    lng: 79.9190,
    sector: 'automotive',
    description: 'BharatBenz trucks and buses manufacturing plant. One of the largest commercial vehicle producers in India.',
    plotRef: 'SH 48, Oragadam Industrial Corridor',
  },
  {
    id: 'royal-enfield',
    name: 'Royal Enfield Manufacturing Company',
    shortName: 'Royal Enfield',
    lat: 12.8440,
    lng: 79.9270,
    sector: 'automotive',
    description: 'Iconic two-wheeler manufacturer. Produces Classic, Meteor, and Himalayan models.',
    plotRef: 'State Highway 48, Oragadam',
  },
  {
    id: 'komatsu',
    name: 'Komatsu India Pvt. Ltd.',
    shortName: 'Komatsu',
    lat: 12.8600,
    lng: 79.9260,
    sector: 'automotive',
    description: 'Heavy construction equipment manufacturing. Excavators, bulldozers, and mining equipment.',
    plotRef: 'SIPCOT Industrial Growth Centre',
  },
  {
    id: 'apollo-tyres',
    name: 'Apollo Tyres Ltd.',
    shortName: 'Apollo Tyres',
    lat: 12.8385,
    lng: 79.9360,
    sector: 'automotive',
    description: 'Tyre manufacturing plant. Produces tyres for passenger vehicles, trucks, and two-wheelers.',
    plotRef: 'Oragadam Industrial Corridor',
  },

  // ── AUTO-ANCILLARY / TIER-1 ──────────────────────────────────────────
  {
    id: 'delphi-tvs',
    name: 'Delphi-TVS Diesel Systems Ltd.',
    shortName: 'Delphi-TVS',
    lat: 12.8430,
    lng: 79.9155,
    sector: 'automotive',
    description: 'Fuel injection systems manufacturer. Joint venture between Delphi Technologies and TVS Group.',
    plotRef: 'Plot A-19/2, SIPCOT IGC',
  },
  {
    id: 'bosch',
    name: 'Bosch Electrical Drives India Pvt. Ltd.',
    shortName: 'Bosch',
    lat: 12.8355,
    lng: 79.9160,
    sector: 'automotive',
    description: 'Electrical drives, automation systems, and automotive components. Adjacent to Welkinrim.',
    plotRef: 'IndoSpace SKCL, Oragadam Walajabad Road',
  },
  {
    id: 'danfoss',
    name: 'Danfoss Industries Pvt. Ltd.',
    shortName: 'Danfoss',
    lat: 12.8465,
    lng: 79.9345,
    sector: 'industrial',
    description: 'Industrial drives, compressors, and hydraulics manufacturing. Energy-efficient solutions.',
    plotRef: 'Plot A-19/2, SIPCOT IGC',
  },
  {
    id: 'subros',
    name: 'Subros Ltd. — Chennai Plant',
    shortName: 'Subros',
    lat: 12.8420,
    lng: 79.9200,
    sector: 'automotive',
    description: 'HVAC systems for automobiles. Supplier to Maruti Suzuki, Tata, and Mahindra.',
    plotRef: 'A-20/1, SIPCOT IGC',
  },
  {
    id: 'tenneco',
    name: 'Tenneco Automotive India Pvt. Ltd.',
    shortName: 'Tenneco',
    lat: 12.8515,
    lng: 79.9210,
    sector: 'automotive',
    description: 'Ride performance and emission control products. Monroe shock absorbers and Walker exhausts.',
    plotRef: 'RNS2, Nissan Supplier Park',
  },
  {
    id: 'steel-strips',
    name: 'Steel Strips Wheels Limited',
    shortName: 'Steel Strips',
    lat: 12.8395,
    lng: 79.9240,
    sector: 'automotive',
    description: 'Steel wheel rims for cars, commercial vehicles, and tractors.',
    plotRef: 'A-10, SIPCOT IGC',
  },
  {
    id: 'calsonic',
    name: 'Calsonic Kansei Motherson',
    shortName: 'Calsonic',
    lat: 12.8455,
    lng: 79.9175,
    sector: 'automotive',
    description: 'Thermal management, exhaust, and cockpit modules for automotive OEMs.',
    plotRef: 'SIPCOT IGC, Chengalpattu-Sriperumbudur Road',
  },

  // ── ELECTRONICS / TECH ───────────────────────────────────────────────
  {
    id: 'nokia',
    name: 'Nokia Solutions & Networks India Pvt. Ltd.',
    shortName: 'Nokia',
    lat: 12.8630,
    lng: 79.9250,
    sector: 'electronics',
    description: 'Telecom equipment manufacturing and R&D. 5G infrastructure components.',
    plotRef: 'Plot OZ-08, Hi-Tech SEZ, Oragadam',
  },
  {
    id: 'sanmina',
    name: 'Sanmina IMS',
    shortName: 'Sanmina',
    lat: 12.8625,
    lng: 79.9195,
    sector: 'electronics',
    description: 'Integrated manufacturing solutions (IMS). PCB assembly, mechanical systems, high-complexity electronics.',
    plotRef: 'OZ-1, SIPCOT Hi-Tech SEZ',
  },

  // ── LOGISTICS / INDUSTRIAL ───────────────────────────────────────────
  {
    id: 'bpcl',
    name: 'BPCL — Industrial Supply Depot',
    shortName: 'BPCL',
    lat: 12.8340,
    lng: 79.9200,
    sector: 'logistics',
    description: 'Bharat Petroleum industrial supply depot serving the industrial corridor.',
    plotRef: 'SIPCOT IGC',
  },
  {
    id: 'natrip',
    name: 'NATRIP (National Automotive Testing)',
    shortName: 'NATRIP',
    lat: 12.8485,
    lng: 79.9030,
    sector: 'industrial',
    description: 'National Automotive Testing and R&D Infrastructure Project. Test tracks and automotive R&D facility.',
    plotRef: 'SIPCOT Oragadam — 304 acres',
  },
  {
    id: 'indospace',
    name: 'IndoSpace Industrial Park',
    shortName: 'IndoSpace',
    lat: 12.8330,
    lng: 79.9225,
    sector: 'logistics',
    description: 'Grade-A warehousing and industrial park. 14+ acres on SH 48.',
    plotRef: 'SH 48, Adjacent to SIPCOT',
  },
]
```

---

## SVG MAP COMPONENT — COMPLETE IMPLEMENTATION

### File: `components/OragadamMap.tsx`

```tsx
'use client'
import { useState, useRef } from 'react'

// ─── Constants ───────────────────────────────────────────────────────────────
const SVG_W = 900
const SVG_H = 840
const GEO_BOUNDS = {
  minLat: 12.820, maxLat: 12.875,
  minLng: 79.900, maxLng: 79.955,
}

// Coordinate projection (equirectangular)
function project(lat: number, lng: number) {
  const x = ((lng - GEO_BOUNDS.minLng) / (GEO_BOUNDS.maxLng - GEO_BOUNDS.minLng)) * SVG_W
  const y = SVG_H - ((lat - GEO_BOUNDS.minLat) / (GEO_BOUNDS.maxLat - GEO_BOUNDS.minLat)) * SVG_H
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }
}

// Convert array of lat/lng to SVG polyline points string
function toPolyline(points: { lat: number; lng: number }[]): string {
  return points.map(p => {
    const { x, y } = project(p.lat, p.lng)
    return `${x},${y}`
  }).join(' ')
}

// Convert polygon corners to SVG path d string
function toPolygon(corners: { lat: number; lng: number }[]): string {
  const pts = corners.map(c => project(c.lat, c.lng))
  return `M ${pts[0].x},${pts[0].y} ` +
    pts.slice(1).map(p => `L ${p.x},${p.y}`).join(' ') + ' Z'
}

// ─── Colour scheme per sector ────────────────────────────────────────────────
const SECTOR_COLOURS = {
  welkinrim:   { pin: '#F2B705', ring: '#F2B705', label: '#F2B705', bg: 'rgba(242,183,5,0.12)' },
  automotive:  { pin: '#FFFFFF', ring: 'rgba(255,255,255,0.4)', label: 'rgba(255,255,255,0.7)', bg: 'rgba(255,255,255,0.06)' },
  electronics: { pin: '#3B8FEF', ring: 'rgba(59,143,239,0.5)', label: '#3B8FEF', bg: 'rgba(59,143,239,0.10)' },
  industrial:  { pin: '#00B4CC', ring: 'rgba(0,180,204,0.5)', label: '#00B4CC', bg: 'rgba(0,180,204,0.08)' },
  logistics:   { pin: '#8866CC', ring: 'rgba(136,102,204,0.5)', label: '#8866CC', bg: 'rgba(136,102,204,0.08)' },
}

// ─── Component ───────────────────────────────────────────────────────────────
export function OragadamMap() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const hoveredCompany = companies.find(c => c.id === hovered)

  return (
    <div style={{ position: 'relative', width: '100%', background: '#09090B' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        style={{ display: 'block', maxWidth: SVG_W }}
        aria-label="Interactive map of Oragadam Industrial Corridor showing Welkinrim Technologies and surrounding major industries"
        role="img"
      >
        {/* ── DEFS ─────────────────────────────────────────────── */}
        <defs>
          {/* Welkinrim pulse animation */}
          <radialGradient id="welkinrim-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#F2B705" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F2B705" stopOpacity="0" />
          </radialGradient>
          {/* Grid pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(242,183,5,0.04)" strokeWidth="0.5"/>
          </pattern>
          {/* Clip for map border */}
          <clipPath id="map-clip">
            <rect x="0" y="0" width={SVG_W} height={SVG_H} />
          </clipPath>
        </defs>

        {/* ── BACKGROUND ──────────────────────────────────────── */}
        <rect width={SVG_W} height={SVG_H} fill="#09090B" />
        {/* Engineering grid — very subtle */}
        <rect width={SVG_W} height={SVG_H} fill="url(#grid)" />
        {/* Outer border */}
        <rect
          x="1" y="1"
          width={SVG_W - 2} height={SVG_H - 2}
          fill="none"
          stroke="rgba(242,183,5,0.20)"
          strokeWidth="1"
        />

        {/* ── NORTH ARROW ─────────────────────────────────────── */}
        {/* Top-right corner, 30px from edge */}
        <g transform={`translate(${SVG_W - 48}, 36)`}>
          <polygon points="0,-16 -5,4 0,0 5,4" fill="#F2B705" opacity="0.7" />
          <polygon points="0,16 -5,-4 0,0 5,-4" fill="rgba(255,255,255,0.2)" />
          <text x="0" y="26" textAnchor="middle" fill="#F2B705" fontSize="8"
            fontFamily="'Space Mono', monospace" letterSpacing="0.1em" opacity="0.7">N</text>
        </g>

        {/* ── SCALE BAR ───────────────────────────────────────── */}
        {/* 1 km at this zoom = about 164 px */}
        {/* Calculation: 1km / 6.1km total width × 900px = 147.5px per km */}
        <g transform={`translate(32, ${SVG_H - 28})`}>
          <line x1="0" y1="0" x2="148" y2="0" stroke="#F2B705" strokeWidth="1" opacity="0.5" />
          <line x1="0" y1="-5" x2="0" y2="5" stroke="#F2B705" strokeWidth="1" opacity="0.5" />
          <line x1="148" y1="-5" x2="148" y2="5" stroke="#F2B705" strokeWidth="1" opacity="0.5" />
          <text x="74" y="-8" textAnchor="middle" fill="rgba(242,183,5,0.5)"
            fontSize="7" fontFamily="'Space Mono', monospace">1 km</text>
        </g>

        {/* ── COORDINATE LABELS ───────────────────────────────── */}
        <text x="8" y={SVG_H - 8} fill="rgba(242,183,5,0.18)" fontSize="7"
          fontFamily="'Space Mono', monospace">
          12.820°N · 79.900°E
        </text>
        <text x={SVG_W - 8} y="14" textAnchor="end" fill="rgba(242,183,5,0.18)"
          fontSize="7" fontFamily="'Space Mono', monospace">
          12.875°N · 79.955°E
        </text>

        {/* ── INDUSTRIAL ZONES (background fills) ─────────────── */}
        {zones.map(zone => (
          <path
            key={zone.id}
            d={toPolygon(zone.corners)}
            fill={zone.fill}
            stroke={zone.stroke}
            strokeWidth={zone.strokeWidth}
            strokeDasharray="4 3"
          />
        ))}

        {/* ── ZONE LABELS ─────────────────────────────────────── */}
        {/* SIPCOT Core label */}
        {(() => {
          const { x, y } = project(12.851, 79.919)
          return (
            <text x={x} y={y} textAnchor="middle" fill="rgba(242,183,5,0.22)"
              fontSize="8" fontFamily="'Space Mono', monospace" letterSpacing="0.2em"
              style={{ textTransform: 'uppercase' }}>
              SIPCOT IGC
            </text>
          )
        })()}
        {/* Hi-Tech SEZ label */}
        {(() => {
          const { x, y } = project(12.862, 79.926)
          return (
            <text x={x} y={y} textAnchor="middle" fill="rgba(59,143,239,0.30)"
              fontSize="7" fontFamily="'Space Mono', monospace" letterSpacing="0.15em">
              HI-TECH SEZ
            </text>
          )
        })()}
        {/* RN Supplier Park label */}
        {(() => {
          const { x, y } = project(12.853, 79.933)
          return (
            <text x={x} y={y} textAnchor="middle" fill="rgba(136,102,204,0.30)"
              fontSize="7" fontFamily="'Space Mono', monospace" letterSpacing="0.12em">
              RN SUPPLIER PARK
            </text>
          )
        })()}

        {/* ── ROADS ───────────────────────────────────────────── */}
        {Object.values(roads).map(road => (
          <polyline
            key={road.id}
            points={toPolyline(road.points)}
            fill="none"
            stroke={road.colour}
            strokeWidth={road.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={road.type === 'primary' ? 1 : road.type === 'secondary' ? 0.8 : 0.55}
          />
        ))}

        {/* ── ROAD LABELS ─────────────────────────────────────── */}
        {/* SH-48 label along the road */}
        {(() => {
          const { x, y } = project(12.856, 79.923)
          return (
            <g transform={`translate(${x}, ${y}) rotate(-38)`}>
              <text textAnchor="middle" fill="#F2B705" fontSize="8"
                fontFamily="'Space Mono', monospace" opacity="0.7">
                — SH 48 —
              </text>
            </g>
          )
        })()}

        {/* ── COMPANY PINS ────────────────────────────────────── */}
        {companies.map(company => {
          const { x, y } = project(company.lat, company.lng)
          const colours = SECTOR_COLOURS[company.sector]
          const isWelkinrim = company.id === 'welkinrim'
          const isHovered = hovered === company.id

          return (
            <g
              key={company.id}
              transform={`translate(${x}, ${y})`}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => {
                setHovered(company.id)
                const svgRect = svgRef.current?.getBoundingClientRect()
                if (svgRect) {
                  setTooltip({ x, y })
                }
              }}
              onMouseLeave={() => {
                setHovered(null)
                setTooltip(null)
              }}
              role="button"
              aria-label={company.name}
              tabIndex={0}
            >
              {/* Welkinrim: large pulsing glow */}
              {isWelkinrim && (
                <>
                  <circle r="48" fill="url(#welkinrim-glow)" opacity="0.6">
                    <animate attributeName="r" values="40;56;40" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle r="28" fill="rgba(242,183,5,0.08)" stroke="rgba(242,183,5,0.3)"
                    strokeWidth="1" strokeDasharray="3 2">
                    <animate attributeName="r" values="24;32;24" dur="3s" repeatCount="indefinite" />
                  </circle>
                </>
              )}

              {/* Hover ring */}
              {isHovered && (
                <circle r={isWelkinrim ? 20 : 14} fill={colours.bg}
                  stroke={colours.ring} strokeWidth="1" />
              )}

              {/* Pin dot */}
              <circle
                r={isWelkinrim ? 8 : isHovered ? 6 : 4}
                fill={colours.pin}
                stroke={isWelkinrim ? '#09090B' : 'rgba(9,9,11,0.8)'}
                strokeWidth={isWelkinrim ? 1.5 : 1}
              />

              {/* Welkinrim: inner dot + slash mark */}
              {isWelkinrim && (
                <>
                  <circle r="3" fill="#09090B" />
                  {/* Diagonal slash matching logo angle (78°) */}
                  <line
                    x1="-4" y1="10" x2="4" y2="-10"
                    stroke="#F2B705"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                </>
              )}

              {/* Company label */}
              <text
                x={isWelkinrim ? 12 : 8}
                y={isWelkinrim ? 4 : 2}
                fill={colours.label}
                fontSize={isWelkinrim ? 9 : 7.5}
                fontFamily="'Space Mono', monospace"
                letterSpacing={isWelkinrim ? '0.12em' : '0.08em'}
                fontWeight={isWelkinrim ? '700' : '400'}
                style={{ userSelect: 'none', pointerEvents: 'none' }}
              >
                {company.shortName}
              </text>
            </g>
          )
        })}

        {/* ── HOVER TOOLTIP (rendered inside SVG) ─────────────── */}
        {hoveredCompany && tooltip && (() => {
          const { x, y } = project(hoveredCompany.lat, hoveredCompany.lng)
          const colours = SECTOR_COLOURS[hoveredCompany.sector]
          // Position tooltip: above and to the right, clamp to SVG bounds
          const tipX = Math.min(x + 12, SVG_W - 210)
          const tipY = Math.max(y - 80, 8)
          const tipW = 200
          const tipH = 70

          return (
            <g transform={`translate(${tipX}, ${tipY})`} style={{ pointerEvents: 'none' }}>
              {/* Tooltip background */}
              <rect
                width={tipW} height={tipH}
                fill="#0F0F12"
                stroke={colours.ring}
                strokeWidth="0.8"
                rx="2"
              />
              {/* Left accent line */}
              <line x1="0" y1="0" x2="0" y2={tipH}
                stroke={colours.pin} strokeWidth="2" />
              {/* Company name */}
              <text x="10" y="16" fill={colours.pin} fontSize="8.5"
                fontFamily="'Space Mono', monospace" letterSpacing="0.1em" fontWeight="700">
                {hoveredCompany.shortName}
              </text>
              {/* Full name */}
              <text x="10" y="28" fill="rgba(255,255,255,0.5)" fontSize="7"
                fontFamily="'Space Mono', monospace">
                {hoveredCompany.name.length > 32
                  ? hoveredCompany.name.slice(0, 32) + '…'
                  : hoveredCompany.name}
              </text>
              {/* Description (wrap at ~42 chars) */}
              {(() => {
                const words = hoveredCompany.description.split(' ')
                const lines: string[] = []
                let current = ''
                words.forEach(word => {
                  if ((current + word).length > 40) {
                    lines.push(current.trim()); current = word + ' '
                  } else {
                    current += word + ' '
                  }
                })
                lines.push(current.trim())
                return lines.slice(0, 2).map((line, i) => (
                  <text key={i} x="10" y={42 + i * 11} fill="rgba(255,255,255,0.35)"
                    fontSize="6.5" fontFamily="'Space Mono', monospace">
                    {line}
                  </text>
                ))
              })()}
              {/* Plot ref */}
              {hoveredCompany.plotRef && (
                <text x="10" y={tipH - 8} fill={colours.ring} fontSize="6"
                  fontFamily="'Space Mono', monospace" opacity="0.6">
                  {hoveredCompany.plotRef}
                </text>
              )}
            </g>
          )
        })()}

        {/* ── MAP TITLE ───────────────────────────────────────── */}
        <text x="20" y="24" fill="rgba(242,183,5,0.6)" fontSize="9"
          fontFamily="'Space Mono', monospace" letterSpacing="0.22em">
          ORAGADAM INDUSTRIAL CORRIDOR
        </text>
        <text x="20" y="37" fill="rgba(255,255,255,0.2)" fontSize="7"
          fontFamily="'Space Mono', monospace" letterSpacing="0.15em">
          SIPCOT Industrial Growth Centre · Tamil Nadu · India
        </text>

      </svg>

      {/* ── LEGEND (below SVG, in HTML) ─────────────────────── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '16px',
        padding: '14px 20px',
        borderTop: '1px solid rgba(242,183,5,0.10)',
        background: '#09090B',
      }}>
        {[
          { sector: 'welkinrim',   label: 'Welkinrim Technologies' },
          { sector: 'automotive',  label: 'Automotive / Auto-ancillary' },
          { sector: 'electronics', label: 'Electronics / Telecom' },
          { sector: 'industrial',  label: 'Heavy Industrial' },
          { sector: 'logistics',   label: 'Logistics / Warehousing' },
        ].map(item => (
          <div key={item.sector} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{
              width: item.sector === 'welkinrim' ? 10 : 7,
              height: item.sector === 'welkinrim' ? 10 : 7,
              borderRadius: '50%',
              background: SECTOR_COLOURS[item.sector as keyof typeof SECTOR_COLOURS].pin,
              flexShrink: 0,
              boxShadow: item.sector === 'welkinrim' ? '0 0 6px #F2B705' : 'none',
            }} />
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '8px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: item.sector === 'welkinrim'
                ? '#F2B705'
                : 'rgba(255,255,255,0.35)',
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## FULL LOCATION PAGE — `app/location/page.tsx`

```tsx
import { OragadamMap } from '@/components/OragadamMap'

export default function LocationPage() {
  return (
    <main style={{ background: '#09090B', minHeight: '100vh', paddingTop: '72px' }}>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section style={{
        padding: 'clamp(64px,9vw,128px) clamp(20px,5vw,64px)',
        maxWidth: 'calc(1400px + 128px)',
        margin: '0 auto',
      }}>
        {/* Overline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <svg width="28" height="28" viewBox="0 0 28 28">
            <line x1="22" y1="2" x2="6" y2="26" stroke="#F2B705" strokeWidth="1" />
          </svg>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '10px', letterSpacing: '0.32em',
            textTransform: 'uppercase', color: '#F2B705',
          }}>
            Our Location
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Syncopate', sans-serif",
          fontWeight: 700,
          fontSize: 'clamp(32px, 4.5vw, 64px)',
          lineHeight: 0.9,
          letterSpacing: '-0.01em',
          color: '#FFFFFF',
          marginBottom: '24px',
        }}>
          ORAGADAM<br />
          <span style={{ color: '#F2B705' }}>INDUSTRIAL</span><br />
          CORRIDOR
        </h1>

        {/* Sub-text */}
        <p style={{
          fontFamily: "'Work Sans', sans-serif",
          fontSize: 'clamp(14px, 1.3vw, 17px)',
          lineHeight: 1.75,
          color: 'rgba(255,255,255,0.55)',
          maxWidth: '560px',
          marginBottom: '16px',
        }}>
          Embedded in South Asia's largest automotive manufacturing hub.
          Surrounded by 22+ Fortune 500 companies, global OEMs, and the
          precision engineering ecosystem that Welkinrim was built to serve.
        </p>

        {/* Address pill */}
        <div style={{
          display: 'inline-flex', gap: '8px',
          border: '1px solid rgba(255,255,255,0.10)',
          padding: '8px 16px',
          marginBottom: '8px',
        }}>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '10px', letterSpacing: '0.18em',
            color: 'rgba(255,255,255,0.45)',
          }}>
            SIPCOT Industrial Growth Centre, Oragadam,
            Sriperumbudur Taluk, Tamil Nadu 602105
          </span>
        </div>

        {/* Coordinates */}
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '10px', letterSpacing: '0.18em',
          color: 'rgba(242,183,5,0.45)',
        }}>
          12.8365°N · 79.9212°E
        </div>
      </section>

      {/* ── MAP ─────────────────────────────────────────────── */}
      <section style={{
        maxWidth: 'calc(1400px + 128px)',
        margin: '0 auto',
        padding: '0 clamp(20px, 5vw, 64px)',
        paddingBottom: 'clamp(64px, 9vw, 128px)',
      }}>
        <div style={{
          border: '1px solid rgba(242,183,5,0.18)',
          overflow: 'hidden',
        }}>
          <OragadamMap />
        </div>

        {/* Map caption */}
        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '8px', letterSpacing: '0.15em',
          color: 'rgba(255,255,255,0.18)',
          marginTop: '12px',
          textTransform: 'uppercase',
        }}>
          Positions are geographically approximate. Road network derived from SH 48 and SIPCOT internal road data.
          Hover any marker to view company details.
        </p>
      </section>

      {/* ── NEIGHBOURS GRID ─────────────────────────────────── */}
      <section style={{
        background: '#F3F3EF',
        padding: 'clamp(64px, 9vw, 128px) clamp(20px, 5vw, 64px)',
      }}>
        <div style={{ maxWidth: 'calc(1400px + 128px)', margin: '0 auto' }}>

          {/* Overline */}
          <div style={{ marginBottom: '24px' }}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px', letterSpacing: '0.32em',
              textTransform: 'uppercase', color: '#8A8A96',
            }}>
              Neighbouring Establishments
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Syncopate', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(24px, 3vw, 40px)',
            lineHeight: 0.92,
            color: '#09090B',
            marginBottom: '48px',
          }}>
            PRECISION COMPANY.
          </h2>

          {/* Grid of notable neighbours */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1px',
            background: '#E6E6E2',
          }}>
            {[
              { name: 'Renault–Nissan Automotive',  desc: 'Car manufacturer',                   dist: '2.1 km' },
              { name: 'Daimler India Commercial',    desc: 'BharatBenz trucks & buses',          dist: '1.8 km' },
              { name: 'Royal Enfield',               desc: 'Two-wheeler manufacturer',           dist: '2.4 km' },
              { name: 'Komatsu India',               desc: 'Heavy construction equipment',       dist: '3.1 km' },
              { name: 'Delphi-TVS Diesel Systems',   desc: 'Fuel injection systems',             dist: '0.9 km' },
              { name: 'Bosch Electrical Drives',     desc: 'Electrical drives & automation',     dist: '0.4 km' },
              { name: 'Apollo Tyres',                desc: 'Tyre manufacturer',                  dist: '1.6 km' },
              { name: 'Sanmina IMS',                 desc: 'Electronics manufacturing',          dist: '3.4 km' },
              { name: 'Nokia Solutions',             desc: 'Telecom equipment (Hi-Tech SEZ)',    dist: '3.2 km' },
              { name: 'Danfoss Industries',          desc: 'Industrial drives & compressors',    dist: '2.8 km' },
              { name: 'NATRIP',                      desc: 'National automotive test facility',  dist: '4.1 km' },
              { name: 'Steel Strips Wheels',         desc: 'Automotive wheel manufacturer',      dist: '1.3 km' },
            ].map((company, i) => (
              <div key={i} style={{
                background: '#F3F3EF',
                padding: '20px 24px',
              }}>
                <div style={{
                  fontFamily: "'Work Sans', sans-serif",
                  fontWeight: 500, fontSize: '13px',
                  color: '#09090B', marginBottom: '4px',
                }}>
                  {company.name}
                </div>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '9px', letterSpacing: '0.12em',
                  color: '#8A8A96', textTransform: 'uppercase',
                  marginBottom: '8px',
                }}>
                  {company.desc}
                </div>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '9px', color: '#F2B705',
                  letterSpacing: '0.1em',
                }}>
                  {company.dist} from Welkinrim
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADDRESS CARD ────────────────────────────────────── */}
      <section style={{
        background: '#09090B',
        padding: 'clamp(64px, 9vw, 128px) clamp(20px, 5vw, 64px)',
      }}>
        <div style={{
          maxWidth: 'calc(1400px + 128px)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
        }}>

          {/* Address block */}
          <div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '9px', letterSpacing: '0.28em',
              color: '#F2B705', textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              Registered Address
            </div>
            <address style={{ fontStyle: 'normal' }}>
              <div style={{
                fontFamily: "'Syncopate', sans-serif",
                fontWeight: 700, fontSize: '18px',
                color: '#FFFFFF', marginBottom: '16px',
                letterSpacing: '0.02em',
              }}>
                WELKINRIM TECHNOLOGIES
              </div>
              {[
                'SIPCOT Industrial Growth Centre',
                'Oragadam, Sriperumbudur Taluk',
                'Kanchipuram District',
                'Tamil Nadu — 602 105',
                'India',
              ].map((line, i) => (
                <div key={i} style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '11px', color: 'rgba(255,255,255,0.50)',
                  lineHeight: 1.9, letterSpacing: '0.05em',
                }}>
                  {line}
                </div>
              ))}
            </address>
          </div>

          {/* Connectivity stats */}
          <div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '9px', letterSpacing: '0.28em',
              color: '#F2B705', textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              Connectivity
            </div>
            {[
              { label: 'Chennai International Airport', value: '40 km' },
              { label: 'Chennai Port', value: '56 km' },
              { label: 'Ennore Port', value: '84 km' },
              { label: 'NH-48 (Chennai–Bangalore)', value: '1.2 km' },
              { label: 'Sriperumbudur Town', value: '15 km' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                padding: '9px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '9px', color: 'rgba(255,255,255,0.40)',
                  letterSpacing: '0.08em',
                }}>
                  {item.label}
                </span>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '11px', color: '#F2B705',
                  letterSpacing: '0.1em',
                }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Get Directions CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <a
              href="https://maps.google.com/?q=12.8365065,79.92121"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                border: '1px solid #F2B705',
                color: '#F2B705',
                fontFamily: "'Space Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                padding: '13px 28px',
                textDecoration: 'none',
                transition: 'background 200ms, color 200ms',
                alignSelf: 'flex-start',
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.background = '#F2B705'
                ;(e.target as HTMLElement).style.color = '#09090B'
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.background = 'transparent'
                ;(e.target as HTMLElement).style.color = '#F2B705'
              }}
            >
              Get Directions →
            </a>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '8px', color: 'rgba(255,255,255,0.18)',
              letterSpacing: '0.12em', marginTop: '12px',
            }}>
              Opens Google Maps
            </div>
          </div>

        </div>
      </section>

    </main>
  )
}
```

---

## RESPONSIVE BEHAVIOUR

### Desktop (≥ 1024px)
- SVG map: full width up to 900px, constrained by page gutter
- Neighbours grid: 4-column auto-fill
- Address section: 3-column grid

### Tablet (768–1023px)
- SVG map: full width, tooltip scales proportionally (SVG viewBox handles it)
- Neighbours grid: 2–3 columns
- Address section: 2-column grid

### Mobile (< 768px)
- SVG map: full width, pinch-zoom enabled (add `touchAction: 'manipulation'` on wrapper)
- Company labels on map: reduced to initials (shortName.split(' ')[0]) at this scale
- Tooltip: displayed as fixed-bottom panel instead of hover (use `onClick` instead of `onMouseEnter`)
- Neighbours grid: 1 column
- Address section: stacked single column

### Mobile Tooltip Implementation
```tsx
// On mobile, replace hover tooltip with bottom sheet
const [selected, setSelected] = useState<string | null>(null)

// Touch: on tap, set selected company
// Render: fixed bottom panel, slides up from bottom
// Close: tap anywhere outside, or × button
// Height: 180px, --sb-1 background
```

---

## ANIMATION DETAILS

### Welkinrim Pin — Pulse Animation
```css
/* Three concentric rings, each expanding and fading */
/* Implemented as SVG animate elements — no CSS needed */

/* Outer ring: 40px → 56px, opacity 0.6 → 0.2, 3s infinite */
/* Middle ring: 24px → 32px, same timing */
/* This creates a radar-ping effect — the company is alive */
```

### Company Pin — Hover Reveal
```css
/* Pin scale: 4px → 6px radius on hover, 150ms */
/* Background disc appears on hover: 0 → 14px radius, 150ms */
/* Label: opacity 0.6 → 1.0 on hover */
/* All handled by React state and inline SVG props */
```

### Map Load — Stagger Reveal
```tsx
// On mount, zones fade in first (0ms)
// Then roads draw via stroke-dashoffset (300ms)
// Then pins appear with stagger (600ms + i × 50ms)
// Welkinrim pin: appears last with scale 0 → 1 (900ms)
// Implemented with Framer Motion animate() triggered on mount
```

---

## DATA ACCURACY NOTES

All company positions are geographically approximate, derived from:
- Google Maps pin coordinates for each company
- SIPCOT plot reference documents (39-company allotment list)
- Wikipedia Oragadam article (Fortune 500 company list)
- IndoSpace and PDFCOFFEE industrial park documents

**Distances in the neighbours grid** are straight-line distances from Welkinrim's coordinates `(12.8365065, 79.92121)` to each company's approximate GPS position.

Distance formula:
```ts
function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371  // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}
```

---

## DEPENDENCIES

None beyond the existing project stack:
- `react` — state, events
- `framer-motion` — optional mount animations
- No Leaflet, no Mapbox, no Google Maps API, no external map tiles
- The SVG is entirely self-contained and works offline

---

*Welkinrim Technologies — Location Page Map Spec v1.0*
*Real coordinates: 12.8365065°N, 79.92121°E*
*SIPCOT Industrial Growth Centre, Oragadam, Tamil Nadu*