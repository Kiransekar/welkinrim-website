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
          className="font-mono text-[9px] tracking-[0.22em] uppercase text-tw-3 flex items-center gap-2"
        >
          <span className="w-1 h-1 rounded-full bg-y opacity-0 group-focus-within:opacity-100 transition-opacity" />
          {label}
        </label>
        {unit && (
          <span className="font-mono text-[9px] tracking-[0.12em] text-tw-3 bg-white-2 px-2 py-0.5 rounded-sm border border-white-3 group-focus-within:border-y/50 transition-colors">
            {unit}
          </span>
        )}
      </div>
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        step={step}
        min={min}
        max={max}
        disabled={disabled}
        className="font-mono text-[12px] text-tw-1 bg-white-0 border border-white-3 rounded-[2px] px-3 py-2.5 w-full focus:outline-none focus:border-y focus:ring-2 focus:ring-y/15 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(242,183,5,0.08)]"
      />
    </div>
  );
}
