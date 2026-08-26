import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/**
 * `main.tsx` is the renderer's ReactDOM bootstrap entry — it calls
 * `createRoot(document.getElementById("app")).render(...)` at MODULE scope (a side
 * effect on import, not a component). `!test`: it isn't a renderable component, and
 * importing it for real would mount the whole provider tree (`QueryClientProvider` +
 * `IntlProvider` + `ClerkProvider` + `App`) a second time into whatever element in the
 * Storybook iframe happens to have `id="app"` — well past "story this component in
 * isolation." A local placeholder documents its role instead; the real bootstrap is
 * exercised by `pnpm dev` / the Electron build, not Storybook.
 */
function BootstrapEntryPlaceholder() {
  return (
    <div className="text-muted-foreground p-8 text-sm">
      Renderer bootstrap entry (main.tsx) — not a component, not rendered in
      Storybook. See the doc comment in main.stories.tsx.
    </div>
  );
}

const meta = {
  title: "Hybrid/Bootstrap",
  component: BootstrapEntryPlaceholder,
  tags: ["autodocs", "!test"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof BootstrapEntryPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
