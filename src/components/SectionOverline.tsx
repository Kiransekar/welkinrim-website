"use client";

import React from "react";

interface SectionOverlineProps {
  text: string;
  variant?: "dark" | "light";
  centered?: boolean;
  animated?: boolean;
}

export function SectionOverline({ text, variant = "dark", centered = false, animated = true }: SectionOverlineProps) {
  return (
    <div className={`flex items-center gap-3 mb-6 ${centered ? "justify-center" : ""}`}>
      {variant === "dark" && (
        <>
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
            className={animated ? "animate-draw-line" : ""}
          >
            <line
              x1="4"
              y1="26"
              x2="24"
              y2="2"
              stroke="rgb(242, 183, 5)"
              strokeWidth="1"
              strokeLinecap="round"
              style={{
                strokeDasharray: 28,
                strokeDashoffset: animated ? 28 : 0,
                animation: animated ? "drawLine 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards" : "none",
              }}
            />
          </svg>
          <style jsx>{`
            @keyframes drawLine {
              to { stroke-dashoffset: 0; }
            }
          `}</style>
        </>
      )}
      <span
        className={`font-mono text-[10px] tracking-[0.32em] uppercase ${
          variant === "dark" ? "text-y" : "text-[#8A8A96]"
        } ${animated ? "opacity-0 animate-fade-in" : "opacity-100"}`}
        style={{
          animation: animated ? `fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards` : "none",
        }}
      >
        {text}
      </span>
      {variant === "dark" && (
        <>
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateX(8px); }
              to { opacity: 1; transform: translateX(0); }
            }
          `}</style>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-y to-transparent opacity-30 max-w-[120px]" />
        </>
      )}
    </div>
  );
}
