import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChevronRight, Folder } from "lucide-react";
import { Button } from "./button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "./item";

const meta: Meta<typeof Item> = {
  title: "UI Primitives/Item",
  component: Item,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Item>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[420px]">{children}</div>
);

export const Default: Story = {
  render: () => (
    <Frame>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <Folder />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Project Aurora</ItemTitle>
          <ItemDescription>Cross-functional planning workspace</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRight className="text-muted-foreground size-4" />
        </ItemActions>
      </Item>
    </Frame>
  ),
};

export const Variants: Story = {
  render: () => (
    <Frame>
      <ItemGroup className="gap-2">
        <Item>
          <ItemContent>
            <ItemTitle>Default</ItemTitle>
            <ItemDescription>Transparent background.</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Outline</ItemTitle>
            <ItemDescription>Bordered card-like row.</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="muted">
          <ItemContent>
            <ItemTitle>Muted</ItemTitle>
            <ItemDescription>Subtle background fill.</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    </Frame>
  ),
};

export const Group: Story = {
  render: () => (
    <Frame>
      <ItemGroup className="rounded-md border">
        {["Reports", "Customers", "Settings"].map((title, i, arr) => (
          <div key={title}>
            <Item asChild>
              <a href="#" className="cursor-pointer">
                <ItemMedia variant="icon">
                  <Folder />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{title}</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <ChevronRight className="text-muted-foreground size-4" />
                </ItemActions>
              </a>
            </Item>
            {i < arr.length - 1 && <ItemSeparator />}
          </div>
        ))}
      </ItemGroup>
    </Frame>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Frame>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <Folder />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Q4 roadmap</ItemTitle>
          <ItemDescription>Last edited 3 days ago</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
          <Button variant="outline" size="sm">
            Share
          </Button>
        </ItemActions>
      </Item>
    </Frame>
  ),
};
