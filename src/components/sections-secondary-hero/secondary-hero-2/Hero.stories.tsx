import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero2Section } from "./index";

const meta: Meta<typeof SecondaryHero2Section> = {
  title: "Sections/SecondaryHero/SecondaryHero2",
  component: SecondaryHero2Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero2Section>;

export const Default: Story = {};
