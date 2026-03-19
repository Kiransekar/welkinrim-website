"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { RevealWrapper } from "@/components/RevealWrapper";
import { SectionOverline } from "@/components/SectionOverline";
import { MotorVisual } from "@/components/MotorVisual";
import { StatCounter } from "@/components/StatCounter";
import { WireDraw } from "@/components/WireDraw";
import { ANSYSFrame } from "@/components/ANSYSFrame";
import { Logo } from "@/components/Logo";
import { StickyScrollNarrative } from "@/components/StickyScrollNarrative";
import type { NarrativeSlide } from "@/components/StickyScrollNarrative";

const DOMAINS = [
  {
    id: "air",
    name: "AIR",
    nameColor: "text-white",
    domain: "air" as const,
    overline: "DOMAIN 01",
    headline: "Altitude-Ready Propulsion",
    description:
      "High-speed, low-weight motors for UAV and eVTOL platforms. Optimised for thrust-to-weight ratio at altitude, with thermal management designed for continuous hover and transition flight profiles.",
    specs: [
      { label: "Power Density", value: "5.2 kW/kg" },
      { label: "Max RPM", value: "12,000" },
      { label: "Peak η", value: "96.2%" },
    ],
  },
  {
    id: "water",
    name: "WATER",
    nameColor: "text-white",
    domain: "water" as const,
    overline: "DOMAIN 02",
    headline: "Marine-Grade Torque",
    description:
      "Sealed, corrosion-resistant motors for electric marine propulsion. High torque at low RPM, designed for direct-drive pod configurations with IP68 ingress protection.",
    specs: [
      { label: "Continuous Torque", value: "48 Nm" },
      { label: "Protection", value: "IP68" },
      { label: "Peak η", value: "94.8%" },
    ],
  },
  {
    id: "land",
    name: "LAND",
    nameColor: "text-y",
    domain: "land" as const,
    overline: "DOMAIN 03",
    headline: "Automotive Powertrain",
    description:
      "High-power traction motors for electric two-wheelers, three-wheelers, and light commercial vehicles. Field-weakening capability for extended speed range beyond base speed.",
    specs: [
      { label: "Peak Power", value: "15 kW" },
      { label: "Base Speed", value: "3,600 RPM" },
      { label: "Peak η", value: "95.4%" },
    ],
  },
  {
    id: "robotics",
    name: "ROBOTICS",
    nameColor: "text-white",
    domain: "robotics" as const,
    overline: "DOMAIN 04",
    headline: "Precision Positioning",
    description:
      "Stepper and servo motors for robotic actuators and CNC applications. Micro-stepping capability with cogging torque below 3%, enabling smooth low-speed control for surgical and industrial robotics.",
    specs: [
      { label: "Step Accuracy", value: "±0.05°" },
      { label: "Cogging Torque", value: "<3%" },
      { label: "Holding Torque", value: "2.4 Nm" },
    ],
  },
];

const PRODUCTS_TEASER = [
  { model: "Haemng 4143 II", series: "Haemng", domain: "Air", kv: "KV100", voltage: "12S", thrust: "18kg", weight: "560g", efficiency: "95.2%" },
  { model: "Maelard 1560", series: "Maelard", domain: "Air", kv: "KV36", voltage: "14-28S", thrust: "73kg", weight: "2320g", efficiency: "96.8%" },
  { model: "Haemng 1536", series: "Haemng", domain: "Air", kv: "KV80", voltage: "24S", thrust: "44kg", weight: "1854g", efficiency: "96.1%" },
  { model: "Maelard 1780", series: "Maelard", domain: "Air", kv: "KV48", voltage: "14-28S", thrust: "79kg", weight: "3509g", efficiency: "97.1%" },
];

// Pre-computed particle configs so we never call hooks inside a map
const PARTICLE_COUNT = 20;
const PARTICLE_CONFIGS = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  left: `${10 + i * 5}%`,
  top: `${15 + i * 3.5}%`,
  opacity: 0.3 + (i % 5) * 0.1,
  xFactor: 0.3 + i * 0.05,
  yFactor: 0.3 + i * 0.05,
}));

