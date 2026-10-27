# FitConnect Design System and UI Specification (design.md)

Version: 1.1.0
Status: Canonical product design system

---

## 1. Principles

1. **Utility over ornament.** Gym owners work in short time windows. Every element must help orientation, clarity, or action. No decorative effects.
2. **Predictable geometry.** Disciplined grids, 6px panels, 4px controls, 1px borders. Boundaries come from borders, not shadows.
3. **Legible data.** Sets, reps, weights, calories, dates, and phone numbers are always set in tabular monospace figures.
4. **Resilient white-labeling.** A gym's color changes only brand tokens. Contrast is checked by calculation, never assumed. Status and structure never change.
5. **Direct language.** Short, imperative, honest. No hype, invented numbers, or filler.

---

## 2. Color tokens

Default brand: deep pine green (`#1E3F20`). It signals stability and discipline without gym-neon cliches.

All tokens are exposed as RGB-triplet CSS variables (for example `--primary: 30 63 32`) and consumed as `rgb(var(--primary) / <alpha-value>)`. Components never use raw hex or palette names.

### Brand and neutral tokens

| Token | Light | Dark | Role | Contrast (pair) |
| :--- | :--- | :--- | :--- | :--- |
| `primary` | `#1E3F20` | `#6FB873` | Primary fill, active indicator | ~11.3:1 on canvas (light), ~7.4:1 on surface (dark) |
| `primary-hover` | `#152C16` | `#8AD08E` | Hover fill | ~14:1 with `on-primary` (light) |
| `primary-soft` | `#E8EFE9` | `#142918` | Selected row, active nav fill | Fill only, no text contrast needed |
| `primary-ink` | `#163018` | `#A5DCA8` | Text and icons on surface or `primary-soft`, focus ring | ~11:1 on `primary-soft` (light), ~11:1 on surface (dark) |
| `on-primary` | `#FFFFFF` | `#0A1B0E` | Text on solid `primary` | ~11.7:1 (light), ~7.4:1 (dark) |
| `background` | `#FBFBFA` | `#121312` | Page canvas | Baseline |
| `surface` | `#FFFFFF` | `#181A18` | Cards, panels, modals, menus | Baseline |
| `surface-alt` | `#F4F4F1` | `#212321` | Table headers, secondary fills | Baseline |
| `ink` | `#1A1B19` | `#F2F3F0` | Headings, body text | ~16:1 on canvas (light) |
| `ink-soft` | `#585A55` | `#A2A59E` | Secondary text, descriptions, icons | ~6.7:1 on canvas, ~6.3:1 on `surface-alt` (light) |
| `ink-faint` | `#6B6E66` | `#8E918A` | Placeholders, inactive breadcrumbs | ~5:1 on canvas (light), ~5.8:1 on dark canvas |
| `line` | `#E2E3DE` | `#2D302C` | 1px borders and dividers | Structural, not text |

### Fixed status tokens (never overridden by gym themes)

Each status has three tokens: fill (dots, icons, error borders), soft (background), and text.

| State | Fill | Soft | Text | Text on soft (light) | Used for |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Success | `#1B5E20` | `#E8F5E9` | `#1B5E20` | ~7:1 | Active member, approved request |
| Warning | `#B45309` | `#FEF3C7` | `#92400E` | ~6.4:1 | Pending request, payment pending |
| Danger | `#B91C1C` | `#FEE2E2` | `#991B1B` | ~6.8:1 | Rejected request, suspended member, errors |
| Info | `#1D4ED8` | `#EFF6FF` | `#1E40AF` | ~8:1 | Starter plan badge, guidance |

Dark mode status values (each text on soft must reach at least 4.5:1, verify before release):

| State | Fill | Soft | Text |
| :--- | :--- | :--- | :--- |
| Success | `#3FA55B` | `#10281A` | `#86D79A` |
| Warning | `#D99A2B` | `#2E2208` | `#F2C26B` |
| Danger | `#E5484D` | `#301414` | `#F59E9E` |
| Info | `#4C8DF0` | `#0F1D33` | `#93B8F5` |

Rule: brand color is for actions, selection, and focus. Status colors are for status only. A gym with a red brand must never make "Rejected" look like its brand.

---

## 3. Typography

