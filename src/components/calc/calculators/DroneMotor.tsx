"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { CalcField } from "../CalcField";
import { CalcSelect } from "../CalcSelect";
import { CalcSlider } from "../CalcSlider";
import { CalcResultRow } from "../CalcResultRow";
import { CalcWarning } from "../CalcWarning";
import { CalcHeader } from "../CalcHeader";
import { drawChart, airDensity, G_PER_N } from "@/lib/calcUtils";

export function DroneMotor() {
  const [auw, setAuw] = useState(2.5);
  const [nRotors, setNRotors] = useState("4");
  const [twr, setTwr] = useState(2.5);
  const [hoverPct, setHoverPct] = useState(50);
  const [kv, setKv] = useState(400);
  const [Vbat, setVbat] = useState(48);
  const [Qbat, setQbat] = useState(12000);
  const [propD, setPropD] = useState(20);
  const [eta_hover, setEtaHover] = useState(88);
  const [eta_max, setEtaMax] = useState(85);
  const [elevation, setElevation] = useState(0);
  const [airTemp, setAirTemp] = useState(25);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const n = Number(nRotors);
  const rho = airDensity(elevation, airTemp);
  const hoverThrust = (auw * 9.81) / n;
  const maxThrust = hoverThrust * twr;

  const propDiamM = propD * 0.0254;
  const diskArea = Math.PI * (propDiamM / 2) ** 2;

  const v_induced_hover = Math.sqrt(hoverThrust / (2 * rho * diskArea));
  const P_mech_hover = hoverThrust * v_induced_hover;
  const P_elec_hover = P_mech_hover / (eta_hover / 100);

  const v_induced_max = Math.sqrt(maxThrust / (2 * rho * diskArea));
  const P_mech_max = maxThrust * v_induced_max;
  const P_elec_max = P_mech_max / (eta_max / 100);

  const totalI_hover = (P_elec_hover * n) / Vbat;
  const totalP_hover = P_elec_hover * n;

  const E_wh = (Qbat / 1000) * Vbat * 0.80;
  const hoverTime = totalP_hover > 0 ? (E_wh / (totalP_hover / 1000)) * 60 : 0;

  const motorMaxRPM = kv * Vbat;
  const specificThrust = P_elec_hover > 0 ? (hoverThrust * G_PER_N) / P_elec_hover : 0;
  const batCRate = Qbat > 0 ? totalI_hover / (Qbat / 1000) : 0;

  const warnings: string[] = [];
  if (batCRate > 5) warnings.push("Battery C-rate exceeds 5C — verify battery discharge capability");
  if (hoverTime < 5) warnings.push("Hover endurance below 5 minutes — consider larger battery or more efficient system");
  if (twr < 1.8) warnings.push("Low TWR — insufficient safety margin for gusts and manoeuvring");

  const drawCurve = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const steps = 100;
    const xData: number[] = [];
    const yThrust: number[] = [];
    const yPower: number[] = [];

    for (let i = 0; i <= steps; i++) {
      const throttle = (i / steps) * 100;
      xData.push(throttle);
      const T = maxThrust * Math.pow(throttle / 100, 1.83);
      yThrust.push(T);
      const vi = diskArea > 0 ? Math.sqrt(Math.abs(T) / (2 * rho * diskArea)) : 0;
      const Pm = T * vi;
      const eta = throttle < hoverPct ? eta_hover : eta_max;
      yPower.push(Pm / (eta / 100));
    }

    drawChart({
      canvas,
      xData,
      yData: [yThrust, yPower.map((p) => p * (Math.max(...yThrust) / Math.max(...yPower.filter(isFinite), 1)))],
      colors: ["#F2B705", "rgba(255,255,255,0.35)"],
      dashed: [false, true],
      xLabel: "THROTTLE (%)",
      yLabel: "THRUST (N)",
      xMin: 0,
      xMax: 100,
      yMin: 0,
      operatingPoint: { x: hoverPct, y: hoverThrust },
    });
  }, [maxThrust, rho, diskArea, hoverPct, hoverThrust, eta_hover, eta_max]);

  useEffect(() => { drawCurve(); }, [drawCurve]);

  return (
    <div>
      <CalcHeader
        title="DRONE MOTOR SELECTOR"
        description="Size motors for multi-rotor UAVs. Uses actuator disk theory for hover power estimation with altitude and temperature correction."
        accuracy="±15%"
        domain="AIR"
        domainColor="#3B8FEF"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="bg-sb-0 p-6 border-b lg:border-b-0 lg:border-r border-sb-3">
          <div className="flex flex-col gap-4">
            <CalcField id="auw" label="All-Up Weight (AUW)" unit="kg" value={auw} onChange={setAuw} step={0.1} min={0.1} />
            <CalcSelect id="nRotors" label="Number of Rotors" value={nRotors} onChange={setNRotors} options={[3,4,6,8,12].map((n) => ({ value: String(n), label: String(n) }))} />
            <CalcSlider id="twr" label="Thrust-to-Weight Ratio" unit="×" value={twr} onChange={setTwr} min={1.5} max={5.0} step={0.1} />
            <CalcSlider id="hoverPct" label="Hover Throttle Target" unit="%" value={hoverPct} onChange={setHoverPct} min={30} max={70} step={1} />
            <div className="h-px bg-sb-3 my-1" />
            <CalcField id="kv" label="Motor KV" unit="rpm/V" value={kv} onChange={setKv} step={10} min={50} />
            <CalcField id="Vbat" label="Battery Voltage" unit="V" value={Vbat} onChange={setVbat} step={1} min={3} />
            <CalcField id="Qbat" label="Battery Capacity" unit="mAh" value={Qbat} onChange={setQbat} step={500} min={500} />
            <CalcField id="propD" label="Propeller Diameter" unit="inch" value={propD} onChange={setPropD} step={1} min={3} />
            <div className="h-px bg-sb-3 my-1" />
            <CalcSlider id="eta_hover" label="Motor Efficiency (hover)" unit="%" value={eta_hover} onChange={setEtaHover} min={70} max={97} step={1} />
            <CalcSlider id="eta_max" label="Motor Efficiency (max)" unit="%" value={eta_max} onChange={setEtaMax} min={65} max={95} step={1} />
            <CalcField id="elevation" label="Field Elevation" unit="m ASL" value={elevation} onChange={setElevation} step={100} min={0} />
            <CalcField id="airTemp" label="Air Temperature" unit="°C" value={airTemp} onChange={setAirTemp} step={1} />
          </div>
        </div>

        <div className="bg-sb-0 p-6">
          <CalcResultRow label="Air Density" value={rho.toFixed(4)} unit="kg/m³" />
          <CalcResultRow label="Hover Thrust/Motor" value={hoverThrust.toFixed(2)} unit="N" />
          <CalcResultRow label="Max Thrust/Motor" value={maxThrust.toFixed(2)} unit="N" style="highlight" />
          <CalcResultRow label="Hover Power/Motor (mech)" value={P_mech_hover.toFixed(1)} unit="W" />
          <CalcResultRow label="Hover Power/Motor (elec)" value={P_elec_hover.toFixed(1)} unit="W" />
          <CalcResultRow label="Max Power/Motor (elec)" value={P_elec_max.toFixed(1)} unit="W" style="highlight" />
          <CalcResultRow label="Total Current Draw (hover)" value={totalI_hover.toFixed(1)} unit="A" />
          <CalcResultRow label="Motor Speed (max)" value={motorMaxRPM.toFixed(0)} unit="rpm" />
          <CalcResultRow label="Specific Thrust (hover)" value={specificThrust.toFixed(1)} unit="g/W" />
          <CalcResultRow label="Hover Flight Time" value={hoverTime.toFixed(1)} unit="min" style="highlight" />
          <CalcResultRow label="TWR (actual)" value={twr.toFixed(1)} unit="×" />
          <CalcResultRow label="Battery C-Rate (hover)" value={batCRate.toFixed(2)} unit="C" style={batCRate > 5 ? "danger" : batCRate > 3 ? "highlight" : "ok"} />
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="px-6 py-3 flex flex-col gap-2 bg-sb-0">
          {warnings.map((w, i) => <CalcWarning key={i} message={w} />)}
        </div>
      )}

      <div className="bg-sb-0 p-6 border-t border-sb-3">
        <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-[rgba(255,255,255,0.25)] mb-3">
          THRUST VS THROTTLE
        </p>
        <canvas ref={canvasRef} width={700} height={300} className="w-full h-[300px] md:h-[280px] rounded-[2px]" />
      </div>
    </div>
  );
}
