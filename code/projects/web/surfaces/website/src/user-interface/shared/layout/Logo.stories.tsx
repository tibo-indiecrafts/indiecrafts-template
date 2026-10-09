import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Logo } from "./Logo";

// Stand-ins for editor-uploaded Sanity logos (data URIs pass through the image loader).
const svg = (fill: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 24"><rect width="24" height="24" rx="6" fill="${fill}"/></svg>`,
  )}`;

/**
 * Brand lockup: the Sanity logo mark plus the site-name wordmark. Presentational — the
 * logo URLs and the name come from Sanity and are passed in.
 */
const meta = {
  title: "Layout/Logo",
  component: Logo,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { name: "Northwind Studio" },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No logo set → the wordmark alone. */
export const WordmarkOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Northwind Studio")).toBeVisible();
    await expect(canvasElement.querySelector("img")).toBeNull();
  },
};

/** One logo mark beside the wordmark, on every theme. */
export const WithLogo: Story = {
  args: { logo: svg("black") },
};

/** Separate light and dark marks — a CSS `dark:` swap shows the right one per `data-theme`. */
export const LightAndDarkLogos: Story = {
  args: { logo: svg("black"), logoDark: svg("white") },
  play: async ({ canvasElement }) => {
    // Both render; CSS hides one. The images are decorative (the wordmark names the site).
    const images = canvasElement.querySelectorAll("img");
    await expect(images).toHaveLength(2);
    images.forEach((img) => expect(img).toHaveAttribute("alt", ""));
  },
};
