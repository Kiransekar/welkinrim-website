"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { RevealWrapper } from "@/components/RevealWrapper";
import { SectionOverline } from "@/components/SectionOverline";
import { ANSYSFrame } from "@/components/ANSYSFrame";

/* ── Oscilloscope Canvas ── */
function Oscilloscope() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const [active, setActive] = useState(false);
  const [speed, setSpeed] = useState(3000);
  const [load, setLoad] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => setActive(true), 600);
      return () => clearTimeout(timeout);
    } else {
      setActive(false);
    }
  }, [isInView]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const t = performance.now() / 1000;
    const freq = speed / 60;
    const loadFactor = load / 100;
    const phaseShift = loadFactor * 18 * (Math.PI / 180);

    ctx.fillStyle = "#050508";
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 20) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 20) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Center line
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();

    if (!active) {
      ctx.fillStyle = "rgba(255,255,255,0.24)";
      ctx.font = "12px 'Space Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("SYSTEM STANDBY", w / 2, h / 2);
      return;
    }

    const phases = [
      { offset: 0 + phaseShift, color: "#3B8FEF", label: "A" },
      { offset: (2 * Math.PI) / 3, color: "#F2B705", label: "B" },
      { offset: (4 * Math.PI) / 3, color: "#FF4444", label: "C" },
    ];

    const amplitude = (h * 0.35) * (1 - loadFactor * 0.15);

    phases.forEach((phase) => {
      ctx.strokeStyle = phase.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const xNorm = x / w;
        let y = Math.sin(2 * Math.PI * freq * (t - xNorm * 2) + phase.offset) * amplitude;
        // 5th harmonic on Phase A at high load
        if (phase.label === "A" && loadFactor > 0.8) {
          y += Math.sin(10 * Math.PI * freq * (t - xNorm * 2)) * amplitude * 0.06 * loadFactor;
        }
        const py = h / 2 - y;
        if (x === 0) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }
      ctx.stroke();
    });

    // Scan cursor
    const scanX = ((t * 60) % w);
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(scanX, 0); ctx.lineTo(scanX, h); ctx.stroke();
  }, [active, speed, load]);

  useEffect(() => {
    let running = true;
    const loop = () => {
      draw();
      if (running) rafRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, [draw]);

  return (
    <div ref={containerRef}>
      <ANSYSFrame
        title="Field-Oriented Control — 3-Phase Waveform"
        colorbarMax="+400"
        colorbarMin="−400"
        colorbarUnit="V"
      >
        <div className="flex flex-col gap-4">
          <canvas
            ref={canvasRef}
            width={600}
            height={240}
            className="w-full h-[200px] lg:h-[240px] rounded-[2px]"
            aria-label="Interactive three-phase motor drive waveform"
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="font-mono text-[9px] tracking-[0.22em] uppercase text-[rgba(255,255,255,0.35)] block mb-2">
                SPEED: <span className="text-white">{speed.toLocaleString()} RPM</span>
              </label>
              <input
                type="range"
                min={1000}
                max={12000}
                step={100}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-y h-[2px] bg-sb-3 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-y [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>
            <div className="flex-1">
              <label className="font-mono text-[9px] tracking-[0.22em] uppercase text-[rgba(255,255,255,0.35)] block mb-2">
                LOAD: <span className="text-white">{load}%</span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={load}
                onChange={(e) => setLoad(Number(e.target.value))}
                className="w-full accent-y h-[2px] bg-sb-3 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-y [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>
          </div>
          <div className="flex gap-6">
            <span className="flex items-center gap-2 font-mono text-[9px] text-[rgba(255,255,255,0.5)]">
              <span className="w-3 h-[2px] bg-[#3B8FEF] inline-block" /> PHASE A
            </span>
            <span className="flex items-center gap-2 font-mono text-[9px] text-[rgba(255,255,255,0.5)]">
              <span className="w-3 h-[2px] bg-[#F2B705] inline-block" /> PHASE B
            </span>
            <span className="flex items-center gap-2 font-mono text-[9px] text-[rgba(255,255,255,0.5)]">
              <span className="w-3 h-[2px] bg-[#FF4444] inline-block" /> PHASE C
            </span>
          </div>
        </div>
      </ANSYSFrame>
    </div>
  );
}

/* ── Thermal Section (Scroll-Driven) ── */
function ThermalSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const temp = useTransform(scrollYProgress, [0, 1], [25, 218]);
  const [currentTemp, setCurrentTemp] = useState(25);
  const [sp, setSp] = useState(0);

  useEffect(() => {
    const unsub = temp.on("change", (v) => setCurrentTemp(Math.round(v)));
    const unsub2 = scrollYProgress.on("change", (v) => setSp(v));
    return () => { unsub(); unsub2(); };
  }, [temp, scrollYProgress]);

  const zones = [
    { name: "Shaft Core", range: [0, 0.28], hotColor: "#FF0000" },
    { name: "Magnets", range: [0.15, 0.45], hotColor: "#FF4400" },
    { name: "Stator Core", range: [0.28, 0.58], hotColor: "#FF7700" },
    { name: "Winding Slots", range: [0.44, 0.73], hotColor: "#FF9900" },
    { name: "End Windings", range: [0.58, 0.94], hotColor: "#FF1100" },
  ];

  return (
    <div ref={ref} className="relative" style={{ height: "250vh" }}>
      <div className="sticky top-0 h-screen flex items-center">
        <div className="page-gutter w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <SectionOverline text="02 — THERMAL ANALYSIS" variant="dark" />
              <h3 className="font-syncopate font-bold text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-white mb-4">
                THERMAL
              </h3>
              <p className="font-work text-[clamp(13px,1.1vw,15px)] leading-[1.72] text-[rgba(255,255,255,0.62)] max-w-[440px] mb-6">
                Five thermal zones propagate heat from shaft core to end windings as the motor
                loads increase. Scroll to observe the thermal propagation sequence.
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-mono text-[36px] text-white font-bold">{currentTemp}</span>
                <span className="font-mono text-[14px] text-[rgba(255,255,255,0.5)]">°C</span>
              </div>
              <div className="flex flex-col gap-2">
                {zones.map((zone) => {
                  const progress = Math.max(0, Math.min(1,
                    (sp - zone.range[0]) / (zone.range[1] - zone.range[0])
                  ));
                  return (
                    <div key={zone.name} className="flex items-center gap-3">
                      <div className="w-24 font-mono text-[9px] tracking-[0.18em] uppercase text-[rgba(255,255,255,0.35)]">
                        {zone.name}
                      </div>
                      <div className="flex-1 h-[4px] bg-sb-3 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            width: `${progress * 100}%`,
                            background: `linear-gradient(90deg, #001f5e, ${zone.hotColor})`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="lg:col-span-7">
              <ANSYSFrame
                title="Thermal Analysis"
                colorbarMax="218"
                colorbarMin="25"
                colorbarUnit="°C"
              >
                <div className="flex items-center justify-center h-[300px] lg:h-[400px]">
                  <svg viewBox="0 0 300 300" className="w-[220px] h-[220px] lg:w-[300px] lg:h-[300px]">
                    {/* End windings outer */}
                    <circle cx="150" cy="150" r="140" fill={`color-mix(in srgb, #001f5e, #FF1100 ${Math.max(0, Math.min(100, ((sp - 0.58) / 0.36) * 100))}%)`} opacity="0.6" />
                    {/* Winding slots */}
                    <circle cx="150" cy="150" r="115" fill={`color-mix(in srgb, #001f5e, #FF9900 ${Math.max(0, Math.min(100, ((sp - 0.44) / 0.29) * 100))}%)`} opacity="0.7" />
                    {/* Stator core */}
                    <circle cx="150" cy="150" r="90" fill={`color-mix(in srgb, #001f5e, #FF7700 ${Math.max(0, Math.min(100, ((sp - 0.28) / 0.30) * 100))}%)`} opacity="0.8" />
                    {/* Magnets */}
                    <circle cx="150" cy="150" r="60" fill={`color-mix(in srgb, #001f5e, #FF4400 ${Math.max(0, Math.min(100, ((sp - 0.15) / 0.30) * 100))}%)`} opacity="0.85" />
                    {/* Shaft core */}
                    <circle cx="150" cy="150" r="30" fill={`color-mix(in srgb, #001f5e, #FF0000 ${Math.max(0, Math.min(100, (sp / 0.28) * 100))}%)`} opacity="0.9" />
                    <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    {/* Zone ring labels */}
                    <text x="150" y="18" textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize="5" fontFamily="Space Mono">END WINDINGS</text>
                    <text x="150" y="42" textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize="5" fontFamily="Space Mono">WINDING SLOTS</text>
                    <text x="150" y="67" textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize="5" fontFamily="Space Mono">STATOR CORE</text>
                    <text x="150" y="96" textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize="5" fontFamily="Space Mono">MAGNETS</text>
                    <text x="150" y="146" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="5" fontFamily="Space Mono">SHAFT</text>
                    {/* Heat shimmer rings — pulsing at high temp */}
                    {sp > 0.5 && (
                      <>
                        <circle cx="150" cy="150" r="145" fill="none" stroke="rgba(255,17,0,0.06)" strokeWidth="1">
                          <animate attributeName="r" values="142;148;142" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
                        </circle>
                      </>
                    )}
                  </svg>
                </div>
              </ANSYSFrame>
              {currentTemp >= 210 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 flex items-center gap-2"
                >
                  <div className="w-8 h-[1px] bg-[#FF1100]" />
                  <span className="font-mono text-[11px] text-[#FF4444]">
                    Peak Hotspot: 218°C — End Winding Region
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Flux Density SVG ── */
function FluxDensityVisual() {
  return (
    <ANSYSFrame title="Electromagnetic Flux Density" colorbarMax="2200" colorbarMin="660" colorbarUnit="mT">
      <div className="flex items-center justify-center h-[280px] lg:h-[380px]">
        <svg viewBox="0 0 300 300" className="w-[220px] h-[220px] lg:w-[280px] lg:h-[280px]">
          <defs>
            <filter id="slot-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Outer housing */}
          <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          {/* Stator back-iron */}
          <circle cx="150" cy="150" r="135" fill="#111116" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          <circle cx="150" cy="150" r="125" fill="#16161A" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          {/* Stator teeth (24 teeth) */}
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (360 / 24) * i;
            const rad = (angle * Math.PI) / 180;
            return (
              <line key={`tooth-${i}`}
                x1={150 + Math.cos(rad) * 82} y1={150 + Math.sin(rad) * 82}
                x2={150 + Math.cos(rad) * 125} y2={150 + Math.sin(rad) * 125}
                stroke="rgba(255,255,255,0.06)" strokeWidth="2"
              />
            );
          })}
          {/* Slot fills — 12 slots with colour based on flux density */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (360 / 12) * i;
            const rad = (angle * Math.PI) / 180;
            const x = 150 + Math.cos(rad) * 105;
            const y = 150 + Math.sin(rad) * 105;
            const hue = (i * 30) % 360;
            return (
              <circle key={i} cx={x} cy={y} r="14"
                fill={`hsl(${hue}, 85%, 55%)`} opacity="0.75"
                filter="url(#slot-glow)"
              >
                <animate attributeName="opacity" values="0.6;0.85;0.6" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
            );
          })}
          {/* Air gap */}
          <circle cx="150" cy="150" r="78" fill="#0F0F12" stroke="rgba(242,183,5,0.06)" strokeWidth="0.5" strokeDasharray="2 3" />
          {/* Rotor (rotates) */}
          <g style={{ transformOrigin: "150px 150px", animation: "fluxRotor 12s linear infinite" }}>
            {/* Magnets — 8 pole pairs */}
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (360 / 8) * i;
              const rad = (angle * Math.PI) / 180;
              const isN = i % 2 === 0;
              return (
                <g key={`mag-${i}`}>
                  <rect
                    x={150 + Math.cos(rad) * 58 - 8} y={150 + Math.sin(rad) * 58 - 14}
                    width="16" height="28" rx="2"
                    fill={isN ? "#FF2200" : "#0066FF"} opacity="0.6"
                    transform={`rotate(${angle} ${150 + Math.cos(rad) * 58} ${150 + Math.sin(rad) * 58})`}
                  />
                </g>
              );
            })}
            {/* Rotor core */}
            <circle cx="150" cy="150" r="40" fill="#1E1E24" />
            <circle cx="150" cy="150" r="22" fill="#2A2A32" />
            <circle cx="150" cy="150" r="10" fill="#09090B" />
          </g>
          {/* Flux lines (animated dash) */}
          {Array.from({ length: 16 }, (_, i) => {
            const angle = (360 / 16) * i;
            const rad = (angle * Math.PI) / 180;
            const dur = [7, 11, 13, 17, 19, 23, 29, 31, 7, 11, 13, 17, 19, 23, 29, 31][i];
            return (
              <line key={`flux-${i}`}
                x1={150 + Math.cos(rad) * 80} y1={150 + Math.sin(rad) * 80}
                x2={150 + Math.cos(rad) * 124} y2={150 + Math.sin(rad) * 124}
                stroke="#F2B705" strokeWidth="0.5" opacity="0.3"
                strokeDasharray="3 4"
                style={{ animation: `fieldDrift ${dur}s linear infinite` }}
              />
            );
          })}
        </svg>
      </div>
      <style jsx>{`
        @keyframes fieldDrift {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -28; }
        }
        @keyframes fluxRotor {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </ANSYSFrame>
  );
}

/* ── Efficiency Map SVG ── */
function EfficiencyMapVisual() {
  const contours = [
    { eff: 96, scale: 1.0, opacity: 0.5 },
    { eff: 94, scale: 0.85, opacity: 0.42 },
    { eff: 92, scale: 0.70, opacity: 0.34 },
    { eff: 90, scale: 0.55, opacity: 0.26 },
    { eff: 85, scale: 0.40, opacity: 0.18 },
  ];

  return (
    <ANSYSFrame title="Efficiency Map — Speed vs Torque Plane" colorbarMax="" colorbarMin="">
      <div className="flex items-center justify-center h-[280px] lg:h-[380px] relative">
        <svg viewBox="0 0 400 300" className="w-full h-full max-w-[400px]">
          {/* Grid lines */}
          {[100, 150, 200, 250, 300, 350].map((x) => (
            <line key={`gx-${x}`} x1={x} y1="20" x2={x} y2="260" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          ))}
          {[60, 100, 140, 180, 220].map((y) => (
            <line key={`gy-${y}`} x1="50" y1={y} x2="380" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          ))}

          {/* Axes */}
          <line x1="50" y1="260" x2="380" y2="260" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1="50" y1="20" x2="50" y2="260" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

          {/* Axis tick marks */}
          {[2000, 4000, 6000, 8000, 10000, 12000].map((rpm, i) => {
            const x = 50 + ((i + 1) / 7) * 330;
            return (
              <g key={`xt-${rpm}`}>
                <line x1={x} y1="260" x2={x} y2="265" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                <text x={x} y="275" fill="rgba(255,255,255,0.25)" fontSize="6" fontFamily="Space Mono" textAnchor="middle">{rpm / 1000}k</text>
              </g>
            );
          })}
          {[20, 40, 60, 80, 100].map((nm, i) => {
            const y = 260 - ((i + 1) / 6) * 240;
            return (
              <g key={`yt-${nm}`}>
                <line x1="45" y1={y} x2="50" y2={y} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                <text x="42" y={y + 3} fill="rgba(255,255,255,0.25)" fontSize="6" fontFamily="Space Mono" textAnchor="end">{nm}</text>
              </g>
            );
          })}

          <text x="210" y="290" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="Space Mono" textAnchor="middle">SPEED (RPM)</text>
          <text x="15" y="140" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="Space Mono" textAnchor="middle" transform="rotate(-90 15 140)">TORQUE (Nm)</text>

          {/* Efficiency contours — staggered reveal */}
          {contours.map((c, i) => (
            <motion.g key={c.eff}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
              viewport={{ once: true }}
              style={{ transformOrigin: "210px 140px" }}
            >
              <ellipse cx={210} cy={140} rx={150 * c.scale} ry={100 * c.scale}
                fill={`rgba(242,183,5,${c.opacity * 0.06})`}
                stroke={`rgba(242,183,5,${c.opacity})`}
                strokeWidth="1"
                strokeDasharray={i > 2 ? "4 4" : "none"}
              />
              <text x={210 + 150 * c.scale + 4} y={140}
                fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="Space Mono"
              >{c.eff}%</text>
            </motion.g>
          ))}

          {/* MTPA curve */}
          <motion.path
            d="M 80 240 Q 140 160 190 120 T 340 55"
            fill="none" stroke="rgba(59,143,239,0.35)" strokeWidth="1" strokeDasharray="3 3"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          />
          <motion.text x="345" y="52"
            fill="rgba(59,143,239,0.5)" fontSize="6" fontFamily="Space Mono"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ delay: 2 }} viewport={{ once: true }}
          >MTPA</motion.text>

          {/* Operating point — pulsing */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.0, type: "spring", stiffness: 200 }}
            viewport={{ once: true }}
            style={{ transformOrigin: "190px 120px" }}
          >
            <circle cx="190" cy="120" r="12" fill="rgba(242,183,5,0.08)" stroke="rgba(242,183,5,0.2)" strokeWidth="0.5">
              <animate attributeName="r" values="10;16;10" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="190" cy="120" r="4" fill="#F2B705" />
            <text x="200" y="115" fill="#F2B705" fontSize="9" fontFamily="Space Mono" fontWeight="700">96.2%</text>
            <text x="200" y="126" fill="rgba(242,183,5,0.5)" fontSize="6" fontFamily="Space Mono">PEAK η</text>
          </motion.g>
        </svg>
      </div>
    </ANSYSFrame>
  );
}

/* ── Stress Analysis SVG ── */
function StressAnalysisVisual() {
  return (
    <ANSYSFrame title="Von Mises Stress Analysis" colorbarMax="350" colorbarMin="0" colorbarUnit="MPa">
      <div className="flex items-center justify-center h-[280px] lg:h-[380px]">
        <svg viewBox="0 0 300 300" className="w-[220px] h-[220px] lg:w-[280px] lg:h-[280px]">
          <defs>
            <radialGradient id="stress-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF0000" stopOpacity="0.8" />
              <stop offset="30%" stopColor="#FF5500" stopOpacity="0.6" />
              <stop offset="55%" stopColor="#FFCC00" stopOpacity="0.5" />
              <stop offset="80%" stopColor="#00FF88" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0033FF" stopOpacity="0.3" />
            </radialGradient>
            <clipPath id="stress-clip">
              <circle cx="150" cy="150" r="130" />
            </clipPath>
            <filter id="stress-blur">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>
          <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          {/* Stress field (animated slow rotation for visual interest) */}
          <g style={{ transformOrigin: "150px 150px", animation: "stressRotate 30s linear infinite" }}>
            <circle cx="150" cy="150" r="130" fill="url(#stress-grad)" clipPath="url(#stress-clip)" />
            {/* Radial stress concentration lines */}
            {Array.from({ length: 12 }, (_, i) => {
              const angle = (360 / 12) * i;
              const rad = (angle * Math.PI) / 180;
              const intensity = Math.abs(Math.sin(rad * 2));
              return (
                <line key={`sl-${i}`}
                  x1={150 + Math.cos(rad) * 30} y1={150 + Math.sin(rad) * 30}
                  x2={150 + Math.cos(rad) * 128} y2={150 + Math.sin(rad) * 128}
                  stroke={`rgba(255,${Math.round(255 * (1 - intensity))},0,${0.06 + intensity * 0.12})`}
                  strokeWidth="0.5" strokeDasharray="2 6"
                />
              );
            })}
          </g>
          {/* Animated stress rings that reveal in viewport */}
          {[130, 105, 90, 70, 55].map((r, i) => (
            <motion.circle key={`sr-${r}`} cx="150" cy="150" r={r}
              fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: "easeOut" }}
              viewport={{ once: true }}
            />
          ))}
          {/* Retaining sleeve highlight */}
          <motion.circle cx="150" cy="150" r="120"
            fill="none" stroke="rgba(255,68,68,0.15)" strokeWidth="8"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          />
          {/* Shaft */}
          <circle cx="150" cy="150" r="25" fill="#2A2A32" stroke="rgba(255,255,255,0.10)" strokeWidth="0.5" />
          <circle cx="150" cy="150" r="10" fill="#1A1A20" />
          {/* Peak stress indicator — pulsing */}
          <motion.g
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8, type: "spring" }}
            viewport={{ once: true }}
          >
            <circle cx="150" cy="32" r="8" fill="none" stroke="#FF0000" strokeWidth="1">
              <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="150" cy="32" r="3" fill="#FF0000" opacity="0.8" />
            <line x1="150" y1="42" x2="150" y2="55" stroke="rgba(255,68,68,0.4)" strokeWidth="0.5" strokeDasharray="2 2" />
            <text x="162" y="35" fill="#FF4444" fontSize="8" fontFamily="Space Mono" fontWeight="700">350 MPa</text>
            <text x="162" y="45" fill="rgba(255,68,68,0.5)" fontSize="6" fontFamily="Space Mono">PEAK STRESS</text>
          </motion.g>
          {/* Safety factor badge */}
          <motion.g
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ delay: 1.2 }} viewport={{ once: true }}
          >
            <rect x="220" y="240" width="60" height="20" rx="2" fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.2)" strokeWidth="0.5" />
            <text x="250" y="254" textAnchor="middle" fill="#00FF88" fontSize="7" fontFamily="Space Mono" fontWeight="700">SF 2.4×</text>
          </motion.g>
        </svg>
      </div>
      <style jsx>{`
        @keyframes stressRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </ANSYSFrame>
  );
}

/* ── Cogging Torque SVG ── */
function CoggingTorqueVisual() {
  const wavePoints: { x: number; y: number }[] = [];
  for (let i = 0; i <= 340; i++) {
    const angle = (i / 340) * 18 * 2 * Math.PI;
    const y = 100 - Math.sin(angle) * 65 * (1 + 0.1 * Math.sin(angle * 0.3));
    wavePoints.push({ x: 40 + i, y });
  }
  const pathD = wavePoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");

  const peaks = wavePoints.reduce<{ x: number; y: number }[]>((acc, p, i) => {
    if (i > 0 && i < wavePoints.length - 1 && p.y < wavePoints[i - 1].y && p.y < wavePoints[i + 1].y && p.y < 50) {
      if (acc.length === 0 || p.x - acc[acc.length - 1].x > 14) acc.push(p);
    }
    return acc;
  }, []).slice(0, 5);

  return (
    <ANSYSFrame title="Cogging Torque Waveform" colorbarMax="3.0" colorbarMin="0.0" colorbarUnit="%">
      <div className="flex items-center justify-center h-[280px] lg:h-[380px]">
        <svg viewBox="0 0 400 200" className="w-full h-full max-w-[400px]">
          {/* Fine grid */}
          {Array.from({ length: 17 }, (_, i) => {
            const x = 40 + i * 20;
            return <line key={`cg-${i}`} x1={x} y1="30" x2={x} y2="170" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />;
          })}
          {[50, 65, 80, 120, 135, 150].map((y) => (
            <line key={`cgy-${y}`} x1="40" y1={y} x2="380" y2={y} stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
          ))}

          {/* Zero line */}
          <line x1="40" y1="100" x2="380" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          {/* Axes */}
          <line x1="40" y1="30" x2="40" y2="170" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1="40" y1="170" x2="380" y2="170" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

          {/* Angle tick marks */}
          {[0, 60, 120, 180, 240, 300, 360].map((deg) => {
            const x = 40 + (deg / 360) * 340;
            return (
              <g key={`ct-${deg}`}>
                <line x1={x} y1="170" x2={x} y2="175" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                <text x={x} y="184" fill="rgba(255,255,255,0.25)" fontSize="5.5" fontFamily="Space Mono" textAnchor="middle">{deg}°</text>
              </g>
            );
          })}

          {/* Labels */}
          <text x="210" y="197" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="Space Mono" textAnchor="middle">ELECTRICAL ANGLE (°)</text>
          <text x="12" y="30" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="Space Mono">3%</text>
          <text x="12" y="102" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="Space Mono">0%</text>
          <text x="8" y="172" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="Space Mono">-3%</text>

          {/* Envelope curves */}
          <motion.line x1="40" y1="35" x2="380" y2="35"
            stroke="rgba(255,68,68,0.15)" strokeWidth="0.5" strokeDasharray="4 4"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ delay: 1.6 }} viewport={{ once: true }}
          />
          <motion.line x1="40" y1="165" x2="380" y2="165"
            stroke="rgba(255,68,68,0.15)" strokeWidth="0.5" strokeDasharray="4 4"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ delay: 1.6 }} viewport={{ once: true }}
          />
          <motion.text x="385" y="37"
            fill="rgba(255,68,68,0.3)" fontSize="5" fontFamily="Space Mono"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ delay: 1.8 }} viewport={{ once: true }}
          >LIMIT</motion.text>

          {/* 18-cycle cogging waveform */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#F2B705"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: "linear" }}
            viewport={{ once: true }}
          />

          {/* Peak markers — stagger in after waveform draws */}
          {peaks.map((p, i) => (
            <motion.g key={`pk-${i}`}
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + i * 0.1, duration: 0.3 }}
              viewport={{ once: true }}
            >
              <circle cx={p.x} cy={p.y} r="2.5" fill="none" stroke="#F2B705" strokeWidth="0.5" opacity="0.6" />
              {i === 0 && (
                <>
                  <line x1={p.x} y1={p.y - 4} x2={p.x} y2={p.y - 16} stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                  <text x={p.x + 4} y={p.y - 12} fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="Space Mono">2.8%</text>
                </>
              )}
            </motion.g>
          ))}

          {/* RMS badge */}
          <motion.g
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ delay: 2.0 }} viewport={{ once: true }}
          >
            <rect x="310" y="85" width="65" height="18" rx="2" fill="rgba(242,183,5,0.06)" stroke="rgba(242,183,5,0.15)" strokeWidth="0.5" />
            <text x="342" y="97" textAnchor="middle" fill="#F2B705" fontSize="6.5" fontFamily="Space Mono" fontWeight="700">RMS: 1.9%</text>
          </motion.g>
        </svg>
      </div>
    </ANSYSFrame>
  );
}

