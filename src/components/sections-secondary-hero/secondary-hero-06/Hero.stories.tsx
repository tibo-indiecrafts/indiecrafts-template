import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero06Section } from "./index";

const meta: Meta<typeof SecondaryHero06Section> = {
  title: "Sections/SecondaryHero/SecondaryHero06",
  component: SecondaryHero06Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero06Section>;

export const Default: Story = {};
