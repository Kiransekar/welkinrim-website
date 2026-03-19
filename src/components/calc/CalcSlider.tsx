"use client";

import React from "react";

interface CalcSliderProps {
  label: string;
  unit: string;
  id: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}

export function CalcSlider({
  label,
  unit,
  id,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: CalcSliderProps) {
  const display = format ? format(value) : `${value.toFixed(1)} ${unit}`;
  const percentage = ((value - min) / (max - min)) * 100;

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
        <span className="font-mono text-[12px] font-bold text-y">
          {display}
        </span>
      </div>
      <div className="relative h-[14px] flex items-center">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-[3px] bg-white-3 appearance-none cursor-pointer rounded-full relative z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[16px] [&::-webkit-slider-thumb]:h-[16px] [&::-webkit-slider-thumb]:bg-y [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(242,183,5,0.6)] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200 [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-[16px] [&::-moz-range-thumb]:h-[16px] [&::-moz-range-thumb]:bg-y [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-[0_0_12px_rgba(242,183,5,0.6)] [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-200 [&::-moz-range-thumb]:hover:scale-110 focus:outline-none focus:ring-2 focus:ring-y/20"
          style={{
            background: `linear-gradient(to right, #F2B705 0%, #F2B705 ${percentage}%, var(--white-3) ${percentage}%, var(--white-3) 100%)`,
          }}
        />
        <div
          className="absolute inset-0 h-[3px] bg-gradient-to-r from-y via-y-hi to-y rounded-full opacity-30 blur-[2px] pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - percentage}% 0 0)` }}
        />
      </div>
    </div>
  );
}
