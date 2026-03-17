// ═══════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════

export const GRAVITY = 9.81;
export const TORQUE_CONST = 9549.297; // 60/(2π)
export const RHO_SL = 1.225; // kg/m³ at sea level 15°C
export const G_PER_N = 101.972; // grams per Newton

// ═══════════════════════════════════════════════════════════
// UNIT CONVERSIONS
// ═══════════════════════════════════════════════════════════

export const conv = {
  inchToM: (x: number) => x * 0.0254,
  knotsToMs: (x: number) => x * 0.5144,
  kmhToMs: (x: number) => x / 3.6,
  degToRad: (x: number) => (x * Math.PI) / 180,
  rpmToRads: (x: number) => (x * Math.PI) / 30,
  NtoG: (x: number) => x * G_PER_N,
  GtoN: (x: number) => x / G_PER_N,
};

// ═══════════════════════════════════════════════════════════
// AIR DENSITY (ISA standard atmosphere)
// ═══════════════════════════════════════════════════════════

export function airDensity(elevM: number, tempC: number): number {
  const T = tempC + 273.15;
  const P = 101325 * Math.pow(1 - 0.0000225577 * elevM, 5.25588);
  return P / (287.058 * T);
}

// ═══════════════════════════════════════════════════════════
// NUMBER FORMATTING
// ═══════════════════════════════════════════════════════════

export function fmt(val: number, decimals = 2, unit = ""): string {
  if (!isFinite(val) || isNaN(val)) return "—";
  const formatted = val.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${formatted}${unit ? " " + unit : ""}`;
}

export function fmtInt(val: number): string {
  if (!isFinite(val) || isNaN(val)) return "—";
  return Math.round(val).toLocaleString("en-IN");
}

// ═══════════════════════════════════════════════════════════
// CHART DRAWING (Canvas 2D)
// ═══════════════════════════════════════════════════════════

export interface ChartAnnotation {
  x?: number;
  y?: number;
  label: string;
  axis: "x" | "y";
  color?: string;
}

export interface ChartConfig {
  canvas: HTMLCanvasElement;
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
  annotations?: ChartAnnotation[];
}

export function drawChart(cfg: ChartConfig): void {
  const { canvas, xData, yData, colors, dashed } = cfg;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;
  const PAD = { top: 20, right: 20, bottom: 40, left: 55 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = "#09090B";
  ctx.fillRect(0, 0, W, H);

  const xMin = cfg.xMin ?? Math.min(...xData);
  const xMax = cfg.xMax ?? Math.max(...xData);
  const allY = yData.flat().filter(isFinite);
  const yMin = cfg.yMin ?? Math.min(...allY) * 0.95;
  const yMax = cfg.yMax ?? Math.max(...allY) * 1.05;

  const rangeX = xMax - xMin || 1;
  const rangeY = yMax - yMin || 1;

  const toCanvasX = (x: number) => PAD.left + ((x - xMin) / rangeX) * plotW;
  const toCanvasY = (y: number) =>
    PAD.top + plotH - ((y - yMin) / rangeY) * plotH;

  // Grid
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 0.5;
  const gridStepsX = 5,
    gridStepsY = 4;
  for (let i = 0; i <= gridStepsX; i++) {
    const x = PAD.left + (plotW * i) / gridStepsX;
    ctx.beginPath();
    ctx.moveTo(x, PAD.top);
    ctx.lineTo(x, PAD.top + plotH);
    ctx.stroke();
  }
  for (let i = 0; i <= gridStepsY; i++) {
    const y = PAD.top + (plotH * i) / gridStepsY;
    ctx.beginPath();
    ctx.moveTo(PAD.left, y);
    ctx.lineTo(PAD.left + plotW, y);
    ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = "rgba(255,255,255,0.30)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD.left, PAD.top);
  ctx.lineTo(PAD.left, PAD.top + plotH);
  ctx.lineTo(PAD.left + plotW, PAD.top + plotH);
  ctx.stroke();

  // Axis tick labels
  ctx.fillStyle = "rgba(255,255,255,0.30)";
  ctx.font = "9px monospace";
  ctx.textAlign = "center";
  for (let i = 0; i <= gridStepsX; i++) {
    const val = xMin + rangeX * (i / gridStepsX);
    const x = PAD.left + (plotW * i) / gridStepsX;
    ctx.fillText(val.toFixed(0), x, PAD.top + plotH + 14);
  }
  ctx.textAlign = "right";
  for (let i = 0; i <= gridStepsY; i++) {
    const val = yMin + rangeY * ((gridStepsY - i) / gridStepsY);
    const y = PAD.top + (plotH * i) / gridStepsY;
    ctx.fillText(val.toFixed(1), PAD.left - 6, y + 3);
  }

  // Axis label text
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.font = "8px monospace";
  ctx.fillText(cfg.xLabel, PAD.left + plotW / 2, H - 4);
  ctx.save();
  ctx.translate(12, PAD.top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(cfg.yLabel, 0, 0);
  ctx.restore();

  // Annotations
  if (cfg.annotations) {
    cfg.annotations.forEach((ann) => {
      ctx.strokeStyle = ann.color ?? "rgba(255,255,255,0.20)";
      ctx.lineWidth = 0.8;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      if (ann.axis === "x" && ann.x !== undefined) {
        const cx = toCanvasX(ann.x);
        ctx.moveTo(cx, PAD.top);
        ctx.lineTo(cx, PAD.top + plotH);
      } else if (ann.axis === "y" && ann.y !== undefined) {
        const cy = toCanvasY(ann.y);
        ctx.moveTo(PAD.left, cy);
        ctx.lineTo(PAD.left + plotW, cy);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = ann.color ?? "rgba(255,255,255,0.35)";
      ctx.font = "8px monospace";
      ctx.textAlign = "left";
      if (ann.axis === "x" && ann.x !== undefined) {
        ctx.fillText(ann.label, toCanvasX(ann.x) + 3, PAD.top + 10);
      } else if (ann.axis === "y" && ann.y !== undefined) {
        ctx.fillText(ann.label, PAD.left + 4, toCanvasY(ann.y) - 3);
      }
    });
  }

  // Data lines
  yData.forEach((lineData, idx) => {
    ctx.strokeStyle = colors[idx] ?? "#F2B705";
    ctx.lineWidth = dashed[idx] ? 1 : 2;
    ctx.setLineDash(dashed[idx] ? [5, 3] : []);
    ctx.beginPath();
    xData.forEach((x, i) => {
      const cx = toCanvasX(x);
      const cy = toCanvasY(lineData[i]);
      if (i === 0) { ctx.moveTo(cx, cy); } else { ctx.lineTo(cx, cy); }
    });
    ctx.stroke();
    ctx.setLineDash([]);
  });

  // Operating point
  if (cfg.operatingPoint) {
    const { x, y } = cfg.operatingPoint;
    const cx = toCanvasX(x),
      cy = toCanvasY(y);
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "#F2B705";
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

// ═══════════════════════════════════════════════════════════
// INPUT VALIDATION
// ═══════════════════════════════════════════════════════════

export function validatePositive(val: number, name: string): string | null {
  if (val <= 0) return `${name} must be greater than zero`;
  return null;
}

export function validateRange(
  val: number,
  min: number,
  max: number,
  name: string
): string | null {
  if (val < min || val > max) return `${name} must be between ${min} and ${max}`;
  return null;
}
