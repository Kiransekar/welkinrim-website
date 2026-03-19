"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

/* ── AIR Domain — High-Performance Propeller System ── */
export function AirDomainVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const [rotation, setRotation] = useState(0);
  const [thrust, setThrust] = useState(0);
  
  const intensity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.3, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);

  useEffect(() => {
    let frame: number;
    let lastTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const delta = now - lastTime;
      lastTime = now;
      setRotation((prev) => (prev + delta * 0.22) % 360);
      setThrust(Math.abs(Math.sin(now * 0.0012)) * 18 + Math.random() * 0.3);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const unsub = intensity.on("change", () => {});
    return () => unsub();
  }, [intensity]);

  return (
    <motion.div ref={ref} className="w-full h-full relative" style={{ scale }}>
      <svg viewBox="0 0 300 300" className="w-full h-full">
        <defs>
          <linearGradient id="air-thrust" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B8FEF" stopOpacity="0" />
            <stop offset="50%" stopColor="#3B8FEF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3B8FEF" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="air-core-glow">
            <stop offset="0%" stopColor="#3B8FEF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3B8FEF" stopOpacity="0" />
          </radialGradient>
          <filter id="air-glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        
        {/* Core glow pulse */}
        <motion.circle
          cx="150" cy="150" r="60"
          fill="url(#air-core-glow)"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Thrust vectors with flow animation */}
        {Array.from({ length: 14 }, (_, i) => {
          const y = 75 + i * 11;
          const offset = Math.sin((rotation + i * 25) * Math.PI / 180) * 10;
          const opacity = 0.3 + Math.sin((rotation + i * 45) * Math.PI / 180) * 0.2;
          return (
            <motion.line
              key={`thrust-${i}`}
              x1="40" y1={y + offset}
              x2="260" y2={y + offset}
              stroke="url(#air-thrust)"
              strokeWidth="2.5"
              strokeDasharray="10 5"
              opacity={opacity}
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -30 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
          );
        })}

        {/* Motor housing with metallic look */}
        <circle cx="150" cy="150" r="38" fill="#1A1F2E" stroke="rgba(59,143,239,0.4)" strokeWidth="2" />
        <circle cx="150" cy="150" r="35" fill="#0F1419" stroke="rgba(59,143,239,0.2)" strokeWidth="1" />
        
        {/* Propeller blades with blur trail */}
        <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "150px 150px" }}>
          {Array.from({ length: 4 }, (_, i) => {
            const angle = i * 90;
            const rad = (angle * Math.PI) / 180;
            return (
              <g key={`blade-${i}`}>
                <ellipse
                  cx={150 + Math.cos(rad) * 65}
                  cy={150 + Math.sin(rad) * 65}
                  rx="55" ry="14"
                  fill="#3B8FEF"
                  opacity="0.8"
                  filter="url(#air-glow)"
                  transform={`rotate(${angle} ${150 + Math.cos(rad) * 65} ${150 + Math.sin(rad) * 65})`}
                />
                <circle
                  cx={150 + Math.cos(rad) * 115}
                  cy={150 + Math.sin(rad) * 115}
                  r="5"
                  fill="#5AAFFF"
                  opacity="0.95"
                  filter="url(#air-glow)"
                />
              </g>
            );
          })}
        </g>
        
        {/* Center hub with detail */}
        <circle cx="150" cy="150" r="22" fill="#2A3545" stroke="#3B8FEF" strokeWidth="2" />
        <circle cx="150" cy="150" r="16" fill="#1A2333" stroke="#5AAFFF" strokeWidth="1" />
        <circle cx="150" cy="150" r="10" fill="#3B8FEF" opacity="0.7" />
        
        {/* Performance metrics */}
        <text x="150" y="232" textAnchor="middle" fill="rgba(59,143,239,0.7)" fontSize="10" fontFamily="Space Mono" fontWeight="bold">
          {Math.round(rotation * 12)} RPM
        </text>
        <text x="150" y="248" textAnchor="middle" fill="rgba(59,143,239,0.6)" fontSize="9" fontFamily="Space Mono">
          {thrust.toFixed(1)}kg • KV100
        </text>
        <text x="150" y="262" textAnchor="middle" fill="rgba(59,143,239,0.45)" fontSize="8" fontFamily="Space Mono">
          12S • 95.2% η • UAV/eVTOL
        </text>
        
        {/* Speed rings */}
        <circle cx="150" cy="150" r="135" fill="none" stroke="rgba(59,143,239,0.12)" strokeWidth="0.5" strokeDasharray="5 3" />
        <circle cx="150" cy="150" r="150" fill="none" stroke="rgba(59,143,239,0.08)" strokeWidth="0.5" strokeDasharray="3 2" />
      </svg>
    </motion.div>
  );
}

