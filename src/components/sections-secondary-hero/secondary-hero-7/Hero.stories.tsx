import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHero7Section } from "./index";

const meta: Meta<typeof SecondaryHero7Section> = {
  title: "Sections/SecondaryHero/SecondaryHero7",
  component: SecondaryHero7Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SecondaryHero7Section>;

export const Default: Story = {};
