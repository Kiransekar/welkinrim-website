"use client";

import React from "react";

interface CalcHeaderProps {
  title: string;
  description: string;
  accuracy: string;
  domain: string;
  domainColor?: string;
}

export function CalcHeader({
  title,
  description,
  accuracy,
  domain,
  domainColor,
}: CalcHeaderProps) {
  return (
    <div className="bg-sb-0 border-b border-sb-3 px-6 py-5 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top, rgba(242, 183, 5, 0.04) 0%, transparent 50%)",
        }}
      />
      <div className="flex items-start justify-between gap-4 flex-wrap relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="font-mono text-[8px] tracking-[0.28em] uppercase px-2 py-0.5 rounded-sm relative overflow-hidden"
              style={{
                color: domainColor ?? "#F2B705",
                backgroundColor: `${domainColor ?? "#F2B705"}15`,
                boxShadow: `0 0 12px ${domainColor ?? "#F2B705"}30`,
              }}
            >
              <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(90deg, transparent, ${domainColor ?? "#F2B705"}20, transparent)` }} />
              {domain}
            </span>
            <span className="font-mono text-[8px] tracking-[0.18em] text-[rgba(255,255,255,0.50)] uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" style={{ boxShadow: "0 0 8px rgba(74, 222, 128, 0.6)" }} />
              {accuracy}
            </span>
          </div>
          <h2 className="font-syncopate font-bold text-[clamp(18px,2.5vw,28px)] text-white leading-[1] mb-2" style={{ textShadow: "0 0 30px rgba(242, 183, 5, 0.3)" }}>
            {title}
          </h2>
          <p className="font-work text-[13px] leading-[1.6] text-[rgba(255,255,255,0.75)] max-w-[500px]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
