import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero08Section } from "./index";

const meta: Meta<typeof SecondaryHero08Section> = {
  title: "Sections/SecondaryHero/SecondaryHero08",
  component: SecondaryHero08Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero08Section>;

export const Default: Story = {};
