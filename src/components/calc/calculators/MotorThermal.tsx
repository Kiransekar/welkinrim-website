"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { CalcField } from "../CalcField";
import { CalcSelect } from "../CalcSelect";
import { CalcResultRow } from "../CalcResultRow";
import { CalcWarning } from "../CalcWarning";
import { CalcHeader } from "../CalcHeader";
import { drawChart } from "@/lib/calcUtils";

const INSULATION_CLASSES: Record<string, number> = {
  A: 105, B: 130, E: 120, F: 155, H: 180, C: 220,
};

const COOLING_MULT: Record<string, number> = {
  excellent: 0.40, good: 0.65, medium: 1.00, poor: 1.50, verypoor: 2.20,
};

export function MotorThermal() {
  const [Rph, setRph] = useState(0.05);
  const [phases, setPhases] = useState("3");
  const [Irms, setIrms] = useState(80);
  const [Pfe, setPfe] = useState(120);
  const [Pfw, setPfw] = useState(30);
  const [Rth_wc, setRth_wc] = useState(0.18);
  const [Rth_ca, setRth_ca] = useState(0.035);
  const [Tamb, setTamb] = useState(40);
  const [insClass, setInsClass] = useState("F");
  const [cooling, setCooling] = useState("medium");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const nPhases = Number(phases);
  const Pcu = Irms * Irms * Rph * nPhases;
  const Ptotal = Pcu + Pfe + Pfw;
  const coolingMult = COOLING_MULT[cooling] ?? 1;
  const Rth_ca_eff = Rth_ca * coolingMult;
  const Tcase = Tamb + Ptotal * Rth_ca_eff;
  const Twinding = Tcase + Ptotal * Rth_wc;
  const Tlimit = INSULATION_CLASSES[insClass] ?? 155;
  const margin = Tlimit - Twinding;

  const thermalBudget = Tlimit - Tamb - (Pfe + Pfw) * (Rth_wc + Rth_ca_eff);
  const Imax = thermalBudget > 0
    ? Math.sqrt(thermalBudget / (Rph * nPhases * (Rth_wc + Rth_ca_eff)))
    : 0;

  let status = "SAFE";
  let statusStyle: "ok" | "danger" | "highlight" = "ok";
  if (margin < 0) { status = "OVER LIMIT"; statusStyle = "danger"; }
  else if (margin < 15) { status = "CRITICAL"; statusStyle = "danger"; }
  else if (margin < 30) { status = "WARNING"; statusStyle = "highlight"; }

  const warnings: string[] = [];
  if (margin < 0) warnings.push("Winding temperature EXCEEDS insulation class limit! Reduce current or improve cooling.");
  if (margin < 15 && margin >= 0) warnings.push("Thermal margin critically low. Consider upgrading insulation class or improving cooling.");

  const drawCurve = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const maxI = Irms * 2;
    const steps = 200;
    const xData: number[] = [];
    const yTemp: number[] = [];

    for (let i = 0; i <= steps; i++) {
      const I = (maxI * i) / steps;
      xData.push(I);
      const pcu = I * I * Rph * nPhases;
      const pt = pcu + Pfe + Pfw;
      const tw = Tamb + pt * Rth_ca_eff + pt * Rth_wc;
      yTemp.push(tw);
    }

    drawChart({
      canvas,
      xData,
      yData: [yTemp],
      colors: ["#F2B705"],
      dashed: [false],
      xLabel: "CURRENT (A)",
      yLabel: "WINDING TEMP (°C)",
      xMin: 0,
      xMax: maxI,
      yMin: Tamb - 10,
      yMax: Math.max(Tlimit * 1.3, Twinding * 1.1),
      operatingPoint: { x: Irms, y: Twinding },
      annotations: [
        { y: Tlimit, label: `Class ${insClass} limit (${Tlimit}°C)`, axis: "y", color: "#F2B705" },
        ...(Imax > 0 ? [{ x: Imax, label: `I_max = ${Imax.toFixed(1)}A`, axis: "x" as const, color: "#FF6B6B" }] : []),
      ],
    });
  }, [Irms, Rph, nPhases, Pfe, Pfw, Tamb, Rth_ca_eff, Rth_wc, Tlimit, Twinding, insClass, Imax]);

  useEffect(() => { drawCurve(); }, [drawCurve]);

  return (
    <div>
      <CalcHeader
        title="MOTOR THERMAL RATING"
        description="Simplified two-stage thermal model. Calculates winding temperature from losses, thermal resistances, and cooling conditions."
        accuracy="±10%"
        domain="UNIVERSAL"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="bg-sb-0 p-6 border-b lg:border-b-0 lg:border-r border-sb-3">
          <div className="flex flex-col gap-4">
            <CalcField id="Rph" label="Phase Resistance" unit="Ω" value={Rph} onChange={setRph} step={0.001} min={0.001} />
            <CalcSelect id="phases" label="Number of Phases" value={phases} onChange={setPhases} options={[{ value: "3", label: "3-Phase" }, { value: "1", label: "1-Phase" }]} />
            <CalcField id="Irms" label="Continuous RMS Current" unit="A" value={Irms} onChange={setIrms} step={1} min={1} />
            <CalcField id="Pfe" label="Iron (Core) Losses" unit="W" value={Pfe} onChange={setPfe} step={5} min={0} />
            <CalcField id="Pfw" label="Friction & Windage" unit="W" value={Pfw} onChange={setPfw} step={5} min={0} />
            <div className="h-px bg-sb-3 my-1" />
            <CalcField id="Rth_wc" label="Thermal Res. (winding→case)" unit="°C/W" value={Rth_wc} onChange={setRth_wc} step={0.01} min={0.001} />
            <CalcField id="Rth_ca" label="Thermal Res. (case→ambient)" unit="°C/W" value={Rth_ca} onChange={setRth_ca} step={0.001} min={0.001} />
            <CalcField id="Tamb" label="Ambient Temperature" unit="°C" value={Tamb} onChange={setTamb} step={1} />
            <CalcSelect id="insClass" label="Insulation Class" value={insClass} onChange={setInsClass} options={Object.keys(INSULATION_CLASSES).map((k) => ({ value: k, label: `Class ${k} (${INSULATION_CLASSES[k]}°C)` }))} />
            <CalcSelect id="cooling" label="Cooling Quality" value={cooling} onChange={setCooling} options={[
              { value: "excellent", label: "Excellent (forced liquid)" },
              { value: "good", label: "Good (forced air)" },
              { value: "medium", label: "Medium (natural convection)" },
              { value: "poor", label: "Poor (enclosed)" },
              { value: "verypoor", label: "Very Poor (sealed)" },
            ]} />
          </div>
        </div>

        <div className="bg-sb-0 p-6">
          <CalcResultRow label="Copper Losses" value={Pcu.toFixed(1)} unit="W" />
          <CalcResultRow label="Iron Losses" value={Pfe.toFixed(1)} unit="W" />
          <CalcResultRow label="Friction/Windage" value={Pfw.toFixed(1)} unit="W" />
          <CalcResultRow label="Total Losses" value={Ptotal.toFixed(1)} unit="W" />
          <CalcResultRow label="Case Temperature" value={Tcase.toFixed(1)} unit="°C" />
          <CalcResultRow label="Winding Temperature" value={Twinding.toFixed(1)} unit="°C" style="highlight" />
          <CalcResultRow label="Insulation Limit" value={Tlimit.toString()} unit="°C" />
          <CalcResultRow label="Thermal Margin" value={margin.toFixed(1)} unit="°C" style={margin > 20 ? "ok" : margin > 0 ? "highlight" : "danger"} />
          <CalcResultRow label="Max Continuous Current" value={Imax.toFixed(1)} unit="A" style="highlight" />
          <CalcResultRow label="Status" value={status} style={statusStyle} />
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="px-6 py-3 flex flex-col gap-2 bg-sb-0">
          {warnings.map((w, i) => <CalcWarning key={i} message={w} />)}
        </div>
      )}

      <div className="bg-sb-0 p-6 border-t border-sb-3">
        <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-[rgba(255,255,255,0.25)] mb-3">
          TEMPERATURE VS LOAD CURRENT
        </p>
        <canvas ref={canvasRef} width={700} height={300} className="w-full h-[300px] md:h-[280px] rounded-[2px]" />
      </div>
    </div>
  );
}
