---
name: "Birdeye CLI"
description: "Compact Birdeye research console with dark and light themes"
colors:
  canvas: "#0b0d12"
  surface: "#141821"
  surface-raised: "#1a1f2b"
  input: "#0d1017"
  ink: "#e6e9f2"
  muted: "#a1abc1"
  line: "#30384a"
  accent: "#78afff"
  focus: "#9dc5ff"
  soft: "#192944"
  green: "#67d99a"
  warning: "#f5c365"
  danger: "#ff9c9c"
  error-bg: "#2d1a22"
  warning-bg: "#292318"
  button: "#3069ca"
  button-hover: "#3b78de"
  light-canvas: "#f5f7fb"
  light-surface: "#ffffff"
  light-surface-raised: "#eaf0f8"
  light-input: "#f5f7fb"
  light-ink: "#202c3f"
  light-muted: "#53627a"
  light-line: "#ccd5e4"
  light-accent: "#235daf"
  light-focus: "#276bd0"
  light-soft: "#e3edff"
  light-green: "#167246"
  light-warning: "#805300"
  light-danger: "#af2638"
  light-error-bg: "#fff0f1"
  light-warning-bg: "#fff5de"
  on-button: "#ffffff"
typography:
  headline:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "21px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-.02em"
  title:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "-.01em"
  section:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.5
  body:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "13px"
    lineHeight: 1.5
  label:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "12px"
    lineHeight: 1.5
  action:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "12px"
    fontWeight: 650
    lineHeight: 1.5
  hint:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "11px"
    lineHeight: 1.6
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "12px"
    lineHeight: 1.65
rounded:
  badge: "5px"
  control: "6px"
  filter: "7px"
  data: "8px"
  panel: "10px"
  connection: "12px"
spacing:
  tight: "4px"
  small: "8px"
  control: "12px"
  panel: "14px"
  inset: "16px"
  section: "20px"
  outer: "24px"
components:
  button-primary:
    backgroundColor: "{colors.button}"
    textColor: "{colors.on-button}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
    typography: "{typography.action}"
  button-primary-hover:
    backgroundColor: "{colors.button-hover}"
  button-secondary:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
    typography: "{typography.label}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    padding: "6px 8px"
    typography: "{typography.label}"
  input:
    backgroundColor: "{colors.input}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "7px 10px"
    typography: "{typography.body}"
  nav-selected:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.accent}"
    rounded: "{rounded.control}"
    padding: "7px 12px"
  badge:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.muted}"
    rounded: "{rounded.badge}"
    padding: "3px 7px"
  skill-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "12px"
  skill-card-selected:
    backgroundColor: "{colors.soft}"
  composer:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
---

# Design System: Birdeye CLI

## Overview

**Creative North Star: "Birdeye research console"**

The user-selected `birdeye-data-skills/deploy/index.html` is the visual authority, recorded in `docs/ui/reference-console.md`. The replacement console uses a navy canvas, blue controls, compact system typography and bordered panels. Its light theme preserves the same hierarchy with cool pale surfaces. This replaces the former light/orange workspace.

This record is extracted from `web/style.css`, `web/main.tsx`, `web/skill-console.tsx`, `web/workflow-overview.tsx` and `web/skill-settings.tsx`. No generated comp or raster imagery defines this world. Browser rendering and contrast have not been visually validated: TCP listen returned EPERM and Chrome launch was blocked, so no screenshots were captured.

**Key Characteristics:**

- Navy or cool light surfaces with blue selection and actions.
- Compact skill, research and history areas with visible CU context.
- Flat bordered panels, system fonts and inspectable source data.

## Colors

Blue is the sole action accent. Navy and blue-gray neutrals establish the dark reading hierarchy; cool whites and slate text establish the light hierarchy. Frontmatter names without a prefix are the default dark palette; `light-` tokens replace the corresponding variable inside the light app shell. Button fills and white button text are shared between themes. The sidecar’s eight-step OKLCH ramps are synthesized preview metadata, not additional CSS tokens or verified contrast pairings.

Primary controls use `button` and `button-hover`; links, selection borders and active tabs use `accent`. Selected panels use `soft`. Neutral roles are `canvas`, `surface`, `surface-raised`, `input`, `ink`, `muted` and `line`. The raised surface is a tonal step, not a shadow treatment. Green communicates completion or configured state, amber communicates CU and caution, and red communicates errors. Error and warning backgrounds accompany readable labels. Focus has its own theme-aware token.

## Typography

The platform sans stack is shared by the interface; addresses and source JSON use the system monospace stack. No remote font loads. Frontmatter captures observed roles rather than an invented modular scale. Body text uses a compact rhythm; prose is capped at 75ch. Supporting labels range from 10px badges to 12px fields, while skill descriptions use 11.5px and metadata uses 10.5px. These small sizes carry secondary information, not primary actions.

Headings progress through headline, title and section roles. The brand uses 19px/750 with -.03em tracking; usage totals use 24px and finding values use 18px. Tables and cost figures use tabular numerals. JSON uses the code role with wrapping and contained scrolling.

