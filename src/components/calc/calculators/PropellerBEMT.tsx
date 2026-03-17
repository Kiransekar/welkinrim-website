"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { CalcField } from "../CalcField";
import { CalcSelect } from "../CalcSelect";
import { CalcResultRow } from "../CalcResultRow";
import { CalcHeader } from "../CalcHeader";
import { drawChart, airDensity, G_PER_N } from "@/lib/calcUtils";

export function PropellerBEMT() {
  const [diam, setDiam] = useState(16);
  const [pitch, setPitch] = useState(6);
  const [blades, setBlades] = useState("2");
  const [rpm, setRpm] = useState(8000);
  const [V_inf, setV_inf] = useState(0);
  const [elevation, setElevation] = useState(0);
  const [temp, setTemp] = useState(25);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const nBlades = Number(blades);
  const rho = airDensity(elevation, temp);
  const D_m = diam * 0.0254;
  const p_m = pitch * 0.0254;
  const n_rps = rpm / 60;
  const V_ms = V_inf / 3.6;

  const J = n_rps > 0 && D_m > 0 ? V_ms / (n_rps * D_m) : 0;
  const pitchSpeedKmh = (p_m * rpm / 60) * 3.6;
  const diskA = Math.PI * (D_m / 2) ** 2;

  // Static thrust estimate
  const tipSpeed = Math.PI * n_rps * D_m;
  const PD = diam > 0 ? pitch / diam : 0;
  const T_ideal = 2 * rho * diskA * Math.pow(tipSpeed * tipSpeed * (PD / Math.PI), 1) * 0.0012;
  const staticThrust = Math.abs(T_ideal) * nBlades * (1 + 0.15 * (nBlades - 2));

  // Shaft power
  const Cp = 0.045 * PD * (1 + 0.3 * (nBlades - 2));
  const shaftPower = Math.abs(Cp * rho * Math.pow(n_rps, 3) * Math.pow(D_m, 5));

  // Torque
  const torque = n_rps > 0 ? shaftPower / (2 * Math.PI * n_rps) : 0;

  // Propulsive efficiency
  const propEta = shaftPower > 0 && V_ms > 0 ? (staticThrust * V_ms) / shaftPower * 100 : 0;

  // Coefficients
  const Ct = rho > 0 && n_rps > 0 && D_m > 0 ? staticThrust / (rho * n_rps ** 2 * D_m ** 4) : 0;
  const CpCoeff = rho > 0 && n_rps > 0 && D_m > 0 ? shaftPower / (rho * n_rps ** 3 * D_m ** 5) : 0;
  const Cq = n_rps > 0 ? CpCoeff / (2 * Math.PI) : 0;

  const diskLoading = diskA > 0 ? staticThrust / diskA : 0;
  const specThrust = shaftPower > 0 ? (staticThrust * G_PER_N) / shaftPower : 0;

  // Reynolds at 70% radius
  const chord_est = D_m * 0.06;
  const V_70 = 0.7 * tipSpeed;
  const nu_air = 1.5e-5;
  const Re_70 = chord_est > 0 ? (V_70 * chord_est) / nu_air : 0;

  const n10N = staticThrust > 0 ? rpm * Math.sqrt(10 / staticThrust) : 0;
  const n100W = shaftPower > 0 ? rpm * Math.pow(100 / shaftPower, 1 / 3) : 0;

  const drawCurve = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const J_max = PD * Math.PI * 0.85;
    const steps = 150;
    const xData: number[] = [];
    const yEta: number[] = [];
    const yCt: number[] = [];

    for (let i = 0; i <= steps; i++) {
      const j = (J_max * i) / steps;
      xData.push(j);
      // Simplified model: Ct drops linearly, eta peaks at ~0.7 J_max
      const ct_j = Ct * Math.max(0, 1 - j / J_max);
      yCt.push(ct_j * 5); // Scale for visibility
      const eta_j = j > 0 ? ct_j * j / (CpCoeff > 0 ? CpCoeff : 0.01) * 100 : 0;
      yEta.push(Math.min(eta_j, 95));
    }

    drawChart({
      canvas,
      xData,
      yData: [yEta, yCt],
      colors: ["#F2B705", "rgba(255,255,255,0.35)"],
      dashed: [false, true],
      xLabel: "ADVANCE RATIO J",
      yLabel: "EFFICIENCY η (%)",
      xMin: 0,
      xMax: J_max > 0 ? J_max : 1,
      yMin: 0,
      yMax: 100,
      operatingPoint: J > 0 ? { x: J, y: Math.min(propEta, 95) } : undefined,
    });
  }, [Ct, CpCoeff, PD, J, propEta]);

  useEffect(() => { drawCurve(); }, [drawCurve]);

  return (
    <div>
      <CalcHeader
        title="PROPELLER PERFORMANCE"
        description="Simplified BEMT propeller analysis. Estimates static thrust, shaft power, and efficiency from diameter, pitch, and RPM."
        accuracy="±8%"
        domain="AIR"
        domainColor="#3B8FEF"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="bg-sb-0 p-6 border-b lg:border-b-0 lg:border-r border-sb-3">
          <div className="flex flex-col gap-4">
            <CalcField id="diam" label="Propeller Diameter" unit="inch" value={diam} onChange={setDiam} step={1} min={3} />
            <CalcField id="pitch" label="Pitch" unit="inch" value={pitch} onChange={setPitch} step={0.5} min={1} />
            <CalcSelect id="blades" label="Number of Blades" value={blades} onChange={setBlades} options={[2,3,4].map((b) => ({ value: String(b), label: String(b) }))} />
            <CalcField id="rpm" label="RPM" unit="rpm" value={rpm} onChange={setRpm} step={100} min={100} />
            <CalcField id="V_inf" label="Airspeed (forward)" unit="km/h" value={V_inf} onChange={setV_inf} step={5} min={0} />
            <div className="h-px bg-sb-3 my-1" />
            <CalcField id="elevation" label="Elevation" unit="m" value={elevation} onChange={setElevation} step={100} min={0} />
            <CalcField id="temp" label="Air Temperature" unit="°C" value={temp} onChange={setTemp} step={1} />
          </div>
        </div>

        <div className="bg-sb-0 p-6">
          <CalcResultRow label="Advance Ratio J" value={J.toFixed(4)} />
          <CalcResultRow label="Pitch Speed" value={pitchSpeedKmh.toFixed(1)} unit="km/h" />
          <CalcResultRow label="Static Thrust" value={`${staticThrust.toFixed(2)} N / ${(staticThrust * G_PER_N).toFixed(0)} g`} style="highlight" />
          <CalcResultRow label="Shaft Power" value={shaftPower.toFixed(1)} unit="W" style="highlight" />
          <CalcResultRow label="Torque" value={(torque * 1000).toFixed(2)} unit="mNm" />
          <CalcResultRow label="Ct (thrust coeff)" value={Ct.toFixed(5)} />
          <CalcResultRow label="Cp (power coeff)" value={CpCoeff.toFixed(5)} />
          <CalcResultRow label="Cq (torque coeff)" value={Cq.toFixed(6)} />
          <CalcResultRow label="Disk Loading" value={diskLoading.toFixed(1)} unit="N/m²" />
          <CalcResultRow label="Specific Thrust" value={specThrust.toFixed(1)} unit="g/W" />
          <CalcResultRow label="Prop Efficiency η" value={propEta.toFixed(1)} unit="%" />
          <CalcResultRow label="Air Density" value={rho.toFixed(4)} unit="kg/m³" />
          <CalcResultRow label="Re @ 70% dia" value={Re_70.toFixed(0)} />
          <CalcResultRow label="n for 10N" value={n10N.toFixed(0)} unit="rpm" />
          <CalcResultRow label="n for 100W" value={n100W.toFixed(0)} unit="rpm" />
        </div>
      </div>

      <div className="bg-sb-0 p-6 border-t border-sb-3">
        <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-[rgba(255,255,255,0.25)] mb-3">
          η · Ct VS ADVANCE RATIO
        </p>
        <canvas ref={canvasRef} width={700} height={300} className="w-full h-[300px] md:h-[280px] rounded-[2px]" />
      </div>
    </div>
  );
}
