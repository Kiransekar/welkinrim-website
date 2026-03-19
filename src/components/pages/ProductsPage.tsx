"use client";
import { useState, useMemo } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────
const MOTORS = [
  { model: "Haemng 2121 II", series: "Haemng", kv: "KV380", voltage: "6S", thrust: "1,200g", weight: 0.086, rpm: 12000, efficiency: 94.5, description: "Ultra-lightweight outrunner for sub-250g FPV racing drones and micro UAV platforms." },
  { model: "Haemng 4143 II", series: "Haemng", kv: "KV100", voltage: "12S", thrust: "18 kg", weight: 0.560, rpm: 8000, efficiency: 95.2, description: "High-performance eVTOL lift motor with integrated cooling duct design." },
  { model: "Haemng 8005",    series: "Haemng", kv: "KV230", voltage: "6S",  thrust: "3,700g", weight: 0.245, rpm: 10500, efficiency: 94.8, description: "Agricultural drone motor optimised for spray and spreading applications." },
  { model: "Haemng 7010",    series: "Haemng", kv: "KV150", voltage: "12S", thrust: "13 kg", weight: 0.468, rpm: 9000, efficiency: 95.6, description: "Heavy-lift cargo drone motor with reinforced shaft and bearings." },
  { model: "Haemng 1536",    series: "Haemng", kv: "KV80",  voltage: "24S", thrust: "44 kg", weight: 1.854, rpm: 6500, efficiency: 96.1, description: "eVTOL propulsion motor for manned and unmanned vertical lift applications." },
  { model: "Haemng 1550",    series: "Haemng", kv: "KV50",  voltage: "24S", thrust: "46 kg", weight: 2.250, rpm: 5500, efficiency: 96.4, description: "Ultra-high efficiency cruise motor for long-endurance eVTOL platforms." },
  { model: "Haemng 8808",    series: "Haemng", kv: "KV160", voltage: "6-12S", thrust: "6 kg", weight: 0.265, rpm: 11000, efficiency: 94.2, description: "Versatile multi-role motor for survey, inspection, and light transport drones." },
  { model: "Haemng 1015",    series: "Haemng", kv: "KV136", voltage: "12S", thrust: "18 kg", weight: 0.636, rpm: 8500, efficiency: 95.8, description: "Premium eVTOL motor with redundant winding configuration for safety-critical applications." },
  { model: "Maelard 1026",   series: "Maelard", kv: "KV100", voltage: "12-14S", thrust: "35 kg", weight: 0.850, rpm: 7500, efficiency: 96.2, description: "Heavy-lift propulsion system for cargo UAV and aerial work platforms." },
  { model: "Maelard 1240",   series: "Maelard", kv: "KV60",  voltage: "12S",    thrust: "43 kg", weight: 1.280, rpm: 6000, efficiency: 96.5, description: "High-altitude operation motor with enhanced thermal management." },
  { model: "Maelard 1560",   series: "Maelard", kv: "KV36",  voltage: "14-28S", thrust: "73 kg", weight: 2.320, rpm: 4500, efficiency: 96.8, description: "Industrial-grade motor for heavy-lift UAV and prototype eVTOL aircraft." },
  { model: "Maelard 1780",   series: "Maelard", kv: "KV48",  voltage: "14-28S", thrust: "79 kg", weight: 3.509, rpm: 5000, efficiency: 97.1, description: "Flagship propulsion motor for certification-ready eVTOL and unmanned cargo aircraft." },
];

