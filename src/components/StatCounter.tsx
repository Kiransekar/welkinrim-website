"use client";

import React, { useRef, useEffect, useState } from "react";
import { useInView, animate } from "framer-motion";

interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}

export function StatCounter({ value, suffix = "", label, delay = 0 }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.2,
    margin: "0px 0px -80px 0px",
  });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        const controls = animate(0, value, {
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
          onUpdate(v) {
            setDisplayValue(Math.round(v));
          },
        });
        return () => controls.stop();
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [isInView, value, delay]);

  return (
    <div ref={ref} className="flex flex-col gap-2">
      <div className="flex items-baseline">
        <span className="font-syncopate font-bold text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-sb-0">
          {displayValue}
        </span>
        {suffix && (
          <span className="font-syncopate font-bold text-[clamp(20px,2.5vw,36px)] text-sb-0 ml-1">
            {suffix}
          </span>
        )}
      </div>
      <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#8A8A96]">
        {label}
      </span>
    </div>
  );
}
