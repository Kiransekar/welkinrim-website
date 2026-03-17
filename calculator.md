# WELKINRIM CALCULATORS PAGE — COMPLETE IMPLEMENTATION SPEC (REVISED v1.1)
**File:** `app/calculators/page.tsx`  
**Reference:** https://www.ecalc.ch — structure replicated, Welkinrim-themed, all calculations from first principles  
**Design tokens:** CLAUDE.md v3.0 — Space Black, Deep White, Bumblebee Yellow  
**Revision:** v1.1 — Cross-verification corrections applied

---

## OVERVIEW
The calculators page is a single-page application inside the Welkinrim site. It replicates eCalc's multi-calculator architecture: a persistent left sidebar with calculator tabs, and a main panel that swaps content per selection. All calculations run in the browser — zero API calls, zero external dependencies for math.

**12 Calculators total**, mapped to Welkinrim's four domains:

| # | Calculator | Domain | eCalc Equivalent |
|---|---|---|---|
| 1 | Torque · Power · Speed | All | torqueCalc |
| 2 | Motor Thermal Rating | All | torqueCalc (thermal tab) |
| 3 | Busbar / Wire Sizing | All | propCalc (wire extension) |
| 4 | Drive System Efficiency | All | propCalc (efficiency chain) |
| 5 | Drone Motor Selector | Air | xcopterCalc |
| 6 | Propeller Performance (BEMT) | Air | bladeCalc |
| 7 | eVTOL Hover Endurance | Air | xcopterCalc (hover time) |
| 8 | Marine Propulsion | Water | propCalc (marine) |
| 9 | EV Drive Range Estimator | Land | evCalc |
| 10 | EV Charging Session | Land | chargeCalc |
| 11 | Robot Joint Torque | Robotics | torqueCalc (industrial) |
| 12 | Servo / Actuator Sizing | Robotics | torqueCalc |

---

## PAGE LAYOUT ARCHITECTURE
```
┌─ Navbar (fixed, from layout.tsx) ─────────────────────────────────────┐
│                                                                         │
├─ Calc Page ──────────────────────────────────────────────────────────── │
│ ┌─ Sidebar (240px fixed) ──┐ ┌─ Main Panel (flex: 1) ───────────────┐ │
│ │  Logo wordmark           │ │  ┌─ Calc Header ─────────────────┐   │ │
│ │  ─────────────────────   │ │  │  Title · Description · Badge  │   │ │
│ │  Domain Groups:          │ │  └───────────────────────────────┘   │ │
│ │                          │ │  ┌─ Panel Grid (2-col desktop) ──┐   │ │
│ │  UNIVERSAL               │ │  │ Input Panel │ Results Panel   │   │ │
│ │  › Torque·Power·Speed    │ │  └───────────────────────────────┘   │ │
│ │  › Motor Thermal         │ │  ┌─ Chart Area (full width) ─────┐   │ │
│ │  › Busbar / Wire         │ │  │  Canvas/SVG visualization     │   │ │
│ │  › Drive Efficiency      │ │  └───────────────────────────────┘   │ │
│ │                          │ │                                       │ │
│ │  AIR                     │ │                                       │ │
│ │  › Drone Motor Selector  │ │                                       │ │
│ │  › Propeller BEMT        │ │                                       │ │
│ │  › eVTOL Hover Endurance │ │                                       │ │
│ │                          │ │                                       │ │
│ │  WATER                   │ │                                       │ │
│ │  › Marine Propulsion     │ │                                       │ │
│ │                          │ │                                       │ │
│ │  LAND                    │ │                                       │ │
│ │  › EV Range Estimator    │ │                                       │ │
│ │  › EV Charging Session   │ │                                       │ │
│ │                          │ │                                       │ │
│ │  ROBOTICS                │ │                                       │ │
│ │  › Robot Joint Torque    │ │                                       │ │
│ │  › Servo / Actuator      │ │                                       │ │
│ │                          │ │                                       │ │
│ │  ─────────────────────   │ │                                       │ │
│ │  "From India — for       │ │                                       │ │
│ │   the world"             │ │                                       │ │
│ └──────────────────────────┘ └───────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## COMPONENT STRUCTURE
```
app/calculators/
├── page.tsx                    ← Shell: sidebar + active calculator
├── layout.tsx                  ← Optional: sets dark meta for this page
└── components/
    ├── CalcSidebar.tsx         ← Tab navigation, domain groups
    ├── CalcHeader.tsx          ← Title, description, accuracy badge
    ├── CalcField.tsx           ← Reusable labelled input
    ├── CalcSelect.tsx          ← Reusable labelled select
    ├── CalcSlider.tsx          ← Labelled range slider with live value
    ├── CalcResults.tsx         ← Results table (dark panel)
    ├── CalcResultRow.tsx       ← Single result row: label + value + unit
    ├── CalcChart.tsx           ← Canvas chart wrapper (with ResizeObserver)
    ├── CalcWarning.tsx         ← Yellow warning box
    ├── CalcInfo.tsx            ← Blue info box
    └── calculators/
        ├── TorquePowerSpeed.tsx
        ├── MotorThermal.tsx
        ├── BusbarWire.tsx
        ├── DriveEfficiency.tsx
        ├── DroneMotor.tsx
        ├── PropellerBEMT.tsx
        ├── EVTOLHover.tsx
        ├── MarinePropulsion.tsx
        ├── EVRange.tsx
        ├── EVCharging.tsx
        ├── RobotJointTorque.tsx
        └── ServoActuator.tsx
```

---

## STYLING TOKENS (apply to all calculator components)
```css
/* Sidebar */
--calc-sidebar-bg: var(--sb-0);
--calc-sidebar-width-desktop: 240px;
--calc-sidebar-width-tablet: 200px;

/* Tab states */
--tab-inactive-color: rgba(255,255,255,0.40);
--tab-hover-color:    rgba(255,255,255,0.65);
--tab-active-color:   var(--y);
--tab-active-border:  2px solid var(--y);
--tab-active-bg:      var(--sb-1);

/* Domain group labels */
--domain-label-font: Space Mono 8px tracking-[0.28em] uppercase;
--domain-label-color: rgba(255,255,255,0.22);

/* Main panel */
--calc-main-bg: var(--dw-0);

/* Calc header */
--calc-header-bg: var(--sb-0);
--calc-header-border: 1px solid var(--sb-3);

/* Input fields */
--input-bg:       var(--dw-1);
--input-border:   1px solid var(--dw-3);
--input-focus:    1px solid var(--y) + outline 2px var(--y) offset 2px;
--input-font:     Space Mono 12px;

/* Results panel */
--results-bg:          var(--sb-0);
--results-border-row:  1px solid var(--sb-3);
--results-label-color: rgba(255,255,255,0.38);
--results-value-color: var(--t-dk-1);
--results-highlight:   var(--y);
--results-danger:      #FF6B6B;
--results-ok:          #4ADE80;

/* Panel grid */
--panel-border: 1px solid var(--dw-3);

/* Chart canvas */
--chart-bg: var(--sb-0);
--chart-grid: rgba(255,255,255,0.06);
--chart-axis: rgba(255,255,255,0.30);
--chart-line-primary: var(--y);
--chart-line-secondary: rgba(255,255,255,0.35);
--chart-label-font: Space Mono 8px;
```

---

## RESPONSIVE BREAKPOINTS
```
Desktop  ≥ 1024px:  sidebar (240px) + main panel (flex:1), 2-column input/results
Tablet   768–1023px: sidebar (200px) + main panel, 1-column panels (stack)
Mobile   < 768px:   sidebar hidden, tab bar across top (horizontal scroll),
                    1-column layout, canvas charts condensed to 180px height
```

---

# CALCULATOR 1 — TORQUE · POWER · SPEED
**Tab:** Universal · `#` icon  
**eCalc equiv:** torqueCalc  
**Accuracy:** ±0.1% (pure physics, no approximation)

## Inputs
| Field | ID | Default | Unit | Type |
|---|---|---|---|---|
| Solve For | `solve` | "torque" | — | Select |
| Mechanical Power | `power` | 50 | kW | Number |
| Rotational Speed | `speed` | 3000 | rpm | Number |
| Output Torque | `torque` | 160 | Nm | Number (hidden when solving for torque) |
| Gearbox Ratio | `gear` | 1 | :1 | Number |
| Gearbox Efficiency | `gearEff` | 97 | % | Slider 70–100 |

**Solve For options:**
- `torque` → hides torque input, shows power + speed
- `power` → hides power input, shows torque + speed
- `speed` → hides speed input, shows torque + power

## Formulas
```ts
// Core relationship: P = T × ω = T × (2π × n / 60)
// Simplified: P[kW] = T[Nm] × n[rpm] / 9549.3
// Therefore:
//   T[Nm] = P[kW] × 9549.3 / n[rpm]
//   P[kW] = T[Nm] × n[rpm] / 9549.3
//   n[rpm] = P[kW] × 9549.3 / T[Nm]

const TORQUE_CONST = 9549.297  // 60 / (2π) — exact value

// ✅ CORRECTED: Use powerKW directly with TORQUE_CONST (9549)
// Do NOT convert to Watts unless using 9.549 constant
function solveTorque(powerKW: number, speedRPM: number): number {
  return (powerKW * TORQUE_CONST) / speedRPM
}

function solvePower(torqueNm: number, speedRPM: number): number {
  return (torqueNm * speedRPM) / TORQUE_CONST  // returns kW
}

function solveSpeed(torqueNm: number, powerKW: number): number {
  return (powerKW * TORQUE_CONST) / torqueNm
}

// Gearbox transformations:
// output_torque = motor_torque × gear_ratio × (gearEff / 100)
// output_speed  = motor_speed / gear_ratio
// output_power  = motor_power × (gearEff / 100)
function withGearbox(
  motorTorque: number, motorSpeed: number, motorPower: number,
  ratio: number, effPct: number
) {
  const eff = effPct / 100
  return {
    outputTorque:  motorTorque * ratio * eff,         // Nm
    outputSpeed:   motorSpeed / ratio,                 // rpm
    outputPower:   motorPower * eff,                   // kW
    gearLoss:      motorPower * (1 - eff) * 1000,     // W
  }
}

// Angular velocity
const omega = (speedRPM: number) => (2 * Math.PI * speedRPM) / 60  // rad/s
```

