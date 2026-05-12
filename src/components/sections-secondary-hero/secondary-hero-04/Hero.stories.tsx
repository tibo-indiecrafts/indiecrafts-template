import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero04Section } from "./index";

const meta: Meta<typeof SecondaryHero04Section> = {
  title: "Sections/SecondaryHero/SecondaryHero04",
  component: SecondaryHero04Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero04Section>;

export const Default: Story = {};
