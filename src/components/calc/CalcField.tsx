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
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96]"
        >
          {label}
        </label>
        {unit && (
          <span className="font-mono text-[9px] tracking-[0.12em] text-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.04)] px-2 py-0.5 rounded-sm">
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
        className="font-mono text-[12px] text-white bg-sb-1 border border-sb-3 rounded-[2px] px-3 py-2 w-full focus:outline-none focus:border-y focus:ring-2 focus:ring-y/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      />
    </div>
  );
}
