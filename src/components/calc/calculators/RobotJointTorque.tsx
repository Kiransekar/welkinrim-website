"use client";

import React, { useState } from "react";
import { CalcField } from "../CalcField";
import { CalcSlider } from "../CalcSlider";
import { CalcResultRow } from "../CalcResultRow";
import { CalcWarning } from "../CalcWarning";
import { CalcHeader } from "../CalcHeader";
import { GRAVITY, conv } from "@/lib/calcUtils";

export function RobotJointTorque() {
  const [M_link, setMLink] = useState(2.5);
  const [L_com, setLCom] = useState(0.3);
  const [M_payload, setMPayload] = useState(1.0);
  const [L_total, setLTotal] = useState(0.6);
  const [omega_max, setOmegaMax] = useState(90);
  const [alpha_max, setAlphaMax] = useState(180);
  const [gear, setGear] = useState(50);
  const [eta_gear, setEtaGear] = useState(90);
  const [T_friction, setTFriction] = useState(0.5);
  const [SF, setSF] = useState(1.5);

  const T_grav = (M_link * GRAVITY * L_com) + (M_payload * GRAVITY * L_total);

  const I_link = (1 / 3) * M_link * L_total ** 2;
  const I_payload = M_payload * L_total ** 2;
  const I_joint = I_link + I_payload;

  const alpha_rad = conv.degToRad(alpha_max);
  const T_inertial = I_joint * alpha_rad;

  const T_output = (T_grav + T_inertial + T_friction) * SF;

  const motorTorque = gear > 0 && eta_gear > 0
    ? T_output / (gear * eta_gear / 100)
    : 0;

  const omega_motor_rad = conv.degToRad(omega_max) * gear;
  const motorSpeedRPM = (omega_max / 360) * 60 * gear;

  const P_continuous = motorTorque * omega_motor_rad;
  const P_peak = motorTorque * omega_motor_rad;

  const I_reflected = I_joint / (gear * gear);

  const warnings: string[] = [];
  if (T_output > 500) warnings.push("Very high output torque — verify structural integrity of joint and mounting");
  if (motorSpeedRPM > 20000) warnings.push("Motor speed exceeds 20,000 rpm — verify bearing and rotor limits");
  if (I_reflected < 1e-6) warnings.push("Reflected inertia very low — system may be over-geared, causing control instability");

  return (
    <div>
      <CalcHeader
        title="ROBOT JOINT TORQUE"
        description="Size motors for robotic arm joints. Calculates gravitational, inertial, and friction torques with gearbox transformation and safety factor."
        accuracy="±5%"
        domain="ROBOTICS"
        domainColor="var(--d-robotics)"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="bg-sb-0 p-6 border-b lg:border-b-0 lg:border-r border-sb-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(136,102,204,0.02)] to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-4">
            <CalcField id="M_link" label="Link Mass" unit="kg" value={M_link} onChange={setMLink} step={0.1} min={0.1} />
            <CalcField id="L_com" label="Link Length (CoM to joint)" unit="m" value={L_com} onChange={setLCom} step={0.01} min={0.01} />
            <CalcField id="M_payload" label="Payload Mass" unit="kg" value={M_payload} onChange={setMPayload} step={0.1} min={0} />
            <CalcField id="L_total" label="Link Length (total)" unit="m" value={L_total} onChange={setLTotal} step={0.01} min={0.01} />
            <div className="h-px bg-sb-3 my-1" />
            <CalcField id="omega_max" label="Max Angular Velocity" unit="°/s" value={omega_max} onChange={setOmegaMax} step={5} min={1} />
            <CalcField id="alpha_max" label="Max Angular Acceleration" unit="°/s²" value={alpha_max} onChange={setAlphaMax} step={10} min={1} />
            <div className="h-px bg-sb-3 my-1" />
            <CalcField id="gear" label="Gearbox Ratio" unit=":1" value={gear} onChange={setGear} step={1} min={1} />
            <CalcSlider id="eta_gear" label="Gearbox Efficiency" unit="%" value={eta_gear} onChange={setEtaGear} min={70} max={99} step={1} />
            <CalcField id="T_friction" label="Friction Torque (joint)" unit="Nm" value={T_friction} onChange={setTFriction} step={0.1} min={0} />
            <CalcSlider id="SF" label="Safety Factor" unit="×" value={SF} onChange={setSF} min={1.0} max={3.0} step={0.1} />
          </div>
        </div>

        <div className="bg-sb-0 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(136,102,204,0.02)] to-transparent pointer-events-none" />
          <div className="relative z-10">
            <CalcResultRow label="Moment of Inertia" value={I_joint.toFixed(4)} unit="kg·m²" />
          <CalcResultRow label="Gravitational Torque" value={T_grav.toFixed(2)} unit="Nm" />
          <CalcResultRow label="Inertial Torque" value={T_inertial.toFixed(2)} unit="Nm" />
          <CalcResultRow label="Total Output Torque (w/ SF)" value={T_output.toFixed(2)} unit="Nm" style="highlight" />
          <CalcResultRow label="Required Motor Torque" value={motorTorque.toFixed(4)} unit="Nm" style="highlight" />
          <CalcResultRow label="Motor Speed (max)" value={motorSpeedRPM.toFixed(0)} unit="rpm" />
          <CalcResultRow label="Motor Power (continuous)" value={P_continuous.toFixed(1)} unit="W" />
          <CalcResultRow label="Motor Power (peak)" value={P_peak.toFixed(1)} unit="W" style="highlight" />
          <CalcResultRow label="Reflected Inertia to Motor" value={I_reflected.toExponential(3)} unit="kg·m²" />
          </div>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="px-6 py-3 flex flex-col gap-2 bg-sb-0 border-b border-sb-3">
          {warnings.map((w, i) => <CalcWarning key={i} message={w} />)}
        </div>
      )}
    </div>
  );
}