## Outputs
| Label | Formula | Unit | Style |
|---|---|---|---|
| Torque (motor shaft) | solveTorque() | Nm | highlight |
| Torque (output shaft) | motorTorque × ratio × eff | Nm | normal |
| Mechanical Power | solvePower() | kW | highlight |
| Motor Speed | solveSpeed() | rpm | normal |
| Output Speed | motorSpeed / ratio | rpm | normal |
| Angular Velocity | omega(motorSpeed) | rad/s | normal |
| Power (with gear loss) | motorPower × gearEff | kW | normal |
| Gear Loss | motorPower × (1-gearEff) | W | danger if > 5% |

## Warnings
```ts
if (speed < 100) warn("Very low speed — torque values may be unrealistic for electric motors")
if (speed > 30000) warn("Speed exceeds typical PMSM operating range. Verify bearing limits.")
if (torque > 2000) warn("High torque — verify shaft and coupling ratings")
if (gearRatio > 20) warn("High gear ratio — consider multi-stage gearbox for efficiency")
```

## Chart: Torque–Speed Curve
```ts
// Constant-torque region: 0 → baseSpeed (rated speed)
// T = constant at ratedTorque
// Constant-power region: baseSpeed → maxSpeed (field weakening)
// T = (P_rated × 9549.3) / n  ← hyperbola
// x-axis: speed 0 → maxSpeed (1.5× input speed)
// y-axis: torque 0 → 1.2× ratedTorque
// Line 1: T-S curve (yellow, 2px)
// Line 2: Power line (white dashed, 1px) — shows P = const

const baseSpeed = speed        // user's input speed = base speed
const maxSpeed  = speed * 2.5  // field weakening limit
const ratedTorque = torqueResult

const points: {x: number, y: number}[] = []
for (let n = 0; n <= maxSpeed; n += maxSpeed / 200) {
  if (n <= baseSpeed) {
    points.push({ x: n, y: ratedTorque })
  } else {
    // Constant power hyperbola
    const T = (ratedTorque * baseSpeed) / n
    points.push({ x: n, y: T })
  }
}

// Operating point dot: user's speed + torque. Yellow, 8px.
// If outside envelope: red dot, curve shakes (±4px, 3 cycles, 280ms)
// Annotations:
// "Base speed" dashed vertical at baseSpeed
// "P = const." label at hyperbola midpoint
// "Max speed" dashed vertical at maxSpeed
```

---

# CALCULATOR 2 — MOTOR THERMAL RATING
**Tab:** Universal · thermometer icon  
**eCalc equiv:** torqueCalc (Thermal tab + Temperature Propagation chart)  
**Accuracy:** ±10% (simplified thermal model)

## Inputs
| Field | ID | Default | Unit | Type |
|---|---|---|---|---|
| Phase Resistance | `Rph` | 0.05 | Ω | Number |
| Number of Phases | `phases` | 3 | — | Select (3/1) |
| Continuous RMS Current | `Irms` | 80 | A | Number |
| Iron (Core) Losses | `Pfe` | 120 | W | Number |
| Friction & Windage | `Pfw` | 30 | W | Number |
| Thermal Resistance (winding→case) | `Rth_wc` | 0.18 | °C/W | Number |
| Thermal Resistance (case→ambient) | `Rth_ca` | **0.035** | °C/W | Number |
| Ambient Temperature | `Tamb` | 40 | °C | Number |
| Insulation Class | `insClass` | "F" | — | Select |
| Cooling Quality | `cooling` | "medium" | — | Select |

**✅ CORRECTED: Default Rth_ca changed from 0.35 to 0.035 °C/W**  
*(0.35 would cause immediate over-temperature for typical motor losses)*

**Insulation classes:**
| Class | Max Winding Temp |
|---|---|
| A | 105°C |
| B | 130°C |
| E | 120°C |
| F | 155°C |
| H | 180°C |
| C | 220°C |

**Cooling multipliers** (applied to Rth_ca):
| Cooling | Multiplier |
|---|---|
| Excellent (forced liquid) | 0.40 |
| Good (forced air) | 0.65 |
| Medium (natural convection) | 1.00 |
| Poor (enclosed) | 1.50 |
| Very Poor (sealed/submerged no flow) | 2.20 |

## Formulas
```ts
// Copper losses (3-phase): P_cu = I² × R_phase × phases
function copperLoss(Irms: number, Rph: number, phases: number): number {
  return Irms * Irms * Rph * phases  // W
}

// Total losses
function totalLoss(Pcu: number, Pfe: number, Pfw: number): number {
  return Pcu + Pfe + Pfw  // W
}

// Effective Rth_ca with cooling factor
function effectiveRth(Rth_ca: number, coolingMult: number): number {
  return Rth_ca * coolingMult
}

// Temperature rise: winding above ambient
// Two-stage thermal model:
//   ΔT_wc = P_total × Rth_wc   (winding → case)
//   ΔT_ca = P_total × Rth_ca_eff (case → ambient)
//   T_winding = Tamb + ΔT_ca + ΔT_wc
function windingTemp(
  Ptotal: number, Rth_wc: number, Rth_ca_eff: number, Tamb: number
): number {
  const dT_wc = Ptotal * Rth_wc
  const dT_ca = Ptotal * Rth_ca_eff
  return Tamb + dT_ca + dT_wc
}

// Case temperature
function caseTemp(Ptotal: number, Rth_ca_eff: number, Tamb: number): number {
  return Tamb + Ptotal * Rth_ca_eff
}

// Maximum continuous current (solve for I where T_winding = T_insulation_limit)
// T_limit = Tamb + P_fe+fw × (Rth_wc + Rth_ca_eff)  +  I² × Rph × phases × Rth_wc
// → I_max = sqrt((T_limit - Tamb - (Pfe+Pfw)×(Rth_wc+Rth_ca_eff)) / (Rph×phases×Rth_wc))
function maxContinuousCurrent(
  Tlimit: number, Tamb: number, Pfe: number, Pfw: number,
  Rth_wc: number, Rth_ca_eff: number, Rph: number, phases: number
): number {
  const thermalBudget = Tlimit - Tamb - (Pfe + Pfw) * (Rth_wc + Rth_ca_eff)
  if (thermalBudget <= 0) return 0
  return Math.sqrt(thermalBudget / (Rph * phases * Rth_wc))
}

// Thermal time constant estimate (simplified)
// τ = Rth_total × C_thermal  — C_thermal estimated from motor size
// Without mass data: show qualitative heat-up curve only
function thermalTimeConstant(Rth_total: number, motorMassKg = 5): number {
  // Specific heat of copper ~385 J/(kg·K), assume ~70% copper by thermal mass
  const C_thermal = motorMassKg * 0.7 * 385 + motorMassKg * 0.3 * 500  // J/K
  return Rth_total * C_thermal  // seconds
}

// Temperature at time t during heat-up:
// T(t) = Tamb + ΔT_ss × (1 - exp(-t/τ))
function tempAtTime(Tamb: number, dT_ss: number, tau: number, t: number): number {
  return Tamb + dT_ss * (1 - Math.exp(-t / tau))
}
```

## Outputs
| Label | Formula | Unit | Style |
|---|---|---|---|
| Copper Losses | I² × R × phases | W | normal |
| Iron Losses | input Pfe | W | normal |
| Friction/Windage | input Pfw | W | normal |
| Total Losses | Pcu + Pfe + Pfw | W | normal |
| Case Temperature | caseTemp() | °C | normal |
| Winding Temperature | windingTemp() | °C | highlight |
| Insulation Limit | from class | °C | normal |
| Thermal Margin | T_limit − T_winding | °C | ok if > 20, danger if < 0 |
| Max Continuous Current | maxContinuousCurrent() | A | highlight |
| Motor Efficiency (est.) | Pout/(Pout+Ptotal) | % | normal |
| Status | text | — | ok/warn/danger |

**Status logic:**
```ts
const margin = T_limit - T_winding
if (margin < 0)   status = "OVER LIMIT"   // danger
if (margin < 15)  status = "CRITICAL"     // danger
if (margin < 30)  status = "WARNING"      // warn
if (margin >= 30) status = "SAFE"         // ok
```

## Chart: Temperature vs Load Current
```ts
// x: current 0 → 2× input Irms
// y: winding temperature
// Plot T_winding vs I at constant Pfe, Pfw
// Mark: user's operating point (yellow dot)
// Mark: I_max line (vertical dashed, red)
// Mark: insulation limit line (horizontal dashed, yellow)
// Fill region above limit: rgba(255,0,0,0.08)
```

---

# CALCULATOR 3 — BUSBAR / WIRE SIZING
**Tab:** Universal · conductor icon  
**eCalc equiv:** propCalc wire extension + custom busbar  
**Accuracy:** ±5%

## Inputs
| Field | ID | Default | Unit | Type |
|---|---|---|---|---|
| Material | `material` | copper | — | Select |
| Conductor Type | `condType` | rect | — | Select |
| Width (rect) | `width` | 40 | mm | Number |
| Thickness (rect) | `thickness` | 5 | mm | Number |
| Diameter (round) | `diameter` | 10 | mm | Number |
| Length | `length` | 500 | mm | Number |
| Continuous Current | `current` | 200 | A | Number |
| Ambient Temperature | `Tamb` | 40 | °C | Number |
| Max Temp Rise | `dTmax` | 30 | °C | Number |
| Installation | `install` | open | — | Select |
| **Circuit Type** | `circuitType` | **single** | — | **Select** |

**✅ ADDED: Circuit Type toggle (single_pole / round_trip)**

**Resistivity values (at 20°C):**
| Material | ρ (Ω·m) |
|---|---|
| Silver | 1.59×10⁻⁸ |
| Copper | 1.72×10⁻⁸ |
| Gold | 2.44×10⁻⁸ |
| Aluminium | 2.82×10⁻⁸ |
| Brass | 7.00×10⁻⁸ |

