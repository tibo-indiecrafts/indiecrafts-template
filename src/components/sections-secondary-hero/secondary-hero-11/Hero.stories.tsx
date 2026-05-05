import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero11Section } from "./index";

const meta: Meta<typeof SecondaryHero11Section> = {
  title: "Sections/SecondaryHero/SecondaryHero11",
  component: SecondaryHero11Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero11Section>;

export const Default: Story = {};
