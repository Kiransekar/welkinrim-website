"use client";

import React from "react";

interface SectionOverlineProps {
  text: string;
  variant?: "dark" | "light";
}

export function SectionOverline({ text, variant = "dark" }: SectionOverlineProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {variant === "dark" && (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <line
            x1="4"
            y1="26"
            x2="24"
            y2="2"
            stroke="#F2B705"
            strokeWidth="1"
          />
        </svg>
      )}
      <span
        className={`font-mono text-[10px] tracking-[0.32em] uppercase ${
          variant === "dark" ? "text-y" : "text-[#8A8A96]"
        }`}
      >
        {text}
      </span>
    </div>
  );
}
