import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import en from "../../../../messages/en.json";
import { SocialFollow } from "./SocialFollow";

/**
 * Footer follow block: the site's social profiles (Sanity `siteSettings.social`) as icon
 * links. Renders nothing when no profile is set.
 */
const meta = {
  title: "Layout/SocialFollow",
  component: SocialFollow,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { label: en.footer.follow, social: {} },
} satisfies Meta<typeof SocialFollow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Three profiles — a twitter handle becomes its x.com URL. */
export const WithProfiles: Story = {
  args: {
    social: {
      twitter: "@northwind",
      linkedin: "https://www.linkedin.com/company/northwind",
      github: "https://github.com/northwind",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(en.footer.follow)).toBeVisible();
    await expect(canvas.getAllByRole("link")).toHaveLength(3);
    await expect(canvas.getByRole("link", { name: "X" })).toHaveAttribute(
      "href",
      "https://x.com/northwind",
    );
  },
};

/** No profiles → renders nothing, so the label never shows alone. */
export const Empty: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText(en.footer.follow)).toBeNull();
  },
};
