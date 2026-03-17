"use client";

import React, { useState } from "react";
import { CalcSidebar } from "@/components/calc/CalcSidebar";
import { TorquePowerSpeed } from "@/components/calc/calculators/TorquePowerSpeed";
import { MotorThermal } from "@/components/calc/calculators/MotorThermal";
import { BusbarWire } from "@/components/calc/calculators/BusbarWire";
import { DriveEfficiency } from "@/components/calc/calculators/DriveEfficiency";
import { DroneMotor } from "@/components/calc/calculators/DroneMotor";
import { PropellerBEMT } from "@/components/calc/calculators/PropellerBEMT";
import { EVTOLHover } from "@/components/calc/calculators/EVTOLHover";
import { MarinePropulsion } from "@/components/calc/calculators/MarinePropulsion";
import { EVRange } from "@/components/calc/calculators/EVRange";
import { EVCharging } from "@/components/calc/calculators/EVCharging";
import { RobotJointTorque } from "@/components/calc/calculators/RobotJointTorque";
import { ServoActuator } from "@/components/calc/calculators/ServoActuator";

const CALC_MAP: Record<string, React.ComponentType> = {
  torque: TorquePowerSpeed,
  thermal: MotorThermal,
  busbar: BusbarWire,
  efficiency: DriveEfficiency,
  drone: DroneMotor,
  propeller: PropellerBEMT,
  evtol: EVTOLHover,
  marine: MarinePropulsion,
  evrange: EVRange,
  evcharge: EVCharging,
  joint: RobotJointTorque,
  servo: ServoActuator,
};

export function CalculatorsPage() {
  const [activeCalc, setActiveCalc] = useState("torque");
  const ActiveComponent = CALC_MAP[activeCalc] ?? TorquePowerSpeed;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-sb-0 relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(242,183,5,0.02)] via-transparent to-[rgba(242,183,5,0.01)] pointer-events-none" />
      <CalcSidebar activeId={activeCalc} onSelect={setActiveCalc} />
      <main className="flex-1 overflow-y-auto relative z-10">
        <ActiveComponent />
        {/* Disclaimer */}
        <div className="px-6 py-5 border-t border-sb-3 bg-sb-0 relative">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-y text-[10px]">⚠</span>
            <span className="font-mono text-[8px] tracking-[0.22em] uppercase text-[rgba(255,255,255,0.30)]">
              Engineering Reference Only
            </span>
          </div>
          <p className="font-mono text-[8px] tracking-[0.06em] text-[rgba(255,255,255,0.22)] italic leading-[1.6] max-w-[700px]">
            All calculations use simplified physical models and are provided for engineering
            guidance and motor selection only. Accuracy varies by calculator — see badge.
            Always verify critical designs with full FEA / CFD simulation and physical testing.
            WelkinRim Technologies assumes no liability for sizing decisions made based on these tools.
          </p>
        </div>
      </main>
    </div>
  );
}
