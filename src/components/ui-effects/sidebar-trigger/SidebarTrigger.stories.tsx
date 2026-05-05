import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui-primitives/sidebar";
import { SidebarTrigger } from "./index";

const meta: Meta<typeof SidebarTrigger> = {
  title: "UI Effects/Nav/SidebarTrigger",
  component: SidebarTrigger,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Sidebar collapsible="offcanvas" />
        <SidebarInset>
          <div className="p-6">
            <Story />
          </div>
        </SidebarInset>
      </SidebarProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SidebarTrigger>;

export const Default: Story = {};
