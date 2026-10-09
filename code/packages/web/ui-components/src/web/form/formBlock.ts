/**
 * The server-side gate + prop clean-up every form block wrapper shares.
 *
 * @see docs/reference/packages/web/ui-components/src/web/form/formBlock.md
 */
import { blockFeatures, type BlockFeatures } from "../features";

/**
 * A form block's props for its client form, or `null` when the block must not render: the
 * app's code flag (`configureBlocks`) is off, or the Studio switch (`enabled`, projected by
 * `MODULES_FRAGMENT`) is `false`. Drops what a client form can't or needn't receive: the
 * `components` render-function map and `inline` flag `renderBlock` injects (functions can't
 * be serialized to a client child), and `enabled` itself.
 */
export function formBlock<T extends { enabled?: boolean }>(
  feature: keyof BlockFeatures,
  props: T,
): Omit<T, "enabled"> | null {
  if (!blockFeatures()[feature] || props.enabled === false) return null;
  const { components, inline, enabled, ...rest } = props as T & {
    components?: unknown;
    inline?: boolean;
  };
  void components;
  void inline;
  void enabled;
  // `components`/`inline` are runtime extras, not part of `T`: dropping them leaves `T`'s keys.
  return rest as Omit<T, "enabled">;
}