/* ── WATER Domain — Marine Propulsion with Cavitation Effect ── */
export function WaterDomainVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const [rotation, setRotation] = useState(0);
  const [torque, setTorque] = useState(0);
  
  const flowIntensity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.4, 1, 0.4]);

  useEffect(() => {
    let frame: number;
    let lastTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const delta = now - lastTime;
      lastTime = now;
      setRotation((prev) => (prev + delta * 0.1) % 360);
      setTorque(Math.abs(Math.sin(now * 0.0008)) * 48 + 20);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const unsub = flowIntensity.on("change", () => {});
    return () => unsub();
  }, [flowIntensity]);

  return (
    <motion.div ref={ref} className="w-full h-full relative">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        <defs>
          <radialGradient id="water-field" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1E90FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1E90FF" stopOpacity="0" />
          </radialGradient>
          <filter id="water-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="cavitation" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E90FF" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1E90FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Water field pressure zones */}
        <motion.circle
          cx="150" cy="150" r="140"
          fill="url(#water-field)"
          animate={{ r: [135, 145, 135] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Turbulent flow lines with cavitation bubbles */}
        {Array.from({ length: 18 }, (_, i) => {
          const angle = (360 / 18) * i + rotation * 0.6;
          const rad = (angle * Math.PI) / 180;
          const x1 = 150 + Math.cos(rad) * 145;
          const y1 = 150 + Math.sin(rad) * 145;
          const x2 = 150 + Math.cos(rad) * 75;
          const y2 = 150 + Math.sin(rad) * 75;
          const opacity = (Math.sin((rotation + i * 20) * Math.PI / 180) + 1) / 2;
          return (
            <g key={`flow-${i}`}>
              <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#1E90FF"
                strokeWidth="2"
                opacity={opacity * 0.5}
                strokeDasharray="6 4"
              />
              {i % 3 === 0 && (
                <motion.circle
                  cx={x1} cy={y1} r="3"
                  fill="url(#cavitation)"
                  initial={{ opacity: 0, r: 2 }}
                  animate={{ opacity: [0, 0.6, 0], r: [2, 4, 2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                />
              )}
            </g>
          );
        })}

        {/* Propeller housing with IP68 seal */}
        <circle cx="150" cy="150" r="55" fill="#0A1218" stroke="rgba(30,144,255,0.5)" strokeWidth="3" />
        <circle cx="150" cy="150" r="52" fill="#0F1419" stroke="rgba(30,144,255,0.3)" strokeWidth="1" />
        
        {/* 5-blade marine propeller */}
        <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "150px 150px" }}>
          {Array.from({ length: 5 }, (_, i) => {
            const angle = i * 72;
            const rad = (angle * Math.PI) / 180;
            const x = 150 + Math.cos(rad) * 48;
            const y = 150 + Math.sin(rad) * 48;
            return (
              <path
                key={`blade-${i}`}
                d={`M 150 150 Q ${x * 0.65 + 150 * 0.35} ${y * 0.65 + 150 * 0.35} ${x + Math.cos(rad + 0.6) * 38} ${y + Math.sin(rad + 0.6) * 38} L ${x + Math.cos(rad - 0.6) * 38} ${y + Math.sin(rad - 0.6) * 38} Z`}
                fill="#1E90FF"
                opacity="0.85"
                stroke="#3BA5FF"
                strokeWidth="1.5"
                filter="url(#water-glow)"
              />
            );
          })}
        </g>
        
        {/* Center hub with seal indicators */}
        <circle cx="150" cy="150" r="28" fill="#1A2533" stroke="#1E90FF" strokeWidth="2.5" />
        <circle cx="150" cy="150" r="22" fill="#0F1823" stroke="#3BA5FF" strokeWidth="1" />
        <circle cx="150" cy="150" r="14" fill="#1E90FF" opacity="0.6" />
        
        {/* Performance readout */}
        <text x="150" y="232" textAnchor="middle" fill="rgba(30,144,255,0.7)" fontSize="10" fontFamily="Space Mono" fontWeight="bold">
          {Math.round(rotation * 8)} RPM
        </text>
        <text x="150" y="248" textAnchor="middle" fill="rgba(30,144,255,0.6)" fontSize="9" fontFamily="Space Mono">
          {torque.toFixed(1)}Nm • IP68
        </text>
        <text x="150" y="262" textAnchor="middle" fill="rgba(30,144,255,0.45)" fontSize="8" fontFamily="Space Mono">
          MARINE • 94.8% η • SEALED
        </text>
        
        {/* Pressure rings */}
        <circle cx="150" cy="150" r="160" fill="none" stroke="rgba(30,144,255,0.1)" strokeWidth="0.5" strokeDasharray="4 4" />
      </svg>
    </motion.div>
  );
}

