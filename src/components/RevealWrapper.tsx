"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface RevealWrapperProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function RevealWrapper({ children, delay = 0, className = "" }: RevealWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.12 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{
        duration: 0.72,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
