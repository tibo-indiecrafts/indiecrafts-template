import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Logo } from "./Logo";

/**
 * Brand lockup: logo mark + site-name wordmark. Pure presentational — logo URLs
 * come from Sanity, passed in. Baseline proof story: needs no surface mock.
 */
const meta = {
  title: "Website/Shared/Logo",
  component: Logo,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { name: "Indiecrafts" },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No logo set → the wordmark alone. */
export const WordmarkOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Indiecrafts")).toBeVisible();
  },
};

/** A single logo mark beside the wordmark. */
export const WithLogo: Story = {
  args: {
    logo: "https://cdn.sanity.io/images/demo/production/logo.png",
  },
};

/** Separate light/dark marks — the right one shows per `data-theme`. */
export const LightAndDarkLogos: Story = {
  args: {
    logo: "https://cdn.sanity.io/images/demo/production/logo-light.png",
    logoDark: "https://cdn.sanity.io/images/demo/production/logo-dark.png",
  },
};