/* ── Main Technology Page ── */
export function TechnologyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-screen bg-sb-0 flex items-center overflow-hidden">
        {/* Magnetic field lines background — curved paths */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="hero-glow" cx="70%" cy="50%" r="40%">
                <stop offset="0%" stopColor="#F2B705" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#F2B705" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="1200" height="800" fill="url(#hero-glow)" />
            {/* Curved field lines radiating from a focal point at ~70% x, 50% y */}
            {Array.from({ length: 18 }, (_, i) => {
              const angle = (i / 18) * Math.PI * 2;
              const cx = 840, cy = 400;
              const r1 = 120, r2 = 550;
              const spread = 0.4;
              const x1 = cx + Math.cos(angle) * r1;
              const y1 = cy + Math.sin(angle) * r1;
              const x2 = cx + Math.cos(angle + spread) * r2;
              const y2 = cy + Math.sin(angle + spread) * r2;
              const cpx = cx + Math.cos(angle + spread * 0.5) * (r1 + r2) * 0.45;
              const cpy = cy + Math.sin(angle + spread * 0.5) * (r1 + r2) * 0.45;
              const dur = [7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 7, 11, 13, 17, 19, 23][i];
              return (
                <motion.path key={i}
                  d={`M ${x1} ${y1} Q ${cpx} ${cpy} ${x2} ${y2}`}
                  fill="none" stroke="#F2B705" strokeWidth="0.5"
                  strokeDasharray="4 8" opacity="0.05"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.05 }}
                  transition={{ duration: 2, delay: i * 0.12, ease: "easeOut" }}
                  style={{ animation: `fieldDrift ${dur}s linear infinite` }}
                />
              );
            })}
            {/* Concentric rings at focal point */}
            {[60, 120, 200, 300].map((r, i) => (
              <circle key={`hr-${r}`} cx="840" cy="400" r={r}
                fill="none" stroke="rgba(242,183,5,0.03)" strokeWidth="0.5"
                strokeDasharray="2 6"
              >
                <animate attributeName="r" values={`${r - 10};${r + 10};${r - 10}`} dur={`${6 + i * 2}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </svg>
        </div>

        <div className="page-gutter relative z-10">
          <RevealWrapper>
            <SectionOverline text="TECHNOLOGY" variant="dark" />
          </RevealWrapper>
          <RevealWrapper delay={0.1}>
            <h1 className="flex flex-col">
              <span className="font-syncopate font-bold text-[clamp(48px,7.5vw,104px)] leading-[0.86] tracking-[-0.01em] text-white">
                THE SCIENCE
              </span>
              <span className="font-syncopate font-bold text-[clamp(48px,7.5vw,104px)] leading-[0.86] tracking-[-0.01em] text-[rgba(255,255,255,0.22)]">
                INSIDE.
              </span>
            </h1>
          </RevealWrapper>
          <RevealWrapper delay={0.22}>
            <p className="font-work text-[clamp(15px,1.4vw,18px)] leading-[1.78] text-[rgba(255,255,255,0.62)] max-w-[520px] mt-8">
              Every motor is validated through six layers of ANSYS simulation before a single
              prototype is manufactured. This is our simulation methodology, made visible.
            </p>
          </RevealWrapper>
        </div>
      </section>

      {/* 01 — Flux Density */}
      <section className="bg-sb-0 py-sp8" aria-label="Flux Density Simulation">
        <div className="page-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <RevealWrapper>
                <SectionOverline text="01 — FLUX DENSITY" variant="dark" />
                <h3 className="font-syncopate font-bold text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-white mb-4">
                  ELECTROMAGNETIC
                </h3>
                <p className="font-work text-[clamp(13px,1.1vw,15px)] leading-[1.72] text-[rgba(255,255,255,0.62)] max-w-[440px] mb-6">
                  Flux density distribution across the motor cross-section. Slot fills change colour
                  based on current loading. Peak flux density at the stator teeth reaches 2.2T — the
                  saturation limit of M350-50A silicon steel.
                </p>
              </RevealWrapper>
            </div>
            <div className="lg:col-span-7">
              <RevealWrapper delay={0.16}>
                <FluxDensityVisual />
              </RevealWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — Thermal */}
      <ThermalSection />

      {/* 03 — Efficiency */}
      <section className="bg-sb-0 py-sp8" aria-label="Efficiency Map">
        <div className="page-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <RevealWrapper>
                <SectionOverline text="03 — EFFICIENCY MAP" variant="dark" />
                <h3 className="font-syncopate font-bold text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-white mb-4">
                  EFFICIENCY
                </h3>
                <p className="font-work text-[clamp(13px,1.1vw,15px)] leading-[1.72] text-[rgba(255,255,255,0.62)] max-w-[440px] mb-6">
                  The speed-torque efficiency contour map shows the operating region where peak
                  efficiency exceeds 96%. The sweet spot is designed to align with the vehicle&apos;s
                  most common driving conditions.
                </p>
              </RevealWrapper>
            </div>
            <div className="lg:col-span-7">
              <RevealWrapper delay={0.16}>
                <EfficiencyMapVisual />
              </RevealWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — Stress */}
      <section className="bg-sb-0 py-sp8" aria-label="Stress Analysis">
        <div className="page-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <RevealWrapper>
                <SectionOverline text="04 — STRESS ANALYSIS" variant="dark" />
                <h3 className="font-syncopate font-bold text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-white mb-4">
                  STRUCTURAL
                </h3>
                <p className="font-work text-[clamp(13px,1.1vw,15px)] leading-[1.72] text-[rgba(255,255,255,0.62)] max-w-[440px] mb-6">
                  Von Mises stress distribution at maximum operating speed. The rotor retaining
                  sleeve sees peak stress of 350 MPa — well within the yield strength of Inconel 718.
                  Safety factor: 2.4×.
                </p>
              </RevealWrapper>
            </div>
            <div className="lg:col-span-7">
              <RevealWrapper delay={0.16}>
                <StressAnalysisVisual />
              </RevealWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — Cogging Torque */}
      <section className="bg-sb-0 py-sp8" aria-label="Cogging Torque">
        <div className="page-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <RevealWrapper>
                <SectionOverline text="05 — COGGING TORQUE" variant="dark" />
                <h3 className="font-syncopate font-bold text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-white mb-4">
                  COGGING
                </h3>
                <p className="font-work text-[clamp(13px,1.1vw,15px)] leading-[1.72] text-[rgba(255,255,255,0.62)] max-w-[440px] mb-6">
                  The 18-cycle cogging torque waveform shows peak-to-peak ripple below 3%. This is
                  achieved through optimised slot-pole combination and skewing angle, critical for
                  smooth low-speed operation in robotic applications.
                </p>
              </RevealWrapper>
            </div>
            <div className="lg:col-span-7">
              <RevealWrapper delay={0.16}>
                <CoggingTorqueVisual />
              </RevealWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — FOC Oscilloscope */}
      <section className="bg-sb-0 py-sp8" aria-label="Field-Oriented Control">
        <div className="page-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <RevealWrapper>
                <SectionOverline text="06 — FIELD-ORIENTED CONTROL" variant="dark" />
                <h3 className="font-syncopate font-bold text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-white mb-4">
                  FOC
                </h3>
                <p className="font-work text-[clamp(13px,1.1vw,15px)] leading-[1.72] text-[rgba(255,255,255,0.62)] max-w-[440px] mb-6">
                  Three-phase waveform viewer showing the motor drive output. Under load, Phase A leads
                  by up to 18° (current lags voltage). At 100% load, 5th harmonic ripple becomes
                  visible on Phase A — a real phenomenon in saturated motor drives.
                </p>
              </RevealWrapper>
            </div>
            <div className="lg:col-span-7">
              <RevealWrapper delay={0.16}>
                <Oscilloscope />
              </RevealWrapper>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes fieldDrift {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -40; }
        }
      `}</style>
    </>
  );
}
