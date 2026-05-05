import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero3Section } from "./index";

const meta: Meta<typeof SecondaryHero3Section> = {
  title: "Sections/SecondaryHero/SecondaryHero3",
  component: SecondaryHero3Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero3Section>;

export const Default: Story = {};
