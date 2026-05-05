import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero4Section } from "./index";

const meta: Meta<typeof SecondaryHero4Section> = {
  title: "Sections/SecondaryHero/SecondaryHero4",
  component: SecondaryHero4Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero4Section>;

export const Default: Story = {};
