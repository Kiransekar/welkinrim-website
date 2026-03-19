"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

/* ── AIR Domain — Propeller with Thrust Vectors ── */
export function AirDomainVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const [rotation, setRotation] = useState(0);
  const [thrust, setThrust] = useState(0);
  
  const powerOutput = useTransform(scrollYProgress, [0, 0.5, 1], [0, 18, 0]);
  const efficiency = useTransform(scrollYProgress, [0, 0.5, 1], [0, 95.2, 0]);

  useEffect(() => {
    let frame: number;
    let lastTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const delta = now - lastTime;
      lastTime = now;
      setRotation((prev) => (prev + delta * 0.2) % 360);
      setThrust(Math.abs(Math.sin(now * 0.001)) * 18);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const unsubPower = powerOutput.on("change", () => {});
    const unsubEff = efficiency.on("change", () => {});
    return () => { unsubPower(); unsubEff(); };
  }, [powerOutput, efficiency]);

  return (
    <div ref={ref} className="w-full h-full relative">
    <svg viewBox="0 0 300 300" className="w-full h-full">
      <defs>
        <linearGradient id="air-thrust" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B8FEF" stopOpacity="0" />
          <stop offset="50%" stopColor="#3B8FEF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#3B8FEF" stopOpacity="0" />
        </linearGradient>
        <filter id="air-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      
      {/* Thrust vectors — flowing lines */}
      {Array.from({ length: 12 }, (_, i) => {
        const y = 80 + i * 12;
        const offset = Math.sin((rotation + i * 30) * Math.PI / 180) * 8;
        return (
          <motion.line
            key={`thrust-${i}`}
            x1="50" y1={y + offset}
            x2="250" y2={y + offset}
            stroke="url(#air-thrust)"
            strokeWidth="2"
            strokeDasharray="8 4"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -24 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        );
      })}

      {/* Motor housing */}
      <circle cx="150" cy="150" r="35" fill="#1A1A22" stroke="rgba(59,143,239,0.3)" strokeWidth="1" />
      
      {/* Propeller blades */}
      <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "150px 150px" }}>
        {Array.from({ length: 4 }, (_, i) => {
          const angle = i * 90;
          const rad = (angle * Math.PI) / 180;
          return (
            <g key={`blade-${i}`}>
              {/* Blade shape */}
              <ellipse
                cx={150 + Math.cos(rad) * 60}
                cy={150 + Math.sin(rad) * 60}
                rx="50" ry="12"
                fill="#3B8FEF"
                opacity="0.7"
                filter="url(#air-glow)"
                transform={`rotate(${angle} ${150 + Math.cos(rad) * 60} ${150 + Math.sin(rad) * 60})`}
              />
              {/* Blade tip glow */}
              <circle
                cx={150 + Math.cos(rad) * 105}
                cy={150 + Math.sin(rad) * 105}
                r="4"
                fill="#3B8FEF"
                opacity="0.9"
                filter="url(#air-glow)"
              />
            </g>
          );
        })}
      </g>
      
      {/* Center hub */}
      <circle cx="150" cy="150" r="20" fill="#2A2A35" stroke="#3B8FEF" strokeWidth="1.5" />
      <circle cx="150" cy="150" r="8" fill="#3B8FEF" opacity="0.6" />
      
      {/* Performance readout */}
      <text x="150" y="235" textAnchor="middle" fill="rgba(59,143,239,0.6)" fontSize="9" fontFamily="Space Mono" fontWeight="bold">
        {Math.round(rotation * 10)} RPM
      </text>
      <text x="150" y="250" textAnchor="middle" fill="rgba(59,143,239,0.5)" fontSize="8" fontFamily="Space Mono">
        {thrust.toFixed(1)}kg THRUST
      </text>
      <text x="150" y="263" textAnchor="middle" fill="rgba(59,143,239,0.4)" fontSize="7" fontFamily="Space Mono">
        KV100 • 12S • 95.2% η
      </text>
      
      {/* Speed rings */}
      <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(59,143,239,0.1)" strokeWidth="0.5" strokeDasharray="4 4" />
      <circle cx="150" cy="150" r="145" fill="none" stroke="rgba(59,143,239,0.06)" strokeWidth="0.5" strokeDasharray="2 2" />
    </svg>
    </div>
  );
}

