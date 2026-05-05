import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero19Section } from "./index";

const meta: Meta<typeof SecondaryHero19Section> = {
  title: "Sections/SecondaryHero/SecondaryHero19",
  component: SecondaryHero19Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero19Section>;

export const Default: Story = {};
