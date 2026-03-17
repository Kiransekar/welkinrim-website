"use client";

import React from "react";

interface ANSYSFrameProps {
  title: string;
  colorbarMax?: string;
  colorbarMin?: string;
  colorbarUnit?: string;
  children: React.ReactNode;
  className?: string;
}

const COLORBAR_STOPS = [
  "#FF0000",
  "#FF5500",
  "#FF9900",
  "#FFCC00",
  "#CCFF00",
  "#00FF88",
  "#00AAFF",
  "#0033FF",
];

export function ANSYSFrame({
  title,
  colorbarMax,
  colorbarMin,
  colorbarUnit,
  children,
  className = "",
}: ANSYSFrameProps) {
  return (
    <div
      className={`relative border border-d-land/20 rounded-[4px] overflow-hidden bg-[#050508] group ${className}`}
      style={{
        boxShadow: "0 0 40px rgba(242, 183, 5, 0.03), inset 0 0 0 1px rgba(255,255,255,0.02)",
      }}
    >
      {/* Subtle glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top, rgba(var(--d-land-rgb), 0.06) 0%, transparent 50%)`,
          filter: "blur(40px)",
        }}
      />

      {/* Header */}
      <div className="relative h-[28px] bg-[rgba(255,255,255,0.03)] flex items-center px-3 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex gap-[6px]">
          <div
            className="w-2 h-2 rounded-full bg-[#FF5F57] shadow-[0_0_6px_#FF5F57]"
            style={{ opacity: 0.8 }}
          />
          <div
            className="w-2 h-2 rounded-full bg-[#FEBC2E] shadow-[0_0_6px_#FEBC2E]"
            style={{ opacity: 0.8 }}
          />
          <div
            className="w-2 h-2 rounded-full bg-[#28C840] shadow-[0_0_6px_#28C840]"
            style={{ opacity: 0.8 }}
          />
        </div>
        <span className="ml-3 font-mono text-[9px] text-[rgba(255,255,255,0.30)] tracking-[0.1em]">
          ANSYS Workbench — {title}
        </span>
      </div>

      <div className="relative flex min-h-[200px]">
        {colorbarMax && colorbarMin && (
          <div className="w-[18px] flex-shrink-0 flex flex-col items-center py-3 ml-2">
            <span className="font-mono text-[7px] text-[rgba(255,255,255,0.45)] mb-1 tracking-[0.1em]">
              {colorbarMax}
            </span>
            <div className="flex-1 w-[4px] rounded-sm overflow-hidden relative">
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(to bottom, ${COLORBAR_STOPS.join(", ")})`,
                  boxShadow: "0 0 12px rgba(255,255,255,0.2)",
                }}
              />
              {/* Glossy overlay */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: "linear-gradient(90deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)",
                }}
              />
            </div>
            <span className="font-mono text-[7px] text-[rgba(255,255,255,0.45)] mt-1 tracking-[0.1em]">
              {colorbarMin}
            </span>
            {colorbarUnit && (
              <span className="font-mono text-[6px] text-[rgba(255,255,255,0.35)] mt-0.5 tracking-[0.1em]">
                {colorbarUnit}
              </span>
            )}
          </div>
        )}

        <div className="flex-1 relative p-4">
          {/* Enhanced grid background */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-d-land/40 rounded-tl-[2px]" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-d-land/40 rounded-tr-[2px]" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-d-land/40 rounded-bl-[2px]" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-d-land/40 rounded-br-[2px]" />
          <div className="relative z-10">{children}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-3 py-1.5 border-t border-[rgba(255,255,255,0.04)]">
        <span className="font-mono text-[6px] text-[rgba(255,255,255,0.15)] tracking-[0.15em] uppercase">
          Simulation Preview
        </span>
        <span className="font-mono text-[7px] text-[rgba(255,255,255,0.12)] tracking-[0.1em]">
          WelkinRim Technologies — Proprietary
        </span>
      </div>
    </div>
  );
}
