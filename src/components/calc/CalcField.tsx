"use client";

import React from "react";

interface CalcFieldProps {
  label: string;
  unit?: string;
  id: string;
  value: number | string;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function CalcField({
  label,
  unit,
  id,
  value,
  onChange,
  step = 1,
  min,
  max,
  disabled = false,
}: CalcFieldProps) {
  return (
    <div className="flex flex-col gap-1 group">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="font-mono text-[9px] tracking-[0.22em] uppercase text-[rgba(255,255,255,0.70)] flex items-center gap-2 flex-1 min-w-0 pr-2"
        >
          <span className="w-1 h-1 rounded-full bg-y opacity-0 group-focus-within:opacity-100 flex-shrink-0 transition-opacity" />
          <span className="truncate">{label}</span>
        </label>
        {unit && (
          <span className="font-mono text-[9px] tracking-[0.12em] text-[rgba(255,255,255,0.45)] bg-[rgba(255,255,255,0.06)] px-2 py-0.5 rounded-sm border border-[rgba(255,255,255,0.08)] group-focus-within:border-y/30 transition-colors">
            {unit}
          </span>
        )}
      </div>
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        step="any"
        min={min}
        max={max}
        disabled={disabled}
        className="font-mono text-[12px] text-white bg-sb-1 border border-sb-3 rounded-[2px] px-3 py-2.5 w-full focus:outline-none focus:border-y focus:ring-2 focus:ring-y/15 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(242,183,5,0.08)]"
      />
    </div>
  );
}