## Layout

The current research surface starts with a compact wrapping header, Research/Usage/Settings navigation, connection and storage status, and group filters. Below, a 260px skills rail and 240px history rail flank a fluid center. Rails stick to the top and scroll within a viewport-height maximum. Center content uses 14px 16px 24px padding. Utility screens omit the skills column. Settings content is capped at 850px; the connection panel is capped at 460px.

At 1200px and below, rails shrink to 215px and 190px and content padding becomes 12px. At 950px and below, the skills rail becomes 205px and history moves below the main grid with a 300px maximum height. At 650px and below, the layout stacks, navigation takes its own header row, and both rails initially collapse to native disclosure summaries. Crossing the 651px media boundary updates their open state. Expanded skills use a horizontally scrollable row of 210px cards. The center form stays full width; composer actions stack and the run button has a 40px minimum height. Secondary workspace notes stack to one column.

Fields use an auto-fit grid with a 175px minimum constrained by available width. Spacing is compact, using the frontmatter steps for shared rhythm with smaller local gaps where controls require them. Tables scroll within their bordered container; source JSON wraps and scrolls within a 580px maximum height.

## Elevation & Depth

No box shadows are defined. Background tones, one-pixel borders and blue selected outlines distinguish panels. Input wells are darker in the default theme and pale in the light theme. Keep this tonal hierarchy when adding surfaces.

## Shapes

Small rounded controls establish the console's form language. The badge radius also serves icon controls; the control radius serves fields, buttons and navigation. Filters and notices use the filter radius. Tables, JSON and informational panels use the data radius. Skill cards, history cards and the research composer use the panel radius; the connection panel uses the connection radius. Status dots are circular. Selected state changes border and fill without changing the silhouette.

## Components

- **Buttons:** Primary controls use blue fill and white text; secondary controls use the raised surface and neutral border; quiet controls are transparent with muted labels. Primary hover changes fill, secondary hover changes the border to accent, and quiet hover uses the raised surface. Disabled buttons use half opacity and a not-allowed cursor. Background and border transitions last 150ms. Reduced-motion preference disables transitions and animations.
- **Focus and fields:** Buttons, inputs, selects, textareas and disclosure summaries have a 2px focus outline offset by 3px. Fields use the input surface, neutral border, control radius and a 36px minimum height; textarea minimum height is 90px. Placeholders remain fully opaque in muted text. Checkboxes use the primary button color.
- **Navigation and group filters:** Navigation selects a soft fill and accent text. Group filters use solid blue when active and expose counts. Composer tabs use an accent underline. Results switch between UI, plain and JSON through bordered tabs with accent selection.
- **Skill and history cards:** Cards use a panel radius, neutral border and 12px padding. Selected and current cards use a soft fill and accent border. History titles render supplied text verbatim, including hyphens; known workflow labels are humanized by the server. Reopening a saved result does not run a paid request.
- **API plan:** The signature disclosure shows a concise API-step count, with narratives and per-step parameter editors inside. The free estimate action and CU/request estimate remain outside the collapsed narrative. Scope/cost notes have a separate disclosure. Budget warnings remain explicit. Parameter edits can update the planned scope without issuing the research request.
- **Results and data:** Status badges distinguish completion; CU, reserved budget and uncertainty stay visible near result controls. Findings preserve line breaks. Metrics use sortable headers, tabular figures, unavailable labels and address copy actions. CSV/JSON export and source disclosures keep evidence inspectable. Error and coverage warnings use dedicated semantic colors with text.
- **Settings and connection:** Connection status and persistence status sit near the top. Settings expose separate Birdeye and AI provider credentials with masked keys, local storage information and saved-state feedback. Optional code entry uses the compact connection panel. Running work retains progress and Stop controls.
- **Assets:** Brand and action icons are inline SVG. No shipping raster images, generated image provenance or approved visual comp are involved. Fonts and UI assets are bundled locally.

Source-level finish review accepted the fixes for hyphenated history titles, collapsed API narratives and compact mobile rails. The implementation handoff reports typecheck, all 67 tests and build passing. The one source detector scan reported 14 advisories against stale font/radius documentation and no hard findings; its source HTML scan could not load generated `/main.css`. This is limited source evidence, not a rendered visual or accessibility verdict.

## Do's and Don'ts

- Do use semantic theme variables for surfaces, labels, selection and status.
- Do keep CU estimates visible when API-step narratives are collapsed.
- Do keep skills and history accessible as compact disclosures at mobile widths.
- Do preserve explicit unavailable values, source context, tabular numerals and contained scrolling.
- Do retain visible keyboard focus and the reduced-motion override.
- Don't restore orange actions or the previous fixed-sidebar workspace.
- Don't treat missing data or unknown usage as zero.
- Don't add decorative imagery or shadows to this flat console without a new direction.
- Don't describe source inspection or automated checks as screenshot or contrast validation.
