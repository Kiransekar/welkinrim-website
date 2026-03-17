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
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timeout = setTimeout(() => {
        setHasAnimated(true);
        const controls = animate(0, value, {
          duration: 1.4,
          ease: [0.16, 1, 0.3, 1],
          onUpdate(v) {
            setDisplayValue(Math.round(v));
          },
        });
        return () => controls.stop();
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [isInView, value, delay, hasAnimated]);

  return (
    <div ref={ref} className="flex flex-col gap-2 group">
      <div className="flex items-baseline">
        <span
          className="font-syncopate font-bold text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-sb-0 relative"
          style={{
            textShadow: hasAnimated ? "0 0 20px rgba(242, 183, 5, 0.3)" : "none",
            transition: "text-shadow 0.6s ease-out",
          }}
        >
          {displayValue}
        </span>
        {suffix && (
          <span
            className="font-syncopate font-bold text-[clamp(20px,2.5vw,36px)] text-sb-0 ml-1"
            style={{
              textShadow: hasAnimated ? "0 0 20px rgba(242, 183, 5, 0.2)" : "none",
              transition: "text-shadow 0.6s ease-out 0.2s",
            }}
          >
            {suffix}
          </span>
        )}
        {/* Subtle glow background */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(242, 183, 5, 0.08) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
      </div>
      <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#8A8A96] relative">
        {label}
        <span
          className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-y transition-all duration-500 group-hover:w-full"
          style={{ boxShadow: "0 0 4px rgba(242, 183, 5, 0.6)" }}
        />
      </span>
    </div>
  );
}
