import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, screen, within } from "storybook/test";
import { MadeByCredit } from "./MadeByCredit";

/**
 * Footer "Made with <name>" credit — the name opens a link-preview popover.
 * Exercises the next-intl mock (`footer.creditPrefix` / `footer.previewLabel`).
 */
const meta = {
  title: "Website/Shared/MadeByCredit",
  component: MadeByCredit,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof MadeByCredit>;

export default meta;
type Story = StoryObj<typeof meta>;

/** With a link — opens a preview popover. */
export const WithLink: Story = {
  args: {
    madeBy: {
      name: "Indiecrafts",
      href: "https://indiecrafts.dev",
      title: "Indiecrafts — client sites, shipped fast",
      description: "A config-first template for marketing sites + a blog.",
      domain: "indiecrafts.dev",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /Indiecrafts/ });
    await expect(trigger).toBeVisible();
    await userEvent.click(trigger);
    await expect(await screen.findByText("indiecrafts.dev")).toBeVisible();
  },
};

/** No link → plain text, no popover. */
export const NoLink: Story = {
  args: { madeBy: { name: "Indiecrafts" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Indiecrafts")).toBeVisible();
    await expect(canvas.queryByRole("button")).not.toBeInTheDocument();
  },
};

/** No name → renders nothing. */
export const Empty: Story = {
  args: { madeBy: {} },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.firstElementChild).toBeEmptyDOMElement();
  },
};
