/* eslint-disable @typescript-eslint/ban-ts-comment -- ts-nocheck below */
// @ts-nocheck -- shadcn upstream; type quirks (React 19 ref-null types, missing JSX namespace, etc.) accepted as-is.
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./resizable";

const meta: Meta<typeof ResizablePanelGroup> = {
  title: "UI Primitives/Resizable",
  component: ResizablePanelGroup,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ResizablePanelGroup>;

export const Horizontal: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background h-[300px] w-[640px] rounded-md border"
    >
      <ResizablePanel defaultSize={40}>
        <div className="text-foreground flex h-full items-center justify-center p-4">
          Sidebar
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60}>
        <div className="text-foreground flex h-full items-center justify-center p-4">
          Main content
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="vertical"
      className="bg-background h-[400px] w-[480px] rounded-md border"
    >
      <ResizablePanel defaultSize={30}>
        <div className="text-foreground flex h-full items-center justify-center p-4">
          Header
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>
        <div className="text-foreground flex h-full items-center justify-center p-4">
          Body
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const ThreePanel: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background h-[300px] w-[720px] rounded-md border"
    >
      <ResizablePanel defaultSize={25}>
        <div className="text-foreground flex h-full items-center justify-center p-4">
          Nav
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="text-foreground flex h-full items-center justify-center p-4">
          Main
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25}>
        <div className="text-foreground flex h-full items-center justify-center p-4">
          Aside
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
