"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { motion, AnimatePresence } from "framer-motion";

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

const SOCIAL_LINKS = [
  { href: "https://linkedin.com/company/welkinrim", label: "LinkedIn", icon: "in" },
  { href: "mailto:info@welkinrim.com", label: "Email", icon: "@" },
  { href: "https://github.com/welkinrim", label: "GitHub", icon: "</>" },
];

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#060608] border-t border-sb-3 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top, rgba(242, 183, 5, 0.04) 0%, transparent 50%)",
        }}
      />

      {/* Return to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="absolute -top-[24px] right-8 lg:right-16 z-20 flex items-center gap-2 font-mono text-[9px] tracking-[0.22em] uppercase text-y bg-dark-0 border border-y px-4 py-2 hover:bg-y hover:text-dark-0 transition-all duration-300 shadow-lg"
            aria-label="Scroll to top"
          >
            <span className="text-[14px]">▲</span> TOP
          </motion.button>
        )}
      </AnimatePresence>

      <div className="page-gutter py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Logo variant="dark" />
            <p className="font-body text-[13px] leading-[1.72] text-[rgba(255,255,255,0.40)] max-w-[320px]">
              Precision electric motors for Air, Water, Land, and Robotics.
              ANSYS-simulation-validated before prototyping.
            </p>
            <p className="font-display font-bold text-[14px] text-y inline-flex items-center gap-2">
              <span className="w-3 h-[1px] bg-y" />
              From India — For the World.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-4 mt-2">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-[36px] h-[36px] rounded-full border border-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.40)] hover:border-y hover:text-y transition-all duration-300"
                  aria-label={social.label}
                >
                  <span className="font-mono text-[10px] font-bold">{social.icon}</span>
                </a>
              ))}
            </div>
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
                      className="group/link font-body text-[14px] text-[rgba(255,255,255,0.50)] hover:text-y transition-all duration-200 inline-flex items-center gap-2"
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

        {/* Newsletter / Contact CTA */}
        <div className="mt-12 p-6 bg-[rgba(242,183,5,0.04)] border border-[rgba(242,183,5,0.15)] rounded-[4px]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h4 className="font-display font-bold text-[16px] text-white mb-1">START A CONVERSATION</h4>
              <p className="font-body text-[13px] text-[rgba(255,255,255,0.50)]">
                Have a project in mind? We respond within 24 hours.
              </p>
            </div>
            <Link
              href="/contact"
              className="flex-shrink-0 inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.22em] uppercase border border-y text-y bg-transparent px-5 py-2.5 hover:bg-y hover:text-sb-0 transition-all duration-300"
            >
              GET IN TOUCH <span className="transition-transform hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.08)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[10px] tracking-[0.12em] text-[rgba(255,255,255,0.28)]">
            © {new Date().getFullYear()} WELKINRIM TECHNOLOGIES PVT. LTD.
          </p>
          <div className="flex items-center gap-6">
            <p className="font-mono text-[10px] tracking-[0.12em] text-[rgba(255,255,255,0.28)]">
              ORAGADAM INDUSTRIAL CORRIDOR · CHENNAI · INDIA
            </p>
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-y" />
              <span className="w-1 h-1 rounded-full bg-domain-air" />
              <span className="w-1 h-1 rounded-full bg-domain-water" />
              <span className="w-1 h-1 rounded-full bg-domain-robotics" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