/* ── LAND Domain — Automotive Powertrain with Torque Vectoring ── */
export function LandDomainVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const [rotation, setRotation] = useState(0);
  const [torque, setTorque] = useState(0);
  const [power, setPower] = useState(0);
  
  const torqueIntensity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.3, 1, 0.3]);

  useEffect(() => {
    let frame: number;
    let lastTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const delta = now - lastTime;
      lastTime = now;
      setRotation((prev) => (prev + delta * 0.15) % 360);
      const torqueVal = Math.abs(Math.sin(now * 0.0015)) * 80 + 20;
      setTorque(torqueVal);
      setPower(torqueVal * 0.18);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const unsub = torqueIntensity.on("change", () => {});
    return () => unsub();
  }, [torqueIntensity]);

  return (
    <motion.div ref={ref} className="w-full h-full relative">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        <defs>
          <linearGradient id="torque-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F2B705" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F2B705" stopOpacity="0.9" />
          </linearGradient>
          <filter id="land-glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="power-glow">
            <stop offset="0%" stopColor="#F2B705" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F2B705" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Power field */}
        <motion.circle
          cx="150" cy="150" r="90"
          fill="url(#power-glow)"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Torque force vectors */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = i * 45 - rotation * 0.4;
          const rad = (angle * Math.PI) / 180;
          const intensity = (torque / 100) * 70;
          const pulsePhase = Math.sin((Date.now() * 0.002 + i * 0.5) % (2 * Math.PI));
          return (
            <motion.line
              key={`torque-${i}`}
              x1={150 + Math.cos(rad) * 65}
              y1={150 + Math.sin(rad) * 65}
              x2={150 + Math.cos(rad) * (65 + intensity)}
              y2={150 + Math.sin(rad) * (65 + intensity)}
              stroke="#F2B705"
              strokeWidth={3 + pulsePhase}
              opacity={0.7}
              strokeLinecap="round"
              filter="url(#land-glow)"
            />
          );
        })}

        {/* Gearbox housing with ventilation */}
        <rect x="95" y="95" width="110" height="110" rx="10" fill="#1A1612" stroke="rgba(242,183,5,0.4)" strokeWidth="3" />
        <rect x="100" y="100" width="100" height="100" rx="8" fill="#0F0D0A" stroke="rgba(242,183,5,0.2)" strokeWidth="1" />
        
        {/* Ventilation grilles */}
        {Array.from({ length: 4 }, (_, i) => (
          <line
            key={`vent-${i}`}
            x1="110" y1={115 + i * 18}
            x2="190" y2={115 + i * 18}
            stroke="rgba(242,183,5,0.15)"
            strokeWidth="1"
          />
        ))}
        
        {/* Internal gears with teeth detail */}
        <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "150px 150px" }}>
          {Array.from({ length: 16 }, (_, i) => {
            const angle = i * 22.5;
            const rad = (angle * Math.PI) / 180;
            return (
              <rect
                key={`tooth-${i}`}
                x={150 + Math.cos(rad) * 48 - 3.5}
                y={150 + Math.sin(rad) * 48 - 7}
                width="7" height="14"
                fill="#F2B705"
                opacity="0.75"
                transform={`rotate(${angle} ${150 + Math.cos(rad) * 48} ${150 + Math.sin(rad) * 48})`}
              />
            );
          })}
          <circle cx="150" cy="150" r="44" fill="#2A2418" stroke="#F2B705" strokeWidth="2.5" />
          <circle cx="150" cy="150" r="38" fill="#1A1612" stroke="#F2B705" strokeWidth="1" opacity="0.5" />
        </g>
        
        {/* Output shaft with rotation indicator */}
        <g style={{ transform: `rotate(${-rotation * 1.8}deg)`, transformOrigin: "150px 150px" }}>
          <circle cx="150" cy="150" r="28" fill="#3A3220" stroke="#F2B705" strokeWidth="2.5" opacity="0.9" />
          <rect x="144" y="125" width="12" height="50" fill="#F2B705" opacity="0.7" rx="3" />
          <rect x="125" y="144" width="50" height="12" fill="#F2B705" opacity="0.7" rx="3" />
        </g>
        
        {/* Center hub */}
        <circle cx="150" cy="150" r="18" fill="#F2B705" opacity="0.5" />
        <circle cx="150" cy="150" r="12" fill="#FFD23F" opacity="0.6" />
        
        {/* Performance metrics */}
        <text x="150" y="230" textAnchor="middle" fill="rgba(242,183,5,0.75)" fontSize="10" fontFamily="Space Mono" fontWeight="bold">
          {Math.round(rotation * 10)} RPM
        </text>
        <text x="150" y="246" textAnchor="middle" fill="rgba(242,183,5,0.65)" fontSize="9" fontFamily="Space Mono">
          {torque.toFixed(0)}Nm • {power.toFixed(1)}kW
        </text>
        <text x="150" y="260" textAnchor="middle" fill="rgba(242,183,5,0.5)" fontSize="8" fontFamily="Space Mono">
          AUTOMOTIVE • 95.4% η • EV
        </text>
      </svg>
    </motion.div>
  );
}

