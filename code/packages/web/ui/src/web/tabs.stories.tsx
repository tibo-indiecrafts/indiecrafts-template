import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import docs from "./tabs.md?raw";

const meta = {
  title: "Web/UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-96">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="specs">Specs</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-muted-foreground text-sm">
        A short summary of the product and what it does.
      </TabsContent>
      <TabsContent value="specs" className="text-muted-foreground text-sm">
        Dimensions, materials, and technical details.
      </TabsContent>
      <TabsContent value="reviews" className="text-muted-foreground text-sm">
        What customers say after buying.
      </TabsContent>
    </Tabs>
  ),
};

export const LineVariant: Story = {
  render: () => (
    <Tabs defaultValue="a" className="w-96">
      <TabsList variant="line">
        <TabsTrigger value="a">Account</TabsTrigger>
        <TabsTrigger value="b">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="a" className="text-muted-foreground text-sm">
        Manage your account details.
      </TabsContent>
      <TabsContent value="b" className="text-muted-foreground text-sm">
        Change your password here.
      </TabsContent>
    </Tabs>
  ),
};

/** Behavior: clicking a tab swaps the visible panel. */
export const SwitchesTab: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("A short summary of the product and what it does."),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("tab", { name: "Specs" }));
    await expect(
      canvas.getByText("Dimensions, materials, and technical details."),
    ).toBeVisible();
  },
};
