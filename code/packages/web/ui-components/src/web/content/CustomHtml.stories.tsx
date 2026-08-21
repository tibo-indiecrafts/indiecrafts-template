import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CustomHtml } from "./CustomHtml";
import docs from "./CustomHtml.md?raw";

const meta = {
  title: "UI Components/CustomHtml",
  component: CustomHtml,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: docs } },
  },
  args: {
    _type: "module.custom-html",
    html: '<div style="padding:1rem;border:1px dashed var(--border);border-radius:8px"><strong>Raw HTML</strong> embedded from the CMS.</div>',
  },
} satisfies Meta<typeof CustomHtml>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A custom (e.g. third-party provider) newsletter form pasted as raw HTML — styles its own controls. */
const FORM_HTML = `<form style="display:flex;gap:.5rem;flex-wrap:wrap;max-width:32rem;margin-inline:auto">
  <input type="email" placeholder="you@example.com" aria-label="Email" style="flex:1;min-width:14rem;padding:.6rem .8rem;border:1px solid var(--border);border-radius:8px;background:var(--background);color:var(--foreground)" />
  <button type="submit" style="padding:.6rem 1.1rem;border:0;border-radius:8px;background:var(--primary);color:var(--primary-foreground);font-weight:600">Subscribe</button>
</form>`;

/** Contained (default) — the form sits at the same width as the other blocks, with a gutter. */
export const CustomForm: Story = {
  args: { html: FORM_HTML, width: "contained" },
};

/** Full width — spans the viewport but keeps a gutter, so the form never touches the screen edges. */
export const CustomFormFullWidth: Story = {
  args: { html: FORM_HTML, width: "full" },
};
