import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero03Section } from "./index";

const meta: Meta<typeof SecondaryHero03Section> = {
  title: "Sections/SecondaryHero/SecondaryHero03",
  component: SecondaryHero03Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero03Section>;

export const Default: Story = {};
