import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ShareButtons } from "./ShareButtons";
import docs from "./ShareButtons.md?raw";

const meta = {
  title: "UI Components/ShareButtons",
  component: ShareButtons,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  args: {
    url: "https://indiecrafts.dev/blog/fast-prototyping-with-nextjs",
    title: "Fast prototyping with Next.js: zero to MVP in a weekend",
    labels: {
      label: "Share",
      x: "Share on X",
      linkedin: "Share on LinkedIn",
      facebook: "Share on Facebook",
      copy: "Copy link",
      copied: "Link copied",
    },
  },
  argTypes: { labels: { table: { disable: true } } },
} satisfies Meta<typeof ShareButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ShareThisPage: Story = {
  args: { url: "https://indiecrafts.dev/", title: "indiecrafts.dev" },
};
