"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { RevealWrapper } from "@/components/RevealWrapper";
import { SectionOverline } from "@/components/SectionOverline";

type Domain = "Air" | "Water" | "Land" | "Robotics";
type SortKey = "model" | "power" | "torque" | "weight" | "rpm" | "efficiency";
type SortDir = "asc" | "desc";

interface Motor {
  model: string;
  domain: Domain;
  power: number;
  powerUnit: string;
  torque: number;
  torqueUnit: string;
  weight: number;
  rpm: number;
  efficiency: number;
  description: string;
}

const MOTORS: Motor[] = [
  { model: "WR-A060", domain: "Air", power: 0.6, powerUnit: "kW", torque: 0.48, torqueUnit: "Nm", weight: 0.22, rpm: 12000, efficiency: 95.8, description: "Ultra-light UAV propulsion motor for sub-2kg multirotor platforms." },
  { model: "WR-A120", domain: "Air", power: 1.2, powerUnit: "kW", torque: 0.96, torqueUnit: "Nm", weight: 0.42, rpm: 12000, efficiency: 96.2, description: "High-performance eVTOL lift motor with integrated cooling." },
  { model: "WR-A250", domain: "Air", power: 2.5, powerUnit: "kW", torque: 2.0, torqueUnit: "Nm", weight: 0.78, rpm: 12000, efficiency: 95.4, description: "Heavy-lift drone motor for agricultural and cargo applications." },
  { model: "WR-W240", domain: "Water", power: 2.4, powerUnit: "kW", torque: 24, torqueUnit: "Nm", weight: 2.1, rpm: 960, efficiency: 93.6, description: "Compact marine thruster for kayaks and small watercraft." },
  { model: "WR-W480", domain: "Water", power: 4.8, powerUnit: "kW", torque: 48, torqueUnit: "Nm", weight: 3.8, rpm: 960, efficiency: 94.8, description: "Marine pod drive motor with IP68 submersion rating." },
  { model: "WR-W100", domain: "Water", power: 10, powerUnit: "kW", torque: 96, torqueUnit: "Nm", weight: 7.2, rpm: 1000, efficiency: 94.2, description: "High-torque marine propulsion for commercial vessels." },
  { model: "WR-L050", domain: "Land", power: 5, powerUnit: "kW", torque: 14, torqueUnit: "Nm", weight: 3.4, rpm: 4800, efficiency: 94.8, description: "Electric two-wheeler hub motor with regenerative braking." },
  { model: "WR-L100", domain: "Land", power: 10, powerUnit: "kW", torque: 28, torqueUnit: "Nm", weight: 5.8, rpm: 4200, efficiency: 95.1, description: "Three-wheeler traction motor with field-weakening capability." },
  { model: "WR-L150", domain: "Land", power: 15, powerUnit: "kW", torque: 42, torqueUnit: "Nm", weight: 8.2, rpm: 3600, efficiency: 95.4, description: "Light commercial vehicle motor with liquid cooling jacket." },
  { model: "WR-R008", domain: "Robotics", power: 0.08, powerUnit: "kW", torque: 0.6, torqueUnit: "Nm", weight: 0.24, rpm: 200, efficiency: 91.2, description: "Precision stepper for surgical robotics and micro-positioning." },
  { model: "WR-R024", domain: "Robotics", power: 0.24, powerUnit: "kW", torque: 2.4, torqueUnit: "Nm", weight: 0.68, rpm: 400, efficiency: 93.1, description: "Joint actuator for collaborative robotic arms." },
  { model: "WR-R060", domain: "Robotics", power: 0.6, powerUnit: "kW", torque: 5.8, torqueUnit: "Nm", weight: 1.2, rpm: 600, efficiency: 92.8, description: "High-torque servo for industrial robotics and CNC." },
];

const DOMAIN_COLORS: Record<Domain, string> = {
  Air: "text-domain-air border-domain-air",
  Water: "text-domain-water border-domain-water",
  Land: "text-y border-y",
  Robotics: "text-domain-robotics border-domain-robotics",
};