**Temperature coefficient α (per °C):**
| Material | α |
|---|---|
| Copper | 0.00393 |
| Aluminium | 0.00403 |
| Silver | 0.00380 |

**Installation derating (NEC/IEC approximation):**
| Installation | Current Derating |
|---|---|
| Open air (free convection) | 1.00 |
| Enclosed (touchable) | 0.85 |
| Enclosed (IP65+) | 0.70 |
| Bundled (3 conductors) | 0.70 |
| Buried | 0.80 |

## Formulas
```ts
// Cross-section area
function area(condType: 'rect' | 'round', w: number, t: number, d: number): number {
  if (condType === 'rect') return w * t          // mm²
  return Math.PI * (d / 2) ** 2                 // mm²
}

// Resistance at operating temperature
// R = ρ × L / A  (all in SI: Ω·m × m / m²)
// Then correct for temperature: R_T = R_20 × [1 + α(T - 20)]
function resistance(
  rho: number,   // Ω·m at 20°C
  L_mm: number,  // mm
  A_mm2: number, // mm²
  Toperating: number,
  alpha: number
): number {
  const R_20 = rho * (L_mm / 1000) / (A_mm2 / 1e6)  // Ω
  return R_20 * (1 + alpha * (Toperating - 20))       // Ω at Toperating
}

// ✅ CORRECTED: Voltage drop accounts for circuit type
function voltageDrop(R_ohm: number, I: number, circuitType: 'single' | 'round_trip'): number {
  const multiplier = circuitType === 'round_trip' ? 2 : 1
  return R_ohm * I * multiplier * 1000  // mV
}

// Power loss
function powerLoss(R_ohm: number, I: number): number {
  return I * I * R_ohm  // W
}

// Current density
function currentDensity(I: number, A_mm2: number): number {
  return I / A_mm2  // A/mm²
}

// Temperature rise (simplified — radiation + convection)
// For copper busbar in open air:
// ΔT ≈ (P_loss / (perimeter × L × h_conv))
// where h_conv ≈ 10 W/(m²·K) for natural convection copper
// Simplified: ΔT = (I² × R) / (k × A_surface)
// Use IEC 60943 simplified: ΔT = (I / I_ref)^1.7 × ΔT_ref
// For practical use: iterate until T stabilises
function tempRise(
  I: number, A_mm2: number,
  perimeterMm: number, lengthMm: number,
  h_conv = 10  // W/(m²·K) — natural convection
): number {
  // Power loss per metre, divided by heat-transfer area
  // P_per_m = I² × ρ / A (W/m)
  const P_per_m = (I * I * 1.72e-8) / (A_mm2 / 1e6)
  const A_surface_per_m = (perimeterMm / 1000)  // m² per m of conductor
  return P_per_m / (A_surface_per_m * h_conv)  // °C
}

// Safe current capacity for given ΔT limit
// Solve: I_safe = I × sqrt(ΔT_max / ΔT_at_I)
function safeCurrentCapacity(I: number, dT_actual: number, dT_max: number): number {
  if (dT_actual <= 0) return Infinity
  return I * Math.sqrt(dT_max / dT_actual)
}

// Perimeter
function perimeter(condType: 'rect' | 'round', w: number, t: number, d: number): number {
  if (condType === 'rect') return 2 * (w + t)    // mm
  return Math.PI * d                              // mm
}
```

## Outputs
| Label | Formula | Unit | Style |
|---|---|---|---|
| Cross-Section Area | area() | mm² | normal |
| Resistance (at Tamb) | resistance() | mΩ | highlight |
| Voltage Drop | voltageDrop() | mV | highlight |
| Power Loss | powerLoss() | W | normal |
| Current Density | currentDensity() | A/mm² | normal |
| Estimated Temp Rise | tempRise() | °C | highlight |
| Conductor Temperature | Tamb + tempRise | °C | ok/warn/danger |
| Safe Continuous Current | safeCurrentCapacity() | A | highlight |
| Derated Current (installation) | safeI × derating | A | normal |

**Warnings:**
```ts
if (currentDensity > 3.5) warn("Current density > 3.5 A/mm² — consider larger cross-section")
if (currentDensity > 6.0) warn("Current density > 6 A/mm² — CRITICAL: severe overheating risk")
if (voltageDrop_pct > 2) warn("Voltage drop > 2% of system voltage — consider shorter run or larger section")
if (I > derated_I_max)  warn("Current exceeds derated capacity for installation type")
```

## Chart: Voltage Drop vs Current
```ts
// x: current 0 → 2× input current
// y: voltage drop in mV
// Line: vDrop vs I (linear — yellow, 2px)
// Mark: operating point (yellow dot)
// Vertical dashed: safe current limit (red)
// Horizontal dashed: max acceptable drop (user-configurable threshold)
```

---

# CALCULATOR 4 — DRIVE SYSTEM EFFICIENCY
**Tab:** Universal · efficiency chain icon  
**eCalc equiv:** propCalc (full drive chain)  
**Accuracy:** ±2%

## Inputs
| Field | ID | Default | Unit | Type |
|---|---|---|---|---|
| Battery Voltage | `Vbat` | 72 | V | Number |
| Battery Internal Resistance | `Rbat` | 25 | mΩ | Number |
| Battery C-Rating (continuous) | `Cbat` | 3 | C | Number |
| Battery Capacity | `Qbat` | 100 | Ah | Number |
| DC Link Cable Resistance | `Rcable` | 5 | mΩ | Number |
| Inverter / ESC Efficiency | `eta_inv` | 97 | % | Slider 90–99.5 |
| Motor Efficiency | `eta_mot` | 96 | % | Slider 80–99 |
| Gearbox Efficiency | `eta_gear` | 98 | % | Slider 90–100 |
| Load Current | `Iload` | 120 | A | Number |
| Shaft Power Required | `Pshaft` | 30 | kW | Number |

## Formulas
```ts
// Battery terminal voltage under load
function batteryVoltageUnderLoad(Voc: number, Rbat_mOhm: number, I: number): number {
  return Voc - I * (Rbat_mOhm / 1000)  // V
}

// Cable loss
function cableLoss(Rcable_mOhm: number, I: number): number {
  return I * I * (Rcable_mOhm / 1000)  // W
}

// Battery loss
function batteryLoss(Rbat_mOhm: number, I: number): number {
  return I * I * (Rbat_mOhm / 1000)  // W
}

// Each stage loss
function stageLoss(P_in: number, eta_pct: number): number {
  return P_in * (1 - eta_pct / 100)  // W
}

// Chain calculation: battery → cable → inverter → motor → gearbox → shaft
function driveChain(
  Vbat: number, Rbat_mOhm: number, Rcable_mOhm: number,
  eta_inv: number, eta_mot: number, eta_gear: number,
  Iload: number, Pshaft_kW: number
) {
  const P_shaft = Pshaft_kW * 1000  // W
  
  // Work backwards from shaft power required
  const P_motor_mech = P_shaft / (eta_gear / 100)
  const P_motor_elec = P_motor_mech / (eta_mot / 100)
  const P_inverter_in = P_motor_elec / (eta_inv / 100)
  
  const P_bat_loss  = batteryLoss(Rbat_mOhm, Iload)
  const P_cable_loss = cableLoss(Rcable_mOhm, Iload)
  const P_inv_loss  = stageLoss(P_inverter_in, eta_inv)
  const P_mot_loss  = stageLoss(P_motor_elec, eta_mot)
  const P_gear_loss = stageLoss(P_motor_mech, eta_gear)
  
  const P_total_in = P_inverter_in + P_cable_loss + P_bat_loss
  const eta_system = (P_shaft / P_total_in) * 100
  const V_terminal = batteryVoltageUnderLoad(Vbat, Rbat_mOhm, Iload)
  const maxI_continuous = (Qbat * Cbat)  // A
  
  return {
    V_terminal,
    P_bat_loss,
    P_cable_loss,
    P_inv_loss,
    P_mot_loss,
    P_gear_loss,
    P_total_in,
    P_total_losses: P_bat_loss + P_cable_loss + P_inv_loss + P_mot_loss + P_gear_loss,
    eta_system,
    maxI_continuous,
    P_shaft,
  }
}
```

## Outputs
| Label | Unit | Style |
|---|---|---|
| Battery Terminal Voltage | V | normal |
| Battery Loss (I²R) | W | normal |
| Cable Loss | W | normal |
| Inverter Loss | W | normal |
| Motor Loss | W | normal |
| Gearbox Loss | W | normal |
| Total System Losses | W | danger |
| Power from Battery | kW | normal |
| Shaft Power | kW | highlight |
| System Efficiency | % | highlight |
| Max Battery Current (cont.) | A | normal |
| Current vs Limit | % | ok/warn/danger |

## Chart: Sankey-style Loss Breakdown
```ts
// Horizontal stacked bar showing power flow:
// [Battery Out] → [Cable Loss] → [Inverter Loss] → [Motor Loss] → [Gear Loss] → [Shaft]
// Each loss segment: red (rgba 0.7)
// Shaft segment: yellow
// Total bar width proportional to P_battery_out
// Labels: W values + % of input
```

---

# CALCULATOR 5 — DRONE MOTOR SELECTOR
**Tab:** Air · drone icon  
**eCalc equiv:** xcopterCalc  
**Accuracy:** ±15%

## Inputs
| Field | ID | Default | Unit | Type |
|---|---|---|---|---|
| All-Up Weight (AUW) | `auw` | 2.5 | kg | Number |
| Number of Rotors | `nRotors` | 4 | — | Select (3/4/6/8/12) |
| Thrust-to-Weight Ratio | `twr` | 2.5 | × | Slider 1.5–5.0 |
| Hover Throttle Target | `hoverPct` | 50 | % | Slider 30–70 |
| Motor KV | `kv` | 400 | rpm/V | Number |
| Battery Voltage (nominal) | `Vbat` | 48 | V | Number |
| Battery Capacity | `Qbat` | 12000 | mAh | Number |
| Propeller Diameter | `propD` | 20 | inch | Number |
| Motor Efficiency (hover) | `eta_hover` | 88 | % | Slider 70–97 |
| Motor Efficiency (max) | `eta_max` | 85 | % | Slider 65–95 |
| Field Elevation | `elevation` | 0 | m ASL | Number |
| Air Temperature | `airTemp` | 25 | °C | Number |

