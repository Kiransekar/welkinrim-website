"use client";

import React, { useState } from "react";
import { CalcField } from "../CalcField";
import { CalcSelect } from "../CalcSelect";
import { CalcResultRow } from "../CalcResultRow";
import { CalcWarning } from "../CalcWarning";
import { CalcHeader } from "../CalcHeader";

const HULL_CR: Record<string, { cr: number; label: string }> = {
  displacement: { cr: 0.018, label: "Displacement (Froude < 0.4)" },
  semi: { cr: 0.025, label: "Semi-displacement" },
  planing: { cr: 0.040, label: "Planing (light)" },
  catamaran: { cr: 0.012, label: "Catamaran" },
};

export function MarinePropulsion() {
  const [disp, setDisp] = useState(1500);
  const [hull, setHull] = useState("displacement");
  const [speed, setSpeed] = useState(12);
  const [propD, setPropD] = useState(18);
  const [propP, setPropP] = useState(14);
  const [blades, setBlades] = useState("3");
  const [nProps, setNProps] = useState("1");
  const [kv, setKv] = useState(150);
  const [Vbat, setVbat] = useState(96);
  const [Qbat, setQbat] = useState(400);

  const rho_water = 1025;
  const V_ms = speed * 0.5144;
  const Cr = HULL_CR[hull]?.cr ?? 0.018;
  const Aw = 2.56 * Math.pow(disp / rho_water, 2 / 3);
  const R_hull = Cr * 0.5 * rho_water * V_ms ** 2 * Aw;

  const P_eff = R_hull * V_ms;
  const eta_prop = 0.55;
  const P_delivered = eta_prop > 0 ? P_eff / eta_prop : 0;

  const pitchM = propP * 0.0254;
  const slip = 0.18;
  const wakeFraction = 0.12;
  const V_advance = V_ms * (1 - wakeFraction);
  const requiredRPM = pitchM > 0 ? (V_advance * 60) / (pitchM * (1 - slip)) : 0;

  const requiredV = kv > 0 ? requiredRPM / kv : 0;
  const n = Number(nProps);
  const P_per_prop = n > 0 ? P_delivered / n : P_delivered;
  const I_draw = Vbat > 0 ? P_delivered / Vbat : 0;
  const motorTorque = requiredRPM > 0 ? P_per_prop / (2 * Math.PI * requiredRPM / 60) : 0;

  const E_wh = Qbat * Vbat * 0.85;
  const enduranceH = P_delivered > 0 ? E_wh / P_delivered : 0;
  const rangeNm = enduranceH * speed;

  const warnings: string[] = [];
  if (requiredV > Vbat) warnings.push(`Required voltage (${requiredV.toFixed(0)}V) exceeds battery voltage (${Vbat}V) — reduce speed or increase KV`);
  if (I_draw > Qbat * 2) warnings.push("Current draw exceeds 2C battery rating — consider higher capacity battery");
  if (enduranceH < 0.5) warnings.push("Endurance below 30 minutes — insufficient for most marine applications");

  return (
    <div>
      <CalcHeader
        title="MARINE PROPULSION"
        description="Estimate hull resistance, propulsion power, motor requirements, and range for electric marine vessels using simplified Holtrop-Mennen method."
        accuracy="±20%"
        domain="WATER"
        domainColor="var(--d-water)"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="bg-white-0 p-6 border-b lg:border-b-0 lg:border-r border-white-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,180,204,0.03)] to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-4">
            <CalcField id="disp" label="Vessel Displacement" unit="kg" value={disp} onChange={setDisp} step={50} min={50} />
            <CalcSelect id="hull" label="Hull Type" value={hull} onChange={setHull} options={Object.entries(HULL_CR).map(([k, v]) => ({ value: k, label: v.label }))} />
            <CalcField id="speed" label="Target Speed" unit="knots" value={speed} onChange={setSpeed} step={0.5} min={0.5} />
            <div className="h-px bg-white-3 my-1" />
            <CalcField id="propD" label="Propeller Diameter" unit="inch" value={propD} onChange={setPropD} step={1} min={4} />
            <CalcField id="propP" label="Propeller Pitch" unit="inch" value={propP} onChange={setPropP} step={1} min={4} />
            <CalcSelect id="blades" label="Number of Blades" value={blades} onChange={setBlades} options={[2,3,4,5].map((b) => ({ value: String(b), label: String(b) }))} />
            <CalcSelect id="nProps" label="Number of Propellers" value={nProps} onChange={setNProps} options={[1,2].map((p) => ({ value: String(p), label: String(p) }))} />
            <div className="h-px bg-white-3 my-1" />
            <CalcField id="kv" label="Motor KV" unit="rpm/V" value={kv} onChange={setKv} step={5} min={10} />
            <CalcField id="Vbat" label="Battery Voltage" unit="V" value={Vbat} onChange={setVbat} step={1} min={12} />
            <CalcField id="Qbat" label="Battery Capacity" unit="Ah" value={Qbat} onChange={setQbat} step={10} min={10} />
          </div>
        </div>

        <div className="bg-white-0 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,180,204,0.02)] to-transparent pointer-events-none" />
          <div className="relative z-10">
            <CalcResultRow label="Hull Resistance" value={R_hull.toFixed(1)} unit="N" />
            <CalcResultRow label="Effective Power (EHP)" value={(P_eff / 1000).toFixed(2)} unit="kW" />
            <CalcResultRow label="Delivered Power" value={(P_delivered / 1000).toFixed(2)} unit="kW" style="highlight" />
            <CalcResultRow label="Required Motor RPM" value={requiredRPM.toFixed(0)} unit="rpm" style="highlight" />
            <CalcResultRow label="Required Voltage" value={requiredV.toFixed(1)} unit="V" style={requiredV > Vbat ? "danger" : "normal"} />
            <CalcResultRow label="Motor Current Draw" value={I_draw.toFixed(1)} unit="A" />
            <CalcResultRow label="Motor Torque" value={motorTorque.toFixed(2)} unit="Nm" />
            <CalcResultRow label="Estimated Range" value={rangeNm.toFixed(1)} unit="nm" style="highlight" />
            <CalcResultRow label="Endurance" value={enduranceH.toFixed(1)} unit="hours" />
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


