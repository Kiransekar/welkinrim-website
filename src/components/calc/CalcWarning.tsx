"use client";

import React from "react";

interface CalcWarningProps {
  message: string;
}

export function CalcWarning({ message }: CalcWarningProps) {
  return (
    <div className="flex items-start gap-2 px-3 py-2.5 rounded-[2px] bg-[rgba(242,183,5,0.08)] border border-[rgba(242,183,5,0.28)] relative overflow-hidden group">
      <span className="text-y text-[12px] flex-shrink-0 mt-px relative z-10" style={{ textShadow: "0 0 8px rgba(242, 183, 5, 0.4)" }}>⚠</span>
      <span className="font-mono text-[9px] tracking-[0.06em] text-y leading-[1.5] relative z-10">
        {message}
      </span>
      {/* Subtle animated shimmer */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(242, 183, 5, 0.08), transparent)",
          animation: "shimmer 2s ease-in-out infinite",
        }}
      />
    </div>
  );
}
