# Tools — mobile platform

Reserved slot for the `tools` kind on the `mobile` platform — dev/build tooling that isn't a shipped
surface: a component gallery (a Storybook-native / Expo-preview), a Detox e2e harness, an EAS/config helper.
Mirrors `code/projects/web/tools/storybook`.

Tools are **not** in the deploy registry (`code/shared/scripts/lib/apps.mjs`) — they build to a static
host or run locally, outside the deploy pipeline.

**To activate** — drop the tool under `code/projects/mobile/tools/<name>/` with its own `package.json`
(`@indiecrafts/<name>`); the workspace glob `code/projects/*/{surfaces,services,tools}/*` resolves it, no
`pnpm-workspace.yaml` edit.

Reserved, not empty — **delete this folder** if the platform never needs a tool. See
[`../../_registry.md`](../../_registry.md).
