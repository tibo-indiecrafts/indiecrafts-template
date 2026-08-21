# Tools — hybrid platform

Reserved slot for the `tools` kind on the `hybrid` platform — dev/build tooling that isn't a shipped
surface: a component gallery (Storybook for the Electron renderer), a signing/notarization helper, a build
diagnostic. Mirrors `code/projects/web/tools/storybook`.

Tools are **not** in the deploy registry (`code/shared/scripts/lib/apps.mjs`) — they build to a static
host or run locally, outside the deploy pipeline.

**To activate** — drop the tool under `code/projects/hybrid/tools/<name>/` with its own `package.json`
(`@indiecrafts/<name>`); the workspace glob `code/projects/*/{surfaces,services,tools}/*` resolves it, no
`pnpm-workspace.yaml` edit.

Reserved, not empty — **delete this folder** if the platform never needs a tool. See
[`../../_registry.md`](../../_registry.md).
