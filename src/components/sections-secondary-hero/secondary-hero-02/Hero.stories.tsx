import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero02Section } from "./index";

const meta: Meta<typeof SecondaryHero02Section> = {
  title: "Sections/SecondaryHero/SecondaryHero02",
  component: SecondaryHero02Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero02Section>;

export const Default: Story = {};
