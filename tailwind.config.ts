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
        white: {
          0: "#FFFFFF",
          1: "#F7F7F7",
          2: "#F0F0F0",
          3: "#E8E8E8",
          4: "#D4D4D4",
        },
        dark: {
          0: "#0A0A0B",
          1: "#111114",
          2: "#18181C",
          3: "#222228",
        },
        tw: {
          1: "#0A0A0B",
          2: "#3A3A3F",
          3: "#7A7A82",
          4: "rgba(10,10,11,0.08)",
        },
        td: {
          1: "#FFFFFF",
          2: "rgba(255,255,255,0.62)",
          3: "rgba(255,255,255,0.35)",
          4: "rgba(255,255,255,0.14)",
        },
        sb: {
          0: "#0A0A0B",
          1: "#111114",
          2: "#18181C",
          3: "#222228",
        },
        dw: {
          0: "#FFFFFF",
          1: "#F7F7F7",
          2: "#FFFFFF",
          3: "#E8E8E8",
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
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        syncopate: ["var(--font-display)", "sans-serif"],
        work: ["var(--font-body)", "sans-serif"],
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
      keyframes: {
        gridMove: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(60px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
