"use client";

import React from "react";

export interface CalcTab {
  id: string;
  label: string;
  badge: string;
}

export interface CalcGroup {
  domain: string;
  colour: string | null;
  tabs: CalcTab[];
}

export const calcGroups: CalcGroup[] = [
  {
    domain: "UNIVERSAL",
    colour: null,
    tabs: [
      { id: "torque", label: "Torque · Power · Speed", badge: "All" },
      { id: "thermal", label: "Motor Thermal Rating", badge: "All" },
      { id: "busbar", label: "Busbar / Wire Sizing", badge: "All" },
      { id: "efficiency", label: "Drive Efficiency", badge: "All" },
    ],
  },
  {
    domain: "AIR",
    colour: "#3B8FEF",
    tabs: [
      { id: "drone", label: "Drone Motor Selector", badge: "UAV" },
      { id: "propeller", label: "Propeller Performance", badge: "BEMT" },
      { id: "evtol", label: "eVTOL Hover Endurance", badge: "eVTOL" },
    ],
  },
  {
    domain: "WATER",
    colour: "#00B4CC",
    tabs: [{ id: "marine", label: "Marine Propulsion", badge: "AUV" }],
  },
  {
    domain: "LAND",
    colour: "#F2B705",
    tabs: [
      { id: "evrange", label: "EV Drive Range", badge: "EV" },
      { id: "evcharge", label: "EV Charging Session", badge: "Charge" },
    ],
  },
  {
    domain: "ROBOTICS",
    colour: "#8866CC",
    tabs: [
      { id: "joint", label: "Robot Joint Torque", badge: "Arm" },
      { id: "servo", label: "Servo / Actuator Sizing", badge: "Control" },
    ],
  },
];

interface CalcSidebarProps {
  activeId: string;
  onSelect: (id: string) => void;
}

export function CalcSidebar({ activeId, onSelect }: CalcSidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] lg:w-[240px] md:w-[200px] flex-shrink-0 bg-sb-0 border-r border-sb-3 h-full overflow-y-auto relative">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(242,183,5,0.02)] to-transparent pointer-events-none" />
        <div className="px-4 pt-5 pb-3 relative z-10">
          <span className="font-display font-bold text-[11px] text-white tracking-[0.08em]" style={{ textShadow: "0 0 16px rgba(242, 183, 5, 0.2)" }}>
            CALCULATORS
          </span>
        </div>
        <div className="w-full h-px bg-sb-3 relative z-10" />
        <nav className="flex-1 py-2 relative z-10">
          {calcGroups.map((group) => (
            <div key={group.domain} className="mb-1">
              <div className="px-4 py-2">
                <span
                  className="font-mono text-[8px] tracking-[0.28em] uppercase flex items-center gap-2"
                  style={{ color: group.colour ?? "rgba(255,255,255,0.22)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: group.colour ?? "rgba(255,255,255,0.22)", boxShadow: group.colour ? `0 0 8px ${group.colour}60` : "none" }} />
                  {group.domain}
                </span>
              </div>
              {group.tabs.map((tab) => {
                const isActive = tab.id === activeId;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelect(tab.id)}
                    className={`w-full text-left px-4 py-2.5 flex items-center gap-2 transition-all duration-200 border-l-2 relative group ${
                      isActive
                        ? "bg-sb-1 text-y border-y"
                        : "text-[rgba(255,255,255,0.40)] border-transparent hover:text-[rgba(255,255,255,0.65)] hover:bg-[rgba(255,255,255,0.02)]"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(90deg, ${group.colour ?? "#F2B705"}20 0%, transparent 100%)` }} />
                    )}
                    <span className="font-mono text-[10px] tracking-[0.04em] leading-tight truncate relative z-10">
                      {tab.label}
                    </span>
                    <span
                      className={`font-mono text-[7px] tracking-[0.16em] px-1.5 py-0.5 rounded-sm flex-shrink-0 transition-all duration-200 relative z-10 ${
                        isActive
                          ? "bg-[rgba(242,183,5,0.12)] text-y"
                          : "bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.22)] group-hover:bg-[rgba(255,255,255,0.08)]"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-sb-3 relative z-10">
          <p className="font-mono text-[8px] tracking-[0.12em] text-[rgba(255,255,255,0.18)] italic leading-[1.6]">
            From India — for the world
          </p>
        </div>
      </aside>

      {/* Mobile horizontal tabs */}
      <div className="md:hidden w-full bg-sb-0 border-b border-sb-3 overflow-x-auto relative">
        <div className="flex gap-0 min-w-max">
          {calcGroups.flatMap((g) =>
            g.tabs.map((tab) => {
              const isActive = tab.id === activeId;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelect(tab.id)}
                  className={`px-4 py-3 font-mono text-[9px] tracking-[0.08em] whitespace-nowrap transition-all duration-200 border-b-2 relative group ${
                    isActive
                      ? "text-y border-y bg-sb-1"
                      : "text-[rgba(255,255,255,0.40)] border-transparent hover:text-[rgba(255,255,255,0.65)] hover:bg-[rgba(255,255,255,0.02)]"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(180deg, rgba(242, 183, 5, 0.15) 0%, transparent 100%)` }} />
                  )}
                  <span className="relative z-10">
                    {tab.label}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