/* ── ROBOTICS Domain — Precision Stepper with Encoder Feedback ── */
export function RoboticsDomainVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const [step, setStep] = useState(0);
  const [targetAngle, setTargetAngle] = useState(0);
  
  const precision = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.5, 1, 0.5]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 200);
      setTargetAngle((prev) => (prev + 1.8) % 360);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsub = precision.on("change", () => {});
    return () => unsub();
  }, [precision]);

  return (
    <motion.div ref={ref} className="w-full h-full relative">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        <defs>
          <filter id="robot-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="precision-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
          <radialGradient id="encoder-glow">
            <stop offset="0%" stopColor="#9333EA" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#9333EA" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Encoder feedback pulse */}
        <motion.circle
          cx="150" cy="150" r="100"
          fill="url(#encoder-glow)"
          animate={{ opacity: [0.2, 0.5, 0.2], r: [95, 105, 95] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Angular precision grid - 200 steps */}
        {Array.from({ length: 200 }, (_, i) => {
          const angle = i * 1.8;
          const rad = (angle * Math.PI) / 180;
          const isActive = i === step;
          const isMajor = i % 20 === 0;
          const isMinor = i % 10 === 0;
          return (
            <line
              key={`grid-${i}`}
              x1="150" y1="150"
              x2={150 + Math.cos(rad) * (isMajor ? 125 : isMinor ? 115 : 108)}
              y2={150 + Math.sin(rad) * (isMajor ? 125 : isMinor ? 115 : 108)}
              stroke={isActive ? "#C084FC" : isMajor ? "rgba(147,51,234,0.35)" : "rgba(147,51,234,0.12)"}
              strokeWidth={isActive ? "2.5" : isMajor ? "1.5" : "0.5"}
              opacity={isActive ? 1 : 0.6}
            />
          );
        })}

        {/* Stepper motor housing with encoder markings */}
        <circle cx="150" cy="150" r="65" fill="#1A0F2E" stroke="rgba(147,51,234,0.3)" strokeWidth="1" />
        
        {/* Stepper motor phases with activation sequence */}
        <g style={{ transform: `rotate(${targetAngle}deg)`, transformOrigin: "150px 150px", transition: "transform 0.08s cubic-bezier(0.4, 0, 0.2, 1)" }}>
          {Array.from({ length: 4 }, (_, i) => {
            const angle = i * 90;
            const rad = (angle * Math.PI) / 180;
            const active = Math.floor(step % 4) === i;
            return (
              <g key={`phase-${i}`}>
                <rect
                  x={150 + Math.cos(rad) * 52 - 14}
                  y={150 + Math.sin(rad) * 52 - 20}
                  width="28" height="40" rx="5"
                  fill={active ? "#9333EA" : "#2A1A3A"}
                  stroke={active ? "#C084FC" : "rgba(147,51,234,0.5)"}
                  strokeWidth="2.5"
                  opacity={active ? 1 : 0.6}
                  filter={active ? "url(#robot-glow)" : "none"}
                  transform={`rotate(${angle} ${150 + Math.cos(rad) * 52} ${150 + Math.sin(rad) * 52})`}
                />
                {active && (
                  <motion.circle
                    cx={150 + Math.cos(rad) * 52}
                    cy={150 + Math.sin(rad) * 52}
                    r="8"
                    fill="#C084FC"
                    opacity="0.8"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.4 }}
                  />
                )}
              </g>
            );
          })}
          
          {/* Rotor with permanent magnets */}
          <circle cx="150" cy="150" r="38" fill="#1A0F2E" stroke="#9333EA" strokeWidth="2.5" />
          {Array.from({ length: 8 }, (_, i) => {
            const angle = i * 45;
            const rad = (angle * Math.PI) / 180;
            return (
              <rect
                key={`magnet-${i}`}
                x={150 + Math.cos(rad) * 28 - 2.5}
                y={150 + Math.sin(rad) * 28 - 7}
                width="5" height="14"
                fill={i % 2 === 0 ? "#FF0055" : "#00AAFF"}
                opacity="0.9"
                transform={`rotate(${angle} ${150 + Math.cos(rad) * 28} ${150 + Math.sin(rad) * 28})`}
              />
            );
          })}
        </g>
        
        {/* Center shaft with encoder */}
        <circle cx="150" cy="150" r="20" fill="#2A1A3A" stroke="#9333EA" strokeWidth="2.5" />
        <circle cx="150" cy="150" r="15" fill="#3A2050" stroke="#C084FC" strokeWidth="1" />
        <circle cx="150" cy="150" r="10" fill="url(#precision-gradient)" />
        
        {/* Precision indicators */}
        <text x="150" y="228" textAnchor="middle" fill="rgba(147,51,234,0.75)" fontSize="10" fontFamily="Space Mono" fontWeight="bold">
          STEP {step}/200
        </text>
        <text x="150" y="244" textAnchor="middle" fill="rgba(147,51,234,0.65)" fontSize="9" fontFamily="Space Mono">
          {targetAngle.toFixed(1)}° • ±0.05°
        </text>
        <text x="150" y="258" textAnchor="middle" fill="rgba(147,51,234,0.5)" fontSize="8" fontFamily="Space Mono">
          ROBOTICS • &lt;3% COGGING
        </text>
        
        {/* Position feedback ring */}
        <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(147,51,234,0.15)" strokeWidth="0.5" strokeDasharray="2 2" />
      </svg>
    </motion.div>
  );
}
