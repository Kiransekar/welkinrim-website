"use client";

import React from "react";

interface CalcResultRowProps {
  label: string;
  value: string | number;
  unit?: string;
  style?: "normal" | "highlight" | "danger" | "ok";
}

const styleMap = {
  normal: "text-[rgba(255,255,255,0.85)]",
  highlight: "text-y",
  danger: "text-[#FF6B6B]",
  ok: "text-[#4ADE80]",
};

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

  return (
    <div className="flex items-center justify-between py-2 border-b border-sb-3 last:border-0">
      <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-[rgba(255,255,255,0.38)]">
        {label}
      </span>
      <span className={`font-mono text-[13px] font-bold ${styleMap[style]}`}>
        {formatted}
        {unit && (
          <span className="text-[10px] font-normal text-[rgba(255,255,255,0.30)] ml-1">
            {unit}
          </span>
        )}
      </span>
    </div>
  );
}
