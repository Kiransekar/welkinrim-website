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
    <footer className="bg-[#060608] border-t border-sb-3">
      <div className="page-gutter py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="flex flex-col gap-6">
            <Logo variant="dark" />
            <p className="font-work text-[13px] leading-[1.72] text-[rgba(255,255,255,0.35)] max-w-[280px]">
              Precision electric motors for Air, Water, Land, and Robotics.
              ANSYS-simulation-validated before prototyping.
            </p>
            <p className="font-syncopate font-bold text-[14px] text-y">
              From India — For the World.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-mono text-[9px] tracking-[0.22em] uppercase text-[rgba(255,255,255,0.35)] mb-6">
                {title}
              </h3>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-work text-[14px] text-[rgba(255,255,255,0.62)] hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.06)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[10px] tracking-[0.12em] text-[rgba(255,255,255,0.24)]">
            © {new Date().getFullYear()} WELKINRIM TECHNOLOGIES PVT. LTD.
          </p>
          <p className="font-mono text-[10px] tracking-[0.12em] text-[rgba(255,255,255,0.24)]">
            ORAGADAM INDUSTRIAL CORRIDOR · CHENNAI · INDIA
          </p>
        </div>
      </div>
    </footer>
  );
}
