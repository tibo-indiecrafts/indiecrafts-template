import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero8Section } from "./index";

const meta: Meta<typeof SecondaryHero8Section> = {
  title: "Sections/SecondaryHero/SecondaryHero8",
  component: SecondaryHero8Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero8Section>;

export const Default: Story = {};