// ─── SVG Motor Illustrations ────────────────────────────────────────────────
function HaemngMotorSVG() {
  return (
    <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="h-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#0d2340" />
        </linearGradient>
        <linearGradient id="h-shaft" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c8d0dc" />
          <stop offset="100%" stopColor="#8896a8" />
        </linearGradient>
        <linearGradient id="h-coil" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b5600a" />
          <stop offset="50%" stopColor="#e07e1a" />
          <stop offset="100%" stopColor="#b5600a" />
        </linearGradient>
        <radialGradient id="h-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b8fef" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3b8fef" stopOpacity="0" />
        </radialGradient>
        <filter id="h-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#3b8fef" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Ambient glow */}
      <ellipse cx="100" cy="140" rx="70" ry="55" fill="url(#h-glow)" />

      {/* Shaft top cap */}
      <ellipse cx="100" cy="52" rx="14" ry="5" fill="#c8d0dc" />
      <rect x="86" y="52" width="28" height="34" fill="url(#h-shaft)" rx="2" />
      <ellipse cx="100" cy="86" rx="14" ry="5" fill="#a0aab8" />

      {/* Motor body top rim */}
      <ellipse cx="100" cy="86" rx="52" ry="13" fill="#2a4a6e" filter="url(#h-shadow)" />

      {/* Motor body cylinder */}
      <rect x="48" y="86" width="104" height="98" fill="url(#h-body)" rx="0" />

      {/* Winding coil layers */}
      {[100, 114, 128, 142, 156, 170].map((y, i) => (
        <ellipse key={i} cx="100" cy={y} rx="46" ry="11"
          fill="url(#h-coil)" opacity={i % 2 === 0 ? 0.92 : 0.72}
          stroke="#8a4400" strokeWidth="0.4" />
      ))}

      {/* Ventilation grooves */}
      {[95, 109, 123, 137, 151, 165, 179].map((y, i) => (
        <rect key={i} x="50" y={y} width="100" height="1.5" fill="#0d1f35" opacity="0.6" />
      ))}

      {/* Motor body bottom rim */}
      <ellipse cx="100" cy="184" rx="52" ry="13" fill="#0d2340" />

      {/* Mounting tabs */}
      {[-1, 1].map((side, i) => (
        <g key={i}>
          <rect x={side === -1 ? 30 : 142} y="148" width="22" height="10" rx="2"
            fill="#162c4a" stroke="#3b8fef" strokeWidth="0.6" />
          <circle cx={side === -1 ? 41 : 153} cy="153" r="3"
            fill="#0a1a2e" stroke="#3b8fef" strokeWidth="0.8" />
        </g>
      ))}

      {/* Accent stripe */}
      <rect x="48" y="133" width="104" height="2" fill="#3b8fef" opacity="0.5" />

      {/* Label */}
      <rect x="68" y="192" width="64" height="16" rx="2" fill="#0d2340" />
      <text x="100" y="204" textAnchor="middle" fill="#3b8fef"
        fontSize="8" fontFamily="monospace" fontWeight="700" letterSpacing="2">HAEMNG</text>
    </svg>
  );
}

