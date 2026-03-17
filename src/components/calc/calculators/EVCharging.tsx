"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { CalcField } from "../CalcField";
import { CalcSlider } from "../CalcSlider";
import { CalcResultRow } from "../CalcResultRow";
import { CalcHeader } from "../CalcHeader";
import { drawChart } from "@/lib/calcUtils";

export function EVCharging() {
  const [Ebat, setEbat] = useState(75);
  const [SoC_start, setSoCStart] = useState(20);
  const [SoC_end, setSoCEnd] = useState(80);
  const [P_max, setPMax] = useState(50);
  const [loss, setLoss] = useState(10);
  const [cost, setCost] = useState(7);
  const [co2, setCo2] = useState(700);
  const [taper_start, setTaperStart] = useState(80);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const eta_charge = 1 - loss / 100;
  const E_needed = Ebat * (SoC_end - SoC_start) / 100;
  const E_grid = eta_charge > 0 ? E_needed / eta_charge : 0;

  const SoC_taper_end = Math.min(SoC_end, taper_start);
  const E_phase1 = Ebat * (SoC_taper_end - SoC_start) / 100;
  const t_phase1 = SoC_start < taper_start && P_max > 0 && eta_charge > 0
    ? (E_phase1 / (P_max * eta_charge)) * 60
    : 0;

  let t_phase2 = 0;
  if (SoC_end > taper_start) {
    const E_phase2 = Ebat * (SoC_end - taper_start) / 100;
    const taper_range = 100 - taper_start;
    const progress = taper_range > 0 ? (SoC_end - taper_start) / taper_range : 0;
    const avg_taper_power = P_max * (1 - progress * 0.9);
    t_phase2 = avg_taper_power > 0 && eta_charge > 0
      ? (E_phase2 / (avg_taper_power * eta_charge)) * 60
      : 0;
  }

  const totalTime = t_phase1 + t_phase2;
  const avgPower = totalTime > 0 ? E_needed / (totalTime / 60) : 0;

  const chargingCost = E_grid * cost;
  const co2Emission = E_grid * co2;
  const rangeAdded = E_needed / 0.18;
  const costPerKm = rangeAdded > 0 ? chargingCost / rangeAdded : 0;

  const drawCurve = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const steps = 200;
    const xData: number[] = [];
    const ySoC: number[] = [];
    const yPower: number[] = [];
    const maxTime = totalTime > 0 ? totalTime * 1.1 : 60;

    for (let i = 0; i <= steps; i++) {
      const t = (maxTime * i) / steps;
      xData.push(t);

      let soc = SoC_start;
      let pw = P_max;

      if (t <= t_phase1) {
        const e = P_max * eta_charge * (t / 60);
        soc = SoC_start + (e / Ebat) * 100;
        pw = P_max;
      } else {
        soc = SoC_taper_end;
        const t_in_phase2 = t - t_phase1;
        const frac = t_phase2 > 0 ? t_in_phase2 / t_phase2 : 0;
        const progress = Math.min(frac, 1);
        pw = P_max * (1 - progress * 0.9);
        const e2 = pw * eta_charge * (t_in_phase2 / 60);
        soc = taper_start + (e2 / Ebat) * 100;
        soc = Math.min(soc, SoC_end);
      }

      ySoC.push(Math.min(soc, SoC_end));
      yPower.push(pw);
    }

    const maxP = P_max * 1.1;
    const scaledPower = yPower.map((p) => (p / maxP) * 100);

    drawChart({
      canvas,
      xData,
      yData: [ySoC, scaledPower],
      colors: ["#F2B705", "rgba(255,255,255,0.35)"],
      dashed: [false, true],
      xLabel: "TIME (min)",
      yLabel: "STATE OF CHARGE (%)",
      xMin: 0,
      xMax: maxTime,
      yMin: 0,
      yMax: 100,
      annotations: [
        { x: t_phase1, label: "Taper start", axis: "x" },
      ],
    });
  }, [SoC_start, SoC_end, SoC_taper_end, taper_start, P_max, eta_charge, Ebat, t_phase1, t_phase2, totalTime]);

  useEffect(() => { drawCurve(); }, [drawCurve]);

  return (
    <div>
      <CalcHeader
        title="EV CHARGING SESSION"
        description="Model a charging session with constant-current and taper phases. Estimate time, cost, and CO2 emissions for any SoC range."
        accuracy="±10%"
        domain="LAND"
        domainColor="#F2B705"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="bg-sb-0 p-6 border-b lg:border-b-0 lg:border-r border-sb-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(242,183,5,0.02)] to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-4">
            <CalcField id="Ebat" label="Battery Capacity (usable)" unit="kWh" value={Ebat} onChange={setEbat} step={5} min={1} />
            <CalcSlider id="SoC_start" label="Arrival SoC" unit="%" value={SoC_start} onChange={setSoCStart} min={0} max={99} step={1} />
            <CalcSlider id="SoC_end" label="Target SoC" unit="%" value={SoC_end} onChange={setSoCEnd} min={1} max={100} step={1} />
            <CalcField id="P_max" label="Max Charge Power" unit="kW" value={P_max} onChange={setPMax} step={5} min={1} />
            <CalcSlider id="loss" label="Charging Loss" unit="%" value={loss} onChange={setLoss} min={5} max={20} step={1} />
            <CalcSlider id="taper_start" label="Taper Start SoC" unit="%" value={taper_start} onChange={setTaperStart} min={60} max={95} step={1} />
            <div className="h-px bg-sb-3 my-1" />
            <CalcField id="cost" label="Electricity Cost" unit="Rs/kWh" value={cost} onChange={setCost} step={0.5} min={0} />
            <CalcField id="co2" label="CO2 Intensity" unit="g/kWh" value={co2} onChange={setCo2} step={10} min={0} />
          </div>
        </div>

        <div className="bg-sb-0 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(242,183,5,0.02)] to-transparent pointer-events-none" />
          <div className="relative z-10">
            <CalcResultRow label="Energy to Add" value={E_needed.toFixed(1)} unit="kWh" />
          <CalcResultRow label="Grid Energy Draw" value={E_grid.toFixed(1)} unit="kWh" />
          <CalcResultRow label="Charging Time" value={totalTime.toFixed(0)} unit="min" style="highlight" />
          <CalcResultRow label="Average Charging Power" value={avgPower.toFixed(1)} unit="kW" />
          <CalcResultRow label="Peak Charging Power" value={P_max.toFixed(0)} unit="kW" />
          <CalcResultRow label="Charging Cost" value={chargingCost.toFixed(1)} unit="Rs" style="highlight" />
          <CalcResultRow label="CO2 Emitted" value={(co2Emission / 1000).toFixed(2)} unit="kg" />
          <CalcResultRow label="Equiv. Range Added" value={rangeAdded.toFixed(0)} unit="km" style="highlight" />
          <CalcResultRow label="Cost per km" value={costPerKm.toFixed(2)} unit="Rs/km" />
          </div>
        </div>
      </div>

      <div className="bg-sb-0 p-6 border-t border-sb-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-y" style={{ boxShadow: "0 0 8px rgba(242, 183, 5, 0.6)" }} />
          <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-[rgba(255,255,255,0.25)]">
            SOC VS TIME
          </p>
        </div>
        <canvas ref={canvasRef} width={700} height={300} className="w-full h-[300px] md:h-[280px] rounded-[2px] border border-sb-3" />
      </div>
    </div>
  );
}