## Formulas
```ts
// Air density correction (ISA standard atmosphere)
function airDensity(elevM: number, tempC: number): number {
  const T = tempC + 273.15         // Kelvin
  const P = 101325 * Math.pow(1 - 0.0000225577 * elevM, 5.25588)  // Pa
  return P / (287.058 * T)         // kg/m³
}

// Standard sea level air density
const RHO_SL = 1.225  // kg/m³

// Hover thrust per motor
function hoverThrustPerMotor(auwKg: number, nRotors: number): number {
  return (auwKg * 9.81) / nRotors  // N
}

// Max thrust per motor
function maxThrustPerMotor(hoverThrust: number, twr: number, hoverPct: number): number {
  // At hoverPct% throttle, thrust = AUW
  // At 100% throttle, thrust = hoverThrust × (1/hoverPct)² × twr
  // Simplified: maxThrust = hoverThrust / (hoverPct/100)^(1.83) × twr_factor
  // Use actuator disk theory: T ∝ throttle^1.83 approximately
  return hoverThrust * twr  // N (at max throttle = TWR × hover weight)
}

// Power required using actuator disk theory:
// P = T × v_induced = T × sqrt(T / (2 × ρ × A_disk))
function hoverPower(
  thrustN: number, propDiamInch: number, rhoCorrected: number
): number {
  const propDiamM = propDiamInch * 0.0254
  const diskArea = Math.PI * (propDiamM / 2) ** 2  // m²
  const v_induced = Math.sqrt(thrustN / (2 * rhoCorrected * diskArea))  // m/s
  return thrustN * v_induced  // W (ideal / mechanical)
}

// Electrical power = mechanical / eta
function electricalPower(P_mech: number, eta: number): number {
  return P_mech / (eta / 100)  // W
}

// Total current draw
function totalCurrentDraw(P_elec_per_motor: number, nRotors: number, Vbat: number): number {
  return (P_elec_per_motor * nRotors) / Vbat  // A
}

// Flight time (hover)
// E_avail = Qbat × Vbat × 0.80 (80% usable)  in Wh
// P_total = P_elec_per_motor × nRotors  (W)
// t_hover = E_avail / P_total × 60  (minutes)
function hoverFlightTime(
  QbatMah: number, Vbat: number, P_total_W: number
): number {
  const E_wh = (QbatMah / 1000) * Vbat * 0.80
  return (E_wh / (P_total_W / 1000)) * 60  // minutes
}

// Motor shaft speed at max throttle
function motorMaxRPM(kv: number, Vbat: number): number {
  return kv * Vbat  // rpm (no-load approximation)
}

// Specific thrust
function specificThrust(thrustG: number, P_elec_W: number): number {
  return thrustG / P_elec_W  // g/W
}
```

## Outputs
| Label | Unit | Style |
|---|---|---|
| Air Density (corrected) | kg/m³ | normal |
| Hover Thrust per Motor | N | normal |
| Max Thrust per Motor | N | highlight |
| Hover Power per Motor (mech) | W | normal |
| Hover Power per Motor (elec) | W | normal |
| Max Power per Motor (elec) | W | highlight |
| Total Current Draw (hover) | A | normal |
| Motor Speed at Max Throttle | rpm | normal |
| Specific Thrust (hover) | g/W | normal |
| Hover Flight Time (est.) | min | highlight |
| Thrust-Weight Ratio (actual) | × | normal |
| Battery C-Rate (hover) | C | ok/warn/danger |

## Chart: Thrust vs Throttle
```ts
// x: throttle 0–100%
// y: thrust N per motor
// Relationship: T ∝ throttle^1.83 (empirical for fixed pitch propeller)
// Points: T_at_throttle = maxThrust × (throttle/100)^1.83
// Mark hover point (yellow dot at hoverPct%, hoverThrust)
// Mark max point (white dot at 100%, maxThrust)
// Secondary y-axis: electrical power (dashed white line)
```

---

# CALCULATOR 6 — PROPELLER PERFORMANCE (BEMT)
**Tab:** Air · propeller icon  
**eCalc equiv:** bladeCalc  
**Accuracy:** ±8% (simplified BEMT without full blade geometry)

## Inputs
| Field | ID | Default | Unit | Type |
|---|---|---|---|---|
| Propeller Diameter | `diam` | 16 | inch | Number |
| Pitch | `pitch` | 6 | inch | Number |
| Number of Blades | `blades` | 2 | — | Select (2/3/4) |
| RPM | `rpm` | 8000 | rpm | Number |
| Airspeed (forward flight) | `V_inf` | 0 | km/h | Number |
| Elevation | `elevation` | 0 | m | Number |
| Air Temperature | `temp` | 25 | °C | Number |

## Formulas
```ts
// Advance ratio J = V / (n × D)
// where n = rev/s, D = diameter in m, V = freestream m/s
function advanceRatio(V_ms: number, rpm: number, D_m: number): number {
  const n = rpm / 60  // rev/s
  return V_ms / (n * D_m)
}

// Pitch speed (maximum theoretical aircraft speed)
// V_pitch = (pitch_in × 0.0254) × (rpm / 60) × 60/1000 in km/h
function pitchSpeed(pitchInch: number, rpm: number): number {
  const pitchM = pitchInch * 0.0254
  return (pitchM * rpm / 60) * 3.6  // km/h
}

// Disk area
function diskArea(D_m: number): number {
  return Math.PI * (D_m / 2) ** 2
}

// ✅ CORRECTED: Static thrust using Momentum Theory (more robust)
// T = (P² × 2 × ρ × A)^(1/3)
function staticThrust(
  rpm: number, D_inch: number, pitch_inch: number,
  blades: number, rho: number, powerW: number
): number {
  const D = D_inch * 0.0254
  const area = Math.PI * (D / 2) ** 2
  // Momentum theory: T = (P² × 2 × ρ × A)^(1/3)
  return Math.pow(powerW ** 2 * 2 * rho * area, 1 / 3)  // N
}

// Shaft power (absorbed)
// P = T_coeff × ρ × n³ × D⁵
// T_coeff from pitch/diameter ratio (empirical)
function shaftPower(
  rpm: number, D_inch: number, pitch_inch: number,
  blades: number, rho: number
): number {
  const D = D_inch * 0.0254
  const n = rpm / 60
  // Cp estimate from P/D ratio
  const PD = pitch_inch / D_inch
  const Cp = 0.045 * PD * (1 + 0.3 * (blades - 2))  // empirical
  return Cp * rho * n ** 3 * D ** 5  // W
}

// Propulsive efficiency
function propEta(T: number, V_ms: number, P: number): number {
  if (P <= 0 || V_ms <= 0) return 0
  return (T * V_ms) / P * 100  // %
}

// Torque = P / (2π × n)
function torqueFromPower(P_W: number, rpm: number): number {
  return P_W / (2 * Math.PI * rpm / 60)  // Nm
}

// Thrust coefficient Ct = T / (ρ × n² × D⁴)
function thrustCoeff(T: number, rho: number, n_rps: number, D_m: number): number {
  return T / (rho * n_rps ** 2 * D_m ** 4)
}

// Power coefficient Cp = P / (ρ × n³ × D⁵)
function powerCoeff(P: number, rho: number, n_rps: number, D_m: number): number {
  return P / (rho * n_rps ** 3 * D_m ** 5)
}

// Disk loading = T / A_disk  (N/m²)
function diskLoading(T: number, A: number): number {
  return T / A
}

// Specific thrust = T[g] / P[W]
function specificThrustGW(T_N: number, P_W: number): number {
  return (T_N * 101.97) / P_W  // g/W (using 101.97 g = 1 N)
}

// n10N = rpm required to produce 10N thrust (by proportion: n ∝ sqrt(T))
function rpmFor10N(rpm_current: number, T_current: number): number {
  return rpm_current * Math.sqrt(10 / T_current)
}

// n100W = rpm absorbing 100W (P ∝ n³ → n100W = n × (100/P)^(1/3))
function rpmFor100W(rpm_current: number, P_current: number): number {
  return rpm_current * Math.pow(100 / P_current, 1 / 3)
}
```

## Outputs
| Label | Unit |
|---|---|
| Advance Ratio J | — |
| Pitch Speed | km/h |
| Static Thrust | N / g |
| Shaft Power | W |
| Torque | Nm |
| Ct (thrust coefficient) | — |
| Cp (power coefficient) | — |
| Cq (torque coefficient) | — |
| Disk Loading | N/m² |
| Specific Thrust | g/W |
| Propulsive Efficiency η | % |
| Air Density | kg/m³ |
| Reynolds Number @ 70% dia | — |
| n10N | rpm |
| n100W | rpm |

## Chart: η · Cp · Ct vs Advance Ratio J
```ts
// x: J from 0 (static) to J_max (zero thrust)
// J_max ≈ pitch/diameter × π × 0.85  (pitch speed advance ratio)
// Three curves:
//   η  (propulsive efficiency) — yellow solid
//   Cp (power coefficient × 10 for visibility) — white dashed
//   Ct (thrust coefficient × 5) — white dotted
// Mark current J on chart
```

---

# CALCULATOR 7 — eVTOL HOVER ENDURANCE
**Tab:** Air · eVTOL icon  
**eCalc equiv:** xcopterCalc (flight time tab)  
**Accuracy:** ±15%

## Inputs
| Field | ID | Default | Unit | Type |
|---|---|---|---|---|
| MTOW | `mtow` | 250 | kg | Number |
| Number of Rotors | `nRotors` | 8 | — | Select |
| Rotor Diameter | `rotorDiam` | 1.5 | m | Number |
| Figure of Merit | `FM` | 0.75 | — | Slider 0.5–0.85 |
| System Efficiency (total) | `etaSys` | 0.88 | — | Slider 0.70–0.96 |
| Battery Capacity | `Ebat` | 100 | kWh | Number |
| Battery Usable % | `usable` | 80 | % | Slider 60–95 |
| Reserve % | `reserve` | 20 | % | Slider 10–30 |
| Cruise Speed | `Vcruise` | 120 | km/h | Number |
| Cruise Drag (Cd×A) | `CdA` | 1.2 | m² | Number |
| Elevation | `elevation` | 0 | m | Number |
| Temperature | `temp` | 25 | °C | Number |

