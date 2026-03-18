"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { RevealWrapper } from "@/components/RevealWrapper";
import { SectionOverline } from "@/components/SectionOverline";

type Series = "Haemng" | "Maelard";
type SortKey = "model" | "kv" | "voltage" | "thrust" | "weight" | "rpm" | "efficiency";
type SortDir = "asc" | "desc";

interface Motor {
  model: string;
  domain: "Air";
  series: Series;
  kv: string;
  voltage: string;
  thrust: string;
  weight: number; // kg
  rpm: number;
  efficiency: number;
  description: string;
}

const MOTORS: Motor[] = [
  // Haemng Series - UAV/eVTOL Motors
  { model: "Haemng 2121 II", series: "Haemng", domain: "Air", kv: "KV380", voltage: "6S", thrust: "1200g", weight: 0.086, rpm: 12000, efficiency: 94.5, description: "Ultra-lightweight outrunner for sub-250g FPV racing drones and micro UAV platforms." },
  { model: "Haemng 4143 II", series: "Haemng", domain: "Air", kv: "KV100", voltage: "12S", thrust: "18kg", weight: 0.560, rpm: 8000, efficiency: 95.2, description: "High-performance eVTOL lift motor with integrated cooling duct design." },
  { model: "Haemng 8005", series: "Haemng", domain: "Air", kv: "KV230", voltage: "6S", thrust: "3700g", weight: 0.245, rpm: 10500, efficiency: 94.8, description: "Agricultial drone motor optimized for spray and spreading applications." },
  { model: "Haemng 7010", series: "Haemng", domain: "Air", kv: "KV150", voltage: "12S", thrust: "13kg", weight: 0.468, rpm: 9000, efficiency: 95.6, description: "Heavy-lift cargo drone motor with reinforced shaft and bearings." },
  { model: "Haemng 1536", series: "Haemng", domain: "Air", kv: "KV80", voltage: "24S", thrust: "44kg", weight: 1.854, rpm: 6500, efficiency: 96.1, description: "EVTOL propulsion motor for manned and unmanned vertical lift applications." },
  { model: "Haemng 1550", series: "Haemng", domain: "Air", kv: "KV50", voltage: "24S", thrust: "46kg", weight: 2.250, rpm: 5500, efficiency: 96.4, description: "Ultra-high efficiency cruise motor for long-endurance eVTOL platforms." },
  { model: "Haemng 8808", series: "Haemng", domain: "Air", kv: "KV160", voltage: "6-12S", thrust: "6kg", weight: 0.265, rpm: 11000, efficiency: 94.2, description: "Versatile multi-role motor for survey, inspection, and light transport drones." },
  { model: "Haemng 1015", series: "Haemng", domain: "Air", kv: "KV136", voltage: "12S", thrust: "18kg", weight: 0.636, rpm: 8500, efficiency: 95.8, description: "Premium eVTOL motor with redundant winding configuration for safety-critical applications." },
  // Maelard Series - Heavy Lift Motors
  { model: "Maelard 1026", series: "Maelard", domain: "Air", kv: "KV100", voltage: "12-14S", thrust: "35kg", weight: 0.850, rpm: 7500, efficiency: 96.2, description: "Heavy-lift propulsion system for cargo UAV and aerial work platforms." },
  { model: "Maelard 1240", series: "Maelard", domain: "Air", kv: "KV60", voltage: "12S", thrust: "43kg", weight: 1.280, rpm: 6000, efficiency: 96.5, description: "High-altitude operation motor with enhanced thermal management." },
  { model: "Maelard 1560", series: "Maelard", domain: "Air", kv: "KV36", voltage: "14-28S", thrust: "73kg", weight: 2.320, rpm: 4500, efficiency: 96.8, description: "Industrial-grade motor for heavy-lift UAV and prototype eVTOL aircraft." },
  { model: "Maelard 1780", series: "Maelard", domain: "Air", kv: "KV48", voltage: "14-28S", thrust: "79kg", weight: 3.509, rpm: 5000, efficiency: 97.1, description: "Flagship propulsion motor for certification-ready eVTOL and unmanned cargo aircraft." },
];

const SERIES_COLORS: Record<"Haemng" | "Maelard", string> = {
  Haemng: "text-domain-air border-domain-air",
  Maelard: "text-domain-robotics border-domain-robotics",
};

export function ProductsPage() {
  const [filter, setFilter] = useState<Series | "ALL">("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("model");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selectedMotor, setSelectedMotor] = useState<Motor | null>(null);

  const filtered = useMemo(() => {
    let list = filter === "ALL" ? MOTORS : MOTORS.filter((m) => m.series === filter);
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

  const FilterPill = ({ value, label }: { value: Series | "ALL"; label: string }) => {
    const seriesGlow: Record<Series | "ALL", string> = {
      ALL: "transparent",
      Haemng: "var(--d-air-glow)",
      Maelard: "var(--d-robotics-glow)",
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
          boxShadow: filter === value ? `0 0 16px ${seriesGlow[value]}` : "none",
        }}
      >
        {filter === value && (
          <span
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle, ${value === "ALL" ? "#F2B705" : value === "Haemng" ? "#3B8FEF" : "#8866CC"} 0%, transparent 70%)`,
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
              {(["ALL", "Haemng", "Maelard"] as const).map((s) => (
                <FilterPill key={s} value={s} label={s.toUpperCase()} />
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
                      { key: "model" as SortKey, label: "SERIES", sortable: false },
                      { key: "kv" as SortKey, label: "KV RATING" },
                      { key: "voltage" as SortKey, label: "VOLTAGE" },
                      { key: "thrust" as SortKey, label: "PEAK THRUST" },
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
                        <span className={`font-mono text-[8px] tracking-[0.18em] uppercase border px-[7px] py-[3px] ${SERIES_COLORS[m.series]}`}>
                          {m.series}
                        </span>
                      </td>
                      <td className="font-mono text-[13px] text-sb-0 px-4 py-3.5">{m.kv}</td>
                      <td className="font-mono text-[13px] text-sb-0 px-4 py-3.5">{m.voltage}</td>
                      <td className="font-mono text-[13px] text-sb-0 px-4 py-3.5">{m.thrust}</td>
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
                    <span className={`font-mono text-[8px] tracking-[0.18em] uppercase border px-[7px] py-[3px] rounded-[4px] ${SERIES_COLORS[m.series]}`}>
                      {m.series}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] block">KV Rating</span>
                      <span className="font-mono text-[13px] text-sb-0">{m.kv}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] block">Voltage</span>
                      <span className="font-mono text-[13px] text-sb-0">{m.voltage}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] block">Thrust</span>
                      <span className="font-mono text-[13px] text-sb-0">{m.thrust}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] block">Weight</span>
                      <span className="font-mono text-[13px] text-sb-0">{m.weight} kg</span>
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
                      <span className={`font-mono text-[8px] tracking-[0.18em] uppercase border px-[7px] py-[3px] rounded-[4px] ${SERIES_COLORS[selectedMotor.series]}`}>
                        {selectedMotor.series}
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
                  { label: "KV Rating", value: selectedMotor.kv },
                  { label: "Voltage", value: selectedMotor.voltage },
                  { label: "Thrust", value: selectedMotor.thrust },
                  { label: "Weight", value: `${selectedMotor.weight} kg` },
                  { label: "Max RPM", value: selectedMotor.rpm.toLocaleString() },
                  { label: "Peak η", value: `${selectedMotor.efficiency}%` },
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
