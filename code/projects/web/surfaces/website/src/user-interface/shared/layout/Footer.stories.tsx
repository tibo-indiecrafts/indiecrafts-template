import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Footer } from "./Footer";

/**
 * Production site footer. Exercises the next-intl mock (`footer.*`, `cookies.doNotSell.link`),
 * the `@/i18n/routing` Link (mocked via `next-intl/navigation`), `SocialFollow`, and
 * `MadeByCredit`. Footer columns use `kind: "external"` leaves — the mocked `Link` doesn't
 * apply `href` for internal (typed-route) leaves, so external items keep this story
 * independent of the app's real route map.
 */
const meta = {
  title: "Website/Layout/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    name: "Indiecrafts",
    tagline: "Client sites, shipped fast.",
    company: "Indiecrafts LLC",
    social: { twitter: "indiecrafts", github: "https://github.com/indiecrafts" },
    columns: [
      {
        title: "Product",
        links: [
          {
            kind: "external",
            href: "https://example.com/pricing",
            label: "Pricing",
            newTab: false,
          },
          {
            kind: "external",
            href: "https://example.com/blog",
            label: "Blog",
            newTab: false,
          },
        ],
      },
      {
        title: "Company",
        links: [
          {
            kind: "external",
            href: "https://example.com/about",
            label: "About",
            newTab: false,
          },
        ],
      },
    ],
    madeBy: { name: "Indiecrafts", href: "https://indiecrafts.dev" },
    showDoNotSell: false,
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Client sites, shipped fast.")).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Pricing" })).toBeVisible();
    await expect(canvas.getByText(/All rights reserved\./)).toBeVisible();
  },
};

/** CCPA "Do Not Sell" link shown for opt-out (US/CCPA) visitors. */
export const WithDoNotSell: Story = {
  args: { showDoNotSell: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", {
        name: "Do Not Sell or Share My Personal Information",
      }),
    ).toBeVisible();
  },
};

/** No columns/social/credit — logo + copyright only. */
export const Minimal: Story = {
  args: { columns: [], social: undefined, madeBy: undefined, tagline: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/All rights reserved\./)).toBeVisible();
  },
};
