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
          <div className="h-full bg-y rounded-full" style={{ width: `${w}px` }} />
        </div>
      </div>
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
                <button
                  key={d}
                  onClick={() => setFilter(d)}
                  className={`font-mono text-[9px] tracking-[0.22em] uppercase px-4 py-2 border rounded-[4px] transition-all duration-200 ${
                    filter === d
                      ? "bg-sb-0 text-white border-sb-0"
                      : "bg-transparent text-[#8A8A96] border-dw-3 hover:border-sb-0 hover:text-sb-0"
                  }`}
                >
                  {d}
                </button>
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
                      className="border-b border-dw-3 last:border-0 hover:bg-[rgba(242,183,5,0.03)] transition-colors cursor-pointer"
                    >
                      <td className="font-mono text-[13px] font-bold text-sb-0 px-4 py-3.5">{m.model}</td>
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
                  className="bg-white border border-dw-3 rounded-[4px] p-4 cursor-pointer hover:border-y transition-colors"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-[13px] font-bold text-sb-0">{m.model}</span>
                    <span className={`font-mono text-[8px] tracking-[0.18em] uppercase border px-[7px] py-[3px] ${DOMAIN_COLORS[m.domain]}`}>
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
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-dw-3 shadow-lg max-h-[50vh] overflow-y-auto"
          >
            <div className="page-gutter py-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-mono text-[18px] font-bold text-sb-0">{selectedMotor.model}</h3>
                    <span className={`font-mono text-[8px] tracking-[0.18em] uppercase border px-[7px] py-[3px] ${DOMAIN_COLORS[selectedMotor.domain]}`}>
                      {selectedMotor.domain}
                    </span>
                  </div>
                  <p className="font-work text-[14px] text-[#44444C] max-w-[500px]">
                    {selectedMotor.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMotor(null)}
                  className="text-[#8A8A96] hover:text-sb-0 text-xl w-[44px] h-[44px] flex items-center justify-center"
                  aria-label="Close detail panel"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-6">
                {[
                  { label: "Power", value: `${selectedMotor.power} ${selectedMotor.powerUnit}` },
                  { label: "Torque", value: `${selectedMotor.torque} ${selectedMotor.torqueUnit}` },
                  { label: "Weight", value: `${selectedMotor.weight} kg` },
                  { label: "Max RPM", value: selectedMotor.rpm.toLocaleString() },
                  { label: "Peak η", value: `${selectedMotor.efficiency}%` },
                  { label: "Domain", value: selectedMotor.domain },
                ].map((spec) => (
                  <div key={spec.label}>
                    <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] block mb-1">
                      {spec.label}
                    </span>
                    <span className="font-mono text-[15px] text-sb-0">{spec.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] uppercase border border-y text-y bg-transparent px-[26px] py-[11px] hover:bg-y hover:text-sb-0 transition-all duration-200"
                >
                  REQUEST DATASHEET
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] uppercase border border-sb-0 text-sb-0 bg-transparent px-[26px] py-[11px] hover:border-y hover:text-y transition-all duration-200"
                >
                  GET QUOTE →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
