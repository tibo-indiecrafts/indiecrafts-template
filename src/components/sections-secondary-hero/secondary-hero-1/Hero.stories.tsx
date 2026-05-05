import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero1Section } from "./index";

const meta: Meta<typeof SecondaryHero1Section> = {
  title: "Sections/SecondaryHero/SecondaryHero1",
  component: SecondaryHero1Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero1Section>;

export const Default: Story = {};
