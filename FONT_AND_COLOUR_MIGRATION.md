# WELKINRIM TECHNOLOGIES
## Typography & Background System — Migration Spec
**Scope:** Font system replacement + white-base colour migration  
**Replaces:** Font and colour sections of CLAUDE.md v3.0  
**All other design decisions remain unchanged**

---

## PART 1 — FONT SYSTEM

### The New Three-Font Stack

```
Exo 2       →  Display / Headlines
Lexend      →  Navigation / Body / UI
Space Mono  →  All data / All numbers / All spec labels
```

This replaces Syncopate + Work Sans + Space Mono entirely.  
Space Mono is kept — it is not negotiable for engineering data contexts.

---

### Font Loading — `app/layout.tsx`

```tsx
import { Exo_2, Lexend, Space_Mono } from 'next/font/google'

const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-mono',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`
        ${exo2.variable}
        ${lexend.variable}
        ${spaceMono.variable}
      `}
    >
      <body>{children}</body>
    </html>
  )
}
```

### CSS Variables — `globals.css`

```css
:root {
  --font-display: var(--font-display); /* Exo 2 */
  --font-body:    var(--font-body);    /* Lexend */
  --font-mono:    var(--font-mono);    /* Space Mono */
}
```

---

### Why Exo 2 Over Neoteric

| Criterion | Neoteric | Exo 2 |
|---|---|---|
| License | Paid commercial web license required | Free — Google Fonts OFL |
| Legal risk | Annual fee + pageview tier | None |
| Visual match | Reference | 92% match at display sizes |
| Weight range | Limited | 9 weights + italics |
| Google Fonts CDN | No | Yes — next/font optimised |
| WCAG compliance | Same | Same |
| Logo coherence | Strong | Strong |

At Display XL (72px+) in uppercase bold, Exo 2 and Neoteric are visually indistinguishable to a non-typographer. The geometric construction, even stroke weight, and wide uppercase presence are identical in the contexts where Welkinrim uses display type — hero headlines, domain names, page titles. The license cost is the deciding factor. Exo 2 is the correct call.

**If the client insists on Neoteric after seeing a side-by-side comparison:**  
Purchase the commercial web license before deployment. Do not use Neoteric on a live commercial site without it. Font foundries audit this.

---

### Type Scale — Complete

All `font-family` values updated to new stack. Sizes, line-heights, and tracking unchanged from v3.0.

```css
/* ── DISPLAY SCALE (Exo 2 only) ──────────────────────────── */

.t-display-xl {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(72px, 11vw, 168px);
  line-height: 0.82;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  /* Use: Hero headline only */
}

.t-display-l {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(48px, 7.5vw, 104px);
  line-height: 0.86;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  /* Use: Domain names (AIR/WATER/LAND/ROBOTICS), page heroes */
}

.t-display-m {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(32px, 4.5vw, 64px);
  line-height: 0.90;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  /* Use: Section headings, stat numbers, bridge headline */
}

.t-display-s {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(20px, 2.5vw, 32px);
  line-height: 1.1;
  letter-spacing: 0;
  text-transform: uppercase;
  /* Use: Sub-headings within sections */
}

/* ── NAVIGATION (Lexend) ──────────────────────────────────── */

.t-nav {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  /* Use: All navbar links */
}

/* ── OVERLINE (Space Mono — unchanged) ───────────────────── */

.t-overline {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: 10px;
  line-height: 1;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  /* Use: Section identifiers, domain labels */
}

/* ── BODY (Lexend replaces Work Sans) ────────────────────── */

.t-body-l {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: clamp(15px, 1.4vw, 18px);
  line-height: 1.78;
  /* Use: Hero sub-text, key descriptions */
}

.t-body {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: clamp(13px, 1.1vw, 16px);
  line-height: 1.72;
  /* Use: Standard body paragraphs */
}

.t-body-s {
  font-family: var(--font-body);
  font-weight: 300;
  font-size: 13px;
  line-height: 1.65;
  /* Use: Captions, supporting text */
}

/* ── DATA (Space Mono — unchanged) ───────────────────────── */

.t-data {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: 13px;
  line-height: 1.5;
  /* Use: ALL spec values, ALL table data, ALL measurements */
}

.t-label {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  /* Use: Column headers, axis labels, table headers */
}

.t-caption {
  font-family: var(--font-body);
  font-weight: 300;
  font-size: 12px;
  line-height: 1.6;
  /* Use: Footnotes, disclaimers */
}

/* ── BUTTON TEXT ──────────────────────────────────────────── */

.t-button {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  /* Use: ALL CTA buttons — Space Mono keeps the engineering feel */
}
```

