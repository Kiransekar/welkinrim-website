"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { RevealWrapper } from "@/components/RevealWrapper";
import { SectionOverline } from "@/components/SectionOverline";

const MILESTONE_ICONS = {
  founded: "◈",
  prototype: "⬡",
  expansion: "◇",
  launch: "◆",
  lab: "▣",
  production: "◫",
  programme: "⬢",
  reach: "✦"
};

const getMilestoneIcon = (title: string) => {
  if (title.includes("Founded")) return MILESTONE_ICONS.founded;
  if (title.includes("Prototype")) return MILESTONE_ICONS.prototype;
  if (title.includes("Expansion") || title.includes("Entry")) return MILESTONE_ICONS.expansion;
  if (title.includes("Launch") || title.includes("Programme")) return MILESTONE_ICONS.launch;
  if (title.includes("Lab") || title.includes("Simulation")) return MILESTONE_ICONS.lab;
  if (title.includes("Production") || title.includes("Volume")) return MILESTONE_ICONS.production;
  if (title.includes("eVTOL")) return MILESTONE_ICONS.programme;
  return MILESTONE_ICONS.reach;
};

const TIMELINE = [
  { year: "2017", title: "Founded", text: "Welkinrim Technologies founded at Oragadam Industrial Corridor, Chennai. Initial focus on BLDC motor design for UAV applications." },
  { year: "2018", title: "First Prototype", text: "First ANSYS-validated motor prototype completed. 800W outrunner for multirotor drones achieves 94% peak efficiency." },
  { year: "2019", title: "Marine Expansion", text: "Entered marine propulsion domain. IP68-rated motor for electric kayak pods. Partnership with coastal vessel manufacturer." },
  { year: "2020", title: "Land Domain", text: "Electric two-wheeler motor programme launched. Field-weakening capability extends speed range 2.4× beyond base speed." },
  { year: "2021", title: "Simulation Lab", text: "Dedicated ANSYS simulation facility established. Six-layer validation methodology formalised: Flux, Thermal, Efficiency, Stress, Cogging, FOC." },
  { year: "2022", title: "Robotics Entry", text: "Precision stepper motors for surgical robotics. Sub-3% cogging torque achieved through optimised slot-pole combination." },
  { year: "2023", title: "Volume Production", text: "Production capacity scaled to 500 units/month. Quality systems aligned to automotive IATF 16949 framework." },
  { year: "2024", title: "12 Motor Variants", text: "Full catalogue reaches 12 validated motor variants across all four domains. Power density leadership in Indian market." },
  { year: "2025", title: "eVTOL Programme", text: "High-power lift motor programme for eVTOL certification. Continuous hover thermal management validated at 218°C peak." },
  { year: "2026", title: "Global Reach", text: "Export-ready motor catalogue. OEM partnerships across Southeast Asia and Europe. From India — For the World." },
];

