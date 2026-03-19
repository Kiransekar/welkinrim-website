import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock framer-motion
vi.mock("framer-motion", () => {
  const Div = React.forwardRef<HTMLDivElement, React.PropsWithChildren<Record<string, unknown>>>(
    ({ children, ...props }, ref) => {
      const safe: Record<string, unknown> = {};
      for (const k of Object.keys(props)) {
        if (["className", "style", "id", "role", "aria-label", "data-theme", "data-testid"].includes(k)) safe[k] = props[k];
      }
      return <div ref={ref} {...safe}>{children}</div>;
    }
  );
  Div.displayName = "MotionDiv";
  const Span = React.forwardRef<HTMLSpanElement, React.PropsWithChildren<Record<string, unknown>>>(
    ({ children, ...props }, ref) => {
      const safe: Record<string, unknown> = {};
      for (const k of Object.keys(props)) {
        if (["className", "style"].includes(k)) safe[k] = props[k];
      }
      return <span ref={ref} {...safe}>{children}</span>;
    }
  );
  Span.displayName = "MotionSpan";
  const P = React.forwardRef<HTMLParagraphElement, React.PropsWithChildren<Record<string, unknown>>>(
    ({ children, ...props }, ref) => {
      const safe: Record<string, unknown> = {};
      for (const k of Object.keys(props)) {
        if (["className", "style"].includes(k)) safe[k] = props[k];
      }
      return <p ref={ref} {...safe}>{children}</p>;
    }
  );
  P.displayName = "MotionP";
  return {
    motion: { div: Div, span: Span, p: P },
    useScroll: () => ({ scrollYProgress: { on: () => () => {} } }),
    useTransform: () => 0,
    useMotionValue: () => ({ set: () => {}, on: () => () => {} }),
    useSpring: () => ({ set: () => {}, on: () => () => {} }),
    useInView: () => true,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

// Mock child components to isolate LandingPage tests
vi.mock("@/components/RevealWrapper", () => ({
  RevealWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/SectionOverline", () => ({
  SectionOverline: ({ text }: { text: string }) => <span>{text}</span>,
}));
vi.mock("@/components/MotorVisual", () => ({
  MotorVisual: ({ domain }: { domain: string }) => <div data-testid={`motor-${domain}`} />,
}));
vi.mock("@/components/StatCounter", () => ({
  StatCounter: ({ label }: { label: string }) => <div>{label}</div>,
}));
vi.mock("@/components/WireDraw", () => ({
  WireDraw: () => <div data-testid="wire-draw" />,
}));
vi.mock("@/components/ANSYSFrame", () => ({
  ANSYSFrame: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div data-testid="ansys-frame" aria-label={title}>{children}</div>
  ),
}));
vi.mock("@/components/Logo", () => ({
  Logo: () => <div data-testid="logo" />,
}));
vi.mock("@/components/StickyScrollNarrative", () => ({
  StickyScrollNarrative: ({ slides, sectionLabel }: { slides: { id: string }[]; sectionLabel?: string }) => (
    <section aria-label={sectionLabel} data-testid="sticky-scroll-narrative">
      {slides.map((s) => <div key={s.id} data-testid={`narrative-slide-${s.id}`} />)}
    </section>
  ),
}));

// Dynamic import after mocks
const { LandingPage } = await import("./LandingPage");

describe("LandingPage", () => {
  it("renders the hero section with headline", () => {
    render(<LandingPage />);
    expect(screen.getByText("ELECTRIC")).toBeInTheDocument();
    expect(screen.getByText("PROPULSION")).toBeInTheDocument();
    expect(screen.getByText("SYSTEMS")).toBeInTheDocument();
  });

  it("renders the StickyScrollNarrative for domains", () => {
    render(<LandingPage />);
    expect(screen.getByTestId("sticky-scroll-narrative")).toBeInTheDocument();
    expect(screen.getByTestId("narrative-slide-air")).toBeInTheDocument();
    expect(screen.getByTestId("narrative-slide-water")).toBeInTheDocument();
    expect(screen.getByTestId("narrative-slide-land")).toBeInTheDocument();
    expect(screen.getByTestId("narrative-slide-robotics")).toBeInTheDocument();
  });

  it("renders the stats section", () => {
    render(<LandingPage />);
    expect(screen.getByText("Years R&D")).toBeInTheDocument();
    expect(screen.getByText("Domains")).toBeInTheDocument();
  });

  it("renders products teaser with real catalogue data", () => {
    render(<LandingPage />);
    expect(screen.getByText("Haemng 4143 II")).toBeInTheDocument();
    expect(screen.getByText("Maelard 1560")).toBeInTheDocument();
  });

  it("renders location section", () => {
    render(<LandingPage />);
    expect(screen.getByText("ORAGADAM")).toBeInTheDocument();
  });

  it("renders CTA section", () => {
    render(<LandingPage />);
    expect(screen.getByText(/LET.*S BUILD/)).toBeInTheDocument();
  });

  it("renders WireDraw transitions", () => {
    render(<LandingPage />);
    const wireDraws = screen.getAllByTestId("wire-draw");
    expect(wireDraws.length).toBeGreaterThanOrEqual(2);
  });
});