- **UI and headings:** `Plus Jakarta Sans`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`. Clear letterforms and a tall x-height, with no tech-startup flavor.
- **Figures and data:** `JetBrains Mono`, `ui-monospace`, `SFMono-Regular`, `monospace`, with `font-variant-numeric: tabular-nums`.

| Level | Size | Weight | Line height | Tracking | Family | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Display | 48px desktop, 32px mobile | 600 | 1.15 | -0.025em | Sans | Landing hero only, max 3 lines |
| H1 | 32px | 600 | 1.2 | -0.02em | Sans | Page titles |
| H2 | 24px | 600 | 1.25 | -0.015em | Sans | Section titles, modal titles |
| H3 | 18px | 600 | 1.3 | -0.01em | Sans | Subsections |
| H4 | 15px | 600 | 1.35 | 0 | Sans | Panel titles |
| Body | 16px | 400 | 1.5 | 0 | Sans | Paragraphs |
| Body medium | 14px | 500 | 1.4 | 0 | Sans | Controls, nav links |
| Small | 13px | 400 | 1.4 | 0 | Sans | Metadata, helper text |
| Caption | 11px | 500 | 1.3 | +0.02em | Sans | Badges, table headers |
| Mono figure | 13px or 14px | 500 | 1.2 | 0 | Mono | Sets, reps, kg, kcal, dates |

---

## 4. Spacing, radius, borders, elevation, grid

### 4px grid
`space-1` 4px, `space-2` 8px, `space-3` 12px, `space-4` 16px, `space-6` 24px, `space-8` 32px, `space-12` 48px, `space-16` 64px, `space-24` 96px.

- Gap between panels: 24px. Padding inside panels: 16px dense, 24px standard. Gap between related controls: 8px.
- Landing section spacing: 64px mobile, 96px desktop.

### Radius
- Panels, cards, modals: 6px.
- Buttons, inputs, selects, badges: 4px.
- Avatar initials: 4px square.
- Exception: radio buttons are circular. Nothing else is round, and nothing exceeds 6px.

### Borders and elevation
- Every surface boundary is `1px solid var(--line)`.
- Shadow is allowed only on floating overlays (menus, modals, toasts): `0 4px 12px rgb(0 0 0 / 0.08)`. In dark mode, overlays also keep a `line` border so they stay distinct.
- No shadows on cards, buttons, or inline panels.

### Breakpoints
Mobile 360 to 767px. Tablet 768 to 1279px. Desktop 1280 to 1439px. Wide 1440px and up.

---

## 5. Layout

### Container widths
- Public pages: max 1200px, 24px gutter desktop, 16px mobile.
- Owner dashboard: max 1440px, sticky 240px left sidebar.
- Member portal: max 960px, centered, top navigation.

```
OWNER DASHBOARD (desktop)
+--------------------+--------------------------------------------------+
| GYM LOGO / NAME    | HEADER: Gym name | Role | Sign out               |
| [Sidebar 240px]    +--------------------------------------------------+
| Operations         | BREADCRUMBS: Home / Join requests                |
|  - Overview        +--------------------------------------------------+
|  - Members         | MAIN: [Filter bar] [Primary action]              |
|  - Join requests   |       [Table / Form / Grid]                      |
| Configuration      |                                                  |
|  - Gym profile     |                                                  |
|  - Branding        |                                                  |
+--------------------+--------------------------------------------------+

