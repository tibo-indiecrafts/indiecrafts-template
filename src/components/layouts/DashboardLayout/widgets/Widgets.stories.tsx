import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui-primitives/sidebar";
import { Calendars } from "./Calendars";
import { DatePicker } from "./DatePicker";
import { SearchForm } from "./SearchForm";
import { SidebarOptInForm } from "./SidebarOptInForm";
import { TeamSwitcher } from "./TeamSwitcher";
import { VersionSwitcher } from "./VersionSwitcher";

/**
 * Composite gallery — every dashboard widget stacked inside a single
 * sidebar so reviewers can see every chrome element at once. Each widget
 * still has its own dedicated story (`Layouts/Dashboard/Widgets/<Name>`)
 * for isolated review.
 */
const meta: Meta = {
  title: "Layouts/Dashboard/Widgets/Gallery",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

export const AllWidgets: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar collapsible="none" className="w-(--sidebar-width)">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>SearchForm</SidebarGroupLabel>
            <SearchForm className="px-2" />
          </SidebarGroup>
          <SidebarSeparator className="mx-0" />
          <SidebarGroup>
            <SidebarGroupLabel>TeamSwitcher</SidebarGroupLabel>
            <div className="px-2">
              <TeamSwitcher
                teams={[
                  { name: "Acme Inc.", logo: () => null, plan: "Enterprise" },
                  { name: "Acme Corp.", logo: () => null, plan: "Startup" },
                ]}
              />
            </div>
          </SidebarGroup>
          <SidebarSeparator className="mx-0" />
          <SidebarGroup>
            <SidebarGroupLabel>VersionSwitcher</SidebarGroupLabel>
            <div className="px-2">
              <VersionSwitcher
                versions={["1.0.0", "1.1.0-alpha", "2.0.0-beta"]}
                defaultVersion="1.1.0-alpha"
              />
            </div>
          </SidebarGroup>
          <SidebarSeparator className="mx-0" />
          <SidebarGroup>
            <SidebarGroupLabel>DatePicker</SidebarGroupLabel>
            <DatePicker />
          </SidebarGroup>
          <SidebarSeparator className="mx-0" />
          <SidebarGroup>
            <SidebarGroupLabel>Calendars</SidebarGroupLabel>
            <Calendars
              calendars={[
                {
                  name: "My Calendars",
                  items: ["Personal", "Work"],
                  active: ["Personal"],
                },
              ]}
            />
          </SidebarGroup>
          <SidebarSeparator className="mx-0" />
          <SidebarGroup>
            <SidebarGroupLabel>SidebarOptInForm</SidebarGroupLabel>
            <div className="px-2">
              <SidebarOptInForm />
            </div>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
};
