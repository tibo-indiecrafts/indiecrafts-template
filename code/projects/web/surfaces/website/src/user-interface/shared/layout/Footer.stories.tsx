import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import en from "../../../../messages/en.json";
import { Footer } from "./Footer";

/**
 * Production site footer: logo + tagline, social follow block, the Sanity `navigation`
 * footer columns, copyright, the CCPA "Do Not Sell" link (opt-out regions only), and the
 * maker credit.
 */
const meta = {
  title: "Layout/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    name: "Northwind Studio",
    tagline: "Websites for small teams.",
    company: "Northwind Studio SARL",
    social: {
      linkedin: "https://www.linkedin.com/company/northwind",
      github: "https://github.com/northwind",
    },
    columns: [
      {
        title: "Studio",
        links: [
          { kind: "internal", href: "/blog", label: "Journal", newTab: false },
          {
            kind: "external",
            href: "https://northwind.example/work",
            label: "Work",
            newTab: true,
          },
        ],
      },
      {
        title: "Legal",
        links: [{ kind: "internal", href: "/privacy", label: "Privacy", newTab: false }],
      },
    ],
    madeBy: { name: "Northwind Studio" },
    showDoNotSell: false,
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Full footer. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Websites for small teams.")).toBeVisible();
    await expect(canvas.getByRole("navigation", { name: "Studio" })).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Work" })).toHaveAttribute(
      "target",
      "_blank",
    );
    await expect(canvas.getByText(new RegExp(en.footer.rights))).toBeVisible();
  },
};

/** An opt-out (US/CCPA) visitor also gets the "Do Not Sell or Share" link. */
export const WithDoNotSell: Story = {
  args: { showDoNotSell: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: en.cookies.doNotSell.link }),
    ).toBeVisible();
  },
};

/** No columns, social, tagline, or credit — logo and copyright only. */
export const Minimal: Story = {
  args: { columns: [], social: undefined, madeBy: undefined, tagline: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("navigation")).toBeNull();
    await expect(canvas.getByText(new RegExp(en.footer.rights))).toBeVisible();
  },
};
