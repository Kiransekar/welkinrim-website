"use client";

import React, {
  createContext,
  useState,
  useContext,
  useRef,
  MouseEvent,
} from "react";

// ─── Context ─────────────────────────────────────────────────────────────────
interface MouseEnterContextType {
  isMouseEntered: boolean;
  setIsMouseEntered: React.Dispatch<React.SetStateAction<boolean>>;
}

const MouseEnterContext = createContext<MouseEnterContextType>({
  isMouseEntered: false,
  setIsMouseEntered: () => {},
});

// ─── CardContainer ────────────────────────────────────────────────────────────
export function CardContainer({
  children,
  className = "",
  containerClassName = "",
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  };

  const handleMouseEnter = () => setIsMouseEntered(true);

  const handleMouseLeave = () => {
    setIsMouseEntered(false);
    if (containerRef.current) {
      containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
    }
  };

  return (
    <MouseEnterContext.Provider value={{ isMouseEntered, setIsMouseEntered }}>
      <div
        className={containerClassName}
        style={{ perspective: "1000px" }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={className}
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.1s ease",
          }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
}

// ─── CardBody ─────────────────────────────────────────────────────────────────
export function CardBody({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

// ─── CardItem ─────────────────────────────────────────────────────────────────
export function CardItem({
  as: Tag = "div",
  children,
  className = "",
  translateZ = 0,
  translateX = 0,
  translateY = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateZ?: number | string;
  translateX?: number | string;
  translateY?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { isMouseEntered } = useContext(MouseEnterContext);

  React.useEffect(() => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `
        translateX(${translateX}px)
        translateY(${translateY}px)
        translateZ(${translateZ}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        rotateZ(${rotateZ}deg)
      `;
    } else {
      ref.current.style.transform = `
        translateX(0px) translateY(0px) translateZ(0px)
        rotateX(0deg) rotateY(0deg) rotateZ(0deg)
      `;
    }
  }, [isMouseEntered, translateX, translateY, translateZ, rotateX, rotateY, rotateZ]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ transition: "transform 0.2s ease-out" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}