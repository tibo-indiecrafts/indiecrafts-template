import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero18Section } from "./index";

const meta: Meta<typeof SecondaryHero18Section> = {
  title: "Sections/SecondaryHero/SecondaryHero18",
  component: SecondaryHero18Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero18Section>;

export const Default: Story = {};
