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
    <div className="bg-sb-0 border-b border-sb-3 px-6 py-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="font-mono text-[8px] tracking-[0.28em] uppercase px-2 py-0.5 rounded-sm"
              style={{
                color: domainColor ?? "#F2B705",
                backgroundColor: `${domainColor ?? "#F2B705"}15`,
              }}
            >
              {domain}
            </span>
            <span className="font-mono text-[8px] tracking-[0.18em] text-[rgba(255,255,255,0.30)] uppercase">
              {accuracy}
            </span>
          </div>
          <h2 className="font-syncopate font-bold text-[clamp(18px,2.5vw,28px)] text-white leading-[1] mb-2">
            {title}
          </h2>
          <p className="font-work text-[13px] leading-[1.6] text-[rgba(255,255,255,0.50)] max-w-[500px]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