/** Single particle — a proper component so hooks are always called at the top level */
function Particle({
  config,
  parallaxX,
  parallaxY,
}: {
  config: (typeof PARTICLE_CONFIGS)[number];
  parallaxX: ReturnType<typeof useSpring>;
  parallaxY: ReturnType<typeof useSpring>;
}) {
  const x = useTransform(parallaxX, (v) => v * config.xFactor);
  const y = useTransform(parallaxY, (v) => v * config.yFactor);

  return (
    <motion.div
      className="absolute w-[2px] h-[2px] bg-[rgba(242,183,5,0.3)] rounded-full"
      style={{
        left: config.left,
        top: config.top,
        opacity: config.opacity,
        x,
        y,
      }}
    />
  );
}

/** Ghost-slash overlay — extracted so useTransform calls live at component top level */
function HeroSlashOverlay({
  parallaxX,
  parallaxY,
}: {
  parallaxX: ReturnType<typeof useSpring>;
  parallaxY: ReturnType<typeof useSpring>;
}) {
  const x = useTransform(parallaxX, (v) => v * 0.5);
  const y = useTransform(parallaxY, (v) => v * 0.5);

  return (
    <motion.div
      className="absolute top-[15%] right-[10%] w-[400px] h-[600px] pointer-events-none hidden lg:block"
      style={{ x, y }}
    >
      <svg width="400" height="600" viewBox="0 0 400 600" fill="none" className="absolute inset-0">
        <defs>
          <linearGradient id="slashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F2B705" stopOpacity="0" />
            <stop offset="50%" stopColor="#F2B705" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#F2B705" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F2B705" stopOpacity="0" />
            <stop offset="45%" stopColor="#F2B705" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#F2B705" stopOpacity="0.25" />
            <stop offset="55%" stopColor="#F2B705" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#F2B705" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="300" y1="0" x2="100" y2="600" stroke="url(#slashGradient)" strokeWidth="1.5" style={{ filter: "blur(1px)" }} />
        <line x1="350" y1="0" x2="150" y2="600" stroke="url(#shimmerGradient)" strokeWidth="1" style={{ filter: "blur(2px)" }} opacity="0.08">
          <animate attributeName="opacity" values="0.06;0.12;0.06" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="250" y1="0" x2="50" y2="600" stroke="#F2B705" strokeWidth="0.5" opacity="0.04" />
      </svg>
    </motion.div>
  );
}

/** Background gradient layer — extracted for the same reason */
function HeroGradientLayer({
  parallaxX,
  parallaxY,
}: {
  parallaxX: ReturnType<typeof useSpring>;
  parallaxY: ReturnType<typeof useSpring>;
}) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ x: parallaxX, y: parallaxY }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(242, 183, 5, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(59, 143, 239, 0.04) 0%, transparent 50%)",
        }}
      />
    </motion.div>
  );
}

