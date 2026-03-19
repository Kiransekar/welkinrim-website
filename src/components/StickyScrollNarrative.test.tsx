import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { StickyScrollNarrative } from "./StickyScrollNarrative";
import type { NarrativeSlide } from "./StickyScrollNarrative";

// Mock framer-motion to avoid animation issues in tests
const MotionDiv = React.forwardRef<HTMLDivElement, React.PropsWithChildren<Record<string, unknown>>>(
  ({ children, ...props }, ref) => (
    <div ref={ref} {...filterDomProps(props)}>
      {children}
    </div>
  )
);
MotionDiv.displayName = "MotionDiv";

vi.mock("framer-motion", () => ({
  motion: { div: MotionDiv },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

function filterDomProps(props: Record<string, unknown>) {
  const domSafe: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    if (
      !["initial", "animate", "exit", "transition", "whileInView", "viewport", "variants", "style"].includes(key) &&
      !key.startsWith("on")
    ) {
      domSafe[key] = props[key];
    }
    if (key === "style") domSafe[key] = props[key];
  }
  return domSafe;
}

const TEST_SLIDES: NarrativeSlide[] = [
  {
    id: "air",
    titleWhite: "AIR",
    titleAccent: "Altitude-Ready Propulsion",
    body: "High-speed, low-weight motors for UAV platforms.",
    visual: <div data-testid="visual-air">Air Visual</div>,
  },
  {
    id: "water",
    titleWhite: "WATER",
    titleAccent: "Marine-Grade Torque",
    body: "Sealed, corrosion-resistant motors for marine propulsion.",
    visual: <div data-testid="visual-water">Water Visual</div>,
  },
  {
    id: "land",
    titleWhite: "LAND",
    titleAccent: "Automotive Powertrain",
    body: "High-power traction motors for electric vehicles.",
    visual: <div data-testid="visual-land">Land Visual</div>,
  },
];

describe("StickyScrollNarrative", () => {
  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
  });

  it("renders the section with correct aria-label", () => {
    render(
      <StickyScrollNarrative
        slides={TEST_SLIDES}
        sectionLabel="Test narrative"
      />
    );
    const section = screen.getByLabelText("Test narrative");
    expect(section).toBeInTheDocument();
  });

  it("renders the first slide text on initial load", () => {
    render(<StickyScrollNarrative slides={TEST_SLIDES} />);
    expect(screen.getByText("AIR")).toBeInTheDocument();
    expect(screen.getByText("Altitude-Ready Propulsion")).toBeInTheDocument();
    expect(
      screen.getByText("High-speed, low-weight motors for UAV platforms.")
    ).toBeInTheDocument();
  });

  it("renders progress indicators for each slide", () => {
    render(<StickyScrollNarrative slides={TEST_SLIDES} />);
    // 3 slides = 3 progress dots + 1 counter text
    expect(screen.getByText("01/03")).toBeInTheDocument();
  });

  it("sets container height based on slide count", () => {
    const { container } = render(
      <StickyScrollNarrative slides={TEST_SLIDES} />
    );
    const section = container.querySelector("section");
    expect(section).toHaveStyle({ height: "300vh" });
  });

  it("renders all visual elements (desktop + mobile instances)", () => {
    render(<StickyScrollNarrative slides={TEST_SLIDES} />);
    expect(screen.getAllByTestId("visual-air").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByTestId("visual-water").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByTestId("visual-land").length).toBeGreaterThanOrEqual(1);
  });

  it("renders with default section label when none provided", () => {
    render(<StickyScrollNarrative slides={TEST_SLIDES} />);
    expect(screen.getByLabelText("Scroll narrative")).toBeInTheDocument();
  });

  it("handles single slide without errors", () => {
    const singleSlide = [TEST_SLIDES[0]];
    const { container } = render(
      <StickyScrollNarrative slides={singleSlide} />
    );
    const section = container.querySelector("section");
    expect(section).toHaveStyle({ height: "100vh" });
    expect(screen.getByText("AIR")).toBeInTheDocument();
    expect(screen.getByText("01/01")).toBeInTheDocument();
  });

  it("renders sticky inner container", () => {
    const { container } = render(
      <StickyScrollNarrative slides={TEST_SLIDES} />
    );
    const sticky = container.querySelector(".sticky");
    expect(sticky).toBeInTheDocument();
    expect(sticky).toHaveClass("top-0", "h-screen");
  });
});
