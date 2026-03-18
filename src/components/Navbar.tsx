"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/technology", label: "TECHNOLOGY" },
  { href: "/products", label: "PRODUCTS" },
  { href: "/about", label: "ABOUT" },
  { href: "/process", label: "PROCESS" },
  { href: "/calculators", label: "CALCULATORS" },
  { href: "/contact", label: "CONTACT" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [logoOverLight, setLogoOverLight] = useState(false);
  const [linksOverLight, setLinksOverLight] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const checkSections = useCallback(() => {
    const scrollY = window.scrollY;
    setScrolled(scrollY >= 40);

    const lightSections = document.querySelectorAll("[data-theme='light']");
    let isLogoOverLight = false;
    let isLinksOverLight = false;
    
    // Threshold for navbar height overlap
    const threshold = 40; 
    const logoX = 40; // Approx horizontal center of logo area
    const linksX = window.innerWidth - 40; // Approx horizontal center of links/menu area

    lightSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= threshold && rect.bottom >= threshold) {
        if (rect.left <= logoX && rect.right >= logoX) isLogoOverLight = true;
        if (rect.left <= linksX && rect.right >= linksX) isLinksOverLight = true;
      }
    });
    
    setLogoOverLight(isLogoOverLight);
    setLinksOverLight(isLinksOverLight);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", checkSections, { passive: true });
    window.addEventListener("resize", checkSections);
    checkSections();
    return () => {
      window.removeEventListener("scroll", checkSections);
      window.removeEventListener("resize", checkSections);
    };
  }, [checkSections]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isContactPage = pathname === "/contact";

  const navBg = isContactPage || scrolled
    ? linksOverLight && !isContactPage
      ? "bg-[rgba(243,243,239,0.92)] backdrop-blur-md border-b border-dw-3 shadow-sm"
      : "bg-[rgba(9,9,11,0.90)] backdrop-blur-md border-b border-sb-3 shadow-lg"
    : "bg-transparent";

  const linkColor = linksOverLight && !isContactPage
    ? "text-[#8A8A96] hover:text-[#09090B]"
    : "text-[rgba(255,255,255,0.40)] hover:text-white";

  const logoVariant = logoOverLight && !isContactPage ? "light" : "dark";

  const activeColor = "text-y";

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-[500ms] ease-precise ${navBg}`}
      >
        <div className="page-gutter flex items-center justify-between h-[72px] md:h-[64px] lg:h-[72px]">
          <Link href="/" aria-label="Welkinrim Technologies Home" onClick={() => setMobileOpen(false)}>
            <div className="relative group">
              <div
                className="transition-all duration-[400ms] ease-precise"
                style={{ opacity: logoVariant === "light" ? 1 : 0, position: logoVariant === "light" ? "relative" : "absolute", top: 0, left: 0 }}
              >
                <Logo variant="light" />
              </div>
              <div
                className="transition-all duration-[400ms] ease-precise"
                style={{ opacity: logoVariant === "light" ? 0 : 1 }}
              >
                <Logo variant="dark" />
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group font-mono text-[11px] tracking-[0.18em] uppercase relative py-2 transition-all duration-300 ${
                  pathname === link.href ? activeColor : linkColor
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-[1px] transition-all duration-[350ms] ease-precise ${
                    pathname === link.href ? "w-full bg-y" : "w-0 bg-y group-hover:w-full"
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-y via-y-hi to-y opacity-0 transition-opacity duration-300 ${
                    pathname === link.href ? "opacity-100" : "group-hover:opacity-50"
                  }`}
                  style={{ filter: "blur(1px)" }}
                />
              </Link>
            ))}

          </div>

          <button
            className="lg:hidden flex flex-col gap-[6px] p-2 group"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span
              className={`block w-[22px] h-[1px] transition-all duration-300 ${
                linksOverLight && !isContactPage ? "bg-sb-0" : "bg-white"
              } ${mobileOpen ? "rotate-45 translate-y-[3.5px]" : "group-hover:w-[26px]"}`}
            />
            <span
              className={`block w-[22px] h-[1px] transition-all duration-300 ${
                linksOverLight && !isContactPage ? "bg-sb-0" : "bg-white"
              } ${mobileOpen ? "opacity-0" : "group-hover:w-[24px]"}`}
            />
            <span
              className={`block w-[22px] h-[1px] transition-all duration-300 ${
                linksOverLight && !isContactPage ? "bg-sb-0" : "bg-white"
              } ${mobileOpen ? "-rotate-45 -translate-y-[3.5px]" : "group-hover:w-[26px]"}`}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[98] bg-sb-0/80 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[99] bg-sb-0 flex flex-col items-center justify-center lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 text-white text-2xl w-[44px] h-[44px] flex items-center justify-center hover:text-y transition-colors"
                aria-label="Close menu"
              >
                ×
              </button>
              <div className="flex flex-col items-center gap-6">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`group font-work font-medium text-[24px] relative py-1 transition-all duration-300 ${
                        pathname === link.href ? "text-y" : "text-white"
                      }`}
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-y transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
