import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero10Section } from "./index";

const meta: Meta<typeof SecondaryHero10Section> = {
  title: "Sections/SecondaryHero/SecondaryHero10",
  component: SecondaryHero10Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero10Section>;

export const Default: Story = {};
