import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero16Section } from "./index";

const meta: Meta<typeof SecondaryHero16Section> = {
  title: "Sections/SecondaryHero/SecondaryHero16",
  component: SecondaryHero16Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero16Section>;

export const Default: Story = {};
