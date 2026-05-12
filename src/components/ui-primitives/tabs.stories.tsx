import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta: Meta<typeof Tabs> = {
  title: "UI Primitives/Tabs",
  component: Tabs,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="mt-4 grid gap-3">
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue="Pedro Duarte" />
        <Button className="justify-self-start">Save changes</Button>
      </TabsContent>
      <TabsContent value="password" className="mt-4 grid gap-3">
        <Label htmlFor="current">Current password</Label>
        <Input id="current" type="password" />
        <Label htmlFor="next">New password</Label>
        <Input id="next" type="password" />
        <Button className="justify-self-start">Update password</Button>
      </TabsContent>
    </Tabs>
  ),
};

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[420px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings" disabled>
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-muted-foreground mt-4 text-sm">
        Overview pane.
      </TabsContent>
      <TabsContent value="analytics" className="text-muted-foreground mt-4 text-sm">
        Analytics pane.
      </TabsContent>
      <TabsContent value="settings" />
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs
      defaultValue="profile"
      orientation="vertical"
      className="flex w-[480px] flex-row gap-4"
    >
      <TabsList className="flex h-auto flex-col">
        <TabsTrigger value="profile" className="justify-start">
          Profile
        </TabsTrigger>
        <TabsTrigger value="billing" className="justify-start">
          Billing
        </TabsTrigger>
        <TabsTrigger value="team" className="justify-start">
          Team
        </TabsTrigger>
      </TabsList>
      <div className="text-muted-foreground flex-1 text-sm">
        <TabsContent value="profile">Profile pane.</TabsContent>
        <TabsContent value="billing">Billing pane.</TabsContent>
        <TabsContent value="team">Team pane.</TabsContent>
      </div>
    </Tabs>
  ),
};
