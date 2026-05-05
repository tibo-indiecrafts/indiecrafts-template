import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero6Section } from "./index";

const meta: Meta<typeof SecondaryHero6Section> = {
  title: "Sections/SecondaryHero/SecondaryHero6",
  component: SecondaryHero6Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero6Section>;

export const Default: Story = {};
