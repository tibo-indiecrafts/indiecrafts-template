import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IconCloud } from "./IconCloud";

const meta: Meta<typeof IconCloud> = {
  title: "UI Effects/Globes & Maps/IconCloud",
  component: IconCloud,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof IconCloud>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[460px] w-full items-center justify-center p-4">
    {children}
  </div>
);

const techSlug = (slug: string, hex = "262626") =>
  `https://cdn.simpleicons.org/${slug}/${hex}`;
const TECH_ICONS = [
  "typescript",
  "javascript",
  "react",
  "nextdotjs",
  "tailwindcss",
  "vite",
  "vercel",
  "github",
  "figma",
  "storybook",
].map((slug) => techSlug(slug));

export const Default: Story = {
  render: () => (
    <Stage>
      <IconCloud />
    </Stage>
  ),
};

export const TechStack: Story = {
  render: () => (
    <Stage>
      <IconCloud images={TECH_ICONS} />
    </Stage>
  ),
};

export const Informational: Story = {
  render: () => (
    <Stage>
      <IconCloud images={TECH_ICONS} informational />
    </Stage>
  ),
};