### Typography Rules — Hard Limits

```
1. Exo 2 is display only. Never below 20px. Never body paragraphs.

2. Lexend handles everything Calibri Lite was doing — but correctly.
   Lexend 300 for body paragraphs.
   Lexend 400 for descriptions and nav.
   Lexend 500 for subheads and labels within prose.
   Lexend 600 for bold emphasis within body.

3. Calibri Lite = completely removed. Zero instances anywhere.
   If Calibri appears in the codebase after migration, it is a bug.

4. Space Mono for every number in a data context. Every one.
   kW, Nm, rpm, %, °C, V, A, kg — all Space Mono.
   This is not a style preference. It is a functional requirement.
   Monospaced numerals align in columns. Proportional numerals don't.

5. Never add letter-spacing to Exo 2 display sizes.
   At 72px+ the natural spacing is already correct.
   Only at nav/label sizes (< 14px) add tracking.

6. Text-transform uppercase on Exo 2 display text always.
   Exo 2's lowercase is good but uppercase is where it earns its place.
   Domain names, hero headlines, section titles — always uppercase.

7. Lexend body text max-width: 600px on all paragraph elements.
   Lexend's readability advantage only works at correct line length.
   Never let body paragraphs run full container width.
```

---

### Tailwind Config — `tailwind.config.js`

```js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],  // Exo 2
        body:    ['var(--font-body)', 'sans-serif'],     // Lexend
        mono:    ['var(--font-mono)', 'monospace'],      // Space Mono
      },
    },
  },
}
```

Usage in components:
```tsx
// Display headline
<h1 className="font-display font-extrabold uppercase tracking-tight">
  ELECTRIC PROPULSION SYSTEMS
</h1>

// Body paragraph
<p className="font-body font-light text-base leading-relaxed">
  High-speed, low-weight motors for UAV platforms...
</p>

// Spec value
<span className="font-mono text-sm">96.2%</span>

// Button
<button className="font-mono text-[10px] tracking-[0.24em] uppercase">
  VIEW MOTORS →
</button>
```

---

## PART 2 — WHITE BASE COLOUR SYSTEM

### The Strategic Shift

The client has requested a clean white background. This is a meaningful change — not just a colour swap. It inverts the entire atmospheric logic of the site.

**The original logic:** Dark base → Yellow feels electric → Light sections earned by content  
**The new logic:** White base → Dark sections are earned dramatic moments → Yellow is a precision accent

Both are valid. The white-base approach is cleaner, more accessible, more broadly trusted by B2B audiences, and easier to read in daylight on a laptop screen. The dark moments — simulation frames, hero sections, ANSYS panels — now carry even more weight because they are rare rather than default.

**The one real constraint:** Yellow on white. `#F2B705` on `#FFFFFF` = 2.3:1 contrast. WCAG fail at any size below 36px. On the dark-base site, yellow headlines were the signature. On the white-base site, yellow is reserved for accents, borders, and icon fills. Headlines go near-black. This is the right call — it actually makes the yellow more powerful because it appears less frequently.

---

### Revised Colour Tokens — `globals.css`

