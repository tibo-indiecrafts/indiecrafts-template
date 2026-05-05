import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero9Section } from "./index";

const meta: Meta<typeof SecondaryHero9Section> = {
  title: "Sections/SecondaryHero/SecondaryHero9",
  component: SecondaryHero9Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero9Section>;

export const Default: Story = {};