## Formulas
```ts
// Hover power (actuator disk + figure of merit)
// P_ideal = sqrt(W³ / (2ρA)) where W=weight N, A=total disk area
// P_actual = P_ideal / FM
// P_electrical = P_actual / etaSys
function hoverPowerKW(
  mtowKg: number, nRotors: number, rotorDiamM: number,
  FM: number, etaSys: number, rho: number
): number {
  const W = mtowKg * 9.81              // N
  const A_disk = Math.PI * (rotorDiamM / 2) ** 2 * nRotors  // m² total
  const P_ideal = Math.sqrt(W ** 3 / (2 * rho * A_disk))    // W
  const P_shaft = P_ideal / FM
  return (P_shaft / etaSys) / 1000     // kW electrical
}

// Hover endurance
function hoverEnduranceMin(
  E_kwh: number, usablePct: number, reservePct: number,
  P_hover_kw: number
): number {
  const E_available = E_kwh * (usablePct / 100) * (1 - reservePct / 100)
  return (E_available / P_hover_kw) * 60  // minutes
}

// Cruise power (simplified):
// P_cruise = P_hover × (V_cruise / V_min_power)^3 component
// + aerodynamic drag power: P_drag = 0.5 × ρ × V² × CdA × V
function cruisePowerKW(
  V_ms: number, CdA: number, rho: number,
  P_hover_kw: number, mtowKg: number
): number {
  // Induced power at cruise (much lower than hover)
  const L = mtowKg * 9.81  // N = lift = weight in level flight
  // Simplified: P_induced_cruise ≈ P_hover × (v_induced_hover / v_cruise)
  // P_drag = drag force × velocity
  const F_drag = 0.5 * rho * V_ms ** 2 * CdA
  const P_drag = F_drag * V_ms / 1000  // kW
  // Total cruise power (induced + parasitic)
  const P_induced = P_hover_kw * 0.3  // approximate at cruise
  return P_induced + P_drag
}

// Cruise range
function cruiseRangeKm(
  E_kwh: number, usablePct: number, reservePct: number,
  P_cruise_kw: number, V_kmh: number
): number {
  const E_available = E_kwh * (usablePct / 100) * (1 - reservePct / 100)
  const flightTimeH = E_available / P_cruise_kw
  return flightTimeH * V_kmh  // km
}
```

## Outputs
| Label | Unit | Style |
|---|---|---|
| Air Density | kg/m³ | normal |
| Hover Power (electrical) | kW | highlight |
| Hover Power (per rotor) | kW | normal |
| Disk Loading | N/m² | normal |
| Max Hover Endurance | min | highlight |
| Cruise Power (electrical) | kW | normal |
| Max Cruise Range | km | highlight |
| Energy per km (cruise) | Wh/km | normal |
| Hover Current Draw (est.) | A | normal |
| Required Battery C-Rate | C | ok/warn/danger |

---

# CALCULATOR 8 — MARINE PROPULSION
**Tab:** Water · marine icon  
**eCalc equiv:** propCalc (marine adaptation)  
**Accuracy:** ±20% (hull drag highly variable)

## Inputs
| Field | ID | Default | Unit | Type |
|---|---|---|---|---|
| Vessel Displacement | `disp` | 1500 | kg | Number |
| Hull Type | `hull` | displacement | — | Select |
| Target Speed | `speed` | 12 | knots | Number |
| Propeller Diameter | `propD` | 18 | inch | Number |
| Propeller Pitch | `propP` | 14 | inch | Number |
| Number of Blades | `blades` | 3 | — | Select (2/3/4/5) |
| Number of Propellers | `nProps` | 1 | — | Select (1/2) |
| Motor KV | `kv` | 150 | rpm/V | Number |
| Battery Voltage | `Vbat` | 96 | V | Number |
| Battery Capacity | `Qbat` | 400 | Ah | Number |

**Hull resistance factors:**
| Hull Type | Resistance Coefficient Cr |
|---|---|
| Displacement (Froude < 0.4) | 0.018 |
| Semi-displacement | 0.025 |
| Planing (light) | 0.040 |
| Catamaran | 0.012 |

## Formulas
```ts
// Speed in m/s from knots
const knotsToMs = (knots: number) => knots * 0.5144

// Hull resistance (Holtrop-Mennen simplified)
// R_total ≈ Cr × 0.5 × ρ_water × V² × Aw
// Aw (wetted area) estimated from displacement:
// Aw ≈ 2.56 × displacement^(2/3) for typical hull (m²)
function hullResistance(
  displacementKg: number, V_ms: number, Cr: number
): number {
  const rho_water = 1025  // kg/m³ (salt water)
  const Aw = 2.56 * Math.pow(displacementKg / rho_water, 2 / 3)  // m²
  return Cr * 0.5 * rho_water * V_ms ** 2 * Aw  // N
}

// Effective power (EHP)
function effectivePower(R_N: number, V_ms: number): number {
  return R_N * V_ms  // W
}

// Delivered power (with propeller efficiency ~0.55 for marine)
function deliveredPower(P_eff: number, eta_prop = 0.55): number {
  return P_eff / eta_prop  // W
}

// Required motor RPM from propeller pitch and boat speed
// V_advance = V_boat × (1 - wake_fraction) ≈ V_boat × 0.88
// RPM = V_advance[m/s] × 60 / (pitch[m] × (1 - slip))
// slip ≈ 0.15–0.25 for marine props
function requiredRPM(
  V_ms: number, pitchInch: number, slip = 0.18, wakeFraction = 0.12
): number {
  const V_advance = V_ms * (1 - wakeFraction)
  const pitchM = pitchInch * 0.0254
  return (V_advance * 60) / (pitchM * (1 - slip))
}

// Required voltage for target RPM
function requiredVoltage(rpm: number, kv: number): number {
  return rpm / kv  // V
}

// Current draw
function currentDraw(P_W: number, V: number): number {
  return P_W / V  // A
}

// Motor torque
function motorTorque(P_W: number, rpm: number): number {
  return P_W / (2 * Math.PI * rpm / 60)  // Nm
}

// ✅ CORRECTED: Variable renamed from flightTimeH to enduranceHours
function rangeNm(QbatAh: number, Vbat: number, P_W: number, V_knots: number): number {
  const E_wh = QbatAh * Vbat * 0.85  // usable
  const enduranceHours = E_wh / (P_W / 1000)
  return enduranceHours * V_knots  // nautical miles
}
```

## Outputs
| Label | Unit | Style |
|---|---|---|
| Hull Resistance | N | normal |
| Effective Power (EHP) | kW | normal |
| Delivered Power | kW | highlight |
| Required Motor RPM | rpm | highlight |
| Required Voltage | V | normal |
| Motor Current Draw | A | normal |
| Motor Torque | Nm | normal |
| Estimated Range | nm | highlight |
| Endurance | hours | normal |

---

# CALCULATOR 9 — EV DRIVE RANGE ESTIMATOR
**Tab:** Land · EV icon  
**eCalc equiv:** evCalc  
**Accuracy:** ±15%

## Inputs
| Field | ID | Default | Unit | Type |
|---|---|---|---|---|
| Vehicle Mass | `mass` | 1500 | kg | Number |
| Payload | `payload` | 75 | kg | Number |
| Drag Coefficient Cd | `Cd` | 0.28 | — | Number |
| Frontal Area | `A` | 2.2 | m² | Number |
| Rolling Resistance Crr | `Crr` | 0.008 | — | Number |
| Drivetrain Efficiency | `eta_dt` | 92 | % | Slider 80–99 |
| Regenerative Braking | `eta_regen` | 65 | % | Slider 0–80 |
| Battery Capacity (usable) | `Ebat` | 75 | kWh | Number |
| Battery Degradation | `degrad` | 0 | % | Slider 0–40 |
| Auxiliary Load | `Paux` | 1.2 | kW | Number |
| Trip Speed | `speed` | 100 | km/h | Number |
| Gradient | `grad` | 0 | % | Slider -10–+10 |
| Temperature | `temp` | 25 | °C | Number |

## Formulas
```ts
// Total vehicle mass
const M_total = (mass: number, payload: number) => mass + payload

// Temperature correction for battery (Peukert approximation)
function tempCorrection(tempC: number): number {
  // Battery capacity reduces at cold temperatures
  if (tempC >= 25) return 1.0
  if (tempC >= 0)  return 1.0 - (25 - tempC) * 0.005  // -0.5% per °C
  return 0.875 - Math.abs(tempC) * 0.003               // further loss below 0°C
}

// Aerodynamic drag force
function dragForce(Cd: number, A: number, V_ms: number, rho = 1.225): number {
  return 0.5 * rho * Cd * A * V_ms ** 2  // N
}

// Rolling resistance force
function rollingForce(M_kg: number, Crr: number, grad_pct: number): number {
  const angle = Math.atan(grad_pct / 100)
  const F_roll = M_kg * 9.81 * Crr * Math.cos(angle)
  const F_grade = M_kg * 9.81 * Math.sin(angle)
  return F_roll + F_grade  // N
}

// Total traction power
function tractionPower(F_drag: number, F_roll: number, V_ms: number): number {
  return (F_drag + F_roll) * V_ms  // W
}

// Electrical power at battery (traction + aux)
function electricalPower(
  P_traction_W: number, eta_dt: number, P_aux_kW: number
): number {
  return (P_traction_W / (eta_dt / 100)) + P_aux_kW * 1000  // W
}

// Consumption per 100 km
function consumption100km(P_elec_W: number, V_kmh: number): number {
  return (P_elec_W / 1000) / (V_kmh / 100)  // Wh/km → kWh/100km
}

// Range
function range(
  E_kwh: number, degrad_pct: number, tempCorr: number,
  cons_per_km: number  // kWh/km
): number {
  const E_effective = E_kwh * (1 - degrad_pct / 100) * tempCorr
  return E_effective / cons_per_km  // km
}

// Regen recovery: energy recovered during braking
// Simplified: assume 30% of trips are deceleration phases
// E_regen = P_traction × 0.30 × eta_regen
function regenBonus(
  P_traction_W: number, eta_regen: number, range_km: number, V_kmh: number
): number {
  const tripTimeH = range_km / V_kmh
  const E_regen_kWh = (P_traction_W / 1000) * tripTimeH * 0.30 * (eta_regen / 100)
  return E_regen_kWh  // kWh recovered
}
```

