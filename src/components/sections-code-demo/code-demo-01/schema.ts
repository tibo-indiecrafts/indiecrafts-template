/**
 * Tailark Pro `code-demo-01` — minimal section that wraps the
 * `CodeTabs` molecule (4-language interactive code preview) inside
 * a centered container with decorative dashed cross-frame borders.
 * Pure layout — no per-cell content, all copy lives in the
 * `CodeTabs` molecule (see `ui-molecules/code/code-tabs/`).
 *
 * No translatable strings; the molecule is presentational and
 * ships hardcoded code samples. The `id` is purely structural for
 * `aria-labelledby` and section anchoring.
 */
export type CodeDemoBlock = {
  type: "code-demo-01";
  id: string;
};
