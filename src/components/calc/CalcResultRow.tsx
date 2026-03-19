"use client";

import React from "react";

interface CalcResultRowProps {
  label: string;
  value: string | number;
  unit?: string;
  style?: "normal" | "highlight" | "danger" | "ok";
}

export function CalcResultRow({
  label,
  value,
  unit,
  style = "normal",
}: CalcResultRowProps) {
  const formatted =
    typeof value === "number"
      ? isFinite(value) && !isNaN(value)
        ? value.toFixed(2)
        : "—"
      : value;

  const styleRowMap = {
    normal: "text-tw-1",
    highlight: "text-y",
    danger: "text-[#FF6B6B]",
    ok: "text-[#4ADE80]",
  };

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white-3 last:border-0 group hover:bg-white-1 -mx-2 px-2 rounded-[2px] transition-all duration-200">
      <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-tw-3 group-hover:text-tw-2 transition-colors">
        {label}
      </span>
      <span className={`font-mono text-[13px] font-bold ${styleRowMap[style]} relative`}>
        {formatted}
        {unit && (
          <span className="text-[10px] font-normal text-tw-3 ml-1">
            {unit}
          </span>
        )}
        {style === "highlight" && (
          <span className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-[1px] bg-y transition-all duration-500 group-hover:w-full" style={{ boxShadow: "0 0 4px rgba(242, 183, 5, 0.6)" }} />
        )}
      </span>
    </div>
  );
}