const TEAM = [
  {
    name: "Founder & CEO",
    role: "Motor Design & Strategy",
    initials: "WR",
    bio: "Leading electric propulsion innovation with 15+ years in motor design and automotive engineering. Previously at Tata Motors R&D.",
    expertise: ["BLDC Design", "Strategic Planning", "OEM Partnerships"],
    linkedin: "https://linkedin.com/company/welkinrim"
  },
  {
    name: "CTO",
    role: "Electromagnetic Design",
    initials: "EM",
    bio: "PhD in Electrical Machines. Specializes in high-speed motor topology and magnetic circuit optimization.",
    expertise: ["ANSYS Maxwell", "Topology Optimization", "Patent Holder"],
    linkedin: "https://linkedin.com/company/welkinrim"
  },
  {
    name: "VP Engineering",
    role: "Thermal & Structural",
    initials: "TS",
    bio: "Expert in thermal management systems and structural analysis. Led development of IP68 marine motor platform.",
    expertise: ["Thermal Analysis", "CFD", "Structural FEA"],
    linkedin: "https://linkedin.com/company/welkinrim"
  },
  {
    name: "Head of Production",
    role: "Manufacturing & QC",
    initials: "MQ",
    bio: "Automotive manufacturing veteran. Implemented IATF 16949 quality systems for volume production scale-up.",
    expertise: ["Lean Manufacturing", "Quality Systems", "Supply Chain"],
    linkedin: "https://linkedin.com/company/welkinrim"
  },
  {
    name: "Controls Lead",
    role: "FOC & Drive Systems",
    initials: "FC",
    bio: "Power electronics and motor controls specialist. Architect of proprietary FOC algorithm with field-weakening.",
    expertise: ["FOC Algorithms", "DSP Programming", "Power Electronics"],
    linkedin: "https://linkedin.com/company/welkinrim"
  },
  {
    name: "Simulation Lead",
    role: "ANSYS & Validation",
    initials: "AV",
    bio: "Simulation-first methodology architect. Established six-layer validation framework for all motor programs.",
    expertise: ["ANSYS Workbench", "Multi-physics", "Test Correlation"],
    linkedin: "https://linkedin.com/company/welkinrim"
  },
];

function TypingText({ text, active }: { text: string; active: boolean }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) {
      setDisplayed("");
      setDone(false);
      return;
    }
    let i = 0;
    setDisplayed("");
    setDone(false);
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, 28 + Math.random() * 14);
    return () => clearInterval(interval);
  }, [active, text]);

  return (
    <span className="font-body text-[clamp(13px,1.1vw,15px)] leading-[1.72] text-[#44444C]">
      {displayed}
      {active && !done && <span className="inline-block w-[2px] h-[14px] bg-y ml-0.5 animate-pulse" />}
    </span>
  );
}