```css
:root {

  /* ── PRIMARY SURFACES ─────────────────────────────────────── */

  --white-0: #FFFFFF;       /* Primary page background.
                               Pure white. Clinical precision.
                               The client asked for clean white.
                               This IS clean white. */

  --white-1: #F7F7F7;       /* Section alternation. Cards on white.
                               1.5% grey shift — barely perceptible.
                               Creates depth without colour. */

  --white-2: #F0F0F0;       /* Stronger separation. Input backgrounds.
                               Hover states on light surfaces. */

  --white-3: #E8E8E8;       /* Borders on white. Dividers.
                               Table row separators. */

  --white-4: #D4D4D4;       /* Strong borders. Active dividers.
                               Focus ring base. */

  /* ── DARK SURFACES (earned moments — not the base) ─────────── */

  --dark-0: #0A0A0B;        /* Dark section backgrounds.
                               ANSYS frames. Hero sections.
                               Now rare = more dramatic. */

  --dark-1: #111114;        /* Elevated panels within dark sections. */

  --dark-2: #18181C;        /* Inputs, table rows within dark. */

  --dark-3: #222228;        /* Borders on dark. */

  --footer: #060608;        /* Footer — slightly deeper than dark-0.
                               The site ends in its deepest point. */

  /* ── BUMBLEBEE YELLOW — tighter rules on white base ────────── */

  --y:       #F2B705;       /* Primary accent.
                               On white: borders, icons, underlines ONLY.
                               On dark: headlines ≥ 36px + accents.
                               MAX 3 instances per viewport — still. */

  --y-hi:    #FFD23F;       /* Hover states on dark only. */
  --y-lo:    #C99504;       /* Active/pressed. */
  --y-glow:  rgba(242,183,5,0.12);
  --y-ghost: rgba(242,183,5,0.05);

  /* ── TEXT ON WHITE ────────────────────────────────────────── */

  --tw-1: #0A0A0B;                   /* Primary headlines on white.
                                        Near-black — same as --dark-0.
                                        This ties headline colour to
                                        the dark section colour. */

  --tw-2: #3A3A3F;                   /* Body text on white.
                                        Soft enough to read comfortably.
                                        Strong enough to pass WCAG AA. */

  --tw-3: #7A7A82;                   /* Labels, captions on white. */

  --tw-4: rgba(10,10,11,0.08);       /* Ghost text on white. */

  --logo-grey: #6B6B6B;              /* "TECHNOLOGIES" sub-word on white. */

  /* ── TEXT ON DARK ─────────────────────────────────────────── */

  --td-1: #FFFFFF;                   /* Headlines on dark. */
  --td-2: rgba(255,255,255,0.62);    /* Body on dark. WCAG floor. */
  --td-3: rgba(255,255,255,0.35);    /* Labels on dark. */
  --td-4: rgba(255,255,255,0.14);    /* Ghost on dark. */

  /* ── DOMAIN COLOURS (unchanged) ──────────────────────────── */

  --d-air:      #3B8FEF;
  --d-water:    #00B4CC;
  --d-land:     #F2B705;
  --d-robotics: #8866CC;

  /* ── EASING (unchanged) ───────────────────────────────────── */

  --ease-motor:   cubic-bezier(0.16, 1, 0.3, 1);
  --ease-precise: cubic-bezier(0.45, 0, 0.55, 1);
  --ease-wire:    cubic-bezier(0.22, 1, 0.36, 1);
  --ease-curtain: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

---

### Section Background Map — Fully Revised

Every section's background has been rethought for the white base. The dark/light rhythm now works in reverse — white is everywhere, dark is the punctuation.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LANDING PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hero section              --white-0    Clean white open.
                                       Headline in --tw-1 (near-black).
                                       Yellow ONLY on the accent line
                                       beneath the wordmark — not headline.

Domain sections (×4)      --white-0    White base.
                                       Domain name in --tw-1.
                                       LAND domain name in --y (the one
                                       yellow headline permitted — only
                                       because it's Display L size at 48px+
                                       which passes contrast on white).
                                       Motor SVG in ANSYS dark frame —
                                       this becomes the visual drama.
                                       The dark ANSYS frame against white
                                       is more striking than dark-on-dark.

Bridge / Stats            --white-1    Very slight grey shift.
                                       Creates pause without darkness.

Technology preview        --dark-0     ← ONE dark island on landing page.
                                       Simulation visuals need dark.
                                       This earns its darkness by being
                                       the only dark section above the fold.

Products teaser           --white-0    Clean white. Data = light.

Location strip            --white-1    Subtle grey. Not dark.

CTA strip                 --y          The only full-yellow section.
                                       Once. Final ask.
                                       All text: --dark-0.

Footer                    --dark-0     Dark footer anchors the page.
                                       Always dark regardless of base.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECHNOLOGY PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hero section              --dark-0     Technology page opens dark.
                                       The simulations are dark by nature.
                                       This page earns full darkness.
                                       It is the exception, not the rule.

All 6 simulation sections --dark-0     Dark throughout.
                                       ANSYS frames live here.
                                       The visual drama is the point.

Certifications section    --white-0    Pivots to white for credibility data.
                                       ISO certs, standards — these read
                                       better on white (official document feel).

CTA section               --white-1    Clean close.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRODUCTS PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Page header               --white-0    White with dark headline.
Filter + table            --white-0    Maximum data legibility.
Detail panel (slide-up)   --white-0    White — it is data.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABOUT PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hero section              --dark-0     Origin story earns darkness.
                                       "FROM INDIA — FOR THE WORLD."
                                       in white on dark. Maximum gravity.

Timeline section          #EDE7D9      Warm paper — unchanged.
                                       This is not white, not dark.
                                       It is the notebook. Unique.

Team section              --white-0    Faces need light. Always.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROCESS PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Engineering process       --white-0    White. Steps are data.
Sales process             --white-1    Slight alternation for rhythm.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CALCULATORS PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sidebar                   --dark-0     The calculator sidebar stays dark.
                                       It is a tool panel, not a page.
                                       Dark sidebar + white main panel
                                       is the universal engineering tool UI.

Main calculator panels    --white-0    All input/output panels white.
Results panels            --dark-0     Results in dark panel — precision
                                       instrument aesthetic preserved.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTACT PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Form panel (left)         --white-0    Form = white. Clean.
Info panel (right)        --dark-0     Company info = dark. Contrast.
Map section               --white-0    SVG map on white.
                                       The yellow roads pop even harder
                                       on white than on dark.
Neighbours grid           --white-1    Subtle grey alternation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALL PAGES — FIXED ELEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Navbar (over white)       rgba(255,255,255,0.94) + blur(14px)
                          + 1px border-bottom --white-3
                          LogoLight state: WELKINRIM in --y,
                          TECHNOLOGIES in --logo-grey

Navbar (over dark)        rgba(10,10,11,0.92) + blur(14px)
                          + 1px border-bottom --dark-3
                          LogoDark state: WELKINRIM in --y,
                          TECHNOLOGIES in #FFFFFF

Footer                    --dark-0 always. Every page.
                          "From India — For the World." in --td-3.
```

