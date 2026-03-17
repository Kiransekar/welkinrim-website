"use client";

import React from "react";

interface CalcWarningProps {
  message: string;
}

export function CalcWarning({ message }: CalcWarningProps) {
  return (
    <div className="flex items-start gap-2 px-3 py-2 rounded-[2px] bg-[rgba(242,183,5,0.08)] border border-[rgba(242,183,5,0.28)]">
      <span className="text-y text-[12px] flex-shrink-0 mt-px">⚠</span>
      <span className="font-mono text-[9px] tracking-[0.06em] text-y leading-[1.5]">
        {message}
      </span>
    </div>
  );
}
