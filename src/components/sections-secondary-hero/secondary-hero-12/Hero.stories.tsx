import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero12Section } from "./index";

const meta: Meta<typeof SecondaryHero12Section> = {
  title: "Sections/SecondaryHero/SecondaryHero12",
  component: SecondaryHero12Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero12Section>;

export const Default: Story = {};
