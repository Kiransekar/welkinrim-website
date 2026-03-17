"use client";

import React, { useState } from "react";
import { CalcField } from "../CalcField";
import { CalcSelect } from "../CalcSelect";
import { CalcSlider } from "../CalcSlider";
import { CalcResultRow } from "../CalcResultRow";
import { CalcHeader } from "../CalcHeader";

export function ServoActuator() {
  const [area, setArea] = useState(0.04);
  const [Ch, setCh] = useState(0.025);
  const [q, setQ] = useState(800);
  const [chord, setChord] = useState(0.15);
  const [deflect, setDeflect] = useState(25);
  const [rate, setRate] = useState(60);
  const [nServos, setNServos] = useState("1");
  const [arm, setArm] = useState(25);
  const [hornLen, setHornLen] = useState(25);
  const [eta_rod, setEtaRod] = useState(0.90);

  const n = Number(nServos);
  const Mh = Ch * q * area * chord;
  const T_design = Mh * 1.3;

  const hornLenM = hornLen / 1000;
  const armM = arm / 1000;
  const F_rod = hornLenM > 0 ? T_design / hornLenM : 0;
  const T_servo = n > 0 && eta_rod > 0 ? (F_rod * armM) / (eta_rod * n) : 0;
  const T_kgcm = T_servo * 10.197;

  const pushrodForce = F_rod;

  const speed60deg = rate > 0 ? 60 / rate : 0;

  const omega_rad = rate * Math.PI / 180;
  const servoPower = T_servo * omega_rad;

  let servoClass = "";
  if (T_kgcm < 3) servoClass = "Micro servo (< 3 kg·cm)";
  else if (T_kgcm < 10) servoClass = "Standard servo (3-10 kg·cm)";
  else if (T_kgcm < 25) servoClass = "Heavy-duty servo (10-25 kg·cm)";
  else if (T_kgcm < 60) servoClass = "Brushless servo (25-60 kg·cm)";
  else servoClass = "Hydraulic / Electric actuator required";

  return (
    <div>
      <CalcHeader
        title="SERVO / ACTUATOR SIZING"
        description="Size servos for aerodynamic control surfaces. Calculates hinge moment, required torque, speed, and recommends servo class."
        accuracy="±5%"
        domain="ROBOTICS"
        domainColor="#8866CC"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="bg-sb-0 p-6 border-b lg:border-b-0 lg:border-r border-sb-3">
          <div className="flex flex-col gap-4">
            <CalcField id="area" label="Control Surface Area" unit="m²" value={area} onChange={setArea} step={0.005} min={0.001} />
            <CalcField id="Ch" label="Hinge Moment Coefficient" unit="" value={Ch} onChange={setCh} step={0.005} min={0.001} />
            <CalcField id="q" label="Dynamic Pressure" unit="Pa" value={q} onChange={setQ} step={50} min={10} />
            <CalcField id="chord" label="Control Surface Chord" unit="m" value={chord} onChange={setChord} step={0.01} min={0.01} />
            <div className="h-px bg-sb-3 my-1" />
            <CalcField id="deflect" label="Max Deflection" unit="°" value={deflect} onChange={setDeflect} step={1} min={1} />
            <CalcField id="rate" label="Deflection Rate" unit="°/s" value={rate} onChange={setRate} step={5} min={1} />
            <CalcSelect id="nServos" label="Number of Servos" value={nServos} onChange={setNServos} options={[{ value: "1", label: "1" }, { value: "2", label: "2" }]} />
            <CalcField id="arm" label="Servo Arm Length" unit="mm" value={arm} onChange={setArm} step={1} min={5} />
            <CalcField id="hornLen" label="Control Horn Length" unit="mm" value={hornLen} onChange={setHornLen} step={1} min={5} />
            <CalcSlider id="eta_rod" label="Pushrod Efficiency" unit="" value={eta_rod} onChange={setEtaRod} min={0.7} max={1.0} step={0.01} format={(v) => v.toFixed(2)} />
          </div>
        </div>

        <div className="bg-sb-0 p-6">
          <CalcResultRow label="Hinge Moment Torque" value={Mh.toFixed(4)} unit="Nm" />
          <CalcResultRow label="Design Torque (with SF)" value={T_design.toFixed(4)} unit="Nm" />
          <CalcResultRow label="Required Servo Torque" value={T_servo.toFixed(4)} unit="Nm" style="highlight" />
          <CalcResultRow label="Required Servo Torque" value={T_kgcm.toFixed(2)} unit="kg·cm" style="highlight" />
          <CalcResultRow label="Pushrod Force" value={pushrodForce.toFixed(1)} unit="N" />
          <CalcResultRow label="Required Servo Speed" value={speed60deg.toFixed(2)} unit="s/60°" />
          <CalcResultRow label="Servo Power (peak)" value={servoPower.toFixed(2)} unit="W" />
          <CalcResultRow label="Recommended Servo Class" value={servoClass} />
        </div>
      </div>
    </div>
  );
}