export function AboutPage() {
  const [activeYear, setActiveYear] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start start", "end start"] });
  const progressPercent = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <>
      {/* Hero */}
      <section data-theme="dark" className="relative h-screen bg-dark-0 flex items-center">
        <div className="page-gutter">
          <RevealWrapper>
            <SectionOverline text="OUR STORY" variant="dark" />
          </RevealWrapper>
          <RevealWrapper delay={0.1}>
            <h1 className="flex flex-col">
              <span className="font-display font-bold text-[clamp(48px,7.5vw,104px)] leading-[0.86] tracking-[-0.01em] text-white">
                FROM INDIA
              </span>
              <span className="font-display font-bold text-[clamp(48px,7.5vw,104px)] leading-[0.86] tracking-[-0.01em] text-y">
                — FOR THE
              </span>
              <span className="font-display font-bold text-[clamp(48px,7.5vw,104px)] leading-[0.86] tracking-[-0.01em] text-white">
                WORLD.
              </span>
            </h1>
          </RevealWrapper>
          <RevealWrapper delay={0.22}>
            <p className="font-body text-[clamp(15px,1.4vw,18px)] leading-[1.78] text-[rgba(255,255,255,0.62)] max-w-[520px] mt-8">
              Founded in 2017 at the heart of India&apos;s automotive corridor,
              Welkinrim Technologies designs precision electric motors that compete
              with the world&apos;s best — at Indian economics.
            </p>
          </RevealWrapper>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-[#EDE7D9] py-sp8" ref={timelineRef}>
        <div className="page-gutter">
          <RevealWrapper>
            <SectionOverline text="TIMELINE" variant="light" />
            <h2 className="font-display font-bold text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-sb-0 mb-4">
              THE JOURNEY
            </h2>
            <p className="font-body text-[clamp(13px,1.1vw,15px)] leading-[1.72] text-[#44444C] max-w-[520px] mb-12">
              From a startup in Oragadam to a global electric propulsion supplier. Click on any year to reveal the story.
            </p>
          </RevealWrapper>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96]">PROGRESS</span>
              <motion.span
                className="font-mono text-[9px] tracking-[0.22em] uppercase text-sb-0"
                style={{ opacity: useTransform(progressPercent, (v) => v > 0 ? 1 : 0.5) }}
              >
                {Math.round(Number(progressPercent.get()))}%
              </motion.span>
            </div>
            <div className="h-[2px] bg-[rgba(9,9,11,0.08)] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-y origin-left"
                style={{ scaleX: useTransform(scrollYProgress, [0, 1], [0, 1]) }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-0 relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[88px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-y via-y to-[rgba(242,183,5,0.2)] hidden lg:block" />

            {TIMELINE.map((entry, i) => {
              const isActive = activeYear === entry.year;
              const icon = getMilestoneIcon(entry.title);

              return (
                <RevealWrapper key={entry.year} delay={i * 0.05}>
                  <div
                    className={`border-b border-[rgba(9,9,11,0.08)] py-6 cursor-pointer transition-all duration-300 ${
                      isActive ? "bg-[rgba(242,183,5,0.08)]" : "hover:bg-[rgba(242,183,5,0.04)]"
                    }`}
                    onClick={() => setActiveYear(isActive ? null : entry.year)}
                  >
                    <div className="flex items-center gap-6 lg:gap-12 relative">
                      {/* Milestone dot on timeline */}
                      <div className="hidden lg:flex absolute left-[78px] w-[20px] h-[20px] items-center justify-center">
                        <div className={`w-[12px] h-[12px] rounded-full transition-all duration-300 ${
                          isActive ? "bg-y scale-125" : "bg-dark-0 scale-100"
                        }`} style={{ boxShadow: isActive ? "0 0 12px rgba(242,183,5,0.6)" : "none" }} />
                      </div>

                      <span className="font-mono text-[clamp(20px,2.5vw,30px)] text-sb-0 font-bold min-w-[80px]">
                        {entry.year}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[18px] text-y hidden lg:inline-block opacity-60">
                              {icon}
                            </span>
                            <span className="font-display font-bold text-[clamp(14px,1.5vw,20px)] text-sb-0">
                              {entry.title}
                            </span>
                          </div>
                          <span
                            className={`text-[#8A8A96] text-sm transition-all duration-300 ${
                              isActive ? "rotate-180 text-y" : ""
                            }`}
                          >
                            ▼
                          </span>
                        </div>
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="pt-3 pl-0 lg:pl-[32px]">
                                <TypingText text={entry.text} active={isActive} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </RevealWrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section data-theme="light" className="bg-white-0 py-sp8">
        <div className="page-gutter">
          <RevealWrapper>
            <SectionOverline text="THE TEAM" variant="light" />
            <h2 className="font-display font-bold text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-sb-0 mb-4">
              WHO WE ARE
            </h2>
            <p className="font-body text-[clamp(13px,1.1vw,15px)] leading-[1.72] text-[#44444C] max-w-[520px]">
              A multidisciplinary team of motor designers, simulation experts, and manufacturing specialists united by precision engineering.
            </p>
          </RevealWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {TEAM.map((member, i) => (
              <RevealWrapper key={member.name} delay={i * 0.08}>
                <div className="group bg-white border border-dw-3 rounded-[4px] p-6 hover:border-y hover:shadow-[0_0_24px_rgba(242,183,5,0.12)] transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-[64px] h-[64px] rounded-full bg-dark-0 flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="font-mono text-[16px] text-y font-bold">{member.initials}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-body font-medium text-[15px] text-sb-0">{member.name}</p>
                      <p className="font-mono text-[10px] tracking-[0.12em] text-[#8A8A96] mb-3">{member.role}</p>
                      <p className="font-body text-[13px] leading-[1.62] text-[#44444C] mb-4">
                        {member.bio}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {member.expertise.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-[9px] tracking-[0.14em] uppercase text-[#8A8A96] bg-[rgba(9,9,11,0.04)] px-2 py-1 rounded-[2px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.22em] uppercase text-sb-0 hover:text-y transition-colors"
                      >
                        LINKEDIN <span className="transition-transform group-hover:translate-x-1">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
