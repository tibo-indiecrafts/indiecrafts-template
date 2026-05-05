import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero20Section } from "./index";

const meta: Meta<typeof SecondaryHero20Section> = {
  title: "Sections/SecondaryHero/SecondaryHero20",
  component: SecondaryHero20Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero20Section>;

export const Default: Story = {};