export function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Parallax mouse movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x * 20);
      mouseY.set(y * 20);
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (hero) {
        hero.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [mouseX, mouseY]);

  return (
    <div>
      {/* ─── 01 HERO ─── */}
      <section ref={heroRef} className="relative h-screen bg-sb-0 flex items-center overflow-hidden">
        {/* Enhanced background gradient with parallax */}
        <HeroGradientLayer parallaxX={parallaxX} parallaxY={parallaxY} />

        {/* Depth particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {PARTICLE_CONFIGS.map((cfg, i) => (
            <Particle key={i} config={cfg} parallaxX={parallaxX} parallaxY={parallaxY} />
          ))}
        </div>

        {/* Animated grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02] animate-[gridMove_20s_linear_infinite]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Enhanced ghost slash lines with shimmer */}
        <HeroSlashOverlay parallaxX={parallaxX} parallaxY={parallaxY} />

        <motion.div
          className="page-gutter relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center"
          style={{
            y: heroY,
            opacity: heroOpacity,
          }}
        >
          {/* Left 60% — Text */}
          <div className="lg:col-span-3">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-[10px] tracking-[0.32em] uppercase text-[rgba(255,255,255,0.35)] mb-8"
            >
              ORAGADAM, INDIA · FOUNDED 2017
            </motion.p>

            <h1 className="flex flex-col gap-0">
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="font-syncopate font-bold text-[clamp(48px,8vw,140px)] leading-[0.82] tracking-[-0.01em] text-white"
              >
                ELECTRIC
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="font-syncopate font-bold text-[clamp(48px,8vw,140px)] leading-[0.82] tracking-[-0.01em] text-y"
              >
                PROPULSION
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="font-syncopate font-bold text-[clamp(48px,8vw,140px)] leading-[0.82] tracking-[-0.01em] text-white"
              >
                SYSTEMS
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.36, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-work text-[clamp(15px,1.4vw,18px)] leading-[1.78] text-[rgba(255,255,255,0.62)] max-w-[420px] mt-8"
            >
              Simulation-first electric motors designed and manufactured in India.
              Four domains. One standard of precision.
            </motion.p>
          </div>

          {/* Right 40% — Ghost slash lines */}
          <div className="hidden lg:flex lg:col-span-2 items-center justify-center h-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1.2 }}
              className="relative w-full h-[400px]"
            >
              <svg width="100%" height="100%" viewBox="0 0 300 400" fill="none" className="absolute inset-0">
                <line x1="220" y1="0" x2="80" y2="400" stroke="#F2B705" strokeWidth="1.5" opacity="0.12" />
                <line x1="260" y1="0" x2="120" y2="400" stroke="#F2B705" strokeWidth="1" opacity="0.06" />
                <line x1="180" y1="0" x2="40" y2="400" stroke="#F2B705" strokeWidth="0.5" opacity="0.04" />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll cue with enhanced animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 right-8 flex items-center gap-3 group cursor-pointer"
        >
          <span
            className="font-mono text-[9px] tracking-[0.22em] text-[rgba(255,255,255,0.35)] uppercase group-hover:text-y transition-colors duration-300"
            style={{ writingMode: "vertical-lr" }}
          >
            SCROLL
          </span>
          <div className="relative">
            <div className="w-[1px] h-[40px] bg-gradient-to-b from-y via-y to-transparent" />
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[8px] bg-y rounded-full"
              style={{ filter: "blur(1px)" }}
            />
          </div>
        </motion.div>
      </section>

      {/* ─── 02 WIRE-DRAW TRANSITION ─── */}
      <WireDraw />

      {/* ─── 03-06 DOMAIN SECTIONS — Sticky Scroll Narrative ─── */}
      <StickyScrollNarrative
        sectionLabel="Four domains of electric propulsion"
        slides={DOMAINS.map((d): NarrativeSlide => ({
          id: d.id,
          titleWhite: d.name,
          titleAccent: d.headline,
          body: d.description,
          visual: (
            <MotorVisual
              domain={d.domain}
              size={380}
              className="w-[260px] h-[260px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px]"
            />
          ),
        }))}
      />

      {/* ─── 07 WIRE-DRAW TRANSITION ─── */}
      <WireDraw />

      {/* ─── 08 BRIDGE / STATS ─── */}
      <section data-theme="light" className="bg-dw-0 py-sp8 lg:py-sp9">
        <div className="page-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-sp6 items-center">
            <RevealWrapper>
              <SectionOverline text="BY THE NUMBERS" variant="light" />
              <h2 className="font-syncopate font-bold text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-sb-0 mt-4">
                ENGINEERING{" "}
                <span className="text-y">DEPTH</span>
              </h2>
              <p className="font-work text-[clamp(13px,1.1vw,15px)] leading-[1.72] text-[#44444C] max-w-[440px] mt-6">
                Every motor is ANSYS-simulation-validated before a single prototype is cut.
                Seven years of R&D. Four domains. One uncompromising standard.
              </p>
            </RevealWrapper>

            <div className="grid grid-cols-2 gap-8">
              <StatCounter value={7} suffix="+" label="Years R&D" delay={0} />
              <StatCounter value={4} label="Domains" delay={0.15} />
              <StatCounter value={12} suffix="+" label="Motor Variants" delay={0.3} />
              <StatCounter value={96} suffix="%" label="Peak η" delay={0.45} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 09 TECHNOLOGY PREVIEW ─── */}
      <section className="bg-sb-0 py-sp8">
        <div className="page-gutter">
          <RevealWrapper>
            <SectionOverline text="SIMULATION-FIRST" variant="dark" />
          </RevealWrapper>
          <RevealWrapper delay={0.1}>
            <h2 className="font-syncopate font-bold text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-white mb-8">
              THE SCIENCE{" "}
              <span className="text-[rgba(255,255,255,0.22)]">INSIDE.</span>
            </h2>
          </RevealWrapper>
          <RevealWrapper delay={0.16}>
            <ANSYSFrame
              title="Flux Density Analysis"
              colorbarMax="2200"
              colorbarMin="660"
              colorbarUnit="mT"
            >
              <div className="flex items-center justify-center h-[280px] lg:h-[360px]">
                <svg viewBox="0 0 300 300" className="w-[200px] h-[200px] lg:w-[280px] lg:h-[280px]">
                  <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <circle cx="150" cy="150" r="120" fill="#16161A" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  {Array.from({ length: 12 }, (_, idx) => {
                    const angle = (360 / 12) * idx;
                    const rad = (angle * Math.PI) / 180;
                    const x = 150 + Math.cos(rad) * 100;
                    const y = 150 + Math.sin(rad) * 100;
                    return (
                      <circle key={idx} cx={x} cy={y} r="12" fill={`hsl(${10 + idx * 20}, 90%, ${50 + idx * 3}%)`} opacity="0.7" />
                    );
                  })}
                  <circle cx="150" cy="150" r="70" fill="#0F0F12" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  <circle cx="150" cy="150" r="50" fill="#1E1E24" />
                  <circle cx="150" cy="150" r="20" fill="#2A2A32" />
                </svg>
              </div>
            </ANSYSFrame>
          </RevealWrapper>
          <RevealWrapper delay={0.42}>
            <div className="mt-8 flex justify-center">
              <Link
                href="/technology"
                className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] uppercase border border-y text-y bg-transparent px-[26px] py-[11px] hover:bg-y hover:text-sb-0 transition-all duration-200 ease-precise"
              >
                EXPLORE TECHNOLOGY <span>→</span>
              </Link>
            </div>
          </RevealWrapper>
        </div>
      </section>

      {/* ─── 10 SLASH DIVIDER ─── */}
      <div className="relative w-full h-[2px] overflow-hidden">
        <svg className="w-full h-[60px] -mt-[29px]" preserveAspectRatio="none">
          <line x1="0" y1="30" x2="100%" y2="30" stroke="#F2B705" strokeWidth="1" opacity="0.18" />
        </svg>
      </div>

      {/* ─── 11 PRODUCTS TEASER ─── */}
      <section data-theme="light" className="bg-dw-0 py-sp8">
        <div className="page-gutter">
          <RevealWrapper>
            <SectionOverline text="MOTOR CATALOGUE" variant="light" />
          </RevealWrapper>
          <RevealWrapper delay={0.1}>
            <h2 className="font-syncopate font-bold text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-sb-0 mb-10">
              PRECISION{" "}
              <span className="text-y">MOTORS</span>
            </h2>
          </RevealWrapper>
          <RevealWrapper delay={0.22}>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full bg-white border border-dw-3 rounded-[4px]">
                <thead>
                  <tr className="border-b border-dw-3">
                    <th className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] text-left px-4 py-3">Model</th>
                    <th className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] text-left px-4 py-3">Series</th>
                    <th className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] text-left px-4 py-3">KV</th>
                    <th className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] text-left px-4 py-3">Voltage</th>
                    <th className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] text-left px-4 py-3">Thrust</th>
                    <th className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] text-left px-4 py-3">Weight</th>
                    <th className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] text-left px-4 py-3">Peak η</th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTS_TEASER.map((p) => (
                    <tr key={p.model} className="border-b border-dw-3 last:border-0 hover:bg-[rgba(242,183,5,0.03)] transition-colors group">
                      <td className="font-mono text-[13px] font-bold text-sb-0 px-4 py-3.5 group-hover:text-y transition-colors">{p.model}</td>
                      <td className="px-4 py-3.5">
                        <span className={`font-mono text-[8px] tracking-[0.18em] uppercase border px-[7px] py-[3px] ${
                          p.series === "Haemng" ? "text-domain-air border-domain-air" : "text-domain-robotics border-domain-robotics"
                        }`}>
                          {p.series}
                        </span>
                      </td>
                      <td className="font-mono text-[13px] text-sb-0 px-4 py-3.5">{p.kv}</td>
                      <td className="font-mono text-[13px] text-sb-0 px-4 py-3.5">{p.voltage}</td>
                      <td className="font-mono text-[13px] text-sb-0 px-4 py-3.5">{p.thrust}</td>
                      <td className="font-mono text-[13px] text-sb-0 px-4 py-3.5">{p.weight}</td>
                      <td className="font-mono text-[13px] text-sb-0 px-4 py-3.5">{p.efficiency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {PRODUCTS_TEASER.map((p) => (
                <div key={p.model} className="bg-white border border-dw-3 rounded-[4px] p-4 hover:border-y hover:shadow-[0_0_20px_rgba(242,183,5,0.15)] transition-all duration-300 group">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-[13px] font-bold text-sb-0 group-hover:text-y transition-colors">{p.model}</span>
                    <span className={`font-mono text-[8px] tracking-[0.18em] uppercase border px-[7px] py-[3px] ${
                      p.series === "Haemng" ? "text-domain-air border-domain-air" : "text-domain-robotics border-domain-robotics"
                    }`}>
                      {p.series}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] block">KV Rating</span>
                      <span className="font-mono text-[13px] text-sb-0">{p.kv}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] block">Voltage</span>
                      <span className="font-mono text-[13px] text-sb-0">{p.voltage}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] block">Thrust</span>
                      <span className="font-mono text-[13px] text-sb-0">{p.thrust}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] block">Weight</span>
                      <span className="font-mono text-[13px] text-sb-0">{p.weight}</span>
                    </div>
                  </div>
                  <Link
                    href="/products"
                    className="mt-4 block w-full text-center font-mono text-[10px] tracking-[0.24em] uppercase border border-sb-0 text-sb-0 py-3 hover:border-y hover:text-y transition-colors"
                  >
                    VIEW SPECS →
                  </Link>
                </div>
              ))}
            </div>
          </RevealWrapper>
          <RevealWrapper delay={0.42}>
            <div className="mt-10 flex justify-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] uppercase border border-sb-0 text-sb-0 bg-transparent px-[32px] py-[14px] hover:bg-sb-0 hover:text-y transition-all duration-200"
              >
                FULL CATALOGUE <span>→</span>
              </Link>
            </div>
          </RevealWrapper>
        </div>
      </section>

      {/* ─── 12 LOCATION STRIP ─── */}
      <section className="bg-sb-0 py-sp7">
        <div className="page-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <RevealWrapper>
              <SectionOverline text="WHERE WE BUILD" variant="dark" />
              <h2 className="font-syncopate font-bold text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-white mb-6">
                ORAGADAM
              </h2>
              <p className="font-work text-[clamp(13px,1.1vw,15px)] leading-[1.72] text-[rgba(255,255,255,0.62)] max-w-[480px]">
                India&apos;s automotive corridor. Adjacent to Delphi-TVS, JBM Group, Sanmina IMS,
                and GARC. A precision manufacturing ecosystem built for scale.
              </p>
            </RevealWrapper>
            <RevealWrapper delay={0.16}>
              <div className="bg-sb-1 border border-sb-3 rounded-[4px] p-6 lg:p-8">
                <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[rgba(255,255,255,0.35)] block mb-4">
                  FACILITY ADDRESS
                </span>
                <p className="font-work text-[15px] leading-[1.78] text-white">
                  Welkinrim Technologies Pvt. Ltd.
                </p>
                <p className="font-work text-[14px] leading-[1.72] text-[rgba(255,255,255,0.62)]">
                  Oragadam Industrial Corridor<br />
                  Chennai, Tamil Nadu, India
                </p>
                <Link
                  href="/contact#location"
                  className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] uppercase text-y mt-6 hover:text-y-hi transition-colors"
                >
                  GET DIRECTIONS <span>→</span>
                </Link>
              </div>
            </RevealWrapper>
          </div>
        </div>
      </section>

      {/* ─── 13 CTA STRIP ─── */}
      <section className="bg-y py-sp7">
        <div className="page-gutter text-center">
          <Logo variant="inverted" className="justify-center mb-8" />
          <h2 className="font-syncopate font-bold text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-sb-0 mb-6">
            LET&apos;S BUILD
          </h2>
          <p className="font-work text-[clamp(15px,1.4vw,18px)] leading-[1.78] text-sb-0 max-w-[500px] mx-auto mb-8 opacity-80">
            Whether you need a custom motor for your next platform or want to explore our catalogue,
            we respond within 24 hours.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] uppercase border border-sb-0 text-sb-0 bg-transparent px-[32px] py-[14px] hover:bg-sb-0 hover:text-y transition-all duration-200 ease-precise"
          >
            START A CONVERSATION <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}