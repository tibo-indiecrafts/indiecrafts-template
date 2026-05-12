import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero01Section } from "./index";

const meta: Meta<typeof SecondaryHero01Section> = {
  title: "Sections/SecondaryHero/SecondaryHero01",
  component: SecondaryHero01Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero01Section>;

export const Default: Story = {};
