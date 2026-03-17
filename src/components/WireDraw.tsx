"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function WireDraw() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="relative w-full h-[2px] overflow-hidden my-0">
      {/* Mobile: simple opacity crossfade */}
      <div className="block lg:hidden w-full h-[1px] bg-y opacity-20" />

      {/* Desktop: wire-draw animation */}
      <div className="hidden lg:block relative w-full h-[2px]">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left" }}
          className="absolute inset-0 bg-y h-[2px]"
        />
        {isInView && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1, 1.5, 2], opacity: [0, 1, 0.5, 0] }}
            transition={{ delay: 1, duration: 0.38, ease: "easeOut" }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[34px] h-[34px] rounded-full"
            style={{
              background: "radial-gradient(circle, #FFFFFF 0%, #F2B705 60%, transparent 100%)",
            }}
          />
        )}
        <motion.div
          initial={{ opacity: 1 }}
          animate={isInView ? { opacity: 0 } : { opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.4, ease: "easeIn" }}
          className="absolute inset-0 bg-y h-[2px]"
          style={{ transformOrigin: "left" }}
        />
      </div>
    </div>
  );
}