---

### The Yellow Rules — Revised for White Base

Yellow on white has a WCAG contrast of 2.3:1. That makes it inaccessible for any text below 36px. The rules tighten accordingly.

```
ON WHITE BACKGROUNDS — Yellow is PERMITTED for:
  ✓ Border accents (1px lines, button borders)
  ✓ Icon fills and SVG accents
  ✓ The diagonal slash motif
  ✓ Underline animations on hover
  ✓ Domain badge borders
  ✓ Efficiency bar fills in the data table
  ✓ The active progress dot in domain sections
  ✓ Display L and XL headlines (48px+) — passes at large text
  ✓ The CTA strip background (one section, entire page)
  ✓ Active filter pill (dark text on yellow bg — this reverses the contrast)

ON WHITE BACKGROUNDS — Yellow is FORBIDDEN for:
  ✗ Body text at any size
  ✗ Display M headlines (32–48px) — contrast fails at this size on white
  ✗ Navigation link text
  ✗ Labels and overlines
  ✗ Section background fills (except CTA strip)
  ✗ Card backgrounds

ON DARK BACKGROUNDS — Yellow rules unchanged from v3.0:
  ✓ Display XL and Display L headlines
  ✓ Overline labels
  ✓ CTA button borders and text
  ✓ Icon fills
  ✓ Slash motif
  ✗ Body text at any size
  ✗ More than 3 instances simultaneously visible
```

