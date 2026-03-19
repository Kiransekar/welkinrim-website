"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface NarrativeSlide {
  id: string;
  titleWhite: string;
  titleAccent: string;
  body: string;
  visual: React.ReactNode;
}

interface StickyScrollNarrativeProps {
  slides: NarrativeSlide[];
  sectionLabel?: string;
}

export function StickyScrollNarrative({
  slides,
  sectionLabel = "Scroll narrative",
}: StickyScrollNarrativeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const containerTop = -rect.top;
    const singleSlideHeight = window.innerHeight;
    const rawIndex = containerTop / singleSlideHeight;
    const clampedIndex = Math.max(
      0,
      Math.min(slides.length - 1, Math.floor(rawIndex + 0.5))
    );

    setActiveIndex(clampedIndex);
  }, [slides.length]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const totalHeight = slides.length * 100;

  return (
    <section
      ref={containerRef}
      aria-label={sectionLabel}
      className="relative bg-[#07070A]"
      style={{ height: `${totalHeight}vh` }}
    >
      {/* Viewport-locked visible area */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Subtle radial spotlight behind the visual column */}
        <div
          className="absolute top-0 right-0 w-[55%] h-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(242,183,5,0.04) 0%, transparent 70%)",
          }}
        />

        <div className="flex h-full">
          {/* ── LEFT COLUMN — Sticky Text (45%) ── */}
          <div className="w-full lg:w-[45%] flex items-end lg:items-center relative z-10">
            <div className="px-[clamp(20px,5vw,64px)] pb-16 lg:pb-0 lg:pl-[clamp(20px,5vw,64px)] lg:pr-12 w-full">
              {/* Progress indicator */}
              <div className="flex items-center gap-3 mb-10">
                {slides.map((_, i) => (
                  <div
                    key={i}
                    className="relative h-[2px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ width: i === activeIndex ? 32 : 12 }}
                  >
                    <div
                      className="absolute inset-0 rounded-full transition-all duration-700"
                      style={{
                        backgroundColor:
                          i === activeIndex
                            ? "#F2B705"
                            : "rgba(255,255,255,0.12)",
                      }}
                    />
                    {i === activeIndex && (
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          backgroundColor: "#F2B705",
                          filter: "blur(4px)",
                          opacity: 0.5,
                        }}
                      />
                    )}
                  </div>
                ))}
                <span className="font-mono text-[9px] tracking-[0.22em] text-[rgba(255,255,255,0.25)] ml-2">
                  {String(activeIndex + 1).padStart(2, "0")}/{String(slides.length).padStart(2, "0")}
                </span>
              </div>

              {/* Text content with crossfade */}
              <div className="relative min-h-[280px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slides[activeIndex].id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <h2 className="font-syncopate font-bold text-[clamp(36px,5.5vw,72px)] leading-[0.92] tracking-[-0.01em]">
                      <span className="text-white block">
                        {slides[activeIndex].titleWhite}
                      </span>
                      <span className="text-y block mt-1">
                        {slides[activeIndex].titleAccent}
                      </span>
                    </h2>
                    <p className="font-work text-[clamp(14px,1.2vw,16px)] leading-[1.72] text-[rgba(255,255,255,0.55)] max-w-[420px] mt-8">
                      {slides[activeIndex].body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN — Scrolling Visuals (55%) ── */}
          <div className="hidden lg:block w-[55%] h-full relative">
            {/* This is the viewport window — content scrolls behind it */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="will-change-transform"
                animate={{ y: -(activeIndex * 100) + "vh" }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {slides.map((slide, i) => (
                  <div
                    key={slide.id}
                    className="h-screen w-full flex items-center justify-center relative"
                  >
                    {/* Warm spotlight behind visual */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(ellipse at 50% 50%, rgba(242,183,5,0.06) 0%, transparent 60%)",
                        opacity: i === activeIndex ? 1 : 0.3,
                        transition: "opacity 0.8s ease",
                      }}
                    />
                    <div className="relative z-10 w-full h-full flex items-center justify-center p-8 lg:p-16">
                      {slide.visual}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Subtle edge vignette */}
            <div
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                background:
                  "linear-gradient(90deg, #07070A 0%, transparent 8%), linear-gradient(270deg, #07070A 0%, transparent 3%), linear-gradient(180deg, #07070A 0%, transparent 5%), linear-gradient(0deg, #07070A 0%, transparent 5%)",
              }}
            />
          </div>
        </div>

        {/* Mobile: show current visual below text */}
        <div className="lg:hidden absolute top-0 left-0 right-0 h-[50vh] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={slides[activeIndex].id + "-mobile"}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full flex items-center justify-center p-6"
            >
              {slides[activeIndex].visual}
            </motion.div>
          </AnimatePresence>
          {/* Bottom fade into text */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{
              background:
                "linear-gradient(0deg, #07070A 0%, transparent 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
