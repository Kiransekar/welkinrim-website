"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RevealWrapper } from "@/components/RevealWrapper";
import { SectionOverline } from "@/components/SectionOverline";

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
  { name: "Founder & CEO", role: "Motor Design & Strategy", initials: "WR" },
  { name: "CTO", role: "Electromagnetic Design", initials: "EM" },
  { name: "VP Engineering", role: "Thermal & Structural", initials: "TS" },
  { name: "Head of Production", role: "Manufacturing & QC", initials: "MQ" },
  { name: "Controls Lead", role: "FOC & Drive Systems", initials: "FC" },
  { name: "Simulation Lead", role: "ANSYS & Validation", initials: "AV" },
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
    <span className="font-work text-[clamp(13px,1.1vw,15px)] leading-[1.72] text-[#44444C]">
      {displayed}
      {active && !done && <span className="inline-block w-[2px] h-[14px] bg-y ml-0.5 animate-pulse" />}
    </span>
  );
}

export function AboutPage() {
  const [activeYear, setActiveYear] = useState<string | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen bg-sb-0 flex items-center">
        <div className="page-gutter">
          <RevealWrapper>
            <SectionOverline text="OUR STORY" variant="dark" />
          </RevealWrapper>
          <RevealWrapper delay={0.1}>
            <h1 className="flex flex-col">
              <span className="font-syncopate font-bold text-[clamp(48px,7.5vw,104px)] leading-[0.86] tracking-[-0.01em] text-white">
                FROM INDIA
              </span>
              <span className="font-syncopate font-bold text-[clamp(48px,7.5vw,104px)] leading-[0.86] tracking-[-0.01em] text-y">
                — FOR THE
              </span>
              <span className="font-syncopate font-bold text-[clamp(48px,7.5vw,104px)] leading-[0.86] tracking-[-0.01em] text-white">
                WORLD.
              </span>
            </h1>
          </RevealWrapper>
          <RevealWrapper delay={0.22}>
            <p className="font-work text-[clamp(15px,1.4vw,18px)] leading-[1.78] text-[rgba(255,255,255,0.62)] max-w-[520px] mt-8">
              Founded in 2017 at the heart of India&apos;s automotive corridor,
              Welkinrim Technologies designs precision electric motors that compete
              with the world&apos;s best — at Indian economics.
            </p>
          </RevealWrapper>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-[#EDE7D9] py-sp8">
        <div className="page-gutter">
          <RevealWrapper>
            <SectionOverline text="TIMELINE" variant="light" />
            <h2 className="font-syncopate font-bold text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-sb-0 mb-12">
              THE JOURNEY
            </h2>
          </RevealWrapper>

          <div className="flex flex-col gap-0">
            {TIMELINE.map((entry, i) => (
              <RevealWrapper key={entry.year} delay={i * 0.05}>
                <div
                  className={`border-b border-[rgba(9,9,11,0.08)] py-6 cursor-pointer transition-colors ${
                    activeYear === entry.year ? "bg-[rgba(242,183,5,0.06)]" : ""
                  }`}
                  onClick={() => setActiveYear(activeYear === entry.year ? null : entry.year)}
                >
                  <div className="flex items-center gap-6 lg:gap-12">
                    <span className="font-mono text-[clamp(20px,2.5vw,30px)] text-sb-0 font-bold min-w-[80px]">
                      {entry.year}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-syncopate font-bold text-[clamp(14px,1.5vw,20px)] text-sb-0">
                          {entry.title}
                        </span>
                        <span
                          className={`text-[#8A8A96] text-sm transition-transform duration-300 ${
                            activeYear === entry.year ? "rotate-180" : ""
                          }`}
                        >
                          ▼
                        </span>
                      </div>
                      <AnimatePresence>
                        {activeYear === entry.year && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3">
                              <TypingText text={entry.text} active={activeYear === entry.year} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section data-theme="light" className="bg-dw-0 py-sp8">
        <div className="page-gutter">
          <RevealWrapper>
            <SectionOverline text="THE TEAM" variant="light" />
            <h2 className="font-syncopate font-bold text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-sb-0 mb-12">
              WHO WE ARE
            </h2>
          </RevealWrapper>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {TEAM.map((member, i) => (
              <RevealWrapper key={member.name} delay={i * 0.08}>
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-[72px] h-[72px] rounded-full bg-sb-0 flex items-center justify-center">
                    <span className="font-mono text-[14px] text-y font-bold">{member.initials}</span>
                  </div>
                  <div>
                    <p className="font-work font-medium text-[14px] text-sb-0">{member.name}</p>
                    <p className="font-mono text-[10px] tracking-[0.12em] text-[#8A8A96]">{member.role}</p>
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
