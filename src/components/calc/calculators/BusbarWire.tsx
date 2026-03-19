"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { CalcField } from "../CalcField";
import { CalcSelect } from "../CalcSelect";
import { CalcSlider } from "../CalcSlider";
import { CalcResultRow } from "../CalcResultRow";
import { CalcWarning } from "../CalcWarning";
import { CalcHeader } from "../CalcHeader";
import { drawChart } from "@/lib/calcUtils";

const MATERIALS: Record<string, { rho: number; alpha: number; label: string }> = {
  silver:    { rho: 1.59e-8, alpha: 0.00380, label: "Silver" },
  copper:    { rho: 1.72e-8, alpha: 0.00393, label: "Copper" },
  gold:      { rho: 2.44e-8, alpha: 0.00380, label: "Gold" },
  aluminium: { rho: 2.82e-8, alpha: 0.00403, label: "Aluminium" },
  brass:     { rho: 7.00e-8, alpha: 0.00393, label: "Brass" },
};

const INSTALL_DERATING: Record<string, { factor: number; label: string }> = {
  open:     { factor: 1.00, label: "Open air (free convection)" },
  enclosed: { factor: 0.85, label: "Enclosed (touchable)" },
  ip65:     { factor: 0.70, label: "Enclosed (IP65+)" },
  bundled:  { factor: 0.70, label: "Bundled (3 conductors)" },
  buried:   { factor: 0.80, label: "Buried" },
};

