"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { CalcField } from "../CalcField";
import { CalcSelect } from "../CalcSelect";
import { CalcSlider } from "../CalcSlider";
import { CalcResultRow } from "../CalcResultRow";
import { CalcWarning } from "../CalcWarning";
import { CalcHeader } from "../CalcHeader";
import { drawChart, TORQUE_CONST } from "@/lib/calcUtils";

const SOLVE_OPTIONS = [
  { value: "torque", label: "Torque" },
  { value: "power", label: "Power" },
  { value: "speed", label: "Speed" },
];

export function TorquePowerSpeed() {
  const [solve, setSolve] = useState("torque");
  const [power, setPower] = useState(50);
  const [speed, setSpeed] = useState(3000);
  const [torque, setTorque] = useState(160);
  const [gear, setGear] = useState(1);
  const [gearEff, setGearEff] = useState(97);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const eff = gearEff / 100;

  let motorTorque = torque;
  let motorPower = power;
  let motorSpeed = speed;

  if (solve === "torque") {
    motorTorque = speed > 0 ? (power * TORQUE_CONST) / speed : 0;
  } else if (solve === "power") {
    motorPower = (torque * speed) / TORQUE_CONST;
  } else {
    motorSpeed = torque > 0 ? (power * TORQUE_CONST) / torque : 0;
  }

  const outputTorque = motorTorque * gear * eff;
  const outputSpeed = gear > 0 ? motorSpeed / gear : 0;
  const outputPower = motorPower * eff;
  const gearLoss = motorPower * (1 - eff) * 1000; // W
  const omega = (2 * Math.PI * motorSpeed) / 60;

  const warnings: string[] = [];
  if (motorSpeed < 100) warnings.push("Very low speed — torque values may be unrealistic for electric motors");
  if (motorSpeed > 30000) warnings.push("Speed exceeds typical PMSM operating range. Verify bearing limits.");
  if (motorTorque > 2000) warnings.push("High torque — verify shaft and coupling ratings");
  if (gear > 20) warnings.push("High gear ratio — consider multi-stage gearbox for efficiency");

  const drawCurve = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const baseSpeed = solve === "speed" ? motorSpeed : speed;
    const ratedTorque = solve === "torque" ? motorTorque : torque;
    const maxSpeed = baseSpeed * 2.5;

    const xData: number[] = [];
    const yTorque: number[] = [];
    const yPower: number[] = [];
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const n = (maxSpeed * i) / steps;
      xData.push(n);
      if (n <= baseSpeed) {
        yTorque.push(ratedTorque);
        yPower.push((ratedTorque * n) / TORQUE_CONST);
      } else {
        const T = (ratedTorque * baseSpeed) / n;
        yTorque.push(T);
        yPower.push((ratedTorque * baseSpeed) / TORQUE_CONST);
      }
    }

    drawChart({
      canvas,
      xData,
      yData: [yTorque],
      colors: ["#F2B705"],
      dashed: [false],
      xLabel: "SPEED (RPM)",
      yLabel: "TORQUE (Nm)",
      xMin: 0,
      xMax: maxSpeed,
      yMin: 0,
      yMax: ratedTorque * 1.2,
      operatingPoint: { x: motorSpeed, y: motorTorque },
      annotations: [
        { x: baseSpeed, label: "Base speed", axis: "x" },
        { x: maxSpeed, label: "Max speed", axis: "x" },
      ],
    });
  }, [solve, motorSpeed, speed, motorTorque, torque]);

  useEffect(() => {
    drawCurve();
  }, [drawCurve]);

  return (
    <div>
      <CalcHeader
        title="TORQUE · POWER · SPEED"
        description="Core motor relationship calculator. Solve for any one of torque, power, or speed given the other two, with optional gearbox transformation."
        accuracy="±0.1%"
        domain="UNIVERSAL"
        domainColor="#F2B705"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Inputs */}
        <div className="bg-sb-0 p-6 border-b lg:border-b-0 lg:border-r border-sb-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(242,183,5,0.02)] to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex flex-col gap-4">
              <CalcSelect id="solve" label="Solve For" value={solve} onChange={setSolve} options={SOLVE_OPTIONS} />
              {solve !== "power" && (
                <CalcField id="power" label="Mechanical Power" unit="kW" value={power} onChange={setPower} step={0.5} min={0.1} />
              )}
              {solve !== "speed" && (
                <CalcField id="speed" label="Rotational Speed" unit="rpm" value={speed} onChange={setSpeed} step={100} min={1} />
              )}
              {solve !== "torque" && (
                <CalcField id="torque" label="Output Torque" unit="Nm" value={torque} onChange={setTorque} step={1} min={0.1} />
              )}
              <div className="h-px bg-sb-3 my-1" />
              <CalcField id="gear" label="Gearbox Ratio" unit=":1" value={gear} onChange={setGear} step={0.5} min={1} />
              <CalcSlider id="gearEff" label="Gearbox Efficiency" unit="%" value={gearEff} onChange={setGearEff} min={70} max={100} step={0.5} />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-sb-0 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(242,183,5,0.015)] to-transparent pointer-events-none" />
          <div className="relative z-10">
            <CalcResultRow label="Motor Torque" value={motorTorque.toFixed(2)} unit="Nm" style="highlight" />
            <CalcResultRow label="Output Torque" value={outputTorque.toFixed(2)} unit="Nm" />
            <CalcResultRow label="Mechanical Power" value={motorPower.toFixed(2)} unit="kW" style="highlight" />
            <CalcResultRow label="Motor Speed" value={Math.round(motorSpeed).toString()} unit="rpm" />
            <CalcResultRow label="Output Speed" value={Math.round(outputSpeed).toString()} unit="rpm" />
            <CalcResultRow label="Angular Velocity" value={omega.toFixed(2)} unit="rad/s" />
            <CalcResultRow label="Output Power" value={outputPower.toFixed(2)} unit="kW" />
            <CalcResultRow label="Gear Loss" value={gearLoss.toFixed(1)} unit="W" style={gearLoss > motorPower * 50 ? "danger" : "normal"} />
          </div>
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="px-6 py-3 flex flex-col gap-2 bg-sb-0 border-b border-sb-3">
          {warnings.map((w, i) => <CalcWarning key={i} message={w} />)}
        </div>
      )}

      {/* Chart */}
      <div className="bg-sb-0 p-6 border-t border-sb-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-y" style={{ boxShadow: "0 0 8px rgba(242, 183, 5, 0.6)" }} />
          <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-[rgba(255,255,255,0.25)]">
            TORQUE–SPEED CURVE
          </p>
        </div>
        <canvas ref={canvasRef} width={700} height={300} className="w-full h-[300px] md:h-[280px] rounded-[2px] border border-sb-3" />
      </div>
    </div>
  );
}
