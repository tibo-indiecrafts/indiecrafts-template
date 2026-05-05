import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero5Section } from "./index";

const meta: Meta<typeof SecondaryHero5Section> = {
  title: "Sections/SecondaryHero/SecondaryHero5",
  component: SecondaryHero5Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero5Section>;

export const Default: Story = {};