/* ── WATER Domain — Marine Propeller with Flow ── */
export function WaterDomainVisual() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let frame: number;
    let lastTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const delta = now - lastTime;
      lastTime = now;
      setRotation((prev) => (prev + delta * 0.08) % 360);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full">
      <defs>
        <radialGradient id="water-field" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1E90FF" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#1E90FF" stopOpacity="0" />
        </radialGradient>
        <filter id="water-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      
      {/* Water flow field */}
      <circle cx="150" cy="150" r="130" fill="url(#water-field)" />
      
      {/* Turbulent flow lines */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (360 / 16) * i + rotation * 0.5;
        const rad = (angle * Math.PI) / 180;
        const x1 = 150 + Math.cos(rad) * 140;
        const y1 = 150 + Math.sin(rad) * 140;
        const x2 = 150 + Math.cos(rad) * 80;
        const y2 = 150 + Math.sin(rad) * 80;
        const opacity = (Math.sin((rotation + i * 22.5) * Math.PI / 180) + 1) / 2;
        return (
          <line
            key={`flow-${i}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#1E90FF"
            strokeWidth="1.5"
            opacity={opacity * 0.4}
            strokeDasharray="4 3"
          />
        );
      })}

      {/* Propeller housing */}
      <circle cx="150" cy="150" r="50" fill="#0F1419" stroke="rgba(30,144,255,0.4)" strokeWidth="2" />
      
      {/* 5-blade marine propeller */}
      <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "150px 150px" }}>
        {Array.from({ length: 5 }, (_, i) => {
          const angle = i * 72;
          const rad = (angle * Math.PI) / 180;
          const x = 150 + Math.cos(rad) * 45;
          const y = 150 + Math.sin(rad) * 45;
          return (
            <g key={`blade-${i}`}>
              <path
                d={`M 150 150 Q ${x * 0.7 + 150 * 0.3} ${y * 0.7 + 150 * 0.3} ${x + Math.cos(rad + 0.5) * 35} ${y + Math.sin(rad + 0.5) * 35} L ${x + Math.cos(rad - 0.5) * 35} ${y + Math.sin(rad - 0.5) * 35} Z`}
                fill="#1E90FF"
                opacity="0.75"
                stroke="#3BA5FF"
                strokeWidth="1"
                filter="url(#water-glow)"
              />
            </g>
          );
        })}
      </g>
      
      {/* Center hub */}
      <circle cx="150" cy="150" r="25" fill="#1A1F28" stroke="#1E90FF" strokeWidth="2" />
      <circle cx="150" cy="150" r="12" fill="#1E90FF" opacity="0.5" />
      
      {/* Depth indicator */}
      <text x="150" y="250" textAnchor="middle" fill="rgba(30,144,255,0.5)" fontSize="10" fontFamily="Space Mono">
        MARINE PROPULSION
      </text>
    </svg>
  );
}

/* ── LAND Domain — Torque Output with Power Transfer ── */
export function LandDomainVisual() {
  const [rotation, setRotation] = useState(0);
  const [torque, setTorque] = useState(0);

  useEffect(() => {
    let frame: number;
    let lastTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const delta = now - lastTime;
      lastTime = now;
      setRotation((prev) => (prev + delta * 0.12) % 360);
      setTorque(Math.abs(Math.sin(now * 0.002)) * 100);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full">
      <defs>
        <linearGradient id="torque-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F2B705" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#F2B705" stopOpacity="0.8" />
        </linearGradient>
        <filter id="land-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      
      {/* Torque force indicators */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = i * 45 - rotation * 0.3;
        const rad = (angle * Math.PI) / 180;
        const intensity = (torque / 100) * 60;
        return (
          <g key={`torque-${i}`}>
            <line
              x1={150 + Math.cos(rad) * 60}
              y1={150 + Math.sin(rad) * 60}
              x2={150 + Math.cos(rad) * (60 + intensity)}
              y2={150 + Math.sin(rad) * (60 + intensity)}
              stroke="#F2B705"
              strokeWidth="3"
              opacity={0.6}
              strokeLinecap="round"
              filter="url(#land-glow)"
            />
          </g>
        );
      })}

      {/* Gearbox housing */}
      <rect x="100" y="100" width="100" height="100" rx="8" fill="#1A1812" stroke="rgba(242,183,5,0.3)" strokeWidth="2" />
      
      {/* Internal gears */}
      <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "150px 150px" }}>
        {/* Main gear teeth */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = i * 30;
          const rad = (angle * Math.PI) / 180;
          return (
            <rect
              key={`tooth-${i}`}
              x={150 + Math.cos(rad) * 45 - 3}
              y={150 + Math.sin(rad) * 45 - 6}
              width="6" height="12"
              fill="#F2B705"
              opacity="0.7"
              transform={`rotate(${angle} ${150 + Math.cos(rad) * 45} ${150 + Math.sin(rad) * 45})`}
            />
          );
        })}
        <circle cx="150" cy="150" r="40" fill="#2A2618" stroke="#F2B705" strokeWidth="2" />
      </g>
      
      {/* Output shaft */}
      <g style={{ transform: `rotate(${-rotation * 1.5}deg)`, transformOrigin: "150px 150px" }}>
        <circle cx="150" cy="150" r="25" fill="#3A3420" stroke="#F2B705" strokeWidth="2" opacity="0.8" />
        <rect x="145" y="130" width="10" height="40" fill="#F2B705" opacity="0.6" rx="2" />
        <rect x="130" y="145" width="40" height="10" fill="#F2B705" opacity="0.6" rx="2" />
      </g>
      
      {/* Center hub */}
      <circle cx="150" cy="150" r="15" fill="#F2B705" opacity="0.4" />
      
      {/* Torque readout */}
      <text x="150" y="250" textAnchor="middle" fill="rgba(242,183,5,0.5)" fontSize="10" fontFamily="Space Mono">
        {Math.round(torque)} Nm TORQUE
      </text>
    </svg>
  );
}

/* ── ROBOTICS Domain — Precision Stepper with Angular Grid ── */
export function RoboticsDomainVisual() {
  const [step, setStep] = useState(0);
  const [targetAngle, setTargetAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 200);
      setTargetAngle((prev) => (prev + 1.8) % 360); // 200 steps per revolution
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full">
      <defs>
        <filter id="robot-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="precision-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>
      </defs>
      
      {/* Angular precision grid */}
      {Array.from({ length: 200 }, (_, i) => {
        const angle = i * 1.8;
        const rad = (angle * Math.PI) / 180;
        const isActive = i === step;
        const isMajor = i % 20 === 0;
        return (
          <line
            key={`grid-${i}`}
            x1="150" y1="150"
            x2={150 + Math.cos(rad) * (isMajor ? 120 : 110)}
            y2={150 + Math.sin(rad) * (isMajor ? 120 : 110)}
            stroke={isActive ? "#C084FC" : isMajor ? "rgba(147,51,234,0.3)" : "rgba(147,51,234,0.1)"}
            strokeWidth={isActive ? "2" : isMajor ? "1" : "0.5"}
            opacity={isActive ? 1 : 0.5}
          />
        );
      })}

      {/* Stepper motor phases */}
      <g style={{ transform: `rotate(${targetAngle}deg)`, transformOrigin: "150px 150px", transition: "transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)" }}>
        {/* 4 phase coils */}
        {Array.from({ length: 4 }, (_, i) => {
          const angle = i * 90;
          const rad = (angle * Math.PI) / 180;
          const active = Math.floor(step % 4) === i;
          return (
            <g key={`phase-${i}`}>
              <rect
                x={150 + Math.cos(rad) * 50 - 12}
                y={150 + Math.sin(rad) * 50 - 18}
                width="24" height="36" rx="4"
                fill={active ? "#9333EA" : "#2A1A3A"}
                stroke={active ? "#C084FC" : "rgba(147,51,234,0.4)"}
                strokeWidth="2"
                opacity={active ? 1 : 0.6}
                filter={active ? "url(#robot-glow)" : "none"}
                transform={`rotate(${angle} ${150 + Math.cos(rad) * 50} ${150 + Math.sin(rad) * 50})`}
              />
            </g>
          );
        })}
        
        {/* Rotor with permanent magnets */}
        <circle cx="150" cy="150" r="35" fill="#1A0F2E" stroke="#9333EA" strokeWidth="2" />
        {Array.from({ length: 8 }, (_, i) => {
          const angle = i * 45;
          const rad = (angle * Math.PI) / 180;
          return (
            <rect
              key={`magnet-${i}`}
              x={150 + Math.cos(rad) * 25 - 2}
              y={150 + Math.sin(rad) * 25 - 6}
              width="4" height="12"
              fill={i % 2 === 0 ? "#FF0055" : "#00AAFF"}
              opacity="0.8"
              transform={`rotate(${angle} ${150 + Math.cos(rad) * 25} ${150 + Math.sin(rad) * 25})`}
            />
          );
        })}
      </g>
      
      {/* Center shaft */}
      <circle cx="150" cy="150" r="18" fill="#2A1A3A" stroke="#9333EA" strokeWidth="2" />
      <circle cx="150" cy="150" r="8" fill="url(#precision-gradient)" />
      
      {/* Position readout */}
      <text x="150" y="250" textAnchor="middle" fill="rgba(147,51,234,0.5)" fontSize="10" fontFamily="Space Mono">
        STEP {step}/200 — {targetAngle.toFixed(1)}°
      </text>
    </svg>
  );
}
