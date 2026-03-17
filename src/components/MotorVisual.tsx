"use client";

import React, { useEffect, useRef, useState } from "react";

type Domain = "air" | "water" | "land" | "robotics";

interface MotorVisualProps {
  domain: Domain;
  size?: number;
  className?: string;
}

const DOMAIN_CONFIG: Record<
  Domain,
  {
    slotColor: string;
    spinDuration: number;
    accentHue: number;
    stepping?: boolean;
    stepAngle?: number;
    stepPause?: number;
  }
> = {
  air: { slotColor: "#3B8FEF", spinDuration: 3500, accentHue: 215 },
  water: { slotColor: "#00B4CC", spinDuration: 8000, accentHue: 187 },
  land: { slotColor: "#F2B705", spinDuration: 5500, accentHue: 45 },
  robotics: {
    slotColor: "#8866CC",
    spinDuration: 0,
    accentHue: 264,
    stepping: true,
    stepAngle: 20,
    stepPause: 580,
  },
};

const SLOT_COUNT = 12;
const ROTOR_POLES = 8;

export function MotorVisual({ domain, size = 340, className = "" }: MotorVisualProps) {
  const config = DOMAIN_CONFIG[domain];
  const [rotation, setRotation] = useState(0);
  const rafRef = useRef<number>(0);
  const stepRef = useRef(0);

  useEffect(() => {
    if (config.stepping) {
      const interval = setInterval(() => {
        stepRef.current += config.stepAngle || 20;
        setRotation(stepRef.current);
      }, config.stepPause || 580);
      return () => clearInterval(interval);
    } else {
      let start: number | null = null;
      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const deg = (elapsed / config.spinDuration) * 360;
        setRotation(deg % 360);
        rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(rafRef.current);
    }
  }, [config]);

  const statorSlots = Array.from({ length: SLOT_COUNT }, (_, i) => {
    const angle = (360 / SLOT_COUNT) * i;
    return angle;
  });

  const rotorPoles = Array.from({ length: ROTOR_POLES }, (_, i) => {
    const angle = (360 / ROTOR_POLES) * i;
    return angle;
  });

  const outerR = size / 2;
  const statorOuterR = outerR * 0.92;
  const statorInnerR = outerR * 0.62;
  const rotorOuterR = outerR * 0.56;
  const rotorInnerR = outerR * 0.28;
  const shaftR = outerR * 0.14;
  const cx = outerR;
  const cy = outerR;

  return (
    <div
      className={`relative ${className}`}
      role="img"
      aria-label={`Animated cross-section of ${domain} electric motor`}
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full opacity-20 blur-xl"
        style={{
          background: `radial-gradient(circle, ${config.slotColor} 0%, transparent 70%)`,
          transform: "scale(1.1)",
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Glow ring */}
        <circle
          cx={cx}
          cy={cy}
          r={outerR - 4}
          stroke={config.slotColor}
          strokeWidth="1"
          fill="none"
          opacity="0.15"
          style={{
            filter: `drop-shadow(0 0 8px ${config.slotColor})`,
          }}
        />

        {/* Housing */}
        <circle cx={cx} cy={cy} r={outerR - 2} stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" />
        <circle
          cx={cx}
          cy={cy}
          r={statorOuterR}
          fill="#16161A"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="1"
          style={{
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))",
          }}
        />

        {/* Stator Slots with enhanced glow */}
        {statorSlots.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const midR = (statorOuterR + statorInnerR) / 2;
          const x = cx + Math.cos(rad) * midR;
          const y = cy + Math.sin(rad) * midR;
          return (
            <g key={`slot-${i}`}>
              <circle
                cx={x}
                cy={y}
                r={outerR * 0.07}
                fill={config.slotColor}
                opacity={0.85}
                className="transition-colors duration-[800ms]"
                style={{
                  filter: `drop-shadow(0 0 6px ${config.slotColor})`,
                }}
              />
              <circle
                cx={x}
                cy={y}
                r={outerR * 0.04}
                fill={config.slotColor}
                opacity={0.4}
                style={{
                  filter: `blur(4px)`,
                }}
              />
            </g>
          );
        })}

        {/* Stator inner ring */}
        <circle cx={cx} cy={cy} r={statorInnerR} fill="#0F0F12" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />

        {/* Air gap with animated dash */}
        <circle
          cx={cx}
          cy={cy}
          r={rotorOuterR + 4}
          fill="none"
          stroke={config.slotColor}
          strokeWidth="0.5"
          opacity="0.20"
          strokeDasharray="4 8"
          style={{
            animation: "rotateGap 20s linear infinite",
          }}
        />

        {/* Rotor */}
        <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: `${cx}px ${cy}px`, transition: config.stepping ? "transform 0.15s ease-precise" : "none" }}>
          <circle
            cx={cx}
            cy={cy}
            r={rotorOuterR}
            fill="#1E1E24"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
            style={{
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
            }}
          />

          {/* Rotor Poles / Magnets with enhanced rendering */}
          {rotorPoles.map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const midR = (rotorOuterR + rotorInnerR) / 2;
            const x = cx + Math.cos(rad) * midR;
            const y = cy + Math.sin(rad) * midR;
            const poleColor = i % 2 === 0 ? "#FF4444" : "#4488FF";
            return (
              <g key={`pole-${i}`}>
                <rect
                  x={x - outerR * 0.04}
                  y={y - outerR * 0.09}
                  width={outerR * 0.08}
                  height={outerR * 0.18}
                  rx={2}
                  fill={poleColor}
                  opacity={0.75}
                  transform={`rotate(${angle} ${x} ${y})`}
                  style={{
                    filter: `drop-shadow(0 0 4px ${poleColor})`,
                  }}
                />
                <rect
                  x={x - outerR * 0.02}
                  y={y - outerR * 0.05}
                  width={outerR * 0.04}
                  height={outerR * 0.10}
                  rx={1}
                  fill={poleColor}
                  opacity={0.3}
                  transform={`rotate(${angle} ${x} ${y})`}
                  style={{
                    filter: `blur(3px)`,
                  }}
                />
              </g>
            );
          })}

          {/* Rotor inner ring */}
          <circle cx={cx} cy={cy} r={rotorInnerR} fill="#16161A" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />

          {/* Shaft with metallic gradient effect */}
          <defs>
            <radialGradient id={`shaftGrad-${domain}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3A3A4A" />
              <stop offset="50%" stopColor="#2A2A32" />
              <stop offset="100%" stopColor="#1A1A22" />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={shaftR} fill={`url(#shaftGrad-${domain})`} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={shaftR * 0.4} fill="#09090B" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        </g>

        {/* Enhanced Magnetic field lines */}
        {[0, 90, 180, 270].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const r1 = statorInnerR + 6;
          const r2 = rotorOuterR - 2;
          const x1 = cx + Math.cos(rad) * r1;
          const y1 = cy + Math.sin(rad) * r1;
          const x2 = cx + Math.cos(rad) * r2;
          const y2 = cy + Math.sin(rad) * r2;
          return (
            <g key={`field-${i}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={config.slotColor}
                strokeWidth="0.5"
                opacity={0.20}
                strokeDasharray="3 5"
                className="hidden lg:block"
                style={{
                  filter: `drop-shadow(0 0 2px ${config.slotColor})`,
                  animation: `fieldDrift ${[7, 11, 13, 17][i]}s linear infinite`,
                }}
              />
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={config.slotColor}
                strokeWidth="1"
                opacity={0.08}
                className="hidden lg:block"
                style={{
                  filter: "blur(2px)",
                  animation: `fieldPulse ${[3, 4, 5, 6][i]}s ease-in-out infinite`,
                }}
              />
            </g>
          );
        })}

        {/* Rotating particles */}
        {Array.from({ length: 8 }, (_, i) => {
          const particleAngle = (360 / 8) * i + rotation;
          const particleRad = (particleAngle * Math.PI) / 180;
          const particleR = (statorInnerR + rotorOuterR) / 2;
          const px = cx + Math.cos(particleRad) * particleR;
          const py = cy + Math.sin(particleRad) * particleR;
          return (
            <circle
              key={`particle-${i}`}
              cx={px}
              cy={py}
              r={1.5}
              fill={config.slotColor}
              opacity={0.6}
              className="hidden lg:block"
              style={{
                filter: `drop-shadow(0 0 3px ${config.slotColor})`,
              }}
            />
          );
        })}
      </svg>

      <style jsx>{`
        @keyframes fieldDrift {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -40; }
        }
        @keyframes rotateGap {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fieldPulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}
