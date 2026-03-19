"use client";

import React from "react";
import Link from "next/link";
import { RevealWrapper } from "@/components/RevealWrapper";
import { SectionOverline } from "@/components/SectionOverline";

const ENGINEERING_STEPS = [
  {
    number: "01",
    title: "DEFINE",
    description:
      "Application requirements, operating envelope, environmental constraints, and certification targets are captured in a formal Motor Requirements Document.",
    details: ["Power & torque specs", "Thermal environment", "Size & weight limits", "Duty cycle profile"],
  },
  {
    number: "02",
    title: "DESIGN",
    description:
      "Electromagnetic topology selection, slot-pole combination, winding configuration, and material selection based on the MRD. Parametric models created in MATLAB.",
    details: ["Topology selection", "Winding layout", "Material specification", "Parametric modelling"],
  },
  {
    number: "03",
    title: "SIMULATE",
    description:
      "Six-layer ANSYS validation: Flux Density, Thermal, Efficiency Map, Structural Stress, Cogging Torque, and FOC Controller. No prototype is cut until all six pass.",
    details: ["Flux density analysis", "Thermal propagation", "Efficiency mapping", "Structural FEA"],
  },
  {
    number: "04",
    title: "VERIFY",
    description:
      "Physical prototype manufactured in-house. Dyno testing against simulation predictions. Thermal imaging. Vibration analysis. Back-EMF waveform capture.",
    details: ["Dyno testing", "Thermal imaging", "Vibration analysis", "EMF verification"],
  },
  {
    number: "05",
    title: "DELIVER",
    description:
      "Production tooling, quality inspection fixtures, and supply chain established. Motors delivered with full test data package including efficiency maps and thermal reports.",
    details: ["Production tooling", "QC fixtures", "Test data package", "Delivery & support"],
  },
];

const SALES_STEPS = [
  {
    number: "01",
    title: "Initial Enquiry",
    description: "Share your application requirements via the contact form or email. We respond within 24 hours with an initial feasibility assessment.",
    time: "Day 1",
  },
  {
    number: "02",
    title: "Requirements Review",
    description: "Technical call to align on specifications, operating conditions, and project timeline. We prepare a formal Motor Requirements Document.",
    time: "Week 1",
  },
  {
    number: "03",
    title: "Proposal & Simulation",
    description: "Detailed technical proposal with preliminary simulation results. Includes estimated performance, dimensions, weight, and pricing for prototype and production.",
    time: "Week 2–3",
  },
  {
    number: "04",
    title: "Prototype Development",
    description: "Full ANSYS simulation suite, prototype manufacturing, and dyno validation. You receive test data and can visit our facility for witnessed testing.",
    time: "Week 4–10",
  },
  {
    number: "05",
    title: "Production & Delivery",
    description: "Production tooling, quality systems, and supply chain established. Ongoing technical support and performance optimisation included.",
    time: "Week 12+",
  },
];

export function ProcessPage() {
  return (
    <>
      {/* Engineering Process — White */}
      <section data-theme="light" className="bg-white-0 pt-sp8 pb-sp7">
        <div className="page-gutter">
          <RevealWrapper>
            <SectionOverline text="HOW WE ENGINEER" variant="light" />
          </RevealWrapper>
          <RevealWrapper delay={0.1}>
            <h1 className="font-display font-bold text-[clamp(48px,7.5vw,104px)] leading-[0.86] text-tw-1 mb-6">
              PROCESS
            </h1>
          </RevealWrapper>
          <RevealWrapper delay={0.22}>
            <p className="font-body text-[clamp(15px,1.4vw,18px)] leading-[1.78] text-tw-2 max-w-[540px] mb-16">
              Five stages. Zero shortcuts. Every motor follows the same rigorous path from
              requirements to delivery — because precision is not a feature, it&apos;s the process.
            </p>
          </RevealWrapper>

          {/* 5-column grid desktop, stacked mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4">
            {ENGINEERING_STEPS.map((step, i) => (
              <RevealWrapper key={step.number} delay={i * 0.08}>
                <div className="bg-white-0 border border-white-3 rounded-[4px] p-5 h-full flex flex-col hover:border-y hover:shadow-[0_0_16px_rgba(242,183,5,0.12)] transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[28px] text-y font-bold leading-none">
                      {step.number}
                    </span>
                    {i < ENGINEERING_STEPS.length - 1 && (
                      <div className="hidden lg:block flex-1 h-[1px] bg-white-3" />
                    )}
                  </div>
                  <h3 className="font-display font-bold text-[20px] text-tw-1 mb-3">
                    {step.title}
                  </h3>
                  <p className="font-body text-[13px] leading-[1.72] text-tw-2 mb-4 flex-1">
                    {step.description}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {step.details.map((detail) => (
                      <li
                        key={detail}
                        className="font-mono text-[9px] tracking-[0.12em] text-tw-3 flex items-center gap-2"
                      >
                        <span className="w-1 h-1 bg-y rounded-full flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Sales Process — White-1 */}
      <section data-theme="light" className="bg-white-1 py-sp8">
        <div className="page-gutter">
          <RevealWrapper>
            <SectionOverline text="WORKING WITH US" variant="light" />
          </RevealWrapper>
          <RevealWrapper delay={0.1}>
            <h2 className="font-display font-bold text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-sb-0 mb-4">
              FROM ENQUIRY{" "}
              <span className="text-y">TO DELIVERY</span>
            </h2>
          </RevealWrapper>
          <RevealWrapper delay={0.22}>
            <p className="font-body text-[clamp(13px,1.1vw,15px)] leading-[1.72] text-[#44444C] max-w-[560px] mb-12">
              A transparent, milestone-based engagement from first contact to production delivery.
              You know exactly where your project stands at every stage.
            </p>
          </RevealWrapper>

          <div className="flex flex-col gap-0">
            {SALES_STEPS.map((step, i) => (
              <RevealWrapper key={step.number} delay={i * 0.06}>
                <div className="flex gap-6 lg:gap-12 py-8 border-b border-dw-3 last:border-0">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <span className="font-mono text-[32px] text-y font-bold leading-none">
                      {step.number}
                    </span>
                    {i < SALES_STEPS.length - 1 && (
                      <div className="w-[1px] flex-1 bg-dw-3 mt-3" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-4 mb-2">
                      <h3 className="font-display font-bold text-[clamp(16px,1.8vw,24px)] text-sb-0">
                        {step.title}
                      </h3>
                      <span className="font-mono text-[10px] tracking-[0.18em] text-[#8A8A96] uppercase flex-shrink-0">
                        {step.time}
                      </span>
                    </div>
                    <p className="font-body text-[clamp(13px,1.1vw,15px)] leading-[1.72] text-[#44444C] max-w-[600px]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </RevealWrapper>
            ))}
          </div>

          <RevealWrapper delay={0.4}>
            <div className="mt-12 flex justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] uppercase border border-tw-1 text-tw-1 bg-transparent px-[32px] py-[14px] hover:bg-tw-1 hover:text-white transition-all duration-200 ease-precise"
              >
                START YOUR PROJECT <span>→</span>
              </Link>
            </div>
          </RevealWrapper>
        </div>
      </section>
    </>
  );
}
