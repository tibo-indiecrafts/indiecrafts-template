import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud01Section } from "./index";

const meta: Meta<typeof LogoCloud01Section> = {
  title: "Sections/LogoCloud/LogoCloud01",
  component: LogoCloud01Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LogoCloud01Section>;

export const Default: Story = {};
