import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { SocialFollow } from "./SocialFollow";

/**
 * Footer social-profile icon links, driven by `siteSettings.social`. Renders
 * nothing when no profile is set. Pure — no i18n/auth mocks needed (label is
 * a prop).
 */
const meta = {
  title: "Website/Shared/SocialFollow",
  component: SocialFollow,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { label: "Follow" },
} satisfies Meta<typeof SocialFollow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A few configured profiles. */
export const WithProfiles: Story = {
  args: {
    social: {
      twitter: "indiecrafts",
      linkedin: "https://linkedin.com/company/indiecrafts",
      github: "https://github.com/indiecrafts",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Follow")).toBeVisible();
    await expect(canvas.getAllByRole("link")).toHaveLength(3);
  },
};

/** No profiles set → renders nothing. */
export const Empty: Story = {
  args: { social: {} },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.firstElementChild).toBeEmptyDOMElement();
  },
};
