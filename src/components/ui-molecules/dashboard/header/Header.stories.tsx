import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarProvider } from "@/components/ui-primitives/sidebar";
import { Header } from "./Header";

const meta: Meta<typeof Header> = {
  title: "UI Molecules/Dashboard/Header",
  component: Header,
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

type Story = StoryObj<typeof Header>;

export const Default: Story = {};

export const WithExternalLink: Story = {
  args: { externalHref: "https://github.com" },
};