MEMBER PORTAL
+-----------------------------------------------------------------------+
| [LOGO: Gym name]       Today | Workouts | Diet | Account              |
+-----------------------------------------------------------------------+
| Member name | Status badge | Plan name                                |
+-----------------------------------------------------------------------+
| TODAY'S WORKOUT (table)            | TODAY'S DIET (macro summary)     |
+-----------------------------------------------------------------------+
```

### Mobile
- Owner sidebar becomes an off-canvas drawer opened from a menu button at top left. Focus is trapped in the drawer while open.
- Member portal uses a sticky bottom tab bar (Today, Workouts, Diet, Account), 48px targets.
- Tables scroll horizontally inside their panel, or collapse to stacked key-value rows below 640px.

---

## 6. Navigation

1. **Public top bar.** Left: text wordmark "FitConnect" (18px, 600). Center: How it works, What you manage, Your gym your look, Demo. Right: "Sign in" text link, then primary button "Book a 5-Min Demo". Mobile: 56px bar with wordmark and a labelled menu button.
2. **Owner sidebar.**
   - Operations: Overview, Members, Join requests (with a count badge).
   - Configuration: Gym profile, Branding.
   - Active item: `primary-soft` background, `primary-ink` text, 3px left indicator in `primary`.
3. **Placement.** The back action sits at the top left above the H1. The primary page action sits at the top right of the page header, or in a sticky bottom action bar on mobile forms.
4. **Breadcrumbs.** Shown on owner pages two levels deep or more. The current page is plain text, not a link.
5. **Skip link.** "Skip to content" is the first focusable element on every page.

---

## 7. Components

Every component defines these states: default, hover, focus-visible, disabled, loading, error.

### Buttons
- **Primary:** `primary` fill, `on-primary` text. Hover: `primary-hover`. If `primary` has less than 3:1 contrast with the surface, add a 1px `primary-ink` border (see section 9).
- **Secondary:** `surface` fill, `ink` text, 1px `line` border. Hover: `surface-alt`.
- **Ghost:** transparent, `ink-soft` text. Hover: `surface-alt` fill, `ink` text.
- **Destructive:** `surface` fill, `danger-text` text, 1px `danger-text` border. Hover: `danger-soft` fill.
- **Sizes:** compact 32px for table toolbars and rows, standard 40px for forms, 44px on touch viewports.
- **Loading:** keeps its dimensions, label dimmed, 16px spinner, `aria-busy="true"`, clicks disabled so a double click cannot fire twice.
- **Disabled:** `ink-faint` text on `surface-alt`, `cursor: not-allowed`.

### Inputs, selects, textareas
- Height 36px desktop, 44px touch. 1px `line` border, 4px radius, `surface` fill.
- Focus: `primary-ink` border plus 2px outline in `primary-ink`, 1px offset.
- Error: `danger-fill` border, message below in 13px `danger-text` with an error icon, linked via `aria-describedby`.
- Numeric fields (sets, reps, weight, calories) use the mono family.
- Labels sit above fields. Required fields are marked with the text "(required)". Optional fields are unmarked.

### Checkbox, radio, segmented tabs
- Checkbox: 16px square, 2px radius. Radio: 16px circle.
- Unselected: 1px `ink` border. Selected: `primary` fill with an icon check in `on-primary`.
- Segmented tabs: selected tab uses `primary-soft` fill and `primary-ink` text. Counts are shown in mono.

### Badges
- 4px radius, 11px uppercase, containing a 6px square dot and a text label. Color is never the only signal.
- Success, warning, danger use their status tokens. Neutral uses `surface-alt`, `ink-soft`, and an `ink-faint` dot.
- Mapping: pending = warning, approved = success, rejected = danger, active = success, inactive = neutral, suspended = danger, starter plan = info, payment pending = warning.

### Data tables
- Header: `surface-alt` fill, 11px uppercase, `ink-soft`, real `th` cells.
- Rows 40px compact, 48px standard. 1px `line` horizontal dividers. Hover: faint tint.
- Numeric columns right-aligned in mono. Long text truncates with a title tooltip.
- Footer: "Showing X of Y" and Previous and Next buttons with "Page X of Y".

### Panels and cards
- `surface` fill, 1px `line` border, 6px radius, no shadow.
- Header row with title, description, and an optional right-aligned action, separated from the body by a hairline.

### Stat tile
- Label (small), value (mono, 24px, 600), one-line subtitle, optional status badge, optional 4px progress bar with square ends.
- Tiles that navigate are links with a chevron icon and a hover border.

### Modals and confirmations
- 40% scrim, `surface` container, 1px `line` border, 6px radius, max width 460px, overlay shadow.
- Focus is trapped, Escape closes, and focus returns to the trigger on close.
- Footer: Cancel (secondary) on the left of the confirm button, both right-aligned. Destructive confirmations name the object ("Reject request from Member name?"). Never use browser alerts or confirms.

### Toasts
- Bottom right on desktop, top on mobile. 6px radius, `surface` fill, 1px `line` border, status icon, plain text, a close button, and `role="status"`. Auto-dismiss after 5 seconds, except errors, which stay until closed.

### Empty, loading, and error states
- **Empty:** icon, one-line title, one sentence of explanation, and the next action as a button.
- **Loading:** flat `surface-alt` blocks matching the final layout size. No shimmer sweep.
- **Error:** inline in the panel, error icon, plain message, and a "Retry" button. A failed figure shows "Unavailable", never 0.
- Each panel owns its own state. One failed request never replaces the whole page.

### Pagination
- "Page X of Y", Previous and Next buttons, disabled at the ends. Counts come from the server total.

---

## 8. Product patterns

### 1. Join request row
- Fields: Member name, Requested date, then the actions.
- **Quick approve** (primary, 32px): approves and creates a starter plan in one step.
- **Set up plan** (secondary, 32px): opens the full member setup form.
- **Reject** (destructive, 32px): opens a confirmation modal.
- States: pending, approved, rejected. Each button has its own loading state. After the first click all three buttons disable.
- Success toast: "Member name approved with a starter plan." Error toast: "Could not approve this request. Try again."
- A row that is already approved shows a status badge and a "View member" link in place of the buttons.

### 2. Weekly workout routine editor
- Six day tabs: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday. A day with no exercises shows "No exercises on this day".
- Exercise row: exercise name (from the catalog), muscle group tag, sets, reps, weight (kg), duration, rest between sets (seconds), notes, delete button.
- "Add exercise" secondary button below the table. "Save routine" is the primary action.

### 3. Diet plan editor
- Meal sections: Breakfast, Lunch, Dinner, Snack.
- Item row: item name, quantity, calories (kcal), protein (g), carbs (g), fat (g).
- Sticky summary bar: day totals for calories, protein, carbs, and fat in mono figures.

### 4. Measurements entry and history
- Fields: date, weight (kg), height (cm), chest, waist, hips, biceps, thighs (cm), body fat (%), BMI.
- BMI is calculated from weight and height when both are present and can be overridden.
- History table: newest first, mono figures, change from the previous entry shown per column.

### 5. Member status control
- Segmented control: Active, Inactive, Suspended. Choosing Inactive or Suspended opens a confirmation modal that names the member and the effect.

### 6. Gym card (directory)
- Gym name, city, amenity list, operating hours, and a "Request to join" primary button. States: default, request pending (disabled with a badge), already a member.

### 7. Plan card
- Plan name, duration (Monthly, Quarterly, Annual), price in mono with the rupee sign. Used inside owner setup and gym detail views.

### 8. Multi-step form
- Stepper at the top with step number, label, and state (current, done, upcoming). Progress is shown as "Step X of Y".
- Footer actions: Back (secondary) on the left, "Save and continue" (primary) on the right. Validation messages appear under each field and as a summary at the top that receives focus on a failed submit.
- Steps for member setup: Membership plan, Health information, Body measurements, Workout routine, Diet plan. Any step can be skipped and finished later.

### 9. Empty plan states
- **Owner view:** "No workout plan yet" with an "Add workout plan" button, and "No diet plan yet" with an "Add diet plan" button.
- **Member view:** "Your gym has not added a workout plan yet" and "Your gym has not added a diet plan yet". No action button.

---

## 9. Gym theming engine (white-label)

Each gym stores one hex color (`themeColor`). A null value means the default theme. Only brand tokens are derived: `primary`, `primary-hover`, `primary-soft`, `primary-ink`, `on-primary`. Status and neutral tokens never change.

Use WCAG relative luminance with linearized sRGB values:
`c = channel / 255`, then `c_lin = c / 12.92` if `c <= 0.04045`, otherwise `((c + 0.055) / 1.055) ^ 2.4`.
`L = 0.2126 R_lin + 0.7152 G_lin + 0.0722 B_lin`.
Contrast ratio = `(L_light + 0.05) / (L_dark + 0.05)`.

**Rules**

1. **`primary`** is the seed color, unchanged. It is used for fills, indicators, and the logo accent.
2. **`on-primary`**: calculate the contrast of `#FFFFFF` and of `#1A1B19` against `primary`. Use whichever is higher. The better of the two always reaches at least 4.5:1. Do not use a luminance threshold.
3. **`primary-ink`** (text and icons on surface and `primary-soft`): start from `primary`. In light mode, reduce HSL lightness in 2% steps until contrast is at least 4.5:1 against both `surface` and `primary-soft`. In dark mode, raise lightness the same way against the dark surface.
4. **`primary-hover`**: in light mode, 10% lower HSL lightness. In dark mode, 8% higher. Re-run rule 2 for the hover fill.
5. **`primary-soft`**: 92% `surface` mixed with 8% `primary`.
6. **Fill visibility.** If `primary` has less than 3:1 contrast with `surface`, solid buttons and selected indicators get a 1px `primary-ink` border.
7. **Focus ring** always uses `primary-ink`, never `primary`, so the ring stays visible for light brand colors.
8. **Reject** a seed that is nearly white (relative luminance above 0.85), nearly black (below 0.02), or nearly grey (HSL saturation below 8%). Show the message "Choose a color with more contrast" and keep the saved value unchanged.
9. **Dark mode:** `primary` stays the seed if it reaches 3:1 against the dark surface, otherwise raise its lightness until it does. `on-primary` is recalculated by rule 2.