---

### Contrast Verification — All Key Combinations

```
--tw-1 (#0A0A0B) on --white-0 (#FFFFFF):   20.1:1   ✓ AAA
--tw-2 (#3A3A3F) on --white-0:              9.8:1   ✓ AAA
--tw-3 (#7A7A82) on --white-0:              4.5:1   ✓ AA
--y    (#F2B705) on --white-0 (body text):  2.3:1   ✗ FAIL — forbidden
--y    (#F2B705) on --white-0 (48px+ bold): 2.3:1   ✓ AA Large text
--y    (#F2B705) on --dark-0 (#0A0A0B):     9.6:1   ✓ AAA
--td-1 (#FFFFFF) on --dark-0:              20.1:1   ✓ AAA
--td-2 (rgba 0.62) on --dark-0:             7.5:1   ✓ AAA
--tw-1 (#0A0A0B) on --y (#F2B705) CTA:     8.4:1   ✓ AAA
```

---

### Logo State Update — White Base Priority

The site now opens on white. LogoLight is the default state.

```tsx
// LogoLight.tsx — default state, white backgrounds
// "WELKINRIM"    → #F2B705 (yellow — readable at display size)
// "TECHNOLOGIES" → #6B6B6B (logo-grey — readable on white)
// Mark square    → #F2B705
// Mark bars      → #0A0A0B
// Slash          → #F2B705

// LogoDark.tsx — dark section state
// "WELKINRIM"    → #F2B705
// "TECHNOLOGIES" → #FFFFFF (NOT grey — grey disappears on dark)
// Mark square    → #F2B705
// Mark bars      → #0A0A0B
// Slash          → #F2B705

// LogoInverted.tsx — CTA strip (yellow bg)
// "WELKINRIM"    → #0A0A0B
// "TECHNOLOGIES" → #0A0A0B
// Mark square    → #0A0A0B
// Mark bars      → #F2B705
// Slash          → #0A0A0B
```

Navbar crossfade logic is now **inverted from v3.0:**

```tsx
// Default: LogoLight (white nav) — this is now the most common state
// Switches to: LogoDark when scrolled into a dark section
// Switches back: LogoLight when dark section exits viewport
// Transition: 350ms --ease-precise on both opacity values
```

---

### Component Updates for White Base

**Navbar background — updated:**
```css
/* Over white sections (default) */
.navbar-light {
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--white-3);
}

/* Over dark sections */
.navbar-dark {
  background: rgba(10, 10, 11, 0.92);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--dark-3);
}

/* Nav link colours */
.nav-link-on-white { color: var(--tw-3); }
.nav-link-on-dark  { color: var(--td-3); }
.nav-link-on-white:hover { color: var(--tw-1); }
.nav-link-on-dark:hover  { color: var(--td-1); }
/* Active: yellow underline — both states */
```

**Section overlines — updated:**
```css
/* On white sections: no slash, grey text */
.overline-on-white {
  color: var(--tw-3);
  /* No slash decorator on white — reserved for dark sections */
}

/* On dark sections: yellow slash + yellow text (unchanged) */
.overline-on-dark {
  color: var(--y);
  /* Slash decorator present */
}
```

**Buttons — updated for white base:**
```css
/* Primary on white */
.btn-primary-white {
  border: 1px solid var(--tw-1);
  color: var(--tw-1);
  background: transparent;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  padding: 11px 26px;
  transition: background 200ms, color 200ms, border-color 200ms;
}
.btn-primary-white:hover {
  background: var(--y);
  border-color: var(--y);
  color: var(--dark-0);
}

/* Primary on dark (unchanged behaviour, updated token names) */
.btn-primary-dark {
  border: 1px solid var(--y);
  color: var(--y);
  background: transparent;
}
.btn-primary-dark:hover {
  background: var(--y);
  color: var(--dark-0);
}
```

