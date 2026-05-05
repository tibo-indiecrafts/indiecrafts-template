import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero13Section } from "./index";

const meta: Meta<typeof SecondaryHero13Section> = {
  title: "Sections/SecondaryHero/SecondaryHero13",
  component: SecondaryHero13Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero13Section>;

export const Default: Story = {};