**Test seeds (each must pass in light and dark mode)**

| Seed | Expected result |
| :--- | :--- |
| Default pine `#1E3F20` | White `on-primary`, no border needed |
| Dark maroon (for example `#7B1E3A`) | White `on-primary`, no border needed |
| Mid green (for example `#2E9E5B`) | Dark `on-primary` (white would reach only about 3.4:1) |
| Light yellow (for example `#FACC15`) | Dark `on-primary`, 1px `primary-ink` border on fills, darkened `primary-ink` for text and focus ring |

Show the dashboard header, a primary button, a selected sidebar item, and a badge row for each test seed.

---

## 10. Header and branding patterns

### Header
- Gym logo image: max height 32px, fixed-size box, `alt` text set to the gym name.
- Fallback: when `gymLogo` is empty or fails to load, show the gym name as a text wordmark. Users without a gym show "FitConnect".
- Mobile: logo or wordmark at left, menu button at right. The gym name truncates with an ellipsis.
- The logo never changes the layout height.

### Branding settings form (owner)
- Fields: Logo URL (https only) and Theme color (hex input plus a color swatch).
- Live preview panel: header with the logo, a primary button, a selected nav item, and a badge, all rendered from the derived tokens.
- Contrast notes shown as text, for example "Button text is dark for readability" or "This color was rejected: too light".
- Actions: "Save branding" (primary), "Reset to default" (secondary, with confirmation).
- Validation: invalid hex or non-https logo shows an inline error. A logo that cannot be loaded shows a warning and the text fallback in the preview.