function MaelardMotorSVG() {
  return (
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="m-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2a1f45" />
          <stop offset="100%" stopColor="#150f28" />
        </linearGradient>
        <linearGradient id="m-shaft" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#b8b0d0" />
          <stop offset="100%" stopColor="#7870a0" />
        </linearGradient>
        <linearGradient id="m-coil" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9a4800" />
          <stop offset="50%" stopColor="#c86010" />
          <stop offset="100%" stopColor="#9a4800" />
        </linearGradient>
        <radialGradient id="m-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8866cc" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8866cc" stopOpacity="0" />
        </radialGradient>
        <filter id="m-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#8866cc" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Ambient glow - larger for heavy-duty */}
      <ellipse cx="100" cy="155" rx="85" ry="65" fill="url(#m-glow)" />

      {/* Heavy shaft */}
      <ellipse cx="100" cy="48" rx="17" ry="6" fill="#c0b8dc" />
      <rect x="83" y="48" width="34" height="38" fill="url(#m-shaft)" rx="2" />
      <ellipse cx="100" cy="86" rx="17" ry="6" fill="#9890b8" />

      {/* Motor body top rim - wider */}
      <ellipse cx="100" cy="86" rx="64" ry="16" fill="#3a2860" filter="url(#m-shadow)" />

      {/* Motor body cylinder - taller */}
      <rect x="36" y="86" width="128" height="118" fill="url(#m-body)" />

      {/* Heavy-duty winding coils */}
      {[100, 116, 132, 148, 164, 180, 196].map((y, i) => (
        <ellipse key={i} cx="100" cy={y} rx="58" ry="13"
          fill="url(#m-coil)" opacity={i % 2 === 0 ? 0.9 : 0.68}
          stroke="#7a3500" strokeWidth="0.4" />
      ))}

      {/* Cooling fins */}
      {[93, 108, 123, 138, 153, 168, 183, 198].map((y, i) => (
        <rect key={i} x="38" y={y} width="124" height="1.5" fill="#0f0820" opacity="0.55" />
      ))}

      {/* Motor body bottom rim */}
      <ellipse cx="100" cy="204" rx="64" ry="16" fill="#150f28" />

      {/* Heavy mounting bolts — 5-point */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 100 + Math.cos(rad) * 54;
        const y = 155 + Math.sin(rad) * 22;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="7" fill="#1a1230" stroke="#8866cc" strokeWidth="1" />
            <circle cx={x} cy={y} r="3.5" fill="#0a0818" stroke="#6644aa" strokeWidth="0.5" />
          </g>
        );
      })}

      {/* Accent stripes */}
      <rect x="36" y="148" width="128" height="2.5" fill="#8866cc" opacity="0.55" />
      <rect x="36" y="153" width="128" height="1" fill="#8866cc" opacity="0.28" />

      {/* Label */}
      <rect x="62" y="213" width="76" height="18" rx="2" fill="#150f28" />
      <text x="100" y="225" textAnchor="middle" fill="#8866cc"
        fontSize="8" fontFamily="monospace" fontWeight="700" letterSpacing="2">MAELARD</text>
    </svg>
  );
}

// ─── Efficiency Bar ──────────────────────────────────────────────────────────
function EffBar({ value, color }) {
  const pct = Math.max(0, Math.min(100, ((value - 80) / 20) * 100));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontFamily: "monospace", fontSize: 13, color: color, fontWeight: 700 }}>
        {value}%
      </span>
      <div style={{
        flex: 1, height: 3, background: "rgba(255,255,255,0.1)",
        borderRadius: 99, overflow: "hidden"
      }}>
        <div style={{
          width: `${pct}%`, height: "100%", borderRadius: 99,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          boxShadow: `0 0 8px ${color}66`,
          transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)"
        }} />
      </div>
    </div>
  );
}

