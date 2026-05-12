import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento01Section } from "./index";
import { bento01Sample } from "./config";

const meta: Meta<typeof Bento01Section> = {
  title: "Sections/Bento/Bento01",
  component: Bento01Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento01Section>;

export const Default: Story = {
  args: {
    ...bento01Sample,
    id: "story-bento-01",
  } as React.ComponentProps<typeof Bento01Section>,
};
