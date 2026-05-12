import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "UI Primitives/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/96?img=12" alt="Jane Doe" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="/__missing.png" alt="Jane Doe" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar className="size-6">
        <AvatarImage src="https://i.pravatar.cc/48?img=21" alt="" />
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
      <Avatar className="size-9">
        <AvatarImage src="https://i.pravatar.cc/48?img=22" alt="" />
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      <Avatar className="size-12">
        <AvatarImage src="https://i.pravatar.cc/96?img=23" alt="" />
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
      <Avatar className="size-16">
        <AvatarImage src="https://i.pravatar.cc/96?img=24" alt="" />
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const Stack: Story = {
  render: () => (
    <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/96?img=31" alt="" />
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/96?img=32" alt="" />
        <AvatarFallback>B</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/96?img=33" alt="" />
        <AvatarFallback>C</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>+5</AvatarFallback>
      </Avatar>
    </div>
  ),
};