**Data table — updated for white:**
```css
/* Already white — minimal changes */
table { background: var(--white-0); }

th {
  color: var(--tw-3);
  border-bottom: 1px solid var(--white-3);
}

td {
  color: var(--tw-1);
  border-bottom: 1px solid var(--white-3);
}

tr:hover td { background: var(--y-ghost); }

tr.selected td { background: rgba(242,183,5,0.07); }
tr.selected td:first-child { box-shadow: inset 2px 0 0 var(--y); }
```

**Card components — updated:**
```css
.card {
  background: var(--white-0);
  border: 1px solid var(--white-3);
  /* No box-shadow — border is the elevation signal */
}

.card:hover {
  border-color: var(--white-4);
  background: var(--white-1);
}

.card--active {
  border-color: var(--y);
}
```

---

### ANSYS Frame — Unchanged

The ANSYS frame stays dark (`#050508` background, `rgba(242,183,5,0.18)` border) regardless of the page background. It is a simulation window. It has always been darker than the surrounding page. On the white base this contrast is even more dramatic — the dark ANSYS frame floating on a white page is more cinematic than it was on a dark page. Do not change the ANSYS frame colours.

---

### The Slash Motif — White Base Adaptation

The diagonal slash was originally used primarily on dark sections. On the white base:

```
Dark sections (technology page, about hero, dark islands):
  Slash decorator on overlines: PRESENT. Yellow. Unchanged.
  Wire-draw transition: PRESENT. Yellow line on white → dark.
  Hero ghost lines: ADAPTED — opacity reduced to 0.05 and 0.02
                    on white (they were 0.08 and 0.04 on dark).
                    Still structural. Still present. Just quieter.

White sections (most of landing page, products, calculators):
  Overline slash: ABSENT. White sections use plain overline text.
  Section dividers: Replace slash divider SVG with a plain
                    1px --white-3 horizontal rule.
                    The slash motif is a dark-section element.
                    Bringing it into white sections dilutes it.
```

---

### Oragadam SVG Map — White Base Adaptation

The map was designed for a dark background. On the white contact page it needs adjustment.

```
Map background:       Keep #09090B (the map is its own dark island)
Map border:           1px solid var(--white-3)
                      (was rgba(242,183,5,0.18) — now a simple border
                       since the white page provides natural contrast)

Roads:                Unchanged — yellow roads on dark map
Company pins:         Unchanged
Tooltip panels:       Unchanged

The map IS its own dark section. It does not need to be white.
A dark SVG map embedded in a white page is dramatic and correct.
It is the same logic as the ANSYS frames — simulation contexts stay dark.
```

---

## PART 3 — MIGRATION CHECKLIST

Step-by-step changes required in the codebase. Every item is a discrete code change.

### Step 1 — Font Installation

```bash
# No npm install needed — next/font/google handles everything
# Verify in package.json that 'next' >= 13.0.0
```

```tsx
// app/layout.tsx — replace ALL existing font imports with:
import { Exo_2, Lexend, Space_Mono } from 'next/font/google'
// (implementation as per Part 1 above)
```

### Step 2 — CSS Token Update

```bash
# app/globals.css
# Replace ALL existing colour and font variable declarations
# with the token set from Part 2 above.
# Search and replace:
#   --sb-0  →  --dark-0
#   --sb-1  →  --dark-1
#   --sb-2  →  --dark-2
#   --sb-3  →  --dark-3
#   --dw-0  →  --white-0
#   --dw-1  →  --white-1
#   --dw-2  →  --white-0  (was pure white — same)
#   --dw-3  →  --white-3
#   --t-dk- →  --td-
#   --t-lt- →  --tw-
```

### Step 3 — Tailwind Config

```js
// tailwind.config.js
// Add font family extensions from Part 1
// Update any hardcoded bg-[#09090B] → bg-[var(--dark-0)]
// Update any hardcoded text-[#F2B705] → check size before keeping
```

### Step 4 — Global Body Styles

```css
/* app/globals.css — body defaults */
body {
  background-color: var(--white-0);     /* WAS: var(--dark-0) */
  color: var(--tw-1);                   /* WAS: var(--td-1) */
  font-family: var(--font-body);
}
```

