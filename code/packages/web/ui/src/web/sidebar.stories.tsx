import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HomeIcon, InboxIcon, SettingsIcon } from "lucide-react";
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./sidebar";
import docs from "./sidebar.md?raw";

const meta = {
  title: "Web/UI/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { title: "Home", icon: HomeIcon },
  { title: "Inbox", icon: InboxIcon },
  { title: "Settings", icon: SettingsIcon },
];

export const Default: Story = {
  render: () => (
    <SidebarProvider
      style={{ minHeight: "20rem" }}
      className="rounded-lg border"
    >
      <Sidebar collapsible="none">
        <SidebarHeader className="px-3 py-2 font-semibold">
          Acme Inc
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {items.map((item, i) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={i === 0}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="p-4">
        <SidebarTrigger />
        <p className="mt-4 text-sm">Main content column.</p>
      </SidebarInset>
    </SidebarProvider>
  ),
};
