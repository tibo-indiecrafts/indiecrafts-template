import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui-primitives/dropdown-menu";
import { Button } from "@/components/ui-primitives/button";
import { DirectionProvider } from "./direction";
import { Slider } from "@/components/ui-primitives/slider";

const meta: Meta<typeof DirectionProvider> = {
  title: "UI Effects/Direction",
  component: DirectionProvider,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Wraps children in Radix's `DirectionProvider`. The component itself doesn't animate — its only job is to set context. Effects show up downstream: dropdown alignment, slider fill direction, submenu side, etc. Stories open the dropdown by default and add a slider so the LTR/RTL flip is visible at a glance.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof DirectionProvider>;

const Demo = () => (
  <div className="flex flex-col items-stretch gap-6 p-12">
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Profile
          <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Billing
          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Email</DropdownMenuItem>
            <DropdownMenuItem>Slack</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <div className="grid w-[260px] gap-2">
      <p className="text-muted-foreground text-xs tracking-wide uppercase">
        Slider — fill direction follows `dir`
      </p>
      <Slider defaultValue={[33]} max={100} />
    </div>
  </div>
);

/**
 * LTR — left-to-right (default). Dropdown shortcut text aligns right of
 * each label, submenu opens to the right, slider fills left → right.
 */
export const LeftToRight: Story = {
  render: () => (
    <DirectionProvider dir="ltr">
      <div dir="ltr">
        <Demo />
      </div>
    </DirectionProvider>
  ),
};

/**
 * RTL — right-to-left. Shortcut text now sits at the start (left) of each
 * row, submenu chevrons flip and submenu opens to the left, and the slider
 * fills right → left. This is the change `DirectionProvider` propagates.
 */
export const RightToLeft: Story = {
  render: () => (
    <DirectionProvider dir="rtl">
      <div dir="rtl">
        <Demo />
      </div>
    </DirectionProvider>
  ),
};

/**
 * Side by side — LTR vs RTL rendered next to each other so the flip is
 * obvious at a glance.
 */
export const SideBySide: Story = {
  render: () => (
    <div className="flex gap-12">
      <div>
        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
          LTR
        </p>
        <DirectionProvider dir="ltr">
          <div dir="ltr" className="rounded-lg border">
            <Demo />
          </div>
        </DirectionProvider>
      </div>
      <div>
        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
          RTL
        </p>
        <DirectionProvider dir="rtl">
          <div dir="rtl" className="rounded-lg border">
            <Demo />
          </div>
        </DirectionProvider>
      </div>
    </div>
  ),
};
