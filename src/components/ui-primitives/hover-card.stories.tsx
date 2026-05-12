import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CalendarDays, MapPin, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

const meta: Meta<typeof HoverCard> = {
  title: "UI Primitives/HoverCard",
  component: HoverCard,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="px-0">
          @nextjs
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" alt="Vercel" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React Framework — created and maintained by @vercel.
            </p>
            <div className="text-muted-foreground flex items-center pt-2 text-xs">
              <CalendarDays className="mr-2 size-4" />
              Joined December 2021
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const InitiallyOpen: Story = {
  render: () => (
    <HoverCard defaultOpen openDelay={0}>
      <HoverCardTrigger asChild>
        <Button variant="link" className="px-0">
          Hover me
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-72 text-sm">
        Triggered on hover with a small delay; renders an unobtrusive flyout.
      </HoverCardContent>
    </HoverCard>
  ),
};

export const TopSide: Story = {
  render: () => (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild>
        <Button variant="outline">Top placement</Button>
      </HoverCardTrigger>
      <HoverCardContent side="top" className="w-64 text-sm">
        Anchored above the trigger via <code>side=&quot;top&quot;</code>.
      </HoverCardContent>
    </HoverCard>
  ),
};

export const RightStart: Story = {
  render: () => (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild>
        <Button variant="outline">Right + start</Button>
      </HoverCardTrigger>
      <HoverCardContent side="right" align="start" className="w-64 text-sm">
        Anchored to the right of the trigger, top-aligned with the trigger&apos;s leading
        edge.
      </HoverCardContent>
    </HoverCard>
  ),
};

export const RichContent: Story = {
  render: () => (
    <HoverCard openDelay={100}>
      <HoverCardTrigger asChild>
        <Button variant="link" className="px-0">
          Atelier Lisbon
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-3">
          <div
            className="bg-muted aspect-[16/9] rounded-md bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80)",
            }}
          />
          <div>
            <h4 className="text-sm font-semibold">Atelier Lisbon</h4>
            <p className="text-muted-foreground mt-1 text-xs">
              A working studio in Bairro Alto with rotating exhibitions.
            </p>
          </div>
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" /> Lisbon, PT
            </span>
            <span className="inline-flex items-center gap-1">
              <Star className="size-3 fill-current text-amber-500" /> 4.8
            </span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
