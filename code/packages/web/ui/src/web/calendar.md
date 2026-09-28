> shadcn `calendar` · `src/user-interface/ui/calendar.tsx`

**Use when** the user picks a date (or range) and calendar context matters — scheduling, filtering, day-of-week decisions. **Don't** use it for a familiar/memorable date like a birthday or expiry — a plain `<input>` (mm/dd/yyyy) with a format hint is faster and more accessible.

## Anatomy

- Header nav: prev / next chevrons (`ghost` `size-(--cell-size)`, Lucide `ChevronLeft/Right`) + caption — either a static month-year label (`captionLayout="label"`) or month/year dropdowns (`captionLayout="dropdown"`, chevron-down).
- Weekday row: single-letter/short headers, `text-muted-foreground text-[0.8rem]`.
- Day grid: one button per day (`CalendarDayButton`, `ghost`, `aspect-square`); outside-month days muted, `today` accent-tinted.
- Optional week-number column (`showWeekNumber`).
- As a **date picker**, mount inside a `Popover` triggered by a `Button` showing the formatted value — Calendar itself is just the grid.

## Variants

Variants are `mode` (selection) + `captionLayout` (navigation), not visual skins. Wrap in a Popover for the picker pattern.

| Variant                    | Use for                                          | Base (Tailwind defaults + tokens)                                |
| -------------------------- | ------------------------------------------------ | ---------------------------------------------------------------- |
| `mode="single"`            | One date — the default                           | selected day `bg-primary text-primary-foreground` (repo `brand`) |
| `mode="range"`             | Start→end span (booking, reporting)              | ends `bg-primary`; middle `bg-accent text-accent-foreground`     |
| `mode="multiple"`          | Several unordered dates (rare)                   | each selected day `bg-primary text-primary-foreground`           |
| `captionLayout="label"`    | Near-term months, arrow-stepping                 | static `text-sm font-medium` caption                             |
| `captionLayout="dropdown"` | Far / arbitrary dates (DOB-in-range, year jumps) | month+year `<select>` in `rounded-md border-input` shell         |
| `numberOfMonths={2}`       | Range picking across month boundaries            | side-by-side months (`md:flex-row`)                              |

## Sizes

Single density axis via the `--cell-size` CSS var (default `--spacing(8)` = 32px). Bump for touch surfaces; don't hand-size individual cells.

| Size    | Cell (`--cell-size`)   | Use                                       |
| ------- | ---------------------- | ----------------------------------------- |
| default | `--spacing(8)` (32px)  | Desktop, inside a popover                 |
| touch   | `--spacing(11)` (44px) | Standalone on mobile — meets ≥40px target |

## States

- **hover** — day: `ghost` hover (`hover:bg-accent hover:text-accent-foreground`).
- **focus-visible** — day: `border-ring ring-ring/50 ring-[3px]` (driven by `group-data-[focused=true]/day`); dropdown shell: `has-focus:ring-ring/50 ring-[3px]`. Keyboard focus follows arrow keys — never remove it.
- **selected** — single: `data-[selected-single=true]:bg-primary text-primary-foreground`; range start/end: `bg-primary`; range middle: `bg-accent`.
- **today** — `bg-accent text-accent-foreground rounded-md` (drops to square when also selected). Reinforce with more than tint if it must be unmistakable.
- **disabled** — out-of-range days: `text-muted-foreground opacity-50` via the `disabled` prop; not clickable.
- **outside** — other-month days: `text-muted-foreground` (hidden entirely with `showOutsideDays={false}`).
- No `loading` or `error` on the grid — validation and the "select a valid date" message live on the input field that owns the Calendar, not here.

## Hierarchy

One calendar per picker; it lives inside an `overlay`-elevation Popover, not inline on the page (except a dedicated scheduling view). It is the detail surface below its trigger Button — never two open at once.

## Restrictions

- Never build the trigger with `next/link` or `next-intl/navigation`, or hard-code month/weekday strings — locale/format comes from `react-day-picker` + the active locale, labels from `messages/<locale>.json`.
- Never signal `today` or `selected` by color alone — today keeps its ring/box, selected changes shape and contrast, not just hue (WCAG + repo rule).
- Never drop keyboard support or the focus ring — arrow-key day navigation and `focus-visible:ring-ring` are required; the Radix/day-picker roving focus already handles it, so don't override `onKeyDown`.
- Never use the calendar as the _only_ way to enter a date — pair the popover with a typeable input for memorable dates.
- Never edit `src/user-interface/ui/calendar.tsx` for one screen's tweak — pass `classNames`/`components` props or `--cell-size`; the file is CLI-managed.
- Never hard-code selected/range colors — use the `primary`/`accent` token roles already wired; a new role goes in `DESIGN.md`.
- Never auto-submit the form on selection — disruptive for screen-reader users; let the user confirm.

## Tokens

- **Color:** `bg-background` surface, `text-foreground`, `text-muted-foreground` (weekdays/outside/disabled), `border-border`/`border-input`; selected & range-ends `bg-primary`/`text-primary-foreground` (brand), range-middle & today `bg-accent`/`text-accent-foreground`. All theme-flipping — no `dark:` forks.
- **Radius:** `rounded-md` (0.5rem default) on days, today, dropdown shell; range middle `rounded-none`, ends round the outer edge only.
- **Elevation:** grid itself flat; the enclosing Popover carries `overlay` (`shadow-lg`).
- **Type:** caption `text-sm font-medium` (title role); weekday/week-number `text-[0.8rem]` (caption); day number `text-sm font-normal`.
- **Focus:** `focus-visible:ring-ring/50 ring-[3px] focus-visible:outline-none` on day buttons, dropdowns, and nav — always present.
- **Motion:** none on the grid; the Popover open/close animates ≤240ms ease-out (guard with `motion-reduce:`). Icons: Lucide chevrons `size-4`, `aria-hidden`.

Sources:

- [Carbon Design System — Date picker usage](https://carbondesignsystem.com/components/date-picker/usage/)
- [U.S. Web Design System — Date picker](https://designsystem.digital.gov/components/date-picker/)
- [PatternFly — Date picker design guidelines](https://www.patternfly.org/components/date-and-time/date-picker/design-guidelines/)
- [shadcn/ui — Calendar](https://ui.shadcn.com/docs/components/calendar)