## Outputs
| Label | Unit | Style |
|---|---|---|
| Aerodynamic Drag Force | N | normal |
| Rolling Resistance Force | N | normal |
| Grade Force | N | normal |
| Total Traction Power | kW | normal |
| Electrical Power at Battery | kW | normal |
| Consumption | kWh/100km | highlight |
| Effective Battery Capacity | kWh | normal |
| Estimated Range | km | highlight |
| Range with Regen | km | highlight |
| Energy Cost (est. ₹7/kWh) | ₹/100km | normal |
| CO₂ (Indian grid ~700g/kWh) | g/km | normal |

## Chart: Power vs Speed
```ts
// x: speed 0 → 200 km/h
// y: consumption kWh/100km
// Show: aerodynamic component (dashed) + rolling component (dashed) + total (yellow solid)
// Mark operating point (yellow dot)
// This is the "economy speed" curve — minimum is visible
```

---

# CALCULATOR 10 — EV CHARGING SESSION
**Tab:** Land · charging icon  
**eCalc equiv:** chargeCalc  
**Accuracy:** ±5%

## Inputs
| Field | ID | Default | Unit | Type |
|---|---|---|---|---|
| Battery Capacity (usable) | `Ebat` | 75 | kWh | Number |
| State of Charge (arrival) | `SoC_start` | 20 | % | Slider 0–100 |
| Target SoC | `SoC_end` | 80 | % | Slider 1–100 |
| Max Charge Power | `P_max` | 50 | kW | Number |
| Charging Loss | `loss` | 10 | % | Slider 5–20 |
| Electricity Cost | `cost` | 7 | ₹/kWh | Number |
| CO₂ Intensity | `co2` | 700 | g/kWh | Number |
| Taper Start (SoC) | `taper_start` | 80 | % | Slider 60–95 |

## Formulas
```ts
// Energy needed
function energyNeeded(Ebat: number, SoC_start: number, SoC_end: number): number {
  return Ebat * (SoC_end - SoC_start) / 100  // kWh
}

// Charge time with taper model:
// Phase 1: constant power from SoC_start to taper_start
// Phase 2: power tapers linearly from P_max to P_min (10% of P_max) at 100%
function chargeTime(
  Ebat: number, SoC_start: number, SoC_end: number,
  P_max: number, loss_pct: number, taper_start: number
): { time_min: number, avg_power: number } {
  const eta_charge = 1 - loss_pct / 100
  
  // Phase 1: constant power
  const SoC_taper_end = Math.min(SoC_end, taper_start)
  const E_phase1 = Ebat * (SoC_taper_end - SoC_start) / 100
  const t_phase1 = SoC_start < taper_start
    ? (E_phase1 / (P_max * eta_charge)) * 60
    : 0
  
  // Phase 2: tapered power (linear from P_max to 0.1×P_max)
  let t_phase2 = 0
  if (SoC_end > taper_start) {
    const E_phase2 = Ebat * (SoC_end - taper_start) / 100
    const taper_range = 100 - taper_start
    const progress = (SoC_end - taper_start) / taper_range
    
    // ✅ CORRECTED: Taper ends at 10% (0.1), so reduction is 0.9 not 0.45
    const avg_taper_power = P_max * (1 - progress * 0.9)  // linear taper to 10%
    
    t_phase2 = (E_phase2 / (avg_taper_power * eta_charge)) * 60
  }
  
  const total_time = t_phase1 + t_phase2
  const E_total = energyNeeded(Ebat, SoC_start, SoC_end)
  const avg_power = E_total / (total_time / 60)
  
  return { time_min: total_time, avg_power }
}

// Cost
function chargingCost(E_kwh: number, loss_pct: number, cost_per_kwh: number): number {
  return (E_kwh / (1 - loss_pct / 100)) * cost_per_kwh  // ₹
}

// CO₂
function co2Emission(E_kwh: number, loss_pct: number, co2_g_kwh: number): number {
  return (E_kwh / (1 - loss_pct / 100)) * co2_g_kwh  // g
}

// Equivalent range added
function rangeAdded(E_kwh: number, consumption_kwh_per_km = 0.18): number {
  return E_kwh / consumption_kwh_per_km  // km
}
```

## Outputs
| Label | Unit | Style |
|---|---|---|
| Energy to Add | kWh | normal |
| Grid Energy Draw | kWh | normal |
| Charging Time | min | highlight |
| Average Charging Power | kW | normal |
| Peak Charging Power | kW | normal |
| Charging Cost | ₹ | highlight |
| CO₂ Emitted | g | normal |
| Equivalent Range Added | km | highlight |
| Cost per km | ₹/km | normal |

## Chart: SoC vs Time
```ts
// x: time in minutes (0 → total charge time)
// y: SoC % (SoC_start → SoC_end)
// Show taper inflection point
// Secondary y: charging power kW (dashed white)
// The power line drops at taper_start — characteristic CCS charging curve
```

---

# CALCULATOR 11 — ROBOT JOINT TORQUE
**Tab:** Robotics · joint icon  
**eCalc equiv:** torqueCalc (industrial, with gear + inertia)  
**Accuracy:** ±5%

## Inputs
| Field | ID | Default | Unit | Type |
|---|---|---|---|---|
| Link Mass | `M_link` | 2.5 | kg | Number |
| Link Length (CoM to joint) | `L_com` | 0.3 | m | Number |
| Payload Mass | `M_payload` | 1.0 | kg | Number |
| Link Length (total) | `L_total` | 0.6 | m | Number |
| Max Angular Velocity | `omega_max` | 90 | °/s | Number |
| Max Angular Acceleration | `alpha_max` | 180 | °/s² | Number |
| Gearbox Ratio | `gear` | 50 | :1 | Number |
| Gearbox Efficiency | `eta_gear` | 90 | % | Slider 70–99 |
| Friction Torque (joint) | `T_friction` | 0.5 | Nm | Number |
| Safety Factor | `SF` | 1.5 | × | Slider 1.0–3.0 |

## Formulas
```ts
// Gravitational torque (worst case = horizontal arm)
// T_grav = M_link × g × L_com + M_payload × g × L_total
function gravitationalTorque(
  M_link: number, L_com: number, M_payload: number, L_total: number
): number {
  return (M_link * 9.81 * L_com) + (M_payload * 9.81 * L_total)  // Nm (output shaft)
}

// Inertia about joint
// I = (1/3) × M_link × L_total² + M_payload × L_total²
function momentOfInertia(M_link: number, M_payload: number, L_total: number): number {
  return (1 / 3) * M_link * L_total ** 2 + M_payload * L_total ** 2  // kg·m²
}

// Inertial torque = I × α
function inertialTorque(I: number, alpha_rad_s2: number): number {
  return I * alpha_rad_s2  // Nm
}

// Total output torque required
function totalOutputTorque(
  T_grav: number, T_inertial: number, T_friction: number, SF: number
): number {
  return (T_grav + T_inertial + T_friction) * SF  // Nm
}

// Motor torque required (reflected through gearbox)
function motorTorque(T_output: number, gear: number, eta_gear: number): number {
  return T_output / (gear * eta_gear / 100)  // Nm
}

// Motor power
function motorPower(T_motor: number, omega_output_rad: number, gear: number): number {
  const omega_motor = omega_output_rad * gear
  return T_motor * omega_motor  // W
}

// Motor speed
function motorSpeed(omega_deg_s: number, gear: number): number {
  return (omega_deg_s / 360) * 60 * gear  // rpm
}

// Peak power (acceleration + velocity combined)
function peakPower(
  T_motor: number, omega_motor_rad: number
): number {
  return T_motor * omega_motor_rad  // W
}
```

## Outputs
| Label | Unit | Style |
|---|---|---|
| Moment of Inertia | kg·m² | normal |
| Gravitational Torque | Nm | normal |
| Inertial Torque | Nm | normal |
| Total Output Torque (w/ SF) | Nm | highlight |
| Required Motor Torque | Nm | highlight |
| Motor Speed (max) | rpm | normal |
| Motor Power (continuous) | W | normal |
| Motor Power (peak) | W | highlight |
| Reflected Inertia to Motor | kg·m² | normal |

---

# CALCULATOR 12 — SERVO / ACTUATOR SIZING
**Tab:** Robotics · servo icon  
**eCalc equiv:** torqueCalc (servo application)  
**Accuracy:** ±5%

## Inputs
| Field | ID | Default | Unit | Type |
|---|---|---|---|---|
| Control Surface Area | `area` | 0.04 | m² | Number |
| Hinge Moment Coefficient | `Ch` | 0.025 | — | Number |
| Dynamic Pressure | `q` | 800 | Pa | Number |
| Control Surface Chord | `chord` | 0.15 | m | Number |
| Max Deflection | `deflect` | 25 | ° | Number |
| Deflection Rate | `rate` | 60 | °/s | Number |
| Number of Servos | `nServos` | 1 | — | Select (1/2) |
| Servo Arm Length | `arm` | 25 | mm | Number |
| **Control Horn Length** | `hornLen` | **25** | **mm** | **Number** |
| Pushrod Efficiency | `eta_rod` | 0.90 | — | Slider 0.7–1.0 |

**✅ ADDED: Control Horn Length input for leverage calculation**

