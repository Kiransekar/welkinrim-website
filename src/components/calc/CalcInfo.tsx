"use client";

import React from "react";

interface CalcInfoProps {
  message: string;
}

export function CalcInfo({ message }: CalcInfoProps) {
  return (
    <div className="flex items-start gap-2 px-3 py-2 rounded-[2px] bg-[rgba(59,143,239,0.06)] border border-[rgba(59,143,239,0.22)]">
      <span className="text-[#3B8FEF] text-[12px] flex-shrink-0 mt-px">ℹ</span>
      <span className="font-mono text-[9px] tracking-[0.06em] text-[#3B8FEF] leading-[1.5]">
        {message}
      </span>
    </div>
  );
}
