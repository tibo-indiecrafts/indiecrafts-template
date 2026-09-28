import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DirectionProvider } from "./direction";
import docs from "./direction.md?raw";

const meta = {
  title: "Web/UI/Direction",
  component: DirectionProvider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof DirectionProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RightToLeft: Story = {
  render: () => (
    <DirectionProvider dir="rtl">
      <div dir="rtl" className="flex items-center gap-2 text-sm">
        <span>مرحبا</span>
        <span className="text-muted-foreground">
          — content flows right-to-left
        </span>
      </div>
    </DirectionProvider>
  ),
};
