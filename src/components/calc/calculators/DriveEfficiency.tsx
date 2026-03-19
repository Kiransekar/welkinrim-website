"use client";

import React, { useState } from "react";
import { CalcField } from "../CalcField";
import { CalcSlider } from "../CalcSlider";
import { CalcResultRow } from "../CalcResultRow";
import { CalcWarning } from "../CalcWarning";
import { CalcHeader } from "../CalcHeader";
import { calculateIRLoss, calculatePowerFlowBackward } from "@/lib/calcUtils";

export function DriveEfficiency() {
  const [Vbat, setVbat] = useState(72);
  const [Rbat, setRbat] = useState(25);
  const [Cbat, setCbat] = useState(3);
  const [Qbat, setQbat] = useState(100);
  const [Rcable, setRcable] = useState(5);
  const [eta_inv, setEtaInv] = useState(97);
  const [eta_mot, setEtaMot] = useState(96);
  const [eta_gear, setEtaGear] = useState(98);
  const [Iload, setIload] = useState(120);
  const [Pshaft, setPshaft] = useState(30);

  const P_shaft = Pshaft * 1000;

  // Calculate power flow backward from shaft through efficiency stages
  const P_motor_mech = calculatePowerFlowBackward(P_shaft, eta_gear);
  const P_motor_elec = calculatePowerFlowBackward(P_motor_mech, eta_mot);
  const P_inverter_in = calculatePowerFlowBackward(P_motor_elec, eta_inv);

  // Calculate losses using I²R formula
  const P_bat_loss = calculateIRLoss(Iload, Rbat / 1000);
  const P_cable_loss = calculateIRLoss(Iload, Rcable / 1000);
  const P_inv_loss = P_inverter_in * (1 - eta_inv / 100);
  const P_mot_loss = P_motor_elec * (1 - eta_mot / 100);
  const P_gear_loss = P_motor_mech * (1 - eta_gear / 100);

  const P_total_in = P_inverter_in + P_cable_loss + P_bat_loss;
  const P_total_losses = P_bat_loss + P_cable_loss + P_inv_loss + P_mot_loss + P_gear_loss;
  const eta_system = P_total_in > 0 ? (P_shaft / P_total_in) * 100 : 0;
  const V_terminal = Vbat - Iload * (Rbat / 1000);
  const maxI_continuous = Qbat * Cbat;
  const currentPct = maxI_continuous > 0 ? (Iload / maxI_continuous) * 100 : 0;

  const warnings: string[] = [];
  if (Iload > maxI_continuous) warnings.push(`Load current (${Iload}A) exceeds battery continuous rating (${maxI_continuous}A)`);
  if (V_terminal < Vbat * 0.7) warnings.push("Battery voltage sag exceeds 30% — consider lower impedance cells");
  if (eta_system < 70) warnings.push("System efficiency below 70% — review loss chain for improvement opportunities");

  // Sankey bar data
  const segments = [
    { label: "Battery Loss", value: P_bat_loss, color: "#FF6B6B" },
    { label: "Cable Loss", value: P_cable_loss, color: "#FF8C8C" },
    { label: "Inverter Loss", value: P_inv_loss, color: "#FFAAAA" },
    { label: "Motor Loss", value: P_mot_loss, color: "#FFCCCC" },
    { label: "Gear Loss", value: P_gear_loss, color: "#FFE0E0" },
    { label: "Shaft Power", value: P_shaft, color: "#F2B705" },
  ];
  const totalBar = segments.reduce((s, seg) => s + seg.value, 0);

  return (
    <div>
      <CalcHeader
        title="DRIVE SYSTEM EFFICIENCY"
        description="Full drive chain analysis: battery → cable → inverter → motor → gearbox → shaft. Identify where your watts are going."
        accuracy="±2%"
        domain="UNIVERSAL"
        domainColor="var(--d-land)"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="bg-white-0 p-6 border-b lg:border-b-0 lg:border-r border-white-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(242,183,5,0.02)] to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-4">
            <CalcField id="Vbat" label="Battery Voltage" unit="V" value={Vbat} onChange={setVbat} step={1} min={12} />
            <CalcField id="Rbat" label="Battery Internal Resistance" unit="mΩ" value={Rbat} onChange={setRbat} step={1} min={1} />
            <CalcField id="Cbat" label="Battery C-Rating (cont.)" unit="C" value={Cbat} onChange={setCbat} step={0.5} min={0.5} />
            <CalcField id="Qbat" label="Battery Capacity" unit="Ah" value={Qbat} onChange={setQbat} step={5} min={1} />
            <CalcField id="Rcable" label="DC Link Cable Resistance" unit="mΩ" value={Rcable} onChange={setRcable} step={1} min={0} />
            <div className="h-px bg-white-3 my-1" />
            <CalcSlider id="eta_inv" label="Inverter Efficiency" unit="%" value={eta_inv} onChange={setEtaInv} min={90} max={99.5} step={0.5} />
            <CalcSlider id="eta_mot" label="Motor Efficiency" unit="%" value={eta_mot} onChange={setEtaMot} min={80} max={99} step={0.5} />
            <CalcSlider id="eta_gear" label="Gearbox Efficiency" unit="%" value={eta_gear} onChange={setEtaGear} min={90} max={100} step={0.5} />
            <div className="h-px bg-white-3 my-1" />
            <CalcField id="Iload" label="Load Current" unit="A" value={Iload} onChange={setIload} step={5} min={1} />
            <CalcField id="Pshaft" label="Shaft Power Required" unit="kW" value={Pshaft} onChange={setPshaft} step={0.5} min={0.1} />
          </div>
        </div>

        <div className="bg-white-0 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(242,183,5,0.015)] to-transparent pointer-events-none" />
          <div className="relative z-10">
            <CalcResultRow label="Battery Terminal Voltage" value={V_terminal.toFixed(1)} unit="V" />
            <CalcResultRow label="Battery Loss (I²R)" value={P_bat_loss.toFixed(1)} unit="W" />
            <CalcResultRow label="Cable Loss" value={P_cable_loss.toFixed(1)} unit="W" />
            <CalcResultRow label="Inverter Loss" value={P_inv_loss.toFixed(1)} unit="W" />
            <CalcResultRow label="Motor Loss" value={P_mot_loss.toFixed(1)} unit="W" />
            <CalcResultRow label="Gearbox Loss" value={P_gear_loss.toFixed(1)} unit="W" />
            <CalcResultRow label="Total System Losses" value={P_total_losses.toFixed(1)} unit="W" style="danger" />
            <CalcResultRow label="Power from Battery" value={(P_total_in / 1000).toFixed(2)} unit="kW" />
            <CalcResultRow label="Shaft Power" value={Pshaft.toFixed(2)} unit="kW" style="highlight" />
            <CalcResultRow label="System Efficiency" value={eta_system.toFixed(1)} unit="%" style="highlight" />
            <CalcResultRow label="Max Battery Current (cont.)" value={maxI_continuous.toFixed(0)} unit="A" />
            <CalcResultRow label="Current vs Limit" value={currentPct.toFixed(1)} unit="%" style={currentPct > 100 ? "danger" : currentPct > 80 ? "highlight" : "ok"} />
          </div>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="px-6 py-3 flex flex-col gap-2 bg-white-0 border-b border-white-3">
          {warnings.map((w, i) => <CalcWarning key={i} message={w} />)}
        </div>
      )}

      {/* Sankey-style stacked bar */}
      <div className="bg-white-0 p-6 border-t border-white-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-y" style={{ boxShadow: "0 0 8px rgba(242, 183, 5, 0.6)" }} />
          <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-tw-3">
            POWER FLOW BREAKDOWN
          </p>
        </div>
        <div className="flex w-full h-[48px] rounded-[2px] overflow-hidden border border-white-3">
          {segments.map((seg) => {
            const pct = totalBar > 0 ? (seg.value / totalBar) * 100 : 0;
            if (pct < 0.5) return null;
            return (
              <div
                key={seg.label}
                className="relative flex items-center justify-center group"
                style={{ width: `${pct}%`, backgroundColor: seg.color }}
              >
                {pct > 8 && (
                  <span className="font-mono text-[8px] text-sb-0 font-bold truncate px-1">
                    {seg.value.toFixed(0)}W
                  </span>
                )}
                <div className="absolute bottom-full mb-1 hidden group-hover:block bg-sb-1 border border-white-3 px-2 py-1 rounded-sm z-10 whitespace-nowrap shadow-lg">
                  <span className="font-mono text-[9px] text-white">{seg.label}: {seg.value.toFixed(1)}W ({pct.toFixed(1)}%)</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: seg.color, boxShadow: `0 0 6px ${seg.color}60` }} />
              <span className="font-mono text-[8px] text-tw-3">{seg.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


