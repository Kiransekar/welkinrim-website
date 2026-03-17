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
      className={`border border-[rgba(242,183,5,0.18)] rounded-[4px] overflow-hidden bg-[#050508] ${className}`}
    >
      <div className="h-[28px] bg-[rgba(255,255,255,0.03)] flex items-center px-3 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex gap-[6px]">
          <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
          <div className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
          <div className="w-2 h-2 rounded-full bg-[#28C840]" />
        </div>
        <span className="ml-3 font-mono text-[9px] text-[rgba(255,255,255,0.24)]">
          ANSYS Workbench — {title}
        </span>
      </div>

      <div className="relative flex min-h-[200px]">
        {colorbarMax && colorbarMin && (
          <div className="w-[14px] flex-shrink-0 flex flex-col items-center py-3 ml-2">
            <span className="font-mono text-[8px] text-[rgba(255,255,255,0.40)] mb-1">
              {colorbarMax}
            </span>
            <div className="flex-1 w-3 rounded-sm overflow-hidden">
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(to bottom, ${COLORBAR_STOPS.join(", ")})`,
                }}
              />
            </div>
            <span className="font-mono text-[8px] text-[rgba(255,255,255,0.40)] mt-1">
              {colorbarMin}
            </span>
            {colorbarUnit && (
              <span className="font-mono text-[7px] text-[rgba(255,255,255,0.30)] mt-0.5">
                {colorbarUnit}
              </span>
            )}
          </div>
        )}

        <div className="flex-1 relative p-4">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative z-10">{children}</div>
        </div>
      </div>

      <div className="flex justify-end px-3 py-1">
        <span className="font-mono text-[7px] text-[rgba(255,255,255,0.10)]">
          WelkinRim Technologies — Proprietary
        </span>
      </div>
    </div>
  );
}
