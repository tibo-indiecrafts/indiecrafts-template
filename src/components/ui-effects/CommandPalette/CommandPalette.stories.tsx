import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  CommandPalette,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "./index";

const meta: Meta<typeof CommandPalette> = {
  title: "UI Effects/CommandPalette",
  component: CommandPalette,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CommandPalette>;

export const Default: Story = {
  args: { open: true },
  render: (args) => (
    <CommandPalette {...args}>
      <CommandInput placeholder="Type a command…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandPalette>
  ),
};
