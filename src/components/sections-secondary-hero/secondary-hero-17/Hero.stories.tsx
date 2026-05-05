import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero17Section } from "./index";

const meta: Meta<typeof SecondaryHero17Section> = {
  title: "Sections/SecondaryHero/SecondaryHero17",
  component: SecondaryHero17Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero17Section>;

export const Default: Story = {};
