"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";

const FOOTER_LINKS = {
  Company: [
    { href: "/about", label: "About" },
    { href: "/process", label: "Process" },
    { href: "/contact", label: "Contact" },
    { href: "/contact#location", label: "Location" },
  ],
  Technology: [
    { href: "/technology", label: "Simulations" },
    { href: "/products", label: "Products" },
    { href: "/calculators", label: "Calculators" },
  ],
  Domains: [
    { href: "/#air", label: "Air" },
    { href: "/#water", label: "Water" },
    { href: "/#land", label: "Land" },
    { href: "/#robotics", label: "Robotics" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#060608] border-t border-sb-3 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top, rgba(242, 183, 5, 0.04) 0%, transparent 50%)",
        }}
      />

      <div className="page-gutter py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="flex flex-col gap-6">
            <Logo variant="dark" />
            <p className="font-work text-[13px] leading-[1.72] text-[rgba(255,255,255,0.40)] max-w-[280px]">
              Precision electric motors for Air, Water, Land, and Robotics.
              ANSYS-simulation-validated before prototyping.
            </p>
            <p className="font-syncopate font-bold text-[14px] text-y inline-flex items-center gap-2">
              <span className="w-3 h-[1px] bg-y" />
              From India — For the World.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="group">
              <h3 className="font-mono text-[9px] tracking-[0.22em] uppercase text-[rgba(255,255,255,0.40)] mb-6 flex items-center gap-2">
                <span className="w-2 h-[1px] bg-sb-3 group-hover:bg-y transition-colors duration-300" />
                {title}
              </h3>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group/link font-work text-[14px] text-[rgba(255,255,255,0.50)] hover:text-y transition-all duration-200 inline-flex items-center gap-2"
                    >
                      <span className="w-0 h-[1px] bg-y group-hover/link:w-3 transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.08)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[10px] tracking-[0.12em] text-[rgba(255,255,255,0.28)]">
            © {new Date().getFullYear()} WELKINRIM TECHNOLOGIES PVT. LTD.
          </p>
          <div className="flex items-center gap-6">
            <p className="font-mono text-[10px] tracking-[0.12em] text-[rgba(255,255,255,0.28)]">
              ORAGADAM INDUSTRIAL CORRIDOR · CHENNAI · INDIA
            </p>
            <div className="hidden md:flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-y" />
              <span className="w-1 h-1 rounded-full bg-d-air" />
              <span className="w-1 h-1 rounded-full bg-d-water" />
              <span className="w-1 h-1 rounded-full bg-d-robotics" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
