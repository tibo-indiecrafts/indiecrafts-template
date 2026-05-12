import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

const meta: Meta<typeof Sheet> = {
  title: "UI Primitives/Sheet",
  component: Sheet,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Sheet>;

const Body = () => (
  <div className="grid gap-3 px-4 py-2">
    <div className="grid gap-1.5">
      <Label htmlFor="name">Name</Label>
      <Input id="name" defaultValue="Pedro Duarte" />
    </div>
    <div className="grid gap-1.5">
      <Label htmlFor="username">Username</Label>
      <Input id="username" defaultValue="@peduarte" />
    </div>
  </div>
);

const Frame = ({ side }: { side: "top" | "right" | "bottom" | "left" }) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" className="capitalize">
        Open ({side})
      </Button>
    </SheetTrigger>
    <SheetContent side={side}>
      <SheetHeader>
        <SheetTitle>Edit profile</SheetTitle>
        <SheetDescription>Make changes here. Save when done.</SheetDescription>
      </SheetHeader>
      <Body />
      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Cancel</Button>
        </SheetClose>
        <Button>Save</Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);

export const Default: Story = {
  render: () => <Frame side="right" />,
};

export const Sides: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-3">
      <Frame side="top" />
      <Frame side="right" />
      <Frame side="bottom" />
      <Frame side="left" />
    </div>
  ),
};

export const InitiallyOpen: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button variant="outline">Re-open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Review changes</SheetTitle>
        </SheetHeader>
        <Body />
      </SheetContent>
    </Sheet>
  ),
};
