"use client";

import React, { useState } from "react";
import { RevealWrapper } from "@/components/RevealWrapper";
import { SectionOverline } from "@/components/SectionOverline";
import { OragadamMap } from "@/components/OragadamMap";

const NEIGHBOURS = [
  { name: "Renault\u2013Nissan Automotive", desc: "Car manufacturer", dist: "2.1 km" },
  { name: "Daimler India Commercial", desc: "BharatBenz trucks & buses", dist: "1.8 km" },
  { name: "Royal Enfield", desc: "Two-wheeler manufacturer", dist: "2.4 km" },
  { name: "Komatsu India", desc: "Heavy construction equipment", dist: "3.1 km" },
  { name: "Delphi-TVS Diesel Systems", desc: "Fuel injection systems", dist: "0.9 km" },
  { name: "Bosch Electrical Drives", desc: "Electrical drives & automation", dist: "0.4 km" },
  { name: "Apollo Tyres", desc: "Tyre manufacturer", dist: "1.6 km" },
  { name: "Sanmina IMS", desc: "Electronics manufacturing", dist: "3.4 km" },
  { name: "Nokia Solutions", desc: "Telecom equipment (Hi-Tech SEZ)", dist: "3.2 km" },
  { name: "Danfoss Industries", desc: "Industrial drives & compressors", dist: "2.8 km" },
  { name: "NATRIP", desc: "National automotive test facility", dist: "4.1 km" },
  { name: "Steel Strips Wheels", desc: "Automotive wheel manufacturer", dist: "1.3 km" },
];

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    domain: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* ─── ENQUIRY FORM + COMPANY INFO (split layout) ─── */}
      <section className="min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left — Form (Light) */}
          <div data-theme="light" className="bg-dw-0 pt-sp8 pb-sp7 flex items-center">
            <div className="w-full px-[clamp(20px,5vw,64px)] max-w-[640px] mx-auto">
              <RevealWrapper>
                <SectionOverline text="GET IN TOUCH" variant="light" />
              </RevealWrapper>
              <RevealWrapper delay={0.1}>
                <h1 className="font-syncopate font-bold text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-sb-0 mb-4">
                  CONTACT
                </h1>
              </RevealWrapper>
              <RevealWrapper delay={0.22}>
                <p className="font-work text-[clamp(13px,1.1vw,15px)] leading-[1.72] text-[#44444C] mb-8">
                  Tell us about your application. We respond within{" "}
                  <span className="text-y font-bold">&lt; 24 hours</span>.
                </p>
              </RevealWrapper>

              {submitted ? (
                <RevealWrapper>
                  <div className="bg-white border border-dw-3 rounded-[4px] p-8 text-center">
                    <div className="w-12 h-12 bg-y rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-sb-0 text-2xl">✓</span>
                    </div>
                    <h3 className="font-syncopate font-bold text-[20px] text-sb-0 mb-2">
                      MESSAGE SENT
                    </h3>
                    <p className="font-work text-[14px] text-[#44444C]">
                      We&apos;ll get back to you within 24 hours.
                    </p>
                  </div>
                </RevealWrapper>
              ) : (
                <RevealWrapper delay={0.3}>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="group">
                      <label className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] block mb-2 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-y opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        FULL NAME *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full h-[48px] px-4 bg-white border border-dw-3 rounded-[4px] font-work text-[14px] text-sb-0 focus:border-y focus:outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(242,183,5,0.1)]"
                      />
                    </div>
                    <div className="group">
                      <label className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] block mb-2 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-y opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-[48px] px-4 bg-white border border-dw-3 rounded-[4px] font-work text-[14px] text-sb-0 focus:border-y focus:outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(242,183,5,0.1)]"
                      />
                    </div>
                    <div className="group">
                      <label className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] block mb-2 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-y opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        COMPANY
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full h-[48px] px-4 bg-white border border-dw-3 rounded-[4px] font-work text-[14px] text-sb-0 focus:border-y focus:outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(242,183,5,0.1)]"
                      />
                    </div>
                    <div className="group">
                      <label className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] block mb-2 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-y opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        APPLICATION DOMAIN
                      </label>
                      <select
                        name="domain"
                        value={formData.domain}
                        onChange={handleChange}
                        className="w-full h-[48px] px-4 bg-white border border-dw-3 rounded-[4px] font-work text-[14px] text-sb-0 focus:border-y focus:outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(242,183,5,0.1)] appearance-none cursor-pointer"
                      >
                        <option value="">Select a domain...</option>
                        <option value="air">Air — UAV / eVTOL</option>
                        <option value="water">Water — Marine Propulsion</option>
                        <option value="land">Land — EV Powertrain</option>
                        <option value="robotics">Robotics — Actuators</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="group">
                      <label className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#8A8A96] block mb-2 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-y opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        MESSAGE *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-dw-3 rounded-[4px] font-work text-[14px] text-sb-0 focus:border-y focus:outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(242,183,5,0.1)] resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="group relative font-mono text-[10px] tracking-[0.24em] uppercase border border-sb-0 text-sb-0 bg-transparent px-[26px] py-[14px] overflow-hidden transition-all duration-300 ease-precise hover:bg-sb-0 hover:text-white hover:shadow-[0_0_20px_rgba(242,183,5,0.3)] self-start"
                    >
                      <span className="relative z-10">SEND ENQUIRY <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span></span>
                    </button>
                  </form>
                </RevealWrapper>
              )}
            </div>
          </div>

          {/* Right — Info (Dark) */}
          <div className="bg-sb-0 pt-sp8 pb-sp7 flex items-center">
            <div className="w-full px-[clamp(20px,5vw,64px)] max-w-[540px]">
              <RevealWrapper>
                <SectionOverline text="WELKINRIM TECHNOLOGIES" variant="dark" />
              </RevealWrapper>
              <RevealWrapper delay={0.1}>
                <h2 className="font-syncopate font-bold text-[clamp(20px,2.5vw,30px)] leading-[1.1] text-white mb-8">
                  PRECISION MOTORS.<br />
                  BUILT TO SPEC.
                </h2>
              </RevealWrapper>

              <div className="flex flex-col gap-8">
                <RevealWrapper delay={0.22}>
                  <div>
                    <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[rgba(255,255,255,0.35)] block mb-2">
                      RESPONSE TIME
                    </span>
                    <span className="font-mono text-[24px] text-y font-bold">&lt; 24 hours</span>
                  </div>
                </RevealWrapper>

                <RevealWrapper delay={0.3}>
                  <div>
                    <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[rgba(255,255,255,0.35)] block mb-2">
                      HEADQUARTERS
                    </span>
                    <p className="font-work text-[15px] leading-[1.78] text-white">
                      Welkinrim Technologies Pvt. Ltd.
                    </p>
                    <p className="font-work text-[14px] leading-[1.72] text-[rgba(255,255,255,0.62)]">
                      Oragadam Industrial Corridor<br />
                      Chennai, Tamil Nadu 602105<br />
                      India
                    </p>
                  </div>
                </RevealWrapper>

                <RevealWrapper delay={0.38}>
                  <div>
                    <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[rgba(255,255,255,0.35)] block mb-2">
                      CAPABILITIES
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {["Custom Motor Design", "ANSYS Simulation", "Prototype Manufacturing", "Volume Production", "Thermal Analysis", "FOC Tuning"].map(
                        (cap) => (
                          <span
                            key={cap}
                            className="font-mono text-[9px] tracking-[0.12em] uppercase border border-sb-3 text-[rgba(255,255,255,0.5)] px-3 py-1.5 rounded-[4px]"
                          >
                            {cap}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </RevealWrapper>

                <RevealWrapper delay={0.46}>
                  <div>
                    <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[rgba(255,255,255,0.35)] block mb-2">
                      DOMAINS SERVED
                    </span>
                    <div className="flex gap-4">
                      {[
                        { name: "Air", color: "text-domain-air" },
                        { name: "Water", color: "text-domain-water" },
                        { name: "Land", color: "text-y" },
                        { name: "Robotics", color: "text-domain-robotics" },
                      ].map((d) => (
                        <span key={d.name} className={`font-mono text-[11px] tracking-[0.12em] uppercase ${d.color}`}>
                          {d.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </RevealWrapper>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LOCATION MAP ─── */}
      <section id="location" className="bg-sb-0 pt-sp7 pb-sp7">
        <div className="page-gutter">
          <RevealWrapper>
            <SectionOverline text="WHERE WE BUILD" variant="dark" />
          </RevealWrapper>
          <RevealWrapper delay={0.1}>
            <h2 className="font-syncopate font-bold text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-white mb-4">
              ORAGADAM
            </h2>
          </RevealWrapper>
          <RevealWrapper delay={0.22}>
            <p className="font-work text-[clamp(15px,1.4vw,18px)] leading-[1.78] text-[rgba(255,255,255,0.62)] max-w-[560px] mb-12">
              India&apos;s automotive corridor. 45 minutes from Chennai city centre,
              surrounded by the country&apos;s most advanced manufacturing facilities.
              A precision ecosystem built for scale.
            </p>
          </RevealWrapper>

          <RevealWrapper delay={0.3}>
            <div className="border border-[rgba(242,183,5,0.18)] overflow-hidden">
              <OragadamMap />
            </div>
            <p className="font-mono text-[8px] tracking-[0.15em] text-[rgba(255,255,255,0.18)] mt-3 uppercase">
              Positions are geographically approximate. Road network derived from SH 48 and SIPCOT internal road data. Hover any marker to view company details.
            </p>
          </RevealWrapper>
        </div>
      </section>

      {/* ─── INDUSTRIAL NEIGHBOURS (Light) ─── */}
      <section data-theme="light" className="bg-dw-0 py-sp8">
        <div className="page-gutter">
          <RevealWrapper>
            <SectionOverline text="NEIGHBOURING ESTABLISHMENTS" variant="light" />
            <h2 className="font-syncopate font-bold text-[clamp(24px,3vw,40px)] leading-[0.92] text-sb-0 mb-12">
              PRECISION COMPANY.
            </h2>
          </RevealWrapper>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[#E6E6E2]">
            {NEIGHBOURS.map((company, i) => (
              <RevealWrapper key={company.name} delay={i * 0.04}>
                <div className="bg-dw-0 p-5 h-full">
                  <div className="font-work font-medium text-[13px] text-sb-0 mb-1">{company.name}</div>
                  <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-[#8A8A96] mb-2">{company.desc}</div>
                  <div className="font-mono text-[9px] tracking-[0.1em] text-y">{company.dist} from Welkinrim</div>
                </div>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ADDRESS + DIRECTIONS (Dark) ─── */}
      <section className="bg-sb-0 py-sp7">
        <div className="page-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <RevealWrapper>
              <SectionOverline text="VISIT US" variant="dark" />
              <h2 className="font-syncopate font-bold text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-white mb-6">
                GET DIRECTIONS
              </h2>
              <p className="font-work text-[clamp(13px,1.1vw,15px)] leading-[1.72] text-[rgba(255,255,255,0.62)] max-w-[440px]">
                Our facility is open for visits by appointment. We encourage prospective
                OEM partners to witness motor testing on our dynamometer first-hand.
              </p>
            </RevealWrapper>

            <RevealWrapper delay={0.16}>
              <div className="bg-sb-1 border border-sb-3 rounded-[4px] p-6 lg:p-8">
                <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[rgba(255,255,255,0.35)] block mb-4">
                  FACILITY ADDRESS
                </span>
                <p className="font-work text-[16px] leading-[1.78] text-white font-medium mb-1">
                  Welkinrim Technologies Pvt. Ltd.
                </p>
                <p className="font-work text-[14px] leading-[1.72] text-[rgba(255,255,255,0.62)] mb-6">
                  Oragadam Industrial Corridor<br />
                  Sriperumbudur Taluk, Kancheepuram District<br />
                  Chennai, Tamil Nadu 602105<br />
                  India
                </p>

                <div className="flex flex-col mb-6">
                  {[
                    { label: "Chennai International Airport", value: "40 km" },
                    { label: "Chennai Port", value: "56 km" },
                    { label: "Ennore Port", value: "84 km" },
                    { label: "NH-48 (Chennai\u2013Bangalore)", value: "1.2 km" },
                    { label: "Sriperumbudur Town", value: "15 km" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-baseline py-[9px] border-b border-[rgba(255,255,255,0.06)]">
                      <span className="font-mono text-[9px] tracking-[0.08em] text-[rgba(255,255,255,0.40)]">{item.label}</span>
                      <span className="font-mono text-[11px] tracking-[0.1em] text-y">{item.value}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="https://www.google.com/maps/place/Welkinrim+Technologies+Pvt+Ltd/@12.8726362,79.8983314,11.74z/data=!4m15!1m8!3m7!1s0x3a52f1b702dbe701:0x80102c911f855377!2sOragadam+Industrial+Corridor,+Oragadam,+Tamil+Nadu!3b1!8m2!3d12.8479293!4d79.9472502!16s%2Fg%2F12xqb6m6t!3m5!1s0x3a52f100105947f7:0x7999db29978bacdb!8m2!3d12.8365065!4d79.92121!16s%2Fg%2F11lz2s14j2?entry=ttu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] uppercase border border-y text-y bg-transparent px-[26px] py-[11px] hover:bg-y hover:text-sb-0 transition-all duration-200"
                >
                  OPEN IN MAPS <span>→</span>
                </a>
              </div>
            </RevealWrapper>
          </div>
        </div>
      </section>
    </>
  );
}