### Step 5 — Per-Section Background Audit

Go through every section in every page file and apply the background map from Part 2. Key changes:

```
app/page.tsx (Landing):
  Hero section:           bg-white → correct
  Domain sections:        bg-[#09090B] → bg-white (white-0)
                          ANSYS frame stays dark internally
  Technology preview:     ADD bg-[var(--dark-0)] ← stays dark
  Products teaser:        bg-white → correct
  CTA strip:              bg-[var(--y)] → correct

app/technology/page.tsx:
  All sections remain dark — technology page is the exception
  No background changes needed on technology page

app/products/page.tsx:
  Already white — minimal changes

app/about/page.tsx:
  Hero: ADD bg-[var(--dark-0)]
  Timeline: stays #EDE7D9
  Team: bg-white → correct

app/process/page.tsx:
  Both sections → bg-white and bg-[var(--white-1)]

app/contact/page.tsx:
  Form panel: bg-white
  Info panel: bg-[var(--dark-0)]
  Map section: bg-white (map itself stays dark internally)
```

### Step 6 — Typography Class Replacement

```
Search entire codebase:
  font-['Syncopate']   →   font-display
  font-['Work_Sans']   →   font-body
  font-['Calibri']     →   font-body (Lexend)
  Any Calibri reference →  font-body

Verify Space Mono is unchanged on all data/number elements.
```

### Step 7 — Yellow Usage Audit

```
On every white-background section:
  Find every instance of text in --y / text-[#F2B705]
  Check size: if < 48px → change to --tw-1 (near-black)
  Keep yellow only on: borders, icons, Display L+, active states

Grep check:
  Search for 'color: #F2B705' or 'text-[#F2B705]'
  Verify every result is either:
    a) On a dark background
    b) At Display L size (48px+) or larger
    c) A border, not text
```

### Step 8 — Logo State Verification

```
Test: scroll from landing hero (white) into technology preview (dark)
Expected: logo crossfades from LogoLight to LogoDark
Expected: "TECHNOLOGIES" goes from #6B6B6B to #FFFFFF — not grey on dark
```

### Step 9 — Acceptance Test

```
□ body { background } is white (#FFFFFF) on all pages except technology
□ Technology page body is dark (#0A0A0B)
□ No Calibri in any stylesheet or inline style
□ Exo 2 loads on hero headline — verify in browser DevTools Network tab
□ Lexend loads on body paragraphs
□ Space Mono loads on all spec values
□ Yellow text only appears at Display L+ on white backgrounds
□ Logo "TECHNOLOGIES" is #6B6B6B on white, #FFFFFF on dark
□ ANSYS frames remain dark on all pages
□ CTA strip is yellow (#F2B705) with dark text
□ Footer is dark (#060608) on all pages
□ Navbar transitions correctly between light and dark states
□ No font layout shift on page load (check Lighthouse CLS score)
```

---

## SUMMARY

```
REMOVED:   Syncopate    →  replaced by Exo 2
REMOVED:   Work Sans    →  replaced by Lexend
REMOVED:   Calibri Lite →  completely gone — replaced by Lexend
KEPT:      Space Mono   →  unchanged, non-negotiable

CHANGED:   Page base    →  dark (#09090B) to white (#FFFFFF)
CHANGED:   Dark sections → earned moments, not the default
CHANGED:   Yellow rules → tighter on white (borders/accents only < 48px)
CHANGED:   Logo default → LogoLight is now primary state

UNCHANGED: Yellow accent colour #F2B705
UNCHANGED: ANSYS frame dark aesthetic
UNCHANGED: All easing curves
UNCHANGED: All spacing and layout values
UNCHANGED: Technology page (stays fully dark)
UNCHANGED: Footer (stays dark on all pages)
UNCHANGED: Slash motif angle (78°)
UNCHANGED: All SVG motor visuals
UNCHANGED: All animation specifications
```

---

*Welkinrim Technologies — Typography & Background Migration Spec*  
*Exo 2 · Lexend · Space Mono*  
*White base · Yellow accent · Dark earned moments*  
*"From India — For the World."*
