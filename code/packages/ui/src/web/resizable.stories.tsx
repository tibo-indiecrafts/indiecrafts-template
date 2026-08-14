import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./resizable";
import docs from "./resizable.md?raw";

const meta = {
  title: "UI/Resizable",
  component: ResizablePanelGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-48 w-96 rounded-lg border"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6 text-sm">List</div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6 text-sm">Detail</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
