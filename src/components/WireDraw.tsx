"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function WireDraw() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="relative w-full h-[2px] overflow-hidden my-0">
      {/* Mobile: simple opacity crossfade */}
      <div className="block lg:hidden w-full h-[1px] bg-y opacity-20" />

      {/* Desktop: wire-draw animation with enhanced effects */}
      <div className="hidden lg:block relative w-full h-[2px]">
        {/* Main line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0.5 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0.5 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left" }}
          className="absolute inset-0 bg-gradient-to-r from-y via-y-hi to-y h-[2px]"
        />

        {/* Glow overlay */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 0.6 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            transformOrigin: "left",
            filter: "blur(4px)",
          }}
          className="absolute inset-0 bg-y h-[4px] -top-[1px]"
        />

        {/* Leading particle */}
        {isInView && (
          <>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.2, 1, 1.5, 0],
                opacity: [0, 1, 1, 0.5, 0],
              }}
              transition={{ delay: 1.2, duration: 0.5, ease: "easeOut" }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full"
              style={{
                background: "radial-gradient(circle, #FFFFFF 0%, #FFD23F 40%, #F2B705 70%, transparent 100%)",
              }}
            />
            {/* Particle trail */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "120px", opacity: [0, 0.8, 0] }}
              transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
              className="absolute right-0 top-1/2 -translate-y-1/2 h-[2px]"
              style={{
                background: "linear-gradient(90deg, transparent, #F2B705, transparent)",
                filter: "blur(2px)",
              }}
            />
          </>
        )}

        {/* Fade out effect */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={isInView ? { opacity: 0 } : { opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5, ease: "easeIn" }}
          className="absolute inset-0 bg-y h-[2px]"
          style={{ transformOrigin: "left" }}
        />

        {/* Sparkle particles */}
        {isInView && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                  x: [0, (i - 2) * 20, 0],
                  y: [0, -10 - i * 5, 0],
                }}
                transition={{ delay: 1.3 + i * 0.1, duration: 0.4, ease: "easeOut" }}
                className="absolute right-[60px] top-1/2 w-[3px] h-[3px] rounded-full bg-y"
                style={{ filter: "blur(0.5px)" }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
