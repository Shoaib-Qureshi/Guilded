# Design System

Source: Figma file `Guilded` (`0X6HKqvG6Ufd1E9lzqVyTq`), page **"Design system"** (node `362:2195`). Tokens below were pulled directly via Figma's `get_design_context` on the Color Scheme (`399:2201`) and type-scale (`399:2366`) nodes — not hand-copied off a screenshot. This supersedes shadcn/ui's default theme; `components.json` and the Tailwind theme need re-tokenizing to these values when implementation starts.

## Colors

| Token | Hex | Usage |
|---|---|---|
| Primary Brand — Gold | `#A36F26` | CTAs / focused-active states |
| Secondary Brand — Green (headers) | `#0F2621` | Headers |
| Secondary Brand — Green (body) | `#394817` | Body |
| Tertiary Brand — Sand | `#D6CCB3` | Backgrounds |
| Dark mode portal background | `rgb(42,42,42)` base + subtle gradient overlay | app shell background in dark mode |
| Dark mode Guilded gold | `#C89B3C` | brighter gold variant for dark surfaces |
| Dark mode text | `#E8E3D9` | text on dark surfaces |
| Dark mode card | `#1A1A1A` | card/surface background |
| Flamingo | `#ED4B9E` | accent (seen in color-shade bars) |
| Indigo | `#0E0E2C` | heading text on light surfaces |
| Accent | `#ECF1F4` | |
| Light | `#FAFCFE` | |
| Text/Body | `#4A4A68` | body text on light surfaces |

**Known inconsistency in the source file, flagged rather than silently fixed**: a second dark swatch (`#2A2A2A`) is also labeled "Dark mode Guilded gold" in Figma but is a dark gray, not gold — looks like a copy-paste label error. Confirm with whoever owns the Figma file before treating it as a real token.

## Typography

Font family **Chivo** throughout (SemiBold for headings; Regular/Medium/SemiBold weights for body), plus **Geist Mono** for the monospaced token.

| Token | Size | Weight | Tracking |
|---|---|---|---|
| Heading 1 | 48px | 600 | -1.5px |
| Heading 2 | 30px | 600 | -1px |
| Heading 3 | 24px | 600 | -1px |
| Heading 4 | 20px | 600 | 0px |
| Paragraph large | 18px | 400 / 500 / 600 | 0px |
| Paragraph regular | 16px | 400 / 500 / 600 | 0px |
| Paragraph small | 14px | 400 / 500 | 0px |
| Paragraph mini | 12px | 400 / 500 / 600 | 0px |
| Caption | 14px, uppercase | 400 | 1.5px |
| Monospaced (Geist Mono) | 16px | 400 | 0px |

Foreground colors: `#0a0a0a` for headings, `#404040` for paragraph text on light surfaces (separate from the dark-mode text color above, which applies to dark surfaces).

## Components (design-system page, for later per-component `get_design_context` pulls)

| Component | Figma node id |
|---|---|
| Color Scheme | `399:2201` |
| Type scale (Content) | `399:2366` |
| Accordion Trigger | `400:2202` |
| Dialog box | `404:4739` |
| Sidebar | `422:3065` |
| Component (misc) | `405:5032` |
| Buttons | `408:5428` |
| Alert | `408:5429` |
| Badges | `408:5430` |
| Checkboxes | `408:5431` |
| Command (palette) | `408:5432` |

Buttons ship as a 5-size × 4-state system: sizes Default/Small/Mid/Large/Extra-large, states Normal/Secondary/Disabled/Destructive (red). Pull exact padding/radius/border values per size via `get_design_context` on `408:5428` when building the shadcn `Button` variant map — not duplicated here since it's faster to re-pull than to keep two copies in sync.

## Overall direction

Dark-mode-first UI (confirmed visually on both the Moderator dashboard and applicant-view screens — see `figma-screen-map.md`): dark card/background surfaces, warm off-white text, gold as the primary accent/CTA color, red reserved for destructive actions and rejection states.
