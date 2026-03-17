"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface RevealWrapperProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: "fade" | "slide" | "scale" | "blur";
  stagger?: boolean;
  staggerDelay?: number;
}

const variants = {
  fade: {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
  slide: {
    hidden: { opacity: 0, y: 48 },
    visible: { opacity: 1, y: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(8px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
};

export function RevealWrapper({
  children,
  delay = 0,
  className = "",
  variant = "fade",
  stagger = false,
  staggerDelay = 0.08,
}: RevealWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.12, margin: "-40px" });

  const baseVariants = variants[variant];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={stagger ? undefined : baseVariants}
      transition={{
        duration: 0.72,
        delay,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: stagger ? staggerDelay : 0,
      }}
      className={className}
    >
      {stagger && Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              variants={baseVariants}
              transition={{
                duration: 0.6,
                delay: delay + i * staggerDelay,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
