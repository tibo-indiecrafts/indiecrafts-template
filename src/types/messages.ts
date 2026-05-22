import type globalEn from "../../messages/en.json";

/**
 * `MessageKey` — dotted paths into the runtime message tree.
 *
 * The known paths are derived from `messages/en.json` (the single source of
 * truth). The `(string & {})` fallback keeps autocomplete biased toward known
 * keys while accepting any string — needed because the /components library
 * ships example configs with their own `blocks.<name>-NN.*` paths that are
 * only resolved by Storybook's per-block message map, not by the production
 * runtime tree. Production app code is encouraged to use known paths so
 * autocomplete catches typos in route configs and section mountings.
 */
type DotPath<T, Depth extends number[] = []> = Depth["length"] extends 8
  ? never
  : T extends Record<string, unknown>
    ? {
        [K in keyof T & string]: K | `${K}.${DotPath<T[K], [...Depth, 1]>}`;
      }[keyof T & string]
    : never;

export type MessageKey = DotPath<typeof globalEn> | (string & {});
