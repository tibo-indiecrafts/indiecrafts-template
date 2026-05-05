import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud1Section } from "./index";

const meta: Meta<typeof LogoCloud1Section> = {
  title: "Sections/LogoCloud/LogoCloud1",
  component: LogoCloud1Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LogoCloud1Section>;

export const Default: Story = {};
