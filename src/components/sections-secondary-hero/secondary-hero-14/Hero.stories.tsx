import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero14Section } from "./index";

const meta: Meta<typeof SecondaryHero14Section> = {
  title: "Sections/SecondaryHero/SecondaryHero14",
  component: SecondaryHero14Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero14Section>;

export const Default: Story = {};
