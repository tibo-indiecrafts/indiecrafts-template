import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./sidebar";
import { Home, Search, Settings, User } from "lucide-react";

const meta: Meta<typeof Sidebar> = {
  title: "UI Primitives/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Sidebar>;

const ITEMS = [
  { title: "Home", icon: Home },
  { title: "Search", icon: Search },
  { title: "Profile", icon: User },
  { title: "Settings", icon: Settings },
];

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="text-foreground px-2 py-1.5 font-semibold">
            Indiecrafts
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {ITEMS.map((it) => (
                  <SidebarMenuItem key={it.title}>
                    <SidebarMenuButton>
                      <it.icon className="size-4" aria-hidden />
                      <span>{it.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="text-muted-foreground px-2 text-xs">v1.0.0</div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center gap-2 p-4">
          <SidebarTrigger />
          <h1 className="text-foreground text-lg font-semibold">Dashboard</h1>
        </header>
        <main className="text-foreground p-6">
          <p>Main content area. Toggle the sidebar via the trigger.</p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
};