export function ProductsPage() {
  const [filter, setFilter] = useState<Domain | "ALL">("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("model");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selectedMotor, setSelectedMotor] = useState<Motor | null>(null);

  const filtered = useMemo(() => {
    let list = filter === "ALL" ? MOTORS : MOTORS.filter((m) => m.domain === filter);
    list = [...list].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return list;
  }, [filter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortChevron = ({ col }: { col: SortKey }) => (
    <span className="inline-flex flex-col ml-1 leading-none text-[7px]">
      <span className={sortKey === col && sortDir === "asc" ? "text-y" : "text-[#8A8A96]"}>▲</span>
      <span className={sortKey === col && sortDir === "desc" ? "text-y" : "text-[#8A8A96]"}>▼</span>
    </span>
  );

  const effBar = (eff: number) => {
    const w = Math.max(0, ((eff - 80) / 20) * 60);
    return (
      <div className="flex items-center gap-2">
        <span className="font-mono text-[13px] text-sb-0">{eff}%</span>
        <div className="w-[60px] h-[2px] bg-dw-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-y-lo via-y to-y-hi rounded-full transition-all duration-500"
            style={{ width: `${w}px`, boxShadow: "0 0 8px rgba(242, 183, 5, 0.4)" }}
          />
        </div>
      </div>
    );
  };

  const FilterPill = ({ value, label }: { value: Domain | "ALL"; label: string }) => {
    const domainGlow: Record<Domain | "ALL", string> = {
      ALL: "transparent",
      Air: "var(--d-air-glow)",
      Water: "var(--d-water-glow)",
      Land: "var(--d-land-glow)",
      Robotics: "var(--d-robotics-glow)",
    };

    return (
      <button
        onClick={() => setFilter(value)}
        className={`relative font-mono text-[9px] tracking-[0.22em] uppercase px-4 py-2 rounded-[4px] transition-all duration-300 overflow-hidden ${
          filter === value
            ? "bg-sb-0 text-white border-sb-0 shadow-md"
            : "bg-transparent text-[#8A8A96] border-dw-3 hover:border-sb-0 hover:text-sb-0"
        }`}
        style={{
          boxShadow: filter === value ? `0 0 16px ${domainGlow[value]}` : "none",
        }}
      >
        {filter === value && (
          <span
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle, ${value === "ALL" ? "#F2B705" : value === "Air" ? "#3B8FEF" : value === "Water" ? "#00B4CC" : value === "Robotics" ? "#8866CC" : "#F2B705"} 0%, transparent 70%)`,
            }}
          />
        )}
        <span className="relative z-10">{label}</span>
      </button>
    );
  };

  return (
    <>
      <section data-theme="light" className="bg-dw-0 min-h-screen pt-sp8 pb-sp7">
        <div className="page-gutter">
          <RevealWrapper>
            <SectionOverline text="MOTOR CATALOGUE" variant="light" />
          </RevealWrapper>
          <RevealWrapper delay={0.1}>
            <h1 className="font-syncopate font-bold text-[clamp(48px,7.5vw,104px)] leading-[0.86] tracking-[-0.01em] text-sb-0 mb-10">
              PRODUCTS
            </h1>
          </RevealWrapper>

          {/* Filter pills */}
          <RevealWrapper delay={0.22}>
            <div className="flex flex-wrap gap-2 mb-8">
              {(["ALL", "Air", "Water", "Land", "Robotics"] as const).map((d) => (
                <FilterPill key={d} value={d} label={d} />
              ))}
            </div>
          </RevealWrapper>

          {/* Desktop Table */}
          <RevealWrapper delay={0.3}>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full bg-white border border-dw-3 rounded-[4px]">
                <caption className="sr-only">Welkinrim motor catalogue with specifications</caption>
                <thead>
                  <tr className="border-b border-dw-3">
                    {[
                      { key: "model" as SortKey, label: "MODEL" },
                      { key: "model" as SortKey, label: "DOMAIN", sortable: false },
                      { key: "power" as SortKey, label: "POWER" },
                      { key: "torque" as SortKey, label: "TORQUE" },
                      { key: "weight" as SortKey, label: "WEIGHT" },
                      { key: "rpm" as SortKey, label: "RPM" },
                      { key: "efficiency" as SortKey, label: "PEAK η" },
                    ].map((col, i) => (
                      <th
                        key={i}
                        scope="col"
                        className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] text-left px-4 py-3 cursor-pointer select-none"
                        onClick={() => col.sortable !== false && toggleSort(col.key)}
                      >
                        {col.label}
                        {col.sortable !== false && <SortChevron col={col.key} />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => (
                    <tr
                      key={m.model}
                      onClick={() => setSelectedMotor(m)}
                      className="border-b border-dw-3 last:border-0 group hover:bg-[rgba(242,183,5,0.04)] transition-all duration-200 cursor-pointer relative"
                    >
                      <td className="font-mono text-[13px] font-bold text-sb-0 px-4 py-3.5 group-hover:text-y transition-colors">{m.model}</td>
                      <td className="px-4 py-3.5">
                        <span className={`font-mono text-[8px] tracking-[0.18em] uppercase border px-[7px] py-[3px] ${DOMAIN_COLORS[m.domain]}`}>
                          {m.domain}
                        </span>
                      </td>
                      <td className="font-mono text-[13px] text-sb-0 px-4 py-3.5">{m.power} {m.powerUnit}</td>
                      <td className="font-mono text-[13px] text-sb-0 px-4 py-3.5">{m.torque} {m.torqueUnit}</td>
                      <td className="font-mono text-[13px] text-sb-0 px-4 py-3.5">{m.weight} kg</td>
                      <td className="font-mono text-[13px] text-sb-0 px-4 py-3.5">{m.rpm.toLocaleString()}</td>
                      <td className="px-4 py-3.5">{effBar(m.efficiency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filtered.map((m) => (
                <div
                  key={m.model}
                  onClick={() => setSelectedMotor(m)}
                  className="bg-white border border-dw-3 rounded-[4px] p-4 cursor-pointer hover:border-y hover:shadow-[0_0_20px_rgba(242,183,5,0.15)] transition-all duration-300 group"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-[13px] font-bold text-sb-0 group-hover:text-y transition-colors">{m.model}</span>
                    <span className={`font-mono text-[8px] tracking-[0.18em] uppercase border px-[7px] py-[3px] rounded-[4px] ${DOMAIN_COLORS[m.domain]}`}>
                      {m.domain}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] block">Power</span>
                      <span className="font-mono text-[13px] text-sb-0">{m.power} {m.powerUnit}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] block">Torque</span>
                      <span className="font-mono text-[13px] text-sb-0">{m.torque} {m.torqueUnit}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] block">Weight</span>
                      <span className="font-mono text-[13px] text-sb-0">{m.weight} kg</span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] block">Peak η</span>
                      <span className="font-mono text-[13px] text-sb-0">{m.efficiency}%</span>
                    </div>
                  </div>
                  <button className="w-full text-center font-mono text-[10px] tracking-[0.24em] uppercase border border-sb-0 text-sb-0 py-3 hover:border-y hover:text-y transition-colors">
                    VIEW SPECS →
                  </button>
                </div>
              ))}
            </div>
          </RevealWrapper>
        </div>
      </section>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedMotor && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-sb-0/60 backdrop-blur-sm"
              onClick={() => setSelectedMotor(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-dw-3 shadow-2xl max-h-[50vh] overflow-y-auto"
              style={{
                boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.4), 0 0 40px rgba(242, 183, 5, 0.1)",
              }}
            >
              <div className="page-gutter py-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-mono text-[20px] font-bold text-sb-0">{selectedMotor.model}</h3>
                      <span className={`font-mono text-[8px] tracking-[0.18em] uppercase border px-[7px] py-[3px] rounded-[4px] ${DOMAIN_COLORS[selectedMotor.domain]}`}>
                        {selectedMotor.domain}
                      </span>
                    </div>
                    <p className="font-work text-[14px] text-[#44444C] max-w-[500px] leading-relaxed">
                      {selectedMotor.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedMotor(null)}
                    className="text-[#8A8A96] hover:text-sb-0 text-2xl w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-[rgba(9,9,11,0.05)] transition-all duration-200"
                    aria-label="Close detail panel"
                  >
                    ×
                  </button>
                </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
                {[
                  { label: "Power", value: `${selectedMotor.power} ${selectedMotor.powerUnit}` },
                  { label: "Torque", value: `${selectedMotor.torque} ${selectedMotor.torqueUnit}` },
                  { label: "Weight", value: `${selectedMotor.weight} kg` },
                  { label: "Max RPM", value: selectedMotor.rpm.toLocaleString() },
                  { label: "Peak η", value: `${selectedMotor.efficiency}%` },
                  { label: "Domain", value: selectedMotor.domain },
                ].map((spec, i) => (
                  <motion.div
                    key={spec.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="bg-[rgba(9,9,11,0.03)] rounded-[4px] p-3"
                  >
                    <span className="font-mono text-[8px] tracking-[0.22em] uppercase text-[#8A8A96] block mb-2">
                      {spec.label}
                    </span>
                    <span className="font-mono text-[16px] font-bold text-sb-0">{spec.value}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] uppercase border border-y text-y bg-transparent px-[26px] py-[11px] hover:bg-y hover:text-sb-0 transition-all duration-300 shadow-sm hover:shadow-glow-y"
                >
                  REQUEST DATASHEET
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] uppercase border border-sb-0 text-sb-0 bg-transparent px-[26px] py-[11px] hover:border-y hover:text-y transition-all duration-300 hover:shadow-glow-sm"
                >
                  GET QUOTE →
                </Link>
              </div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