// ─── Motor Card ──────────────────────────────────────────────────────────────
function MotorCard({ motor, onClick }) {
  const [hovered, setHovered] = useState(false);
  const isHaemng = motor.series === "Haemng";
  const accent = isHaemng ? "#3b8fef" : "#8866cc";

  return (
    <div
      onClick={() => onClick(motor)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(145deg, #101018, #18141f)`
          : "linear-gradient(145deg, #0d0d14, #141018)",
        border: `1px solid ${hovered ? accent : "rgba(255,255,255,0.07)"}`,
        borderRadius: 8,
        padding: "20px 20px 16px",
        cursor: "pointer",
        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: hovered
          ? `0 0 0 1px ${accent}22, 0 16px 48px ${accent}22, 0 4px 16px rgba(0,0,0,0.5)`
          : "0 2px 12px rgba(0,0,0,0.4)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Corner accent */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 60, height: 60,
        background: `radial-gradient(circle at top right, ${accent}18, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Series badge */}
      <div style={{ marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em",
          textTransform: "uppercase", color: accent,
          border: `1px solid ${accent}55`,
          padding: "3px 8px", borderRadius: 3,
          background: `${accent}0f`,
        }}>
          {motor.series}
        </span>
        <span style={{
          fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.12em"
        }}>
          {motor.voltage}
        </span>
      </div>

      {/* Motor illustration */}
      <div style={{
        width: "100%", height: 140,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 16,
        filter: hovered ? `drop-shadow(0 0 16px ${accent}44)` : "none",
        transition: "filter 0.35s ease",
        transform: hovered ? "scale(1.04)" : "scale(1)",
      }}>
        {isHaemng ? <HaemngMotorSVG /> : <MaelardMotorSVG />}
      </div>

      {/* Model name */}
      <div style={{
        fontFamily: "monospace", fontSize: 15, fontWeight: 700,
        color: hovered ? accent : "#e8eaf0",
        letterSpacing: "0.04em", marginBottom: 14,
        transition: "color 0.25s ease",
      }}>
        {motor.model}
      </div>

      {/* Specs grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 8, marginBottom: 14,
      }}>
        {[
          { label: "THRUST",  value: motor.thrust },
          { label: "WEIGHT",  value: `${motor.weight} kg` },
          { label: "KV",      value: motor.kv },
          { label: "RPM",     value: motor.rpm.toLocaleString() },
        ].map(spec => (
          <div key={spec.label} style={{
            background: "rgba(255,255,255,0.04)",
            borderRadius: 4, padding: "8px 10px",
          }}>
            <div style={{
              fontFamily: "monospace", fontSize: 8, letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 4,
            }}>
              {spec.label}
            </div>
            <div style={{
              fontFamily: "monospace", fontSize: 12, fontWeight: 700,
              color: "#e0e4ec",
            }}>
              {spec.value}
            </div>
          </div>
        ))}
      </div>

      {/* Efficiency */}
      <div style={{
        background: "rgba(255,255,255,0.03)", borderRadius: 4,
        padding: "8px 10px", marginBottom: 16,
      }}>
        <div style={{
          fontFamily: "monospace", fontSize: 8, letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 6,
        }}>
          PEAK EFFICIENCY
        </div>
        <EffBar value={motor.efficiency} color={accent} />
      </div>

      {/* CTA */}
      <button style={{
        width: "100%", fontFamily: "monospace", fontSize: 9,
        letterSpacing: "0.22em", textTransform: "uppercase",
        border: `1px solid ${hovered ? accent : "rgba(255,255,255,0.15)"}`,
        color: hovered ? accent : "rgba(255,255,255,0.5)",
        background: hovered ? `${accent}0f` : "transparent",
        padding: "10px 0", borderRadius: 4, cursor: "pointer",
        transition: "all 0.25s ease",
      }}>
        VIEW SPECS →
      </button>
    </div>
  );
}

// ─── Detail Panel ────────────────────────────────────────────────────────────
function DetailPanel({ motor, onClose }) {
  if (!motor) return null;
  const isHaemng = motor.series === "Haemng";
  const accent = isHaemng ? "#3b8fef" : "#8866cc";

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "flex-end",
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
        }}
      />
      <div style={{
        position: "relative", zIndex: 1, width: "100%",
        background: "linear-gradient(180deg, #0f0f18, #090910)",
        borderTop: `1px solid ${accent}44`,
        boxShadow: `0 -16px 64px ${accent}22, 0 -4px 24px rgba(0,0,0,0.8)`,
        padding: "32px 40px",
        animation: "slideUp 0.45s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <style>{`@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <h3 style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 700, color: "#e8eaf0", margin: 0 }}>
                {motor.model}
              </h3>
              <span style={{
                fontFamily: "monospace", fontSize: 8, letterSpacing: "0.2em",
                textTransform: "uppercase", color: accent,
                border: `1px solid ${accent}55`, padding: "3px 8px", borderRadius: 3,
                background: `${accent}0f`,
              }}>{motor.series}</span>
            </div>
            <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", margin: 0, maxWidth: 500, lineHeight: 1.6 }}>
              {motor.description}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)",
            fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>×</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "KV Rating", value: motor.kv },
            { label: "Voltage",   value: motor.voltage },
            { label: "Thrust",    value: motor.thrust },
            { label: "Weight",    value: `${motor.weight} kg` },
            { label: "Max RPM",   value: motor.rpm.toLocaleString() },
            { label: "Peak η",    value: `${motor.efficiency}%`, highlight: true },
          ].map((s, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "12px 14px",
              border: s.highlight ? `1px solid ${accent}33` : "1px solid rgba(255,255,255,0.05)",
            }}>
              <div style={{ fontFamily: "monospace", fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 6 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: s.highlight ? accent : "#e0e4ec" }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button style={{
            fontFamily: "monospace", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
            border: `1px solid ${accent}`, color: accent, background: `${accent}12`,
            padding: "12px 24px", borderRadius: 4, cursor: "pointer",
          }}>REQUEST DATASHEET</button>
          <button style={{
            fontFamily: "monospace", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
            border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", background: "transparent",
            padding: "12px 24px", borderRadius: 4, cursor: "pointer",
          }}>GET QUOTE →</button>
        </div>
      </div>
    </div>
  );
}

