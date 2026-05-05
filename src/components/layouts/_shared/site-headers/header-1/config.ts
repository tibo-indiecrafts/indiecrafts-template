/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * The header's mega-menu structure (which items appear, in which group)
 * lives in `Header.tsx` because each item carries an inline JSX icon.
 * All visible LABELS are translated via `./en.json` under
 * `blocks.header-1.*`. To swap which menu items render, edit the demo
 * arrays in `Header.tsx`; to relabel them, edit `en.json` only.
 */
export const header1Key = "header-1" as const;
export const header1Namespace = "blocks.header-1" as const;
