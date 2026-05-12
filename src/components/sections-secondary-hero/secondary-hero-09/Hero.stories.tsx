import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero09Section } from "./index";

const meta: Meta<typeof SecondaryHero09Section> = {
  title: "Sections/SecondaryHero/SecondaryHero09",
  component: SecondaryHero09Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero09Section>;

export const Default: Story = {};