// ─── Filter Pill ─────────────────────────────────────────────────────────────
function FilterPill({ label, value, active, onClick }) {
  const colors = { ALL: "#f2b705", Haemng: "#3b8fef", Maelard: "#8866cc" };
  const c = colors[value];
  return (
    <button
      onClick={() => onClick(value)}
      style={{
        fontFamily: "monospace", fontSize: 9, letterSpacing: "0.22em",
        textTransform: "uppercase", padding: "8px 18px", borderRadius: 4,
        border: `1px solid ${active ? c : "rgba(255,255,255,0.1)"}`,
        color: active ? "#0d0d14" : "rgba(255,255,255,0.4)",
        background: active ? c : "transparent",
        cursor: "pointer", transition: "all 0.25s ease",
        boxShadow: active ? `0 0 20px ${c}44` : "none",
      }}
    >
      {label}
    </button>
  );
}

// ─── Sort Header ─────────────────────────────────────────────────────────────
function Th({ children, col, sortKey, sortDir, onSort }) {
  const active = sortKey === col;
  return (
    <th
      onClick={() => onSort(col)}
      style={{
        fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em",
        textTransform: "uppercase", textAlign: "left",
        padding: "12px 16px", cursor: "pointer", userSelect: "none",
        color: active ? "#f2b705" : "rgba(255,255,255,0.3)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
      {active && <span style={{ marginLeft: 4 }}>{sortDir === "asc" ? "▲" : "▼"}</span>}
    </th>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export function ProductsPage() {
  const [filter, setFilter]         = useState("ALL");
  const [sortKey, setSortKey]       = useState("model");
  const [sortDir, setSortDir]       = useState("asc");
  const [selected, setSelected]     = useState(null);
  const [view, setView]             = useState("grid"); // "grid" | "table"

  const filtered = useMemo(() => {
    const list = filter === "ALL" ? MOTORS : MOTORS.filter(m => m.series === filter);
    return [...list].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [filter, sortKey, sortDir]);

  const toggleSort = key => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #07070f 0%, #0c0b15 50%, #07070f 100%)",
      color: "#e8eaf0",
      fontFamily: "system-ui, sans-serif",
      padding: "0 0 80px",
    }}>

      {/* ── Header ── */}
      <div style={{
        padding: "80px 48px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        marginBottom: 48,
      }}>
        <div style={{
          fontFamily: "monospace", fontSize: 10, letterSpacing: "0.3em",
          textTransform: "uppercase", color: "#f2b705", marginBottom: 16,
        }}>
          ◆ MOTOR CATALOGUE
        </div>
        <h1 style={{
          fontFamily: "monospace", fontSize: "clamp(40px, 7vw, 96px)",
          fontWeight: 900, lineHeight: 0.88,
          color: "#e8eaf0", letterSpacing: "-0.02em", margin: "0 0 40px",
        }}>
          PRODUCTS
        </h1>

        {/* Controls */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          justifyContent: "space-between", alignItems: "center",
          gap: 16, paddingBottom: 32,
        }}>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { v: "ALL",     l: "ALL" },
              { v: "Haemng",  l: "HAEMNG" },
              { v: "Maelard", l: "MAELARD" },
            ].map(f => (
              <FilterPill key={f.v} value={f.v} label={f.l}
                active={filter === f.v} onClick={setFilter} />
            ))}
          </div>

          {/* View toggle */}
          <div style={{
            display: "flex", gap: 4,
            background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: 4,
          }}>
            {[["grid","⊞ GRID"],["table","☰ TABLE"]].map(([v,l]) => (
              <button key={v} onClick={() => setView(v)} style={{
                fontFamily: "monospace", fontSize: 9, letterSpacing: "0.16em",
                padding: "6px 14px", borderRadius: 4, border: "none", cursor: "pointer",
                background: view === v ? "rgba(255,255,255,0.1)" : "transparent",
                color: view === v ? "#e8eaf0" : "rgba(255,255,255,0.3)",
                transition: "all 0.2s",
              }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "0 48px" }}>

        {/* ── Grid View ── */}
        {view === "grid" && (
          <>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 16, marginBottom: 16,
            }}>
              {filtered.map(m => (
                <MotorCard key={m.model} motor={m} onClick={setSelected} />
              ))}
            </div>
            <p style={{
              fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.1em", textAlign: "right", marginTop: 8,
            }}>
              {filtered.length} MOTORS — CLICK ANY CARD TO VIEW FULL SPECS
            </p>
          </>
        )}

        {/* ── Table View ── */}
        {view === "table" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  {[
                    { k: "model",      l: "MODEL" },
                    { k: null,         l: "SERIES" },
                    { k: "kv",         l: "KV" },
                    { k: "voltage",    l: "VOLTAGE" },
                    { k: "thrust",     l: "THRUST" },
                    { k: "weight",     l: "WEIGHT" },
                    { k: "rpm",        l: "RPM" },
                    { k: "efficiency", l: "PEAK η" },
                  ].map((col, i) => col.k
                    ? <Th key={i} col={col.k} sortKey={sortKey} sortDir={sortDir} onSort={toggleSort}>{col.l}</Th>
                    : <th key={i} style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", textAlign: "left", padding: "12px 16px", color: "rgba(255,255,255,0.3)" }}>{col.l}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const accent = m.series === "Haemng" ? "#3b8fef" : "#8866cc";
                  return (
                    <tr
                      key={m.model}
                      onClick={() => setSelected(m)}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = `${accent}0a`}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#e0e4ec", padding: "14px 16px" }}>{m.model}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontFamily: "monospace", fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase", color: accent, border: `1px solid ${accent}55`, padding: "3px 8px", borderRadius: 3 }}>
                          {m.series}
                        </span>
                      </td>
                      <td style={{ fontFamily: "monospace", fontSize: 13, color: "#a0a8b8", padding: "14px 16px" }}>{m.kv}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 13, color: "#a0a8b8", padding: "14px 16px" }}>{m.voltage}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 13, color: "#a0a8b8", padding: "14px 16px" }}>{m.thrust}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 13, color: "#a0a8b8", padding: "14px 16px" }}>{m.weight} kg</td>
                      <td style={{ fontFamily: "monospace", fontSize: 13, color: "#a0a8b8", padding: "14px 16px" }}>{m.rpm.toLocaleString()}</td>
                      <td style={{ padding: "14px 16px" }}><EffBar value={m.efficiency} color={accent} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Detail Panel ── */}
      {selected && <DetailPanel motor={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}