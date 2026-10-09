import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, within } from "storybook/test";
import en from "../../../../messages/en.json";
import { MadeByCredit } from "./MadeByCredit";

/**
 * Footer maker credit: "Made with <name>". With a link, the name opens a link-preview
 * popover (tap-friendly). The data is Sanity `siteSettings.madeBy`, passed in.
 */
const meta = {
  title: "Layout/MadeByCredit",
  component: MadeByCredit,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    madeBy: {
      name: "Northwind Studio",
      href: "https://northwind.example",
      title: "Northwind Studio — websites for small teams",
      description: "Design and build for marketing sites and blogs.",
      domain: "northwind.example",
    },
  },
} satisfies Meta<typeof MadeByCredit>;

export default meta;
type Story = StoryObj<typeof meta>;

/** With a link — tapping the name opens the preview card. */
export const WithLink: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Northwind Studio/ }));
    await expect(await screen.findByText("northwind.example")).toBeVisible();
  },
};

/** No link → the name as plain text, no popover. */
export const NoLink: Story = {
  args: { madeBy: { name: "Northwind Studio" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Northwind Studio")).toBeVisible();
    await expect(canvas.queryByRole("button")).toBeNull();
  },
};

/** No name → renders nothing. */
export const Empty: Story = {
  args: { madeBy: {} },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText(en.footer.creditPrefix, { exact: false })).toBeNull();
  },
};