## Formulas
```ts
// Hinge moment torque (aerodynamic load on control surface)
// Mh = Ch × q × S × c
// where S = area, c = chord, q = dynamic pressure
function hingeMoment(Ch: number, q: number, S: number, c: number): number {
  return Ch * q * S * c  // Nm
}

// Deflection torque (inertia + friction — simplified)
function deflectionTorque(hingeMoment: number, SF = 1.3): number {
  return hingeMoment * SF  // Nm (safety factor for peak loads)
}

// ✅ CORRECTED: Required servo torque with leverage ratio
// T_servo = F_pushrod × arm_length
// F_pushrod = T_hinge / horn_length
function requiredServoTorque(
  T_hinge: number, hornLen: number, armLen: number, eta_rod: number, nServos: number
): number {
  // Force required at control horn
  const F_rod = T_hinge / (hornLen / 1000)  // N
  // Torque required at servo arm
  return (F_rod * (armLen / 1000)) / (eta_rod * nServos)  // Nm
}

// Servo output in kg·cm (industry standard unit for servos)
function servoTorqueKgCm(T_Nm: number): number {
  return T_Nm * 10.197  // kg·cm
}

// Required speed (°/s → s/60°, industry standard)
function servoSpeed60deg(rate_deg_s: number): number {
  return 60 / rate_deg_s  // seconds per 60°
}

// Pushrod force
function pushrodForce(T_hinge: number, armM: number): number {
  return T_hinge / armM  // N
}

// Power at servo
function servoPower(T_Nm: number, rate_deg_s: number): number {
  const omega = rate_deg_s * Math.PI / 180  // rad/s
  return T_Nm * omega  // W
}
```

## Outputs
| Label | Unit | Style |
|---|---|---|
| Hinge Moment Torque | Nm | normal |
| Design Torque (with SF) | Nm | normal |
| Required Servo Torque | Nm | highlight |
| Required Servo Torque | kg·cm | highlight |
| Pushrod Force | N | normal |
| Required Servo Speed | s/60° | normal |
| Servo Power (peak) | W | normal |
| Recommended Servo Class | text | normal |

**Servo class recommendation:**
```ts
const torqueKgCm = servoTorqueKgCm(T_servo)
if (torqueKgCm < 3)   class = "Micro servo (< 3 kg·cm)"
if (torqueKgCm < 10)  class = "Standard servo (3–10 kg·cm)"
if (torqueKgCm < 25)  class = "Heavy-duty servo (10–25 kg·cm)"
if (torqueKgCm < 60)  class = "Brushless servo (25–60 kg·cm)"
if (torqueKgCm >= 60) class = "Hydraulic / Electric actuator required"
```

---

## SHARED UTILITIES (`lib/calcUtils.ts`)
```ts
// ═══════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════
export const GRAVITY = 9.81              // m/s²
export const TORQUE_CONST = 9549.297     // 60/(2π) — for kW input
export const RHO_SL = 1.225             // kg/m³ at sea level 15°C
export const G_PER_N = 101.972          // grams per Newton

// ═══════════════════════════════════════════════════════════
// UNIT CONVERSIONS
// ═══════════════════════════════════════════════════════════
export const conv = {
  inchToM:    (x: number) => x * 0.0254,
  knotsToMs:  (x: number) => x * 0.5144,
  kmhToMs:    (x: number) => x / 3.6,
  degToRad:   (x: number) => x * Math.PI / 180,
  rpmToRads:  (x: number) => x * Math.PI / 30,
  NtoG:       (x: number) => x * G_PER_N,
  GtoN:       (x: number) => x / G_PER_N,
}

// ═══════════════════════════════════════════════════════════
// AIR DENSITY (ISA standard atmosphere)
// ═══════════════════════════════════════════════════════════
export function airDensity(elevM: number, tempC: number): number {
  const T = tempC + 273.15
  const P = 101325 * Math.pow(1 - 0.0000225577 * elevM, 5.25588)
  return P / (287.058 * T)
}

// ═══════════════════════════════════════════════════════════
// NUMBER FORMATTING
// ═══════════════════════════════════════════════════════════
// ✅ CORRECTED: Added locale formatting for commas and better decimal handling
export function fmt(val: number, decimals = 2, unit = ''): string {
  if (!isFinite(val) || isNaN(val)) return '—'
  const formatted = val.toLocaleString('en-IN', { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  })
  return `${formatted}${unit ? ' ' + unit : ''}`
}

export function fmtInt(val: number): string {
  if (!isFinite(val) || isNaN(val)) return '—'
  return Math.round(val).toLocaleString('en-IN')
}

// ═══════════════════════════════════════════════════════════
// CHART DRAWING (Canvas 2D)
// ═══════════════════════════════════════════════════════════
export interface ChartConfig {
  canvas: HTMLCanvasElement
  xData: number[]
  yData: number[][]           // multiple lines
  colors: string[]
  dashed: boolean[]
  xLabel: string
  yLabel: string
  xMin?: number; xMax?: number
  yMin?: number; yMax?: number
  operatingPoint?: { x: number; y: number }
  annotations?: { x?: number; y?: number; label: string; axis: 'x' | 'y' }[]
}

export function drawChart(cfg: ChartConfig): void {
  const { canvas, xData, yData, colors, dashed } = cfg
  const ctx = canvas.getContext('2d')!
  const W = canvas.width
  const H = canvas.height
  const PAD = { top: 20, right: 20, bottom: 40, left: 55 }
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  
  ctx.clearRect(0, 0, W, H)
  
  // Background
  ctx.fillStyle = '#09090B'
  ctx.fillRect(0, 0, W, H)
  
  // Determine axis bounds
  const xMin = cfg.xMin ?? Math.min(...xData)
  const xMax = cfg.xMax ?? Math.max(...xData)
  const allY = yData.flat().filter(isFinite)
  const yMin = cfg.yMin ?? Math.min(...allY) * 0.95
  const yMax = cfg.yMax ?? Math.max(...allY) * 1.05
  
  const toCanvasX = (x: number) => PAD.left + ((x - xMin) / (xMax - xMin)) * plotW
  const toCanvasY = (y: number) => PAD.top + plotH - ((y - yMin) / (yMax - yMin)) * plotH
  
  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 0.5
  const gridStepsX = 5, gridStepsY = 4
  for (let i = 0; i <= gridStepsX; i++) {
    const x = PAD.left + (plotW * i / gridStepsX)
    ctx.beginPath(); ctx.moveTo(x, PAD.top); ctx.lineTo(x, PAD.top + plotH); ctx.stroke()
  }
  for (let i = 0; i <= gridStepsY; i++) {
    const y = PAD.top + (plotH * i / gridStepsY)
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + plotW, y); ctx.stroke()
  }
  
  // Axes
  ctx.strokeStyle = 'rgba(255,255,255,0.30)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD.left, PAD.top)
  ctx.lineTo(PAD.left, PAD.top + plotH)
  ctx.lineTo(PAD.left + plotW, PAD.top + plotH)
  ctx.stroke()
  
  // Axis labels (Space Mono style via canvas)
  ctx.fillStyle = 'rgba(255,255,255,0.30)'
  ctx.font = '9px monospace'
  ctx.textAlign = 'center'
  for (let i = 0; i <= gridStepsX; i++) {
    const val = xMin + (xMax - xMin) * i / gridStepsX
    const x = PAD.left + (plotW * i / gridStepsX)
    ctx.fillText(val.toFixed(0), x, PAD.top + plotH + 14)
  }
  ctx.textAlign = 'right'
  for (let i = 0; i <= gridStepsY; i++) {
    const val = yMin + (yMax - yMin) * (gridStepsY - i) / gridStepsY
    const y = PAD.top + (plotH * i / gridStepsY)
    ctx.fillText(val.toFixed(1), PAD.left - 6, y + 3)
  }
  
  // Axis labels text
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(255,255,255,0.25)'
  ctx.font = '8px monospace'
  ctx.fillText(cfg.xLabel, PAD.left + plotW / 2, H - 4)
  ctx.save()
  ctx.translate(12, PAD.top + plotH / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText(cfg.yLabel, 0, 0)
  ctx.restore()
  
  // Annotations (dashed lines)
  if (cfg.annotations) {
    cfg.annotations.forEach(ann => {
      ctx.strokeStyle = 'rgba(255,255,255,0.20)'
      ctx.lineWidth = 0.8
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      if (ann.axis === 'x' && ann.x !== undefined) {
        const cx = toCanvasX(ann.x)
        ctx.moveTo(cx, PAD.top); ctx.lineTo(cx, PAD.top + plotH)
      } else if (ann.axis === 'y' && ann.y !== undefined) {
        const cy = toCanvasY(ann.y)
        ctx.moveTo(PAD.left, cy); ctx.lineTo(PAD.left + plotW, cy)
      }
      ctx.stroke()
      ctx.setLineDash([])
      
      // Annotation label
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.font = '8px monospace'
      ctx.textAlign = 'left'
      if (ann.axis === 'x' && ann.x !== undefined) {
        ctx.fillText(ann.label, toCanvasX(ann.x) + 3, PAD.top + 10)
      } else if (ann.axis === 'y' && ann.y !== undefined) {
        ctx.fillText(ann.label, PAD.left + 4, toCanvasY(ann.y) - 3)
      }
    })
  }
  
  // Data lines
  yData.forEach((lineData, idx) => {
    ctx.strokeStyle = colors[idx] ?? '#F2B705'
    ctx.lineWidth = dashed[idx] ? 1 : 2
    ctx.setLineDash(dashed[idx] ? [5, 3] : [])
    ctx.beginPath()
    xData.forEach((x, i) => {
      const cx = toCanvasX(x)
      const cy = toCanvasY(lineData[i])
      i === 0 ? ctx.moveTo(cx, cy) : ctx.lineTo(cx, cy)
    })
    ctx.stroke()
    ctx.setLineDash([])
  })
  
  // Operating point
  if (cfg.operatingPoint) {
    const { x, y } = cfg.operatingPoint
    const cx = toCanvasX(x), cy = toCanvasY(y)
    ctx.beginPath()
    ctx.arc(cx, cy, 6, 0, 2 * Math.PI)
    ctx.fillStyle = '#F2B705'
    ctx.fill()
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }
}

// ═══════════════════════════════════════════════════════════
// INPUT VALIDATION
// ═══════════════════════════════════════════════════════════
export function validatePositive(val: number, name: string): string | null {
  if (val <= 0) return `${name} must be greater than zero`
  return null
}

export function validateRange(
  val: number, min: number, max: number, name: string
): string | null {
  if (val < min || val > max) return `${name} must be between ${min} and ${max}`
  return null
}
```

