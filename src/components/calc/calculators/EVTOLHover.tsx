"use client";

import React, { useState } from "react";
import { CalcField } from "../CalcField";
import { CalcSelect } from "../CalcSelect";
import { CalcSlider } from "../CalcSlider";
import { CalcResultRow } from "../CalcResultRow";
import { CalcWarning } from "../CalcWarning";
import { CalcHeader } from "../CalcHeader";
import { airDensity } from "@/lib/calcUtils";

export function EVTOLHover() {
  const [mtow, setMtow] = useState(250);
  const [nRotors, setNRotors] = useState("8");
  const [rotorDiam, setRotorDiam] = useState(1.5);
  const [FM, setFM] = useState(0.75);
  const [etaSys, setEtaSys] = useState(0.88);
  const [Ebat, setEbat] = useState(100);
  const [usable, setUsable] = useState(80);
  const [reserve, setReserve] = useState(20);
  const [Vcruise, setVcruise] = useState(120);
  const [CdA, setCdA] = useState(1.2);
  const [elevation, setElevation] = useState(0);
  const [temp, setTemp] = useState(25);

  const n = Number(nRotors);
  const rho = airDensity(elevation, temp);
  const W = mtow * 9.81;
  const A_disk = Math.PI * (rotorDiam / 2) ** 2 * n;

  const P_ideal = Math.sqrt(W ** 3 / (2 * rho * A_disk));
  const P_shaft = FM > 0 ? P_ideal / FM : 0;
  const P_hover_kw = etaSys > 0 ? (P_shaft / etaSys) / 1000 : 0;
  const P_hover_per_rotor = n > 0 ? P_hover_kw / n : 0;

  const diskLoading = A_disk > 0 ? W / A_disk : 0;

  const E_available = Ebat * (usable / 100) * (1 - reserve / 100);
  const hoverEndurance = P_hover_kw > 0 ? (E_available / P_hover_kw) * 60 : 0;

  const V_ms = Vcruise / 3.6;
  const F_drag = 0.5 * rho * V_ms ** 2 * CdA;
  const P_drag = (F_drag * V_ms) / 1000;
  const P_induced_cruise = P_hover_kw * 0.3;
  const P_cruise_kw = P_induced_cruise + P_drag;

  const cruiseTimeH = P_cruise_kw > 0 ? E_available / P_cruise_kw : 0;
  const cruiseRange = cruiseTimeH * Vcruise;

  const energyPerKm = cruiseRange > 0 ? (E_available * 1000) / cruiseRange : 0;
  const hoverCurrent = P_hover_kw > 0 && Ebat > 0 ? (P_hover_kw * 1000) / (Ebat * 10 / mtow) : 0;
  const batCRate = Ebat > 0 ? P_hover_kw / Ebat : 0;

  const warnings: string[] = [];
  if (hoverEndurance < 10) warnings.push("Hover endurance below 10 minutes — insufficient for most eVTOL missions");
  if (diskLoading > 800) warnings.push("Disk loading very high — consider larger or more rotors for efficiency");
  if (batCRate > 3) warnings.push("Battery C-rate exceeds 3C — verify cell discharge capability");

  return (
    <div>
      <CalcHeader
        title="eVTOL HOVER ENDURANCE"
        description="Estimate hover power, endurance, and cruise range for electric VTOL aircraft using actuator disk theory with figure of merit correction."
        accuracy="±15%"
        domain="AIR"
        domainColor="var(--d-air)"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="bg-white-0 p-6 border-b lg:border-b-0 lg:border-r border-white-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(59,143,239,0.03)] to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-4">
            <CalcField id="mtow" label="MTOW" unit="kg" value={mtow} onChange={setMtow} step={10} min={10} />
            <CalcSelect id="nRotors" label="Number of Rotors" value={nRotors} onChange={setNRotors} options={[4,6,8,12,16].map((r) => ({ value: String(r), label: String(r) }))} />
            <CalcField id="rotorDiam" label="Rotor Diameter" unit="m" value={rotorDiam} onChange={setRotorDiam} step={0.1} min={0.3} />
            <CalcSlider id="FM" label="Figure of Merit" unit="" value={FM} onChange={setFM} min={0.5} max={0.85} step={0.01} format={(v) => v.toFixed(2)} />
            <CalcSlider id="etaSys" label="System Efficiency" unit="" value={etaSys} onChange={setEtaSys} min={0.70} max={0.96} step={0.01} format={(v) => v.toFixed(2)} />
            <div className="h-px bg-white-3 my-1" />
            <CalcField id="Ebat" label="Battery Capacity" unit="kWh" value={Ebat} onChange={setEbat} step={5} min={1} />
            <CalcSlider id="usable" label="Battery Usable" unit="%" value={usable} onChange={setUsable} min={60} max={95} step={1} />
            <CalcSlider id="reserve" label="Reserve" unit="%" value={reserve} onChange={setReserve} min={10} max={30} step={1} />
            <div className="h-px bg-white-3 my-1" />
            <CalcField id="Vcruise" label="Cruise Speed" unit="km/h" value={Vcruise} onChange={setVcruise} step={5} min={10} />
            <CalcField id="CdA" label="Cruise Drag (Cd×A)" unit="m²" value={CdA} onChange={setCdA} step={0.1} min={0.1} />
            <CalcField id="elevation" label="Elevation" unit="m" value={elevation} onChange={setElevation} step={100} min={0} />
            <CalcField id="temp" label="Temperature" unit="°C" value={temp} onChange={setTemp} step={1} />
          </div>
        </div>

        <div className="bg-white-0 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(59,143,239,0.02)] to-transparent pointer-events-none" />
          <div className="relative z-10">
            <CalcResultRow label="Air Density" value={rho.toFixed(4)} unit="kg/m³" />
            <CalcResultRow label="Hover Power (electrical)" value={P_hover_kw.toFixed(1)} unit="kW" style="highlight" />
            <CalcResultRow label="Hover Power (per rotor)" value={P_hover_per_rotor.toFixed(2)} unit="kW" />
            <CalcResultRow label="Disk Loading" value={diskLoading.toFixed(1)} unit="N/m²" />
            <CalcResultRow label="Max Hover Endurance" value={hoverEndurance.toFixed(1)} unit="min" style="highlight" />
            <CalcResultRow label="Cruise Power (electrical)" value={P_cruise_kw.toFixed(1)} unit="kW" />
            <CalcResultRow label="Max Cruise Range" value={cruiseRange.toFixed(1)} unit="km" style="highlight" />
            <CalcResultRow label="Energy per km (cruise)" value={energyPerKm.toFixed(1)} unit="Wh/km" />
            <CalcResultRow label="Hover Current Draw (est.)" value={hoverCurrent.toFixed(0)} unit="A" />
            <CalcResultRow label="Required Battery C-Rate" value={batCRate.toFixed(2)} unit="C" style={batCRate > 3 ? "danger" : batCRate > 2 ? "highlight" : "ok"} />
          </div>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="px-6 py-3 flex flex-col gap-2 bg-white-0 border-b border-white-3">
          {warnings.map((w, i) => <CalcWarning key={i} message={w} />)}
        </div>
      )}
    </div>
  );
}


