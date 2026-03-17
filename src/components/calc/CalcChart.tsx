"use client";

import { useEffect, useRef } from "react";
import { drawChart, ChartConfig } from "@/lib/calcUtils";

interface CalcChartProps {
  xData: number[];
  yData: number[][];
  colors: string[];
  dashed: boolean[];
  xLabel: string;
  yLabel: string;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  operatingPoint?: { x: number; y: number };
  annotations?: ChartConfig["annotations"];
  height?: number;
}

export function CalcChart(props: CalcChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const redraw = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      drawChart({
        canvas,
        xData: props.xData,
        yData: props.yData,
        colors: props.colors,
        dashed: props.dashed,
        xLabel: props.xLabel,
        yLabel: props.yLabel,
        xMin: props.xMin,
        xMax: props.xMax,
        yMin: props.yMin,
        yMax: props.yMax,
        operatingPoint: props.operatingPoint,
        annotations: props.annotations,
      });
    };

    const observer = new ResizeObserver(() => {
      redraw();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [
    props.xData,
    props.yData,
    props.colors,
    props.dashed,
    props.xLabel,
    props.yLabel,
    props.xMin,
    props.xMax,
    props.yMin,
    props.yMax,
    props.operatingPoint,
    props.annotations,
  ]);

  return (
    <div
      ref={containerRef}
      className="w-full"
      style={{ height: props.height ?? 280 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
