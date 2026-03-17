"use client";

import React from "react";

interface LogoProps {
  variant: "light" | "dark" | "inverted";
  className?: string;
}

export function Logo({ variant, className = "" }: LogoProps) {
  const welkinrimColor =
    variant === "inverted" ? "#09090B" : "#F2B705";
  const techColor =
    variant === "light"
      ? "#6B6B6B"
      : variant === "dark"
      ? "#FFFFFF"
      : "#09090B";
  const markSquare =
    variant === "inverted" ? "#09090B" : "#F2B705";
  const markBars =
    variant === "inverted" ? "#F2B705" : "#09090B";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="2" fill={markSquare} />
        <rect x="8" y="6" width="3" height="20" rx="1" fill={markBars} />
        <rect x="14" y="6" width="3" height="20" rx="1" fill={markBars} />
        <rect x="20" y="6" width="3" height="20" rx="1" fill={markBars} />
        <line
          x1="26"
          y1="4"
          x2="22"
          y2="28"
          stroke={markSquare === "#09090B" ? "#F2B705" : "#09090B"}
          strokeWidth="1.5"
          style={{ transform: "rotate(-12deg)", transformOrigin: "center" }}
        />
      </svg>
      <div className="flex flex-col leading-none">
        <span
          className="font-syncopate font-bold text-[13px] tracking-[0.02em]"
          style={{ color: welkinrimColor }}
        >
          WELKINRIM
        </span>
        <span
          className="font-syncopate font-normal text-[7px] tracking-[0.12em]"
          style={{ color: techColor }}
        >
          TECHNOLOGIES
        </span>
      </div>
    </div>
  );
}
