import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero07Section } from "./index";

const meta: Meta<typeof SecondaryHero07Section> = {
  title: "Sections/SecondaryHero/SecondaryHero07",
  component: SecondaryHero07Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero07Section>;

export const Default: Story = {};
