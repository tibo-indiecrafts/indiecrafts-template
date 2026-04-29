import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarProvider } from "@/components/ui-primitives/sidebar";
import { DashboardHeader } from "./index";

const meta: Meta<typeof DashboardHeader> = {
  title: "Layouts/Dashboard/DashboardHeader",
  component: DashboardHeader,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <SidebarProvider
        style={
          {
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <div className="flex w-full flex-col">
          <Story />
        </div>
      </SidebarProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof DashboardHeader>;

export const Default: Story = {};

export const WithExternalLink: Story = {
  args: { externalHref: "https://github.com" },
};
