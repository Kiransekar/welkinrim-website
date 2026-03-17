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
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Housing */}
        <circle cx={cx} cy={cy} r={outerR - 2} stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none" />
        <circle cx={cx} cy={cy} r={statorOuterR} fill="#16161A" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* Stator Slots */}
        {statorSlots.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const midR = (statorOuterR + statorInnerR) / 2;
          const x = cx + Math.cos(rad) * midR;
          const y = cy + Math.sin(rad) * midR;
          return (
            <circle
              key={`slot-${i}`}
              cx={x}
              cy={y}
              r={outerR * 0.07}
              fill={config.slotColor}
              opacity={0.8}
              className="transition-colors duration-[800ms]"
            />
          );
        })}

        {/* Stator inner ring */}
        <circle cx={cx} cy={cy} r={statorInnerR} fill="#0F0F12" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* Air gap */}
        <circle cx={cx} cy={cy} r={rotorOuterR + 4} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="2 4" />

        {/* Rotor */}
        <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: `${cx}px ${cy}px`, transition: config.stepping ? "transform 0.15s ease-precise" : "none" }}>
          <circle cx={cx} cy={cy} r={rotorOuterR} fill="#1E1E24" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

          {/* Rotor Poles / Magnets */}
          {rotorPoles.map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const midR = (rotorOuterR + rotorInnerR) / 2;
            const x = cx + Math.cos(rad) * midR;
            const y = cy + Math.sin(rad) * midR;
            return (
              <rect
                key={`pole-${i}`}
                x={x - outerR * 0.04}
                y={y - outerR * 0.09}
                width={outerR * 0.08}
                height={outerR * 0.18}
                rx={2}
                fill={i % 2 === 0 ? "#FF4444" : "#4488FF"}
                opacity={0.7}
                transform={`rotate(${angle} ${x} ${y})`}
              />
            );
          })}

          {/* Rotor inner ring */}
          <circle cx={cx} cy={cy} r={rotorInnerR} fill="#16161A" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

          {/* Shaft */}
          <circle cx={cx} cy={cy} r={shaftR} fill="#2A2A32" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={shaftR * 0.4} fill="#09090B" />
        </g>

        {/* Magnetic field lines */}
        {[0, 90, 180, 270].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const r1 = statorInnerR + 6;
          const r2 = rotorOuterR - 2;
          const x1 = cx + Math.cos(rad) * r1;
          const y1 = cy + Math.sin(rad) * r1;
          const x2 = cx + Math.cos(rad) * r2;
          const y2 = cy + Math.sin(rad) * r2;
          return (
            <line
              key={`field-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={config.slotColor}
              strokeWidth="0.5"
              opacity={0.15}
              strokeDasharray="3 5"
              className="hidden lg:block"
              style={{
                animation: `fieldDrift ${[7, 11, 13, 17][i]}s linear infinite`,
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
      `}</style>
    </div>
  );
}
