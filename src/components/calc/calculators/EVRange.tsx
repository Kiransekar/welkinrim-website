"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { CalcField } from "../CalcField";
import { CalcSlider } from "../CalcSlider";
import { CalcResultRow } from "../CalcResultRow";
import { CalcWarning } from "../CalcWarning";
import { CalcHeader } from "../CalcHeader";
import { drawChart } from "@/lib/calcUtils";

function tempCorrection(tempC: number): number {
  if (tempC >= 25) return 1.0;
  if (tempC >= 0) return 1.0 - (25 - tempC) * 0.005;
  return 0.875 - Math.abs(tempC) * 0.003;
}

export function EVRange() {
  const [mass, setMass] = useState(1500);
  const [payload, setPayload] = useState(75);
  const [Cd, setCd] = useState(0.28);
  const [A, setA] = useState(2.2);
  const [Crr, setCrr] = useState(0.008);
  const [eta_dt, setEtaDt] = useState(92);
  const [eta_regen, setEtaRegen] = useState(65);
  const [Ebat, setEbat] = useState(75);
  const [degrad, setDegrad] = useState(0);
  const [Paux, setPaux] = useState(1.2);
  const [speed, setSpeed] = useState(100);
  const [grad, setGrad] = useState(0);
  const [temp, setTemp] = useState(25);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const M_total = mass + payload;
  const V_ms = speed / 3.6;
  const rho = 1.225;

  const F_drag = 0.5 * rho * Cd * A * V_ms ** 2;
  const angle = Math.atan(grad / 100);
  const F_roll = M_total * 9.81 * Crr * Math.cos(angle);
  const F_grade = M_total * 9.81 * Math.sin(angle);
  const F_total = F_drag + F_roll + F_grade;

  const P_traction = F_total * V_ms;
  const P_elec = (P_traction / (eta_dt / 100)) + Paux * 1000;

  const cons_per_km = V_ms > 0 ? (P_elec / 1000) / (speed) : 0;
  const cons_100km = cons_per_km * 100;

  const tempCorr = tempCorrection(temp);
  const E_effective = Ebat * (1 - degrad / 100) * tempCorr;

  const rangeKm = cons_per_km > 0 ? E_effective / cons_per_km : 0;

  // Regen
  const tripTimeH = speed > 0 ? rangeKm / speed : 0;
  const E_regen = (P_traction / 1000) * tripTimeH * 0.30 * (eta_regen / 100);
  const rangeWithRegen = cons_per_km > 0 ? (E_effective + E_regen) / cons_per_km : 0;

  const costPer100km = cons_100km * 7;
  const co2PerKm = cons_per_km > 0 ? cons_per_km * 1000 * 700 : 0;

  const warnings: string[] = [];
  if (rangeKm < 50) warnings.push("Estimated range below 50 km — verify battery capacity and driving conditions");
  if (cons_100km > 30) warnings.push("High consumption — reduce speed, check aerodynamics, or lighten vehicle");
  if (F_grade > F_drag + F_roll) warnings.push("Gradient force dominates — range significantly reduced on inclines");

  const drawCurve = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const steps = 200;
    const maxSpeed = 200;
    const xData: number[] = [];
    const yTotal: number[] = [];
    const yAero: number[] = [];
    const yRoll: number[] = [];

    for (let i = 0; i <= steps; i++) {
      const spd = (maxSpeed * i) / steps;
      const v = spd / 3.6;
      xData.push(spd);

      const fd = 0.5 * rho * Cd * A * v ** 2;
      const fr = M_total * 9.81 * Crr;
      const pt = (fd + fr) * v;
      const pe = pt / (eta_dt / 100) + Paux * 1000;
      const c = spd > 0 ? (pe / 1000) / spd * 100 : 0;
      const ca = spd > 0 ? ((fd * v) / (eta_dt / 100) / 1000) / spd * 100 : 0;
      const cr = spd > 0 ? ((fr * v) / (eta_dt / 100) / 1000) / spd * 100 : 0;

      yTotal.push(c);
      yAero.push(ca);
      yRoll.push(cr);
    }

    drawChart({
      canvas,
      xData,
      yData: [yTotal, yAero, yRoll],
      colors: ["#F2B705", "rgba(255,255,255,0.35)", "rgba(255,255,255,0.20)"],
      dashed: [false, true, true],
      xLabel: "SPEED (km/h)",
      yLabel: "CONSUMPTION (kWh/100km)",
      xMin: 0,
      xMax: maxSpeed,
      yMin: 0,
      operatingPoint: { x: speed, y: cons_100km },
    });
  }, [Cd, A, Crr, M_total, eta_dt, Paux, speed, cons_100km, rho]);

  useEffect(() => { drawCurve(); }, [drawCurve]);

  return (
    <div>
      <CalcHeader
        title="EV DRIVE RANGE ESTIMATOR"
        description="Estimate electric vehicle range from aerodynamic drag, rolling resistance, gradient, battery capacity, and temperature. Includes regenerative braking recovery."
        accuracy="±15%"
        domain="LAND"
        domainColor="#F2B705"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="bg-sb-0 p-6 border-b lg:border-b-0 lg:border-r border-sb-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(242,183,5,0.02)] to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-4">
            <CalcField id="mass" label="Vehicle Mass" unit="kg" value={mass} onChange={setMass} step={50} min={100} />
            <CalcField id="payload" label="Payload" unit="kg" value={payload} onChange={setPayload} step={5} min={0} />
            <CalcField id="Cd" label="Drag Coefficient Cd" unit="" value={Cd} onChange={setCd} step={0.01} min={0.1} />
            <CalcField id="A" label="Frontal Area" unit="m²" value={A} onChange={setA} step={0.1} min={0.5} />
            <CalcField id="Crr" label="Rolling Resistance Crr" unit="" value={Crr} onChange={setCrr} step={0.001} min={0.001} />
            <div className="h-px bg-sb-3 my-1" />
            <CalcSlider id="eta_dt" label="Drivetrain Efficiency" unit="%" value={eta_dt} onChange={setEtaDt} min={80} max={99} step={1} />
            <CalcSlider id="eta_regen" label="Regen Braking Efficiency" unit="%" value={eta_regen} onChange={setEtaRegen} min={0} max={80} step={5} />
            <CalcField id="Ebat" label="Battery Capacity (usable)" unit="kWh" value={Ebat} onChange={setEbat} step={5} min={1} />
            <CalcSlider id="degrad" label="Battery Degradation" unit="%" value={degrad} onChange={setDegrad} min={0} max={40} step={1} />
            <CalcField id="Paux" label="Auxiliary Load" unit="kW" value={Paux} onChange={setPaux} step={0.1} min={0} />
            <div className="h-px bg-sb-3 my-1" />
            <CalcField id="speed" label="Trip Speed" unit="km/h" value={speed} onChange={setSpeed} step={5} min={5} />
            <CalcSlider id="grad" label="Gradient" unit="%" value={grad} onChange={setGrad} min={-10} max={10} step={0.5} />
            <CalcField id="temp" label="Temperature" unit="°C" value={temp} onChange={setTemp} step={1} />
          </div>
        </div>

        <div className="bg-sb-0 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(242,183,5,0.015)] to-transparent pointer-events-none" />
          <div className="relative z-10">
            <CalcResultRow label="Aerodynamic Drag Force" value={F_drag.toFixed(1)} unit="N" />
            <CalcResultRow label="Rolling Resistance Force" value={F_roll.toFixed(1)} unit="N" />
            <CalcResultRow label="Grade Force" value={F_grade.toFixed(1)} unit="N" />
            <CalcResultRow label="Total Traction Power" value={(P_traction / 1000).toFixed(2)} unit="kW" />
            <CalcResultRow label="Electrical Power at Battery" value={(P_elec / 1000).toFixed(2)} unit="kW" />
            <CalcResultRow label="Consumption" value={cons_100km.toFixed(2)} unit="kWh/100km" style="highlight" />
            <CalcResultRow label="Effective Battery Capacity" value={E_effective.toFixed(1)} unit="kWh" />
            <CalcResultRow label="Estimated Range" value={rangeKm.toFixed(0)} unit="km" style="highlight" />
            <CalcResultRow label="Range with Regen" value={rangeWithRegen.toFixed(0)} unit="km" style="highlight" />
            <CalcResultRow label="Energy Cost (₹7/kWh)" value={`₹${costPer100km.toFixed(1)}`} unit="/100km" />
            <CalcResultRow label="CO₂ (Indian grid)" value={co2PerKm.toFixed(0)} unit="g/km" />
          </div>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="px-6 py-3 flex flex-col gap-2 bg-sb-0 border-b border-sb-3">
          {warnings.map((w, i) => <CalcWarning key={i} message={w} />)}
        </div>
      )}

      <div className="bg-sb-0 p-6 border-t border-sb-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-y" style={{ boxShadow: "0 0 8px rgba(242, 183, 5, 0.6)" }} />
          <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-[rgba(255,255,255,0.25)]">
            CONSUMPTION VS SPEED
          </p>
        </div>
        <canvas ref={canvasRef} width={700} height={300} className="w-full h-[300px] md:h-[280px] rounded-[2px] border border-sb-3" />
      </div>
    </div>
  );
}