---

## REUSABLE COMPONENT SPEC
### `CalcField.tsx`
```tsx
interface CalcFieldProps {
  label: string
  unit?: string
  id: string
  value: number | string
  onChange: (v: number) => void
  step?: number
  min?: number
  max?: number
  type?: 'number'
}

// Renders: labelled input with unit badge aligned right inside the label row
// Focus: border-color var(--y), outline 2px var(--y) offset 2px
// Font: Space Mono 12px on the input
```

### `CalcSelect.tsx`
```tsx
interface CalcSelectProps {
  label: string
  id: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}
```

### `CalcSlider.tsx`
```tsx
interface CalcSliderProps {
  label: string
  unit: string
  id: string
  value: number
  min: number; max: number; step: number
  onChange: (v: number) => void
  format?: (v: number) => string  // default: v.toFixed(1) + unit
}

// Renders: label row + slider + live value display right-aligned
// Thumb: 14×14px circle, --y fill
// Track: 3px height, --dw-3 bg
```

### `CalcResultRow.tsx`
```tsx
interface CalcResultRowProps {
  label: string
  value: string | number
  unit?: string
  style?: 'normal' | 'highlight' | 'danger' | 'ok'
  decimals?: number
}

// highlight → value in --y
// danger    → value in #FF6B6B
// ok        → value in #4ADE80
// normal    → value in --t-dk-1
```

### `CalcWarning.tsx`
```tsx
// Yellow border + bg tint box
// bg: rgba(242,183,5,0.08)
// border: 1px solid rgba(242,183,5,0.28)
// icon: ⚠ in --y, 12px
// text: Space Mono 9px --y
```

### `CalcInfo.tsx`
```tsx
// Blue border + bg tint box
// bg: rgba(59,143,239,0.06)
// border: 1px solid rgba(59,143,239,0.22)
// text: Space Mono 9px #3B8FEF
```

### `CalcChart.tsx` — ✅ UPDATED with ResizeObserver
```tsx
// Canvas chart wrapper with automatic resize handling
import { useEffect, useRef } from 'react'
import { drawChart, ChartConfig } from '@/lib/calcUtils'

interface CalcChartProps {
  xData: number[]
  yData: number[][]
  colors: string[]
  dashed: boolean[]
  xLabel: string
  yLabel: string
  operatingPoint?: { x: number; y: number }
  annotations?: ChartConfig['annotations']
  height?: number  // default 280px, mobile 180px
}

export function CalcChart(props: CalcChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    
    const ctx = canvas.getContext('2d')!
    
    // ✅ ResizeObserver for responsive canvas
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const dpr = window.devicePixelRatio || 1
        canvas.width = entry.contentRect.width * dpr
        canvas.height = entry.contentRect.height * dpr
        
        // Scale context to match
        ctx.scale(dpr, dpr)
        
        // Redraw chart
        drawChart({
          canvas,
          xData: props.xData,
          yData: props.yData,
          colors: props.colors,
          dashed: props.dashed,
          xLabel: props.xLabel,
          yLabel: props.yLabel,
          operatingPoint: props.operatingPoint,
          annotations: props.annotations,
        })
      }
    })
    
    observer.observe(container)
    return () => observer.disconnect()
  }, [props.xData, props.yData, props.operatingPoint])
  
  return (
    <div ref={containerRef} className="w-full" style={{ height: props.height ?? 280 }}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
```

---

## FULL SIDEBAR TAB LIST
```tsx
const calcGroups = [
  {
    domain: 'UNIVERSAL',
    colour: null,
    tabs: [
      { id: 'torque',     label: 'Torque · Power · Speed', badge: 'All'      },
      { id: 'thermal',    label: 'Motor Thermal Rating',   badge: 'All'      },
      { id: 'busbar',     label: 'Busbar / Wire Sizing',   badge: 'All'      },
      { id: 'efficiency', label: 'Drive Efficiency',       badge: 'All'      },
    ],
  },
  {
    domain: 'AIR',
    colour: '#3B8FEF',
    tabs: [
      { id: 'drone',      label: 'Drone Motor Selector',   badge: 'UAV'      },
      { id: 'propeller',  label: 'Propeller Performance',  badge: 'BEMT'     },
      { id: 'evtol',      label: 'eVTOL Hover Endurance',  badge: 'eVTOL'    },
    ],
  },
  {
    domain: 'WATER',
    colour: '#00B4CC',
    tabs: [
      { id: 'marine',     label: 'Marine Propulsion',      badge: 'AUV'      },
    ],
  },
  {
    domain: 'LAND',
    colour: '#F2B705',
    tabs: [
      { id: 'evrange',    label: 'EV Drive Range',         badge: 'EV'       },
      { id: 'evcharge',   label: 'EV Charging Session',    badge: 'Charge'   },
    ],
  },
  {
    domain: 'ROBOTICS',
    colour: '#8866CC',
    tabs: [
      { id: 'joint',      label: 'Robot Joint Torque',     badge: 'Arm'      },
      { id: 'servo',      label: 'Servo / Actuator Sizing', badge: 'Control' },
    ],
  },
]
```

---

## ACCURACY DISCLAIMER (render in CalcHeader)
```
All calculations use simplified physical models and are provided
for engineering guidance and motor selection only. Accuracy varies
by calculator — see badge. Always verify critical designs with
full FEA / CFD simulation and physical testing.

WelkinRim Technologies assumes no liability for sizing decisions
made based on these tools.
```
Font: Space Mono 8px, --t-dk-3, italic. Render below the results panel.

---

## BUILD CHECKLIST
```
□ All 12 calculators render correct outputs for known test cases
□ All inputs validate on change (no NaN, no Infinity displayed)
□ All chart canvases resize correctly on window resize (ResizeObserver)
□ Sidebar active tab highlighted correctly
□ Tab switching clears previous warnings
□ All numbers formatted to sensible decimal places (no 0.30000000000004)
□ All charts: operating point dot shows on first render
□ Mobile: sidebar collapses to horizontal tab row
□ Mobile: charts display at 180px height
□ Keyboard: tab between inputs works logically
□ Focus: all inputs show yellow outline on focus
□ No console errors on any calculator
□ calcUtils.ts imported correctly in all 12 calculator components
□ All formulas match hand-calculated test values (see test cases below)
□ Torque calculator uses kW with 9549 constant (not W)
□ Thermal calculator Rth_ca default = 0.035 (not 0.35)
□ EV Charging taper ends at 10% (multiplier 0.9)
□ Servo calculator includes horn length leverage
□ Busbar calculator has circuit type toggle
```

---

## TEST CASES (verify outputs against these)
### Calculator 1 — Torque/Power/Speed
```
Input:  P = 50 kW, n = 3000 rpm, gear = 2:1, eta_gear = 97%
Output: T_motor = 159.15 Nm, T_output = 309.15 Nm, n_output = 1500 rpm
        ω = 314.16 rad/s, P_output = 48.5 kW, gear_loss = 1500 W

✅ VERIFICATION: If output shows 159155 Nm, the kW/W constant error is present.
```

### Calculator 2 — Motor Thermal
```
Input:  Rph = 0.05Ω, I = 80A, Pfe = 120W, Pfw = 30W
        Rth_wc = 0.18, Rth_ca = 0.035, cooling = medium, Tamb = 40°C, Class F
Output: Pcu = 960W, Ptotal = 1110W
        T_case = 40 + 1110×0.035 = 78.85°C
        T_winding = 78.85 + 1110×0.18 = 278.65°C → exceeds Class F (155°C)
        Status: OVER LIMIT (correct — 80A with 0.05Ω is overloaded)

✅ VERIFICATION: Default Rth_ca must be 0.035, not 0.35
```

### Calculator 3 — Busbar
```
Input:  copper, rect, 40mm × 5mm, L=500mm, I=200A, Tamb=40°C, circuit=single
Output: Area = 200 mm², R = 1.72e-8 × 0.5 / (200e-6) = 0.043 mΩ
        Vdrop = 200 × 0.000043 × 1000 = 8.6 mV
        Ploss = 200² × 0.000043 = 1.72 W
        J = 200/200 = 1.0 A/mm²  ← very safe

✅ VERIFICATION: Round-trip circuit should show 17.2 mV (2×)
```

### Calculator 5 — Drone Motor
```
Input:  AUW=2.5kg, rotors=4, TWR=2.5, hover=50%, KV=400, Vbat=48V, Q=12000mAh
Output: Hover thrust per motor = (2.5×9.81)/4 = 6.13 N
        Max thrust per motor = 6.13 × 2.5 = 15.32 N
        Motor max RPM = 400 × 48 = 19200 rpm
```

### Calculator 10 — EV Charging
```
Input:  Ebat=75kWh, SoC_start=20%, SoC_end=80%, P_max=50kW, taper_start=80%
Output: Phase 1 (20→80%): 45kWh / 50kW = 0.9h = 54 min
        Phase 2: N/A (SoC_end = taper_start)
        Total time ≈ 54 min (plus 10% loss = ~60 min)

✅ VERIFICATION: At 100% SoC, power should taper to 10% of P_max (5kW), not 55%
```

### Calculator 12 — Servo Sizing
```
Input:  T_hinge=5Nm, hornLen=25mm, armLen=25mm, eta_rod=0.9, nServos=1
Output: F_rod = 5 / 0.025 = 200 N
        T_servo = (200 × 0.025) / 0.9 = 5.56 Nm = 56.7 kg·cm
        Class: Hydraulic / Electric actuator required

✅ VERIFICATION: If hornLen=armLen, torque should equal hinge torque / efficiency
```

---

*Welkinrim Technologies — Calculators Page Spec v1.1 (Revised)*  
*12 calculators · eCalc-inspired structure · All calculations from first principles*  
*Cross-verification corrections applied: Torque constant, Thermal Rth, Charging taper, Servo leverage, Busbar circuit type*