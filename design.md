# PRODUCT REQUIREMENTS DOCUMENT
## Welkinrim Technologies — Corporate Website
**Version:** 1.0 | **Status:** Final | **Classification:** Internal  
**Owner:** Design & Product Lead | **Last Updated:** March 2026  
**Live URL:** https://welkinrimtech.vercel.app  
**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Framer Motion

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [User Personas & Goals](#3-user-personas--goals)
4. [Site Architecture & Pages](#4-site-architecture--pages)
5. [Design Language System](#5-design-language-system)
6. [Design DOs](#6-design-dos)
7. [Design DON'Ts](#7-design-donts)
8. [Component Specifications](#8-component-specifications)
9. [Interaction & Animation System](#9-interaction--animation-system)
10. [Scroll System](#10-scroll-system)
11. [Responsive Design System](#11-responsive-design-system)
12. [Accessibility Requirements](#12-accessibility-requirements)
13. [Performance Requirements](#13-performance-requirements)
14. [Page-by-Page Requirements](#14-page-by-page-requirements)
15. [Known Issues & Fix Priority](#15-known-issues--fix-priority)
16. [Build Phases & Acceptance Criteria](#16-build-phases--acceptance-criteria)

---

## 1. EXECUTIVE SUMMARY

Welkinrim Technologies is a deep-tech electric motor and EV powertrain startup founded in 2017, headquartered at the Oragadam Industrial Corridor, Chennai, India. The company designs and manufactures precision electric motors for four domains: **Air**, **Water**, **Land**, and **Robotics**. All motors are ANSYS-simulation-validated before prototyping.

The corporate website serves as the primary trust-building and lead-generation instrument for three distinct audiences: OEM procurement teams, investors, and engineering talent. The site must communicate one thing above all else:

> *"These people know exactly what they're doing — and they can prove it."*

The design strategy is **Industrial Editorial** — the precision of an engineering drawing, the confidence of a technical journal. The site is not a brochure. It is a demonstration of the company's simulation capability, made visible through the interface itself. The physics of an electric motor — electromagnetic flux, thermal propagation, field-oriented control — are re-enacted in the browser through SVG and Canvas. The site is the first proof point of the engineering.

---

## 2. PRODUCT OVERVIEW

### 2.1 Business Objectives

| Objective | Metric | Target |
|---|---|---|
| Generate qualified OEM enquiries | Contact form submissions | ≥ 15/month post-launch |
| Build investor confidence | Time on site / depth of scroll | Avg. 3+ pages per session |
| Attract engineering talent | Careers page views | Tracked from launch |
| Establish technical credibility | Technology page completion rate | ≥ 60% |
| Differentiate from competitors | Bounce rate | < 40% |

### 2.2 Competitive Landscape

| Competitor | Strength | Our Advantage |
|---|---|---|
| MGM Compro | ANSYS visuals | Interactive simulation, not static images |
| Mejzlik | Clean process page | Full physics-driven animation system |
| Plettenberg | Deep spec data | Efficiency map + torque curve tools |
| Emrax | Premium positioning | Indian pricing + global engineering quality |

### 2.3 The Core Design Insight

No competitor is doing this: **making the physics of the product visible inside the interface.** Not screenshots of simulations — the actual electromagnetic, thermal, and control behaviour of an electric motor, re-enacted in the browser. The website is itself a simulation environment. This is the single strongest differentiator available without spending a rupee on content.

---

## 3. USER PERSONAS & GOALS

### Persona 1 — The OEM Procurement Engineer

**Background:** Senior mechanical/electrical engineer at an automotive, aerospace, or robotics OEM. 30–50 years old. Evaluating 3–5 motor suppliers simultaneously. Has 15 minutes.

**Goals:**
- Quickly verify technical capability (simulation depth, certification coverage)
- Find specific motor specs (power, torque, weight, efficiency) for their application
- Download a datasheet or request a quote without friction

**Pain Points:**
- Sites that show renders instead of data
- No sortable spec tables
- Contact forms that feel like black boxes

**What wins them:** The products table sorts by power density in two clicks. The Technology page shows actual ANSYS methodology. The response time on the contact page says "< 24 hours."

**Key pages:** Products → Technology → Contact

---

### Persona 2 — The Investor / VC

**Background:** Partner at a deep-tech or climate-tech fund. Has seen 200 motor startups. Looking for proof of engineering depth, India manufacturing advantage, and market trajectory.

**Goals:**
- Understand the technology moat (why is this company hard to replicate?)
- See the founding story and team credentials
- Assess the market domains (Air/Water/Land/Robotics = four TAMs)

**Pain Points:**
- Over-designed sites that hide behind visual polish
- No team page or founding narrative
- Generic "contact us" with no context

**What wins them:** The hero opens in darkness — the site doesn't try to impress immediately. The motor simulation is genuinely technically impressive. The About page has the founding story. The footer says "From India — For the World."

**Key pages:** Landing → Technology → About → Contact

---

### Persona 3 — The Engineering Recruit

**Background:** Mechanical, electrical, or controls engineer, 2–8 years experience. Considering a move to a high-growth startup. Has strong technical standards — will immediately know if the site is fake.

**Goals:**
- See that the work is real (ANSYS, MATLAB, production-grade design)
- Understand the domain breadth (Air to Robotics = variety)
- Get a sense of company culture and ambition

**Pain Points:**
- Sites that claim "AI-powered" motors
- No technical depth
- Vague job descriptions

**What wins them:** The oscilloscope on the FOC page actually renders three-phase waveforms. The thermal propagation section teaches motor physics. The company was founded in 2017 and is still running — that means something.

**Key pages:** Technology → About → Process

---

## 4. SITE ARCHITECTURE & PAGES

### 4.1 Navigation Structure

```
/ (Landing)
├── /technology
├── /products
├── /about
├── /process
├── /location
├── /calculators
└── /contact
```

### 4.2 Page Status

| Page | Status | Priority |
|---|---|---|
| `/` Landing | Live — issues present | P0 |
| `/technology` | Live — issues present | P0 |
| `/products` | Live — issues present | P0 |
| `/contact` | 404 | P0 — all CTAs point here |
| `/about` | 404 | P1 |
| `/calculators` | 404 | P1 |
| `/location` | 404 | P2 |
| `/process` | 404 | P2 |

### 4.3 Landing Page Section Sequence

```
01  Hero                    100vh  Space Black    Opening statement
02  Wire-Draw Transition    —      —              Section boundary effect
03  AIR Domain              100vh  Space Black    First domain
04  WATER Domain            100vh  Space Black    Second domain
05  LAND Domain             100vh  Space Black    Third domain
06  ROBOTICS Domain         100vh  Space Black    Fourth domain
07  Wire-Draw Transition    —      —              Section boundary effect
08  Bridge / Stats          ~60vh  Deep White     The contrast payoff
09  Technology Preview      ~50vh  Space Black    Simulation teaser
10  Slash Divider           —      —              Minor break
11  Products Teaser         ~60vh  Deep White     Motor cards
12  Location Strip          ~40vh  Space Black    Oragadam context
13  CTA Strip               ~30vh  Bumblebee      Final ask
14  Footer                  auto   #060608        Deeper than dark
```

---

## 5. DESIGN LANGUAGE SYSTEM

### 5.1 The Three-Colour Philosophy

This site uses exactly **three colours**. Every other value is a tint, shade, or opacity of these three. This is not minimalism for aesthetics. It is discipline for impact.

**Space Black** is the foundation. Not `#000000` — that reads flat and dead. Not `#1C1C1E` — that's warm and Apple-adjacent. `#09090B` has a micro blue-violet shift that gives it depth. It reads as the colour of a CNC-machined motor casing. Infinite. Precise. Engineered.

**Deep White** is the contrast surface. Not `#FFFFFF` — that's clinical and blank. `#F3F3EF` has a 4% warm bias, a 2% yellow shift. It reads as the white of freshly-machined aluminium. Precision white, not hospital white.

**Bumblebee Yellow** is the signal. `#F2B705`. Logo-matched. Hue 45°, Saturation 96%, Lightness 49%. The yellow of live copper. Of high-voltage warning tape. Of kinetic energy stored at rest. It is not a brand colour in the traditional sense — it is a warning signal. Its power comes entirely from its scarcity. Use it like a warning label: rare, deliberate, impossible to ignore.

### 5.2 Full Colour Token Reference

```
SPACE BLACK SCALE
─────────────────────────────────────────────────────────
--sb-0    #09090B    Primary dark background
--sb-1    #0F0F12    Elevated panels on dark
--sb-2    #16161A    Inputs, table rows on dark
--sb-3    #1E1E24    Borders on dark
--sb-4    #2A2A32    Active hover states on dark

DEEP WHITE SCALE
─────────────────────────────────────────────────────────
--dw-0    #F3F3EF    Primary light background
--dw-1    #FAFAF8    Elevated panels on light
--dw-2    #FFFFFF    Pure white — table cells, max contrast
--dw-3    #E6E6E2    Borders on light
--dw-4    #D8D8D4    Strong borders, active dividers

BUMBLEBEE YELLOW
─────────────────────────────────────────────────────────
--y       #F2B705    Primary. MAX 3× per viewport.
--y-hi    #FFD23F    Hover/focus states only
--y-lo    #C99504    Active/pressed states only
--y-glow  rgba(242,183,5,0.14)    Ambient glow
--y-ghost rgba(242,183,5,0.06)    Background tint

TEXT ON DARK
─────────────────────────────────────────────────────────
--t-dk-1  #FFFFFF                  Headlines
--t-dk-2  rgba(255,255,255,0.62)   Body (WCAG floor — never lower)
--t-dk-3  rgba(255,255,255,0.35)   Labels, captions
--t-dk-4  rgba(255,255,255,0.14)   Ghost, watermarks

TEXT ON LIGHT
─────────────────────────────────────────────────────────
--t-lt-1  #09090B     Headlines
--t-lt-2  #44444C     Body
--t-lt-3  #8A8A96     Labels, captions
--t-lt-4  rgba(9,9,11,0.07)    Ghost, watermarks

LOGO SPECIFIC
─────────────────────────────────────────────────────────
--logo-grey  #6B6B6B   "TECHNOLOGIES" sub-word on light backgrounds only

DOMAIN COLOURS
─────────────────────────────────────────────────────────
--d-air       #3B8FEF    Deep altitude blue
--d-water     #00B4CC    Submersion cyan
--d-land      #F2B705    Brand yellow — Land shares the brand accent
--d-robotics  #8866CC    Precision violet

SPECIAL BACKGROUNDS
─────────────────────────────────────────────────────────
Footer:           #060608    Darker than --sb-0. The site deepens.
About timeline:   #EDE7D9    Warm paper — unique to this section only.
CTA strip:        #F2B705    Only full-yellow section on the entire site.
ANSYS frame bg:   #050508    Darker than site dark. A simulation window.
```

### 5.3 Typography System

**Three fonts. No others. Ever.**

| Font | Use Case | Never Use For |
|---|---|---|
| Syncopate | Display headlines only | Body, labels, anything < 20px |
| Work Sans | Body copy, descriptions, narrative | Data values, measurements |
| Space Mono | All numbers, all data, all labels | Body paragraphs |

**The rule is simple:** If it's a number, it's Space Mono. If it's a headline, it's Syncopate. If it's everything else, it's Work Sans.

**Type Scale:**

| Name | Font | Size | Line Height | Tracking | Use |
|---|---|---|---|---|---|
| Display XL | Syncopate 700 | clamp(72px, 11vw, 168px) | 0.82 | -0.01em | Hero headline only |
| Display L | Syncopate 700 | clamp(48px, 7.5vw, 104px) | 0.86 | -0.01em | Domain names, page heroes |
| Display M | Syncopate 700 | clamp(32px, 4.5vw, 64px) | 0.90 | -0.01em | Section headings, stat numbers |
| Display S | Syncopate 400 | clamp(20px, 2.5vw, 30px) | 1.1 | 0.02em | Sub-headings |
| Overline | Space Mono 400 | 10px | 1.0 | 0.32em | Section labels — UPPERCASE always |
| Body L | Work Sans 400 | clamp(15px, 1.4vw, 18px) | 1.78 | 0 | Hero sub-text, key descriptions |
| Body | Work Sans 400 | clamp(13px, 1.1vw, 15px) | 1.72 | 0 | Standard paragraphs |
| Data | Space Mono 400 | 13px | 1.5 | 0 | All spec values, table data |
| Label | Space Mono 400 | 9px | 1.0 | 0.22em | Column headers, axis labels — UPPERCASE |
| Caption | Work Sans 300 | 12px | 1.6 | 0 | Footnotes, disclaimers |

### 5.4 The Logo System

The logo has exactly **four components**. All four must be present at all times. If any one is missing, the logo is broken.

1. **"WELKINRIM"** — Syncopate 700, Bumblebee Yellow `#F2B705`
2. **"TECHNOLOGIES"** — Syncopate 400, colour is context-dependent (see states)
3. **Three-bar mark** — Three vertical dark bars inside a solid yellow square
4. **Diagonal slash** — At exactly 78° from horizontal, Bumblebee Yellow

**Three Logo States:**

| State | Background | "WELKINRIM" | "TECHNOLOGIES" | Mark Square | Mark Bars |
|---|---|---|---|---|---|
| LogoLight | Deep White | #F2B705 | #6B6B6B (logo-grey) | #F2B705 | #09090B |
| LogoDark | Space Black | #F2B705 | #FFFFFF (not grey — grey disappears) | #F2B705 | #09090B |
| LogoInverted | Bumblebee Yellow | #09090B | #09090B | #09090B | #F2B705 |

The navbar must maintain both `LogoLight` and `LogoDark` in the DOM simultaneously, crossfading between them at 350ms as the user scrolls between dark and light sections.

### 5.5 The Slash Motif

The diagonal slash in the logo mark runs at **78° from horizontal** — nearly vertical, tilted slightly right. This is the brand's geometric signature. It implies cutting through, kinetic energy, the motion of wire drawn through a die.

```
SLASH_ANGLE_DEG = 78
SLASH_ANGLE_RAD = (78 × π) / 180
```

**Four permitted uses, in order of visual weight:**

| Use | Description | Count Limit |
|---|---|---|
| Wire-Draw Transition | 2px yellow horizontal line draws across viewport | 2 per site |
| Section Slash Divider | Full-width SVG line at 78° angle, 1px yellow | 1 visible at a time |
| Overline Decorator | 28px diagonal rule before section labels (dark sections only) | 1 per section |
| Hero Ghost Lines | Two faint background lines in hero upper-right (opacity 0.08, 0.04) | 1 hero only |

### 5.6 Spacing Scale

| Token | Value | Use |
|---|---|---|
| --sp-1 | 8px | Tight internal spacing |
| --sp-2 | 16px | Standard component padding |
| --sp-3 | 24px | Card padding mobile |
| --sp-4 | 32px | Grid gap |
| --sp-5 | 48px | Section element separation |
| --sp-6 | 64px | Desktop horizontal gutter |
| --sp-7 | 96px | Section vertical breathing room |
| --sp-8 | 128px | Major section separation |
| --sp-9 | 192px | Hero breathing room |

**Gutter:** `clamp(20px, 5vw, 64px)` — applies to left and right edges of all sections.

### 5.7 Section Backgrounds — Locked Map

The dark/light rhythm of the site is a deliberate design decision, not a stylesheet coincidence. The landing page opens dark and earns its one light moment (the Bridge section) after four full-screen domain sections. This contrast is the design. Do not reorder it. Do not add light sections to the dark sequence.

| Section | Background | Rationale |
|---|---|---|
| Landing hero | --sb-0 | Site opens in dark — light is earned |
| Domain sections ×4 | --sb-0 | Motor + yellow are the colour |
| Bridge / stats | --dw-0 | The one light break — oxygen after darkness |
| Tech preview | --sb-0 | Dark — simulations belong here |
| Products teaser | --dw-0 | Data = light |
| Location strip | --sb-0 | Cinematic |
| CTA strip | --y | Only full-yellow section. Final ask. Once. |
| Footer | #060608 | Darker than page. Site deepens as it ends. |
| Technology page | --sb-0 | All dark — ANSYS demands it |
| Products page | --dw-0 | All light — data demands legibility |
| About hero | --sb-0 | Gravity |
| About timeline | #EDE7D9 | Warm paper — notebook reference, unique |
| About team | --dw-0 | Faces need light |
| Calculators | --dw-0 | Zero visual noise |

### 5.8 SVG Design Language

Every SVG on this site follows a single visual grammar:

**ANSYS Frame Chrome (required on all simulation visuals):**

```
Outer border:     1px solid rgba(242,183,5,0.18)
Background:       #050508 — darker than page dark. A simulation window.
Toolbar height:   28px
Toolbar dots:     3 traffic-light dots — red #FF5F57, yellow #FEBC2E, green #28C840
                  8px diameter, 6px gap, 12px from left
Toolbar title:    Space Mono 9px rgba(255,255,255,0.24)
                  "ANSYS Workbench — [Analysis Type]"
Grid:             rgba(255,255,255,0.04) at 20px intervals
Colorbar:         Always LEFT side. Never right. 12px wide, 180px tall.
                  8 colour stops: #FF0000 → #FF5500 → #FF9900 → #FFCC00
                              → #CCFF00 → #00FF88 → #00AAFF → #0033FF
                  Labels: Space Mono 8px rgba(255,255,255,0.40)
Watermark:        "WelkinRim Technologies — Proprietary"
                  Space Mono 7px rgba(255,255,255,0.10), bottom-right
```

**Colorbar Values by Simulation (context-specific — not generic 2200/660 everywhere):**

| Section | Max Label | Min Label | Unit |
|---|---|---|---|
| Flux Density | 2200 | 660 | mT |
| Thermal | 218 | 25 | °C |
| Stress | 350 | 0 | MPa |
| Efficiency | — | — | Contour labels, not colorbar |
| Cogging | 3.0 | 0.0 | % |
| FOC | +400 | −400 | V |

**⚠ Critical data error on live site:** The Thermal section currently shows "Max Temp 660°C". The value 660 is the flux density colorbar minimum in mT — it is not a temperature. Electric motors operate at 25°C–218°C. Fix the label to "Peak Hotspot: 218°C" and implement a dedicated thermal colorbar in °C.

---

## 6. DESIGN DOs

These are principles to follow in every design and implementation decision.

### DO: Open Every Page in Darkness

The site opens in `--sb-0` Space Black. This is a deliberate inversion of the web convention of light-on-white. It communicates: this is not a consumer product website. This is a machine. Light is earned by the content that deserves it — the data table, the team section, the calculator. Dark sections establish authority; light sections earn trust.

### DO: Use Yellow as a Warning Signal

Yellow must feel like a live conductor that accidentally brushed the frame. Every time `--y` appears, it should stop the eye. To achieve this: count your yellow elements per viewport before marking any section complete. If there are more than three visible simultaneously, remove one. The logo counts as one. An active nav link underline counts as one. You have one left for content.

### DO: Let Every SVG Tell a Story

The motor cross-section SVG is not decoration. It is physics. The slot fills change colour based on domain because that is what a flux density map actually looks like for each motor configuration. The thermal overlay intensifies as you scroll because that is how a motor heats up under load. Every SVG element has a physical referent in the real machine. If an SVG element cannot be explained in engineering terms, it should not exist.

### DO: Use Space Mono for Every Number

Every voltage, every torque value, every RPM, every percentage, every axis label, every table cell — Space Mono. The font is monospaced because engineering data is monospaced. Numbers in a data context should align in columns by default. Work Sans numerals are proportionally spaced and will visually misalign in tables. This is not an aesthetic preference; it is a functional requirement.

### DO: Stack Headlines Vertically in Syncopate

Syncopate headlines work best broken across lines. "ELECTRIC PROPULSION SYSTEMS" is three separate spans, each on its own line, with the middle word in `--y`. "THE SCIENCE INSIDE." is two lines — "THE SCIENCE" at full opacity, "INSIDE." at 22% opacity because the science is inside, partially hidden. Let the headline enact its own meaning.

### DO: Earn Every Dark-to-Light Transition

Every time the page moves from a dark section to a light section, something should shift in the user's experience. The Bridge section after four domain sections hits like oxygen — the eye has adjusted to dark and the sudden white feels like a spotlight. Preserve this. The rhythm of the site is: dark → dark → dark → dark → WHITE → dark → WHITE → dark → YELLOW. That rhythm is the emotional arc.

### DO: Make the Motor Physically Accurate

The rotor spins at domain-appropriate speeds: 3,500ms per revolution for Air (12,000rpm feel), 8,000ms for Water (torque-biased marine), 5,500ms for Land (high-power automotive), and step-mode for Robotics (stepper motor indexing at 20° per step with 580ms pause). These are not random values. They reflect the actual operating characteristics of each domain's motor type. Anyone who knows motors will feel the accuracy. Anyone who doesn't will feel the intentionality.

### DO: Design Mobile-First for Touch

On touch devices: snap scroll is disabled, the custom cursor is not mounted, magnetic field lines are suppressed on low-end hardware, and the wire-draw transition becomes an opacity crossfade. The products table collapses from a data grid to a card stack. Motor SVGs scale via a size prop without re-drawing. Every interactive element has a 44px minimum touch target. The site works on a phone in a factory — that is where procurement engineers often are.

### DO: Respect the Warm Paper Section

The About timeline lives on `#EDE7D9` — a warm paper tone that exists nowhere else on the site. This section is the one place where the company is being human rather than technical. It earns a unique background. The typing effect that reveals each year's entry character by character — with irregular pace variation of ±15% — creates the sensation of reading a lab notebook being filled in. This moment of warmth inside an otherwise precise site is what makes the company feel real.

### DO: Make the Oscilloscope Technically Real

The FOC oscilloscope must render three genuine sinusoidal waveforms in phase relationship. Phase A at 0°, Phase B at 120°, Phase C at 240°. Under load, Phase A leads by up to 18° (current lags voltage — the load angle relationship). At 100% load, Phase A shows a visible 5th harmonic ripple — a real phenomenon in saturated motor drives. A controls engineer who sees this will lean forward in their chair. That moment of recognition is worth more than any copywritten claim.

### DO: Fix Broken Elements Before Adding New Ones

The hero headline renders as "ELECTRICPROPULSIONSYSTEMS" — a single unspaced string. The stat counters show "0% Peak Efficiency." The thermal section claims "Max Temp 660°C." The oscilloscope never activates. Five pages return 404. Fix these before implementing any new feature. A broken foundation cannot support new construction.

---

## 7. DESIGN DON'Ts

These are violations of the design language. Any of these appearing in a build signals a fundamental misunderstanding of the design intent.

### DON'T: Use Inter, Roboto, or System Fonts

```
✗  font-family: 'Inter', sans-serif
✗  font-family: 'Roboto', sans-serif
✗  font-family: system-ui, -apple-system, sans-serif
✗  font-family: 'Arial', sans-serif
```
These are the default choices. This site has no default choices. Syncopate, Work Sans, Space Mono. Any other font appearing in the codebase is a bug, not a variation.

### DON'T: Use Yellow as Body Text

```
✗  color: var(--y)  on any font below 36px
✗  color: var(--y)  on any paragraph element
✗  color: var(--y)  on any label below Display M size
```
The WCAG contrast ratio of `#F2B705` on `#F3F3EF` is 2.3:1 — a critical fail at body size. Even on dark backgrounds where the contrast is technically sufficient (9.6:1), yellow body text reads as an alarm state. Reserve yellow for the one structural element per section that demands attention.

### DON'T: Allow More Than 3 Yellow Elements Per Viewport

```
✗  Yellow heading + yellow button + yellow icon + yellow underline = 4 yellows
```
Count before committing. The logo mark on the navbar = 1. The active nav underline = 2. The section overline label = 3. That is the maximum. If a design has a yellow button AND a yellow overline AND the active nav state, one of the content yellows must be changed to white or removed.

### DON'T: Use Pure Black or Pure White as Backgrounds

```
✗  background: #000000
✗  background: #111111
✗  background: #FFFFFF  (as page background — only in table cells)
```
`#000000` reads flat and dead on modern screens. `#FFFFFF` reads clinical and generic. `--sb-0` (`#09090B`) and `--dw-0` (`#F3F3EF`) are the correct values. The difference is subtle on a calibrated monitor but immediately perceptible to a trained eye.

### DON'T: Add Letter-Spacing to Syncopate

```
✗  font-family: 'Syncopate'; letter-spacing: 0.1em
✗  font-family: 'Syncopate'; letter-spacing: 0.2em
```
Syncopate has its own letter-spacing built into the typeface design. It was chosen precisely because its proportions match the logo's wide tracking DNA. Adding external letter-spacing distorts these proportions and breaks the logo relationship. The only permitted letter-spacing value on Syncopate is the negative value `-0.01em` specified in the Display XL and Display L classes to tighten very large headlines.

### DON'T: Use Syncopate Below 20px

```
✗  font-family: 'Syncopate'; font-size: 14px  (navigation links)
✗  font-family: 'Syncopate'; font-size: 11px  (overlines)
✗  font-family: 'Syncopate'; font-size: 16px  (sub-labels)
```
Syncopate becomes illegible below 20px due to its extreme letter spacing. At small sizes, the wide tracking creates gaps that break word recognition. Navigation links are Space Mono. Overlines are Space Mono. Labels are Space Mono.

### DON'T: Use Border-Radius Above 4px

```
✗  border-radius: 8px   (cards)
✗  border-radius: 12px  (buttons)
✗  border-radius: 50%   (decorative shapes — circles are OK for dots and avatars)
```
This is a precision engineering aesthetic. Rounded corners above 4px belong to SaaS dashboards and consumer apps. The maximum border-radius for cards, buttons, and panels is 4px. Avatars (circular) and progress dots (circular/pill) are the only exceptions.

### DON'T: Use Box-Shadow on Cards or Panels

```
✗  box-shadow: 0 4px 24px rgba(0,0,0,0.12)
✗  box-shadow: 0 2px 8px rgba(0,0,0,0.08)
```
Shadows imply elevation in a skeuomorphic design system. This is a flat, precision system. Elevation is communicated through background colour contrast — `--sb-1` on `--sb-0`, `--dw-1` on `--dw-0`. A 1px border at the appropriate opacity creates more precision than any drop shadow.

### DON'T: Use Spring Animations in Framer Motion

```
✗  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
✗  transition={{ type: 'spring', bounce: 0.4 }}
```
Spring animations imply elasticity. Electric motors do not bounce. They start from rest, accelerate to operating speed, and stop with precision. All motion on this site uses the four locked easing curves: `--ease-motor`, `--ease-precise`, `--ease-wire`, `--ease-thermal`. Use the cubic-bezier values directly if Framer Motion type must be 'tween'.

### DON'T: Use `scale()` Hover Transforms Above 1.02

```
✗  whileHover={{ scale: 1.05 }}
✗  &:hover { transform: scale(1.08); }
```
Scaling elements on hover is a consumer UI pattern — it communicates playfulness and interactivity in a casual context. In a precision engineering context, it communicates imprecision. Hover states communicate through colour transitions (border going from `--dw-3` to `--y`, background going from transparent to `--y`), not physical enlargement.

### DON'T: Place the Logo on Mid-Tone, Gradient, or Coloured Backgrounds

```
✗  Logo on #888888 grey background
✗  Logo on a gradient from dark to light
✗  Logo on the --d-air blue background
✗  Logo on any photography
```
The logo has three approved backgrounds: Deep White (LogoLight), Space Black (LogoDark), and Bumblebee Yellow CTA strip (LogoInverted). Any other background renders the logo in an untested colour relationship.

### DON'T: Show "TECHNOLOGIES" in Grey on Dark Backgrounds

```
✗  "TECHNOLOGIES" in #6B6B6B on --sb-0 background
```
`#6B6B6B` on `#09090B` has a contrast ratio of 3.2:1 — below WCAG AA at this size. More importantly, it visually disappears. On dark backgrounds, "TECHNOLOGIES" must be `#FFFFFF`. This is the most common implementation error on the current live site.

### DON'T: Concatenate Words That Are Separate Elements

```
✗  <h1>ELECTRICPROPULSIONSYSTEMS</h1>
✗  <h1>THE SCIENCEINSIDE.</h1>
✗  <div>WELKINRIMTECHNOLOGIES</div>
```
"ELECTRIC PROPULSION SYSTEMS" is three `<span>` elements. "THE SCIENCE" and "INSIDE." are two `<div>` elements with a line break between them. "WELKINRIM" and "TECHNOLOGIES" are two separate styled elements. These are broken in the current live implementation and must be fixed as the highest priority correction.

### DON'T: Use the Thermal Section's Flux Colorbar Values as Temperature

```
✗  Max Temp: 660°C   (660 is the flux density minimum in mT, not a temperature)
✗  Max Temp: 2200°C  (2200 is the flux density maximum in mT)
```
The thermal section must use its own dedicated temperature colorbar: 25°C minimum, 218°C maximum, in the standard thermal colour gradient. The "660°C" figure currently on the live site is the flux density colorbar minimum value from a different section bleeding into the thermal section. Any engineer who sees this will immediately distrust the entire site.

### DON'T: Use Snap Scroll on Touch Devices

```
✗  scroll-snap-type: y mandatory  (applied globally, including mobile)
```
Snap scroll on touch creates a fighting sensation — the user's momentum scroll is constantly being overridden by the snap behaviour. On mobile and tablet (pointer: coarse), snap scroll must be disabled. Use passive IntersectionObserver reveals instead. The snap scroll behaviour is a desktop-only enhancement.

### DON'T: Mount the Custom Cursor on Touch Devices

```
✗  <SlashCursor />  (mounted without touch detection)
```
Touch devices have no cursor. Mounting a cursor component on mobile wastes DOM resources and achieves nothing. Always check `window.matchMedia('(pointer: coarse)').matches` and return `null` from the cursor component if true.

### DON'T: Show the Same Colorbar Values Across All Simulation Sections

```
✗  All six technology sections showing "2200 / 660" in the ANSYS colorbar
```
The colorbar must be context-specific. Flux Density shows mT values. Thermal shows °C values. Stress shows MPa values. Cogging shows % values. FOC shows voltage values. Generic colorbar values signal that the visuals are placeholders, not genuine simulation outputs.

### DON'T: Use Placeholder Text Instead of SVG Visuals

```
✗  <div>FLUX DENSITY MAP</div>
✗  <div>EFFICIENCY MAP VISUAL</div>
✗  <div>STRESS ANALYSIS VISUAL</div>
✗  <div>COGGING TORQUE VISUAL</div>
```
Four of the six simulation sections on the technology page currently show only uppercase placeholder text. For a site whose entire credibility claim is "simulation-first engineering," empty simulation panels are a critical trust failure. These must be replaced with the domain-specific SVG implementations specified in the design system.

---

## 8. COMPONENT SPECIFICATIONS

### 8.1 Navbar

```
Height:           72px desktop | 64px tablet | 56px mobile
Position:         fixed, top 0, z-index 100
Background:
  scrollY < 60px: transparent
  scrollY ≥ 60, over dark: rgba(9,9,11,0.92) + backdrop-blur(14px)
                           + 1px border-bottom --sb-3
  scrollY ≥ 60, over light: rgba(243,243,239,0.94) + backdrop-blur(14px)
                             + 1px border-bottom --dw-3
  Transition: 450ms --ease-precise

Logo:             Two states stacked (LogoLight + LogoDark)
                  Active state opacity: 1. Inactive: 0.
                  Crossfade: 350ms --ease-precise

Nav links:        Space Mono 11px, tracking 0.18em, UPPERCASE
                  Default: --t-dk-3 (dark nav) | --t-lt-3 (light nav)
                  Hover: yellow underline, width 0→100%, 280ms
                  Active page: yellow underline full width, static

CTA button:       "ENQUIRE" | Space Mono 10px | tracking 0.24em | UPPERCASE
                  Border 1px --y, colour --y, bg transparent
                  Hover: bg --y, colour --sb-0, 200ms
                  Desktop only — hidden on mobile

Hamburger:        < 1024px — 3 lines, 1px each, 22px wide, 6px gap
Mobile menu:      Full-screen overlay --sb-0
                  Links: Work Sans 500 22px, stagger fade-up 60ms between each
                  Close: × top-right, 44px touch target
                  Open/close: slides down from top, 400ms --ease-motor
```

### 8.2 Buttons

```
PRIMARY (dark backgrounds):
  Default:   border 1px --y | colour --y | bg transparent
  Hover:     bg --y | colour --sb-0
  Font:      Space Mono 700 10px tracking 0.24em UPPERCASE
  Padding:   11px 26px | min-height 44px (touch)
  Transition: 200ms --ease-precise

PRIMARY (light backgrounds):
  Default:   border 1px --sb-0 | colour --sb-0 | bg transparent
  Hover:     border-color --y | colour --y

SECONDARY / TEXT LINK:
  Default:   colour --t-dk-2 | text-underline-offset 4px
             text-decoration-color rgba(255,255,255,0.20)
  Hover:     colour --t-dk-1 | decoration-color rgba(255,255,255,0.50)

ARROW VARIANT:
  Arrow → character in its own <span class="arrow">
  On parent hover: translateX(4px) over 280ms
```

### 8.3 Section Overline

```
Structure (dark sections):
  [28px diagonal SVG rule at 78°, 1px --y]  [OVERLINE TEXT]

Structure (light sections):
  [OVERLINE TEXT]  — no slash on light

Font:     Space Mono 10px tracking 0.32em UPPERCASE
Colour:   --y on dark | --t-lt-3 on light
Margin:   0 0 24px 0
```

### 8.4 ANSYS Frame

```
Outer border:   1px solid rgba(242,183,5,0.18)
Background:     #050508
Toolbar:        28px height, rgba(255,255,255,0.03) bg
                3 traffic-light dots + title text
Separator:      1px rgba(255,255,255,0.06) below toolbar
Content:        Colorbar (14px) left | SVG visual right
Footer:         Watermark text bottom-right
```

### 8.5 Data Table

```
Background:     --dw-2 (pure white — maximum legibility)
Header cells:   Space Mono 9px tracking 0.22em UPPERCASE --t-lt-3
                Cursor pointer, user-select none (all columns sortable)
                Sort chevrons: ▲▼, both grey default, active direction --y
Data cells:     Space Mono 13px --t-lt-1 | padding 14px 16px
Row hover:      bg rgba(242,183,5,0.03) — barely perceptible
Selected row:   bg rgba(242,183,5,0.05) + inset 2px left border --y
Dividers:       1px --dw-3 between rows
Domain badge:   Space Mono 8px tracking 0.18em UPPERCASE
                border 1px currentColor | padding 3px 7px
                colour: domain-specific (--d-air, --d-water, etc.)
Efficiency bar: 2px height | 60px max-width | --y fill | --dw-3 track
                Width = (efficiency - 80) / 20 × 60px

Tablet:         Horizontal scroll wrapper, -webkit-overflow-scrolling touch
                Right-edge shadow gradient signals scrollability
Mobile:         Card stack — each motor becomes a card
                Top: model name + domain badge
                Grid: power | torque | weight | efficiency
                Bottom: "View Specs →" full-width button
```

### 8.6 Motor SVG (Living Motor)

Refer to CLAUDE.md v3.0 Chapter 5 for full layer-by-layer specification including domain configurations, slot count, hue ranges, thermal overlay, and flux line ambient animation.

### 8.7 Stat Counters

```
Problem:        Currently stuck at 0 on live site.
Fix:            useInView({ threshold: 0.2, rootMargin: '0px 0px -80px 0px' })
                animate() from framer-motion, not CSS transitions
                Suffix ("+" "%" "") as static sibling — never concatenated
                Count: duration 1.2s, --ease-motor, stagger 150ms between counters
Values:         7+ Years R&D | 4 Domains | 12+ Motor Variants | 96% Peak η
```

### 8.8 Domain Progress Dots

```
Position:       Fixed right: 24px, vertically centred in domain scroll container
Visible:        During domain sections only — fades out entering bridge section
4 dots:         gap 14px, vertical stack

Inactive:       5×5px circle, rgba(255,255,255,0.18)
Active:         5×22px pill, border-radius 3px, --y background
Transition:     height+width 300ms --ease-motor, colour 300ms

Hover tooltip:  Space Mono 9px --t-dk-3, appears left of dot after 400ms
Click:          Smooth scroll to corresponding domain section
Desktop only:   Hidden at tablet and mobile breakpoints
```

---

## 9. INTERACTION & ANIMATION SYSTEM

### 9.1 Easing Curves — Immutable

| Name | Value | Use |
|---|---|---|
| --ease-motor | cubic-bezier(0.16, 1, 0.3, 1) | All content reveals, motor spin-up |
| --ease-precise | cubic-bezier(0.45, 0, 0.55, 1) | State transitions, nav crossfade |
| --ease-wire | cubic-bezier(0.22, 1, 0.36, 1) | Wire-draw transition |
| --ease-thermal | cubic-bezier(0.35, 0, 0.15, 1) | Thermal propagation — heat seeps |

### 9.2 Reveal Stagger Schedule

Every section uses the same stagger timing. Never deviate:

| Element | Delay |
|---|---|
| Overline label | 0ms |
| Headline | 100ms |
| Body paragraph | 220ms |
| Key metric | 300ms |
| CTA button | 420ms |
| Visual / SVG | 160ms |

### 9.3 The Custom Cursor (Desktop Only)

```
Mount condition:  window.matchMedia('(pointer: coarse)').matches === false
Default state:    16×16px crosshair, 1px lines, colour switches dark/light by section
Hover state:      Crosshair shrinks to 10px + 22px slash extension at 78°, --y
Motor hover:      Transforms into ANSYS probe cursor — 7px open circle + leader line
Table hover:      Vertical bar extends 32px downward
Click:            All bars shrink 50% × 100ms then return × 80ms
```

### 9.4 Four Permitted Continuous Loops

Only four animations are permitted to run continuously without scroll trigger:

1. Motor rotor rotation (CSS animation, GPU-composited)
2. Magnetic field line drift (CSS stroke-dashoffset, GPU-composited)
3. Oscilloscope scan cursor (requestAnimationFrame, canvas)
4. Ambient motor sound synthesis (Web Audio API, Phase 6 only)

No other animation loops are permitted.

### 9.5 Wire-Draw Transition — Phase Timeline

```
t = 0ms:      Wire begins drawing left → right
              SVG line strokeDashoffset: 1440 → 0
              Duration: 1000ms, --ease-wire

t = 600ms:    New section begins rising
              translateY: 28px → 0, opacity: 0 → 1
              Duration: 800ms, --ease-motor

t = 1000ms:   Wire reaches right edge. Spark fires.
              White circle at right endpoint:
                r: 0 → 3 → 12 → 22 → 34px
                opacity: 0 → 1 → 0.85 → 0.5 → 0
                colour: #FFFFFF → #F2B705 (white-hot, cools to yellow)
              Duration: 380ms

t = 1100ms:   Wire fades
              opacity: 1 → 0, 400ms ease-in

Mobile:       Skip entirely. Use opacity crossfade 300ms instead.
```

---

## 10. SCROLL SYSTEM

### 10.1 Three Scroll Models

| Model | Behaviour | Used For |
|---|---|---|
| Model A — Passive Reveal | IntersectionObserver triggers content entrance | All standard sections |
| Model B — Scroll-Driven | scrollYProgress directly controls animation progress | Thermal section |
| Model C — Snap Scroll | Viewport snaps to section boundaries | Domain sections, tech sims (desktop only) |

### 10.2 Passive Reveal (Model A)

All scroll reveals use `RevealWrapper` component. Never inline Framer Motion props on individual elements. The component applies: `opacity 0→1, translateY 28→0, 720ms, --ease-motor`. Threshold: 0.12 viewport. See stagger schedule in §9.2.

### 10.3 Thermal Propagation — Scroll-Driven (Model B)

```
Section height:     250vh desktop | 180vh tablet | 120vh mobile
Layout:             Sticky inner panel (100vh) while section scrolls
scrollYProgress:    0 = section top at viewport top
                    1 = section bottom at viewport top

5 thermal zones, scroll thresholds:
  Shaft core:     activates 0.00–0.28  cold #001f5e → hot #FF0000
  Magnets:        activates 0.15–0.45  cold #001f5e → hot #FF4400
  Stator core:    activates 0.28–0.58  cold #001f5e → hot #FF7700
  Winding slots:  activates 0.44–0.73  cold #001f5e → hot #FF9900
  End windings:   activates 0.58–0.94  cold #001f5e → hot #FF1100

Temperature display: useTransform(scrollYProgress, [0,1], [25, 218])
Colorbar bracket:    useTransform(scrollYProgress, [0,1], [170, 10]) (Y position)
Annotation:          opacity useTransform([0.89, 0.96], [0, 1])
                     "Peak hotspot: 218°C" with callout line to end winding
```

### 10.4 Snap Scroll (Model C)

```
Domain sections (landing page):
  scroll-snap-type: y mandatory on the 4-section container
  scroll-snap-align: start on each section
  Height: 100vh each
  Desktop only — disabled at < 1024px

Technology page simulations:
  scroll-snap-type: y mandatory on html.tech-page
  scroll-snap-align: start on each section
  Thermal section: 250vh (starts snap, extra scroll for animation)
  Desktop only — disabled at < 1024px
```

---

## 11. RESPONSIVE DESIGN SYSTEM

### 11.1 Breakpoints

| Name | Width | Target |
|---|---|---|
| xs | 480px | Phone portrait |
| sm | 640px | Phone landscape |
| md | 768px | Tablet portrait |
| lg | 1024px | Tablet landscape / small laptop |
| xl | 1280px | Standard desktop |
| 2xl | 1440px | Large desktop |

### 11.2 Layout Grid

```css
.page-gutter {
  padding-left:  clamp(20px, 5vw, 64px);
  padding-right: clamp(20px, 5vw, 64px);
  max-width: calc(1400px + 128px);
  margin: 0 auto;
}
```

### 11.3 Section Layout Behaviour by Breakpoint

| Section | Desktop (≥1024px) | Tablet (768–1023px) | Mobile (<768px) |
|---|---|---|---|
| Domain sections | 2-col: text left, motor right | Stack: motor above, text below | Stack: motor (220px) → text |
| Tech simulations | 2-col: text 40%, visual 60% | Stack: visual (300px) → text | Stack: visual (240px) → text |
| Bridge stats | 2-col: headline left, 2×2 grid right | Stack | 2-col stat grid, stack otherwise |
| Products table | Full table | Horizontal scroll | Card stack |
| Contact | 50/50 split | Stack: form → info | Stack |
| About timeline | Year col + content col | Year in header row | Year + title same row |
| Footer | Logo + 3 columns | Logo top + 3 columns | Stacked accordions |

### 11.4 Features Disabled at Breakpoints

| Feature | Desktop | Tablet | Mobile |
|---|---|---|---|
| Custom cursor | ✓ Enabled | ✗ Disabled (pointer:coarse) | ✗ Disabled |
| Snap scroll | ✓ Enabled | ✗ Disabled | ✗ Disabled |
| Wire-draw transition | Full spec | Reduced (1px wire) | ✗ Replaced with crossfade |
| Progress dots | ✓ Visible | ✗ Hidden | ✗ Hidden |
| Magnetic field lines | ✓ Enabled | ✓ Enabled | ✗ Disabled (performance) |
| ANSYS toolbar chrome | Full detail | Full detail | ✗ Hidden (too small) |
| Oscilloscope fps | 60fps | 30fps | 30fps |
| Motor size | 340×340px | 260×260px | 220×220px |

### 11.5 Touch Target Requirements

All interactive elements on mobile must meet 44px minimum touch target:

```css
@media (pointer: coarse) {
  button, a, [role="button"] {
    min-height: 44px;
    min-width: 44px;
  }
  table tr { min-height: 56px; }
  .slider-thumb { width: 28px; height: 28px; }
}
```

---

## 12. ACCESSIBILITY REQUIREMENTS

### 12.1 Colour Contrast (WCAG 2.1)

| Combination | Ratio | Level |
|---|---|---|
| #FFFFFF on #09090B | 19.8:1 | ✓ AAA |
| rgba(255,255,255,0.62) on #09090B | 7.5:1 | ✓ AAA |
| #F2B705 on #09090B (48px+) | 9.6:1 | ✓ AAA Large Text |
| #09090B on #F3F3EF | 18.4:1 | ✓ AAA |
| #44444C on #F3F3EF | 7.1:1 | ✓ AAA |
| #F2B705 on #F3F3EF (body text) | 2.3:1 | ✗ FAIL — FORBIDDEN |

### 12.2 Focus Styles

All interactive elements must show:
```css
outline: 2px solid var(--y);
outline-offset: 3px;
```
Focus styles must never be removed. The custom cursor does not replace keyboard focus indicators.

### 12.3 Semantic HTML

```
<nav aria-label="Main navigation">
<main id="main-content">
<section aria-label="[Domain] propulsion systems">
Motor SVGs: role="img" aria-label="Animated cross-section of [domain] electric motor"
Oscilloscope: aria-label="Interactive three-phase motor drive waveform"
Tables: <thead><tbody> | <th scope="col"> | <caption>
Accordions: aria-expanded | aria-controls on trigger
```

### 12.4 Skip Navigation

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```
Visible only on `:focus`. Background `--y`, colour `--sb-0`.

### 12.5 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Reveals: opacity only, no translateY */
  /* Wire-draw: opacity crossfade, no line */
  /* Motor: rotation stops */
  /* Field lines: display none */
  /* Oscilloscope: static waveforms, no cursor */
  /* Thermal: shows final state immediately */
  /* Cursor: instant state changes */
  /* Typing effect: instant full text */
}
```

---

## 13. PERFORMANCE REQUIREMENTS

### 13.1 Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 88 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse Best Practices | ≥ 95 |
| Lighthouse SEO | ≥ 90 |
| LCP (Largest Contentful Paint) | < 2.5s |
| CLS (Cumulative Layout Shift) | < 0.1 |
| FID (First Input Delay) | < 100ms |

### 13.2 Animation Performance Rules

Only these CSS properties may be animated. Animating anything else triggers layout recalculation and causes jank:

```
PERMITTED:   transform, opacity, stroke-dashoffset, SVG fill colour
FORBIDDEN:   width, height, top, left, margin, padding, border-width
```

### 13.3 Bundle Optimisation

```
Framer Motion: LazyMotion + domAnimation (reduces bundle ~66%)
Canvas:        OffscreenCanvas where supported (Chrome/Edge)
               30fps cap on tablet/mobile
               Pause rAF when canvas not in viewport
SVG motors:    Inline SVG (not img) — enables CSS animation
Fonts:         preconnect to googleapis.com + gstatic.com
               display=swap, Latin subset only
Images:        Next.js <Image>, WebP q85, lazy except above-fold
```

### 13.4 Low-End Device Handling

```ts
const isLowEnd = navigator.hardwareConcurrency < 4

if (isLowEnd) {
  // Disable magnetic field lines
  // Reduce rAF to 24fps
  // Increase motor spinDurationMs by 50%
}
```

---

## 14. PAGE-BY-PAGE REQUIREMENTS

### 14.1 Landing Page (`/`)

**Hero Section**
- Background: `--sb-0`
- Height: `100vh`
- Two ghost slash lines in upper-right quadrant (opacity 0.08, 0.04)
- Overline: "ORAGADAM, INDIA · FOUNDED 2017" — Space Mono, `--t-dk-3`, no yellow
- Headline: THREE separate `<span>` elements — "ELECTRIC" (white) · "PROPULSION" (yellow) · "SYSTEMS" (white)
- Each line stagger-animates on load: 0ms, 80ms, 160ms delays, 900ms duration
- Sub-text: Work Sans 16px, max-width 420px, fades in at 360ms
- Scroll cue: bottom-right, 40px yellow vertical line + "SCROLL" rotated text

**Domain Sections (×4)**
- Each: `100vh`, `--sb-0`, snap scroll (desktop)
- Desktop: 2-column grid (col-span-5 text, col-span-7 visual)
- Motor SVG: sticky on desktop, morphs between domain configs
- Robotics: micro-step behaviour (20°/step, 580ms pause)
- Content reveals: full stagger on section entry
- Domain name colours: AIR white · WATER white · LAND yellow · ROBOTICS white
- Progress dots: fixed right, desktop only

**Bridge/Stats Section**
- Background: `--dw-0` — the contrast payoff
- Stat counters: fix the IntersectionObserver trigger (currently stuck at 0)
- Values: 7+ Years · 4 Domains · 12+ Motor Variants · 96% Peak η
- Counter stagger: 150ms between each

**CTA Strip**
- Background: `--y` (the only full-yellow section on the site)
- All text: `--sb-0`
- Logo: LogoInverted state

### 14.2 Technology Page (`/technology`)

**Hero**
- Fix headline: "THE SCIENCE" + line break + "INSIDE." (two separate elements, not concatenated)
- "INSIDE." at 22% opacity — the science is inside, partially hidden
- Magnetic field lines active in background (12–16 paths, prime-number durations)

**Simulation Sections (×6)**

| Section | Visual Required | Animation | Colorbar |
|---|---|---|---|
| Flux Density | Motor cross-section + high-opacity flux lines | Lines draw continuously | mT 660–2200 |
| Thermal | 5-zone scroll-driven heatmap | Scroll-driven (250vh) | °C 25–218 |
| Efficiency | Speed/torque plane + 5 contours | Outside-in reveal, 1100ms | Contour labels only |
| Stress | Von Mises colour map | Clip-path scan | MPa 0–350 |
| Cogging | 18-cycle waveform trace | Left-right draw, 1400ms linear | % 0–3 |
| FOC | Interactive oscilloscope canvas | Activates on section entry | V ±400 |

**FOC Oscilloscope Requirements**
- Fix: currently shows "SYSTEM STANDBY" forever — IntersectionObserver not triggering
- Three phases: A (blue `#3B8FEF`) · B (yellow `#F2B705`) · C (red `#FF4444`)
- Speed slider: 1,000–12,000 rpm visual range
- Load slider: 0–100% with phase shift and amplitude reduction under load
- 5th harmonic on Phase A at 100% load
- Entry animation: waveforms draw left-right over 1200ms before going live

### 14.3 Products Page (`/products`)

- Domain filter pills above table: ALL · AIR · WATER · LAND · ROBOTICS
- Fix column header: "Peak n" → "Peak η" (η = `&eta;`)
- Sort chevrons on all numeric columns, active direction highlighted in yellow
- Row click → slide-up detail panel (full-width, fixed bottom)
- Spec Whisper ghost overlay on row hover (desktop only)
- Mobile: collapse table to card stack

### 14.4 Contact Page (`/contact`) — Currently 404, Build Priority P0

- Split layout: Deep White left (form), Space Black right (info)
- Response time visible: "< 24 hours" in yellow
- All form fields: 44px min-height, 1px border, focus outline in yellow
- Application domain dropdown
- Mobile: stack form above info

### 14.5 About Page (`/about`) — Currently 404, Build Priority P1

- Hero: "FROM INDIA — FOR THE WORLD." headline
- Timeline: warm paper background `#EDE7D9`, typing effect with ±15% pace variation
- Timeline years: 2017 → 2026
- Team grid: Deep White, 72px avatar circles, name + role

### 14.6 Calculators (`/calculators`) — Currently 404, Build Priority P1

- Four calculators: Torque/Power, Inrush Current, Drone Selection, Busbar
- Torque/Power: Canvas torque curve with operating point dot
- Operating point outside envelope: dot turns red, curve shakes
- Mobile: stacked layout, canvas full-width

### 14.7 Process Page (`/process`) — Currently 404, Build Priority P2

- Engineering process: dark background, 5-column grid
- Steps: Define → Design → Simulate → Verify → Deliver
- Sales process: light background, vertical list with step numbers

### 14.8 Location Page (`/location`) — Currently 404, Build Priority P2

- Map: CSS grayscale + invert filter for dark aesthetic
- Neighbour companies: Delphi-TVS, JBM Group, Sanmina IMS, GARC
- Address card with "Get Directions" CTA
- Fix current landing page copy: "Adjacent to Hyundai, Renault-Nissan, Daimler, and Saint-Gobain" is inaccurate per the project brief

---

## 15. KNOWN ISSUES & FIX PRIORITY

### P0 — Breaks Trust or Functionality

| Issue | Location | Description | Fix |
|---|---|---|---|
| 5 pages 404 | `/contact` `/about` `/calculators` `/location` `/process` | All linked in nav — every click past the first 3 pages fails | Build pages in priority order |
| Hero headline no spaces | `/` hero | "ELECTRICPROPULSIONSYSTEMS" renders as single string | Three separate `<span>` elements |
| Stat counters at zero | `/` bridge | "0% Peak Efficiency" undermines credibility | Fix IntersectionObserver rootMargin |
| Wrong temperature value | `/technology` thermal | "Max Temp 660°C" — 660 is mT, not °C | Fix label to "Peak Hotspot: 218°C", fix colorbar |
| Logo broken everywhere | All pages | "WELKINRIMTECHNOLOGIES" single string, no mark, no colour difference | Build LogoLight + LogoDark SVG components |

### P1 — Credibility Gaps

| Issue | Location | Description |
|---|---|---|
| Oscilloscope never activates | `/technology` FOC | "SYSTEM STANDBY" permanent — IntersectionObserver not firing |
| 4 empty simulation sections | `/technology` | Placeholder text instead of SVG visuals |
| Products table no sort | `/products` | No chevrons, no sort state |
| "Peak n" label | `/products` | η symbol not rendering |
| Technology headline broken | `/technology` | "THE SCIENCEINSIDE." — missing line break |

### P2 — Polish

| Issue | Location | Description |
|---|---|---|
| No slash motif in hero | `/` | Ghost slash lines not implemented |
| No wire-draw transition | `/` | Section transitions are plain cuts |
| No custom cursor | All | Default browser cursor |
| No domain progress dots | `/` domain sections | No orientation signal |
| Wrong neighbour companies | `/` location strip | Copy doesn't match project brief |
| "From India — For the World" absent | Footer | Key brand phrase missing |
| Body text contrast low | `/` domain sections | Text appears to be below the 0.62 floor |

---

## 16. BUILD PHASES & ACCEPTANCE CRITERIA

### Phase 1 — Foundation

**Deliverables:**
- All CSS tokens defined in `globals.css`
- `LogoLight.tsx`, `LogoDark.tsx`, `LogoInverted.tsx` (all 4 logo components correct)
- `Navbar.tsx` — dual logo crossfade, mobile hamburger overlay
- `SlashCursor.tsx` — touch-detected, portal-mounted
- `RevealWrapper.tsx` — single reveal pattern
- `ANSYSFrame.tsx` — toolbar chrome, colorbar, watermark
- `SectionOverline.tsx` — with slash decorator
- `WireDraw.tsx` — desktop spec + mobile opacity fallback
- Hero headline fix: three elements
- Stat counter fix: IntersectionObserver repair
- Google Fonts with preconnect

**Acceptance Criteria:**
- [ ] "WELKINRIM" renders in #F2B705 Syncopate 700 in the navbar
- [ ] "TECHNOLOGIES" renders in #6B6B6B on light, #FFFFFF on dark
- [ ] Logo crossfades when scrolling between dark and light sections
- [ ] Custom cursor appears on desktop, absent on mobile
- [ ] Hero reads: ELECTRIC / PROPULSION / SYSTEMS on three lines
- [ ] Stats animate from 0 to target values on scroll into view
- [ ] Fonts load without FOUT (flash of unstyled text)

### Phase 2 — Landing Page

**Deliverables:**
- `MotorVisual.tsx` — all 4 domain configs, micro-step for Robotics
- Domain section layout (desktop 2-col, tablet stack, mobile single-col)
- Living Motor morphing between domains
- Domain progress dots (desktop only)
- Wire-draw fires at correct scroll position
- Bridge section counter animation

**Acceptance Criteria:**
- [ ] Motor spins at domain-appropriate speed for all 4 domains
- [ ] Robotics motor advances 20° per step with 580ms pause
- [ ] Motor slot colours change when domain changes (800ms transition)
- [ ] Wire-draw fires when outgoing section is 90% scrolled
- [ ] Spark fires at wire completion (white then yellow)
- [ ] Wire-draw replaced by opacity crossfade on mobile
- [ ] Progress dots update on domain scroll

### Phase 3 — Technology Page

**Deliverables:**
- Technology hero headline fix
- Magnetic field lines (prime-number durations)
- All 6 simulation SVGs (no more placeholder text)
- Thermal propagation (scroll-driven, 250vh)
- Correct colorbar values per section
- Oscilloscope: working rAF loop, load/speed sliders

**Acceptance Criteria:**
- [ ] Technology hero: "THE SCIENCE" / "INSIDE." on two lines
- [ ] Thermal section: temperature shows 25°C at start, 218°C at scroll end
- [ ] Thermal colorbar shows °C values (not mT values)
- [ ] Oscilloscope activates (not stuck on "SYSTEM STANDBY")
- [ ] Phase B waveform is yellow, Phase A is blue, Phase C is red
- [ ] Under load, Phase A visibly leads Phase B
- [ ] All 6 simulation sections show SVG content (no placeholder text)
- [ ] Field lines use prime-number durations (no visual sync)

### Phase 4 — Products Page

**Deliverables:**
- Domain filter pills
- Sort on all columns (fix η symbol)
- Row click slide-up detail panel
- Spec Whisper efficiency ghost (desktop)
- Efficiency bar column
- Mobile card stack

**Acceptance Criteria:**
- [ ] η symbol renders in column header
- [ ] Clicking a column header sorts the table
- [ ] Active sort column shows highlighted chevron in yellow
- [ ] Clicking a row opens detail panel from bottom
- [ ] Detail panel has "Request Datasheet" button
- [ ] Mobile shows card stack, not overflowing table

### Phase 5 — Remaining Pages

**Deliverables:**
- `/contact` — form + split layout
- `/about` — timeline typing effect, team grid
- `/calculators` — torque curve canvas, all 4 tools
- `/process` — engineering + sales sections
- `/location` — map + corrected neighbour names

**Acceptance Criteria:**
- [ ] All 5 pages return 200 (no more 404s)
- [ ] Contact form submits without errors
- [ ] About timeline types in characters on accordion open
- [ ] Torque curve paints left-to-right on value change
- [ ] Operating point shakes when outside the motor envelope
- [ ] Location strip shows correct Oragadam neighbours per brief

### Phase 6 — Polish & Launch

**Deliverables:**
- Slash motif in hero
- Full reduced-motion audit
- "From India — For the World" in footer
- Engineering Notebook effect (about page)
- Ambient motor sound (opt-in only)
- Cross-device test across Chrome, Firefox, Safari, iOS, Android
- Lighthouse audit

**Acceptance Criteria:**
- [ ] Lighthouse Performance ≥ 88
- [ ] Lighthouse Accessibility ≥ 95
- [ ] prefers-reduced-motion: all animations disabled correctly
- [ ] No Inter/Roboto/system-ui font found in codebase (grep check)
- [ ] No more than 3 yellow elements visible simultaneously on any page
- [ ] "TECHNOLOGIES" never renders in grey on any dark background
- [ ] All touch targets ≥ 44px on mobile
- [ ] Custom cursor absent on all touch devices
- [ ] Snap scroll absent on all touch devices
- [ ] "660°C" does not appear anywhere on the site

---

*Welkinrim Technologies — Product Requirements Document v1.0*
*Space Black #09090B · Deep White #F3F3EF · Bumblebee Yellow #F2B705*
*Syncopate · Work Sans · Space Mono*
*"From India — for the world."*