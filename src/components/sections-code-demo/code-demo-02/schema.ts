/**
 * Tailark Pro `code-demo-02` — minimal section that wraps the
 * `CodeBookmarks` molecule (JSON file viewer with avatar bookmarks)
 * inside the same centered container with decorative dashed
 * cross-frame borders as `code-demo-01`. Pure layout — all copy and
 * navigation live in the molecule.
 *
 * No translatable strings; the molecule is presentational and ships
 * hardcoded JSON. The `id` is purely structural.
 */
export type CodeDemoBlock = {
  type: "code-demo-02";
  id: string;
};