export function BusbarWire() {
  const [material, setMaterial] = useState("copper");
  const [condType, setCondType] = useState("rect");
  const [width, setWidth] = useState(40);
  const [thickness, setThickness] = useState(5);
  const [diameter, setDiameter] = useState(10);
  const [length, setLength] = useState(500);
  const [current, setCurrent] = useState(200);
  const [Tamb, setTamb] = useState(40);
  const [dTmax, setDTmax] = useState(30);
  const [install, setInstall] = useState("open");
  const [circuitType, setCircuitType] = useState("single");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mat = MATERIALS[material];
  const derating = INSTALL_DERATING[install];

  const areaMm2 = condType === "rect" ? width * thickness : Math.PI * (diameter / 2) ** 2;
  const perimMm = condType === "rect" ? 2 * (width + thickness) : Math.PI * diameter;

  const Toperating = Tamb + dTmax / 2;
  const R20 = mat.rho * (length / 1000) / (areaMm2 / 1e6);
  const R_T = R20 * (1 + mat.alpha * (Toperating - 20));

  const vDropMult = circuitType === "round_trip" ? 2 : 1;
  const vDrop = R_T * current * vDropMult * 1000;
  const pLoss = current * current * R_T;
  const J = current / areaMm2;

  const P_per_m = (current * current * mat.rho) / (areaMm2 / 1e6);
  const A_surface_per_m = perimMm / 1000;
  const h_conv = 10;
  const tempRise = A_surface_per_m > 0 ? P_per_m / (A_surface_per_m * h_conv) : 0;
  const condTemp = Tamb + tempRise;

  const safeI = tempRise > 0 ? current * Math.sqrt(dTmax / tempRise) : Infinity;
  const deratedI = isFinite(safeI) ? safeI * derating.factor : Infinity;

  const warnings: string[] = [];
  if (J > 6.0) warnings.push("Current density > 6 A/mm² — CRITICAL: severe overheating risk");
  else if (J > 3.5) warnings.push("Current density > 3.5 A/mm² — consider larger cross-section");
  if (current > deratedI) warnings.push("Current exceeds derated capacity for installation type");

  const drawCurve = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const maxI = current * 2;
    const steps = 200;
    const xData: number[] = [];
    const yDrop: number[] = [];

    for (let i = 0; i <= steps; i++) {
      const I = (maxI * i) / steps;
      xData.push(I);
      yDrop.push(R_T * I * vDropMult * 1000);
    }

    drawChart({
      canvas,
      xData,
      yData: [yDrop],
      colors: ["#F2B705"],
      dashed: [false],
      xLabel: "CURRENT (A)",
      yLabel: "VOLTAGE DROP (mV)",
      xMin: 0,
      xMax: maxI,
      yMin: 0,
      operatingPoint: { x: current, y: vDrop },
      annotations: isFinite(deratedI) ? [
        { x: deratedI, label: `Safe limit ${deratedI.toFixed(0)}A`, axis: "x", color: "#FF6B6B" },
      ] : [],
    });
  }, [current, R_T, vDrop, deratedI, vDropMult]);

  useEffect(() => { drawCurve(); }, [drawCurve]);

  return (
    <div>
      <CalcHeader
        title="BUSBAR / WIRE SIZING"
        description="Calculate resistance, voltage drop, power loss, and safe current capacity for rectangular busbars or round conductors."
        accuracy="±5%"
        domain="UNIVERSAL"
        domainColor="#F2B705"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="bg-white-0 p-6 border-b lg:border-b-0 lg:border-r border-white-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(242,183,5,0.02)] to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-4">
            <CalcSelect id="material" label="Material" value={material} onChange={setMaterial} options={Object.entries(MATERIALS).map(([k, v]) => ({ value: k, label: v.label }))} />
            <CalcSelect id="condType" label="Conductor Type" value={condType} onChange={setCondType} options={[{ value: "rect", label: "Rectangular" }, { value: "round", label: "Round" }]} />
            {condType === "rect" ? (
              <>
                <CalcField id="width" label="Width" unit="mm" value={width} onChange={setWidth} step={1} min={1} />
                <CalcField id="thickness" label="Thickness" unit="mm" value={thickness} onChange={setThickness} step={0.5} min={0.5} />
              </>
            ) : (
              <CalcField id="diameter" label="Diameter" unit="mm" value={diameter} onChange={setDiameter} step={0.5} min={0.5} />
            )}
            <CalcField id="length" label="Length" unit="mm" value={length} onChange={setLength} step={10} min={1} />
            <CalcField id="current" label="Continuous Current" unit="A" value={current} onChange={setCurrent} step={5} min={1} />
            <CalcField id="Tamb" label="Ambient Temperature" unit="°C" value={Tamb} onChange={setTamb} step={1} />
            <CalcSlider id="dTmax" label="Max Temp Rise" unit="°C" value={dTmax} onChange={setDTmax} min={5} max={80} step={1} />
            <CalcSelect id="install" label="Installation" value={install} onChange={setInstall} options={Object.entries(INSTALL_DERATING).map(([k, v]) => ({ value: k, label: v.label }))} />
            <CalcSelect id="circuitType" label="Circuit Type" value={circuitType} onChange={setCircuitType} options={[{ value: "single", label: "Single pole" }, { value: "round_trip", label: "Round trip (×2)" }]} />
          </div>
        </div>

        <div className="bg-white-0 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(242,183,5,0.015)] to-transparent pointer-events-none" />
          <div className="relative z-10">
            <CalcResultRow label="Cross-Section Area" value={areaMm2.toFixed(1)} unit="mm²" />
            <CalcResultRow label="Resistance (at Tamb)" value={(R_T * 1000).toFixed(4)} unit="mΩ" style="highlight" />
            <CalcResultRow label="Voltage Drop" value={vDrop.toFixed(2)} unit="mV" style="highlight" />
            <CalcResultRow label="Power Loss" value={pLoss.toFixed(2)} unit="W" />
            <CalcResultRow label="Current Density" value={J.toFixed(2)} unit="A/mm²" style={J > 6 ? "danger" : J > 3.5 ? "highlight" : "normal"} />
            <CalcResultRow label="Est. Temp Rise" value={tempRise.toFixed(1)} unit="°C" style="highlight" />
            <CalcResultRow label="Conductor Temp" value={condTemp.toFixed(1)} unit="°C" style={condTemp > 100 ? "danger" : condTemp > 70 ? "highlight" : "ok"} />
            <CalcResultRow label="Safe Continuous Current" value={isFinite(safeI) ? safeI.toFixed(1) : "—"} unit="A" style="highlight" />
            <CalcResultRow label="Derated Current" value={isFinite(deratedI) ? deratedI.toFixed(1) : "—"} unit="A" />
          </div>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="px-6 py-3 flex flex-col gap-2 bg-white-0 border-b border-white-3">
          {warnings.map((w, i) => <CalcWarning key={i} message={w} />)}
        </div>
      )}

      <div className="bg-white-0 p-6 border-t border-white-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-y" style={{ boxShadow: "0 0 8px rgba(242, 183, 5, 0.6)" }} />
          <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-tw-3">
            VOLTAGE DROP VS CURRENT
          </p>
        </div>
        <canvas ref={canvasRef} width={700} height={300} className="w-full h-[300px] md:h-[280px] rounded-[2px] border border-white-3" />
      </div>
    </div>
  );
}


