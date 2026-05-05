import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero15Section } from "./index";

const meta: Meta<typeof SecondaryHero15Section> = {
  title: "Sections/SecondaryHero/SecondaryHero15",
  component: SecondaryHero15Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero15Section>;

export const Default: Story = {};