---

## 11. Forms

- Labels above fields. Helper text below the label in `ink-soft`. Error text replaces helper text.
- Single column on mobile. On desktop, related short fields (sets, reps, weight) share a row.
- Input widths match the expected content: short for numbers and dates, full width for names and notes.
- Long forms use the multi-step pattern (section 8) and show unsaved-changes protection when leaving.
- Destructive actions always use a confirmation modal.
- Submit buttons show the loading state and ignore repeated clicks.

---

## 12. Content standards

- **Tone:** practical, peer-level, concise.
- **Casing:** sentence case for headings, buttons, labels, and table columns. Capitalize only proper names and acronyms.
- **Numbers:** Indian digit grouping (`1,20,000`) for currency with the rupee sign, plain decimals for others (`140 kg`, `2,400 kcal`).
- **Dates:** `DD Mon YYYY` (for example `14 Oct 2026`). Times in 24-hour format.
- **Placeholders in mockups:** "Member name", "Exercise name", "Gym name", "Value", "0000". No realistic names or numbers.
- **Banned:** em dashes, exclamation marks, and the words revolutionize, supercharge, next-gen, transform, seamless, game-changer, elevate.
- **Icons:** one Lucide-style line set (16px in rows, 20px in tiles). No emoji and no typed glyphs (check marks, crosses, arrows).

---

## 13. Accessibility (WCAG 2.1 AA)

- **Focus:** 2px solid ring in `primary-ink`, 2px offset, on every interactive element via `:focus-visible`.
- **Touch targets:** at least 44 by 44px on touch viewports.
- **Color independence:** every status pairs color with a text label, and errors also use an icon.
- **Keyboard:** logical tab order, skip link, focus trap in modals and drawers, arrow-key navigation in tab lists.
- **Announcements:** form errors use `aria-live`, toasts use `role="status"`, and icon-only buttons have text labels for screen readers.
- **Contrast:** every text and icon pairing is at least 4.5:1, and every UI boundary at least 3:1 (large text 3:1).
- **Tables:** real `th` cells with `scope`.

---

## 14. Motion

- State transitions (hover, focus, open, close): 120 to 180ms ease-out.
- Section reveal on the landing page: opacity 0 to 1 and 12px upward shift over 300ms, once per section, using `IntersectionObserver`. Content stays fully visible if scripting fails.
- `prefers-reduced-motion: reduce` disables all transforms and shows content immediately.
- Banned: parallax, looping or pulsing animation, counters, autoplay carousels, intro screens, cursor effects, and scroll-driven or pinned effects.

---

## 15. Dos and don'ts

**Do**
- Use named tokens only.
- Keep one primary action per view.
- Show totals from the server and an explicit empty, loading, and error state for every panel.
- Use links for navigation and buttons for actions.

**Don't**
- No gradients, glow, glass, blur, or decorative shapes.
- No pill-shaped buttons or chips.
- No shadows on inline cards.
- No raw hex or palette names in markup.
- No fake reviews, metrics, customer counts, or stock imagery.
- No "made with" or generator badges.
- No browser dialogs.
- No claims about payments, notifications, mobile apps, attendance, trainer accounts, analytics, or integrations.