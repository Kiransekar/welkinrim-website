import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sb: {
          0: "#09090B",
          1: "#0F0F12",
          2: "#16161A",
          3: "#1E1E24",
          4: "#2A2A32",
        },
        dw: {
          0: "#F3F3EF",
          1: "#FAFAF8",
          2: "#FFFFFF",
          3: "#E6E6E2",
          4: "#D8D8D4",
        },
        y: {
          DEFAULT: "#F2B705",
          hi: "#FFD23F",
          lo: "#C99504",
        },
        domain: {
          air: "#3B8FEF",
          water: "#00B4CC",
          land: "#F2B705",
          robotics: "#8866CC",
        },
        footer: "#060608",
      },
      fontFamily: {
        syncopate: ["var(--font-syncopate)", "Syncopate", "sans-serif"],
        work: ["var(--font-work)", "Work Sans", "sans-serif"],
        mono: ["var(--font-mono)", "Space Mono", "monospace"],
      },
      spacing: {
        sp1: "8px",
        sp2: "16px",
        sp3: "24px",
        sp4: "32px",
        sp5: "48px",
        sp6: "64px",
        sp7: "96px",
        sp8: "128px",
        sp9: "192px",
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "4px",
      },
      transitionTimingFunction: {
        motor: "cubic-bezier(0.16, 1, 0.3, 1)",
        precise: "cubic-bezier(0.45, 0, 0.55, 1)",
        wire: "cubic-bezier(0.22, 1, 0.36, 1)",
        thermal: "cubic-bezier(0.35, 0, 0.15, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
