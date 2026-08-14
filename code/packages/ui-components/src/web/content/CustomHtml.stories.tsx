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
