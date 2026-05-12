import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero05Section } from "./index";

const meta: Meta<typeof SecondaryHero05Section> = {
  title: "Sections/SecondaryHero/SecondaryHero05",
  component: SecondaryHero05Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero05Section>;

export const Default: Story = {};
