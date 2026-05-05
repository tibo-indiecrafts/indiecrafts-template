/**
 * Block from `@blocks-so/dialog-11` — initialize-new-project modal:
 * left-side info column + right-side stepped Select form (framework /
 * package manager / linter / testing). Option labels resolve through
 * `blocks.dialog-11.options.<group>.<value>`; the keys + defaults are
 * declared inline in the block to keep the schema simple.
 */
export type DialogBlock = {
  type: "dialog-11";
  id: string;
  defaultOpen?: boolean;
};
