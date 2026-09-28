import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { CalendarDays, Smile, User } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "./command";
import docs from "./command.md?raw";

const meta = {
  title: "Web/UI/Command",
  component: Command,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Command className="w-80 rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <CalendarDays /> Calendar
          </CommandItem>
          <CommandItem>
            <Smile /> Search emoji
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User /> Profile
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/** Behavior: typing filters the option list. */
export const Filters: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("option", { name: /Calendar/ }),
    ).toBeVisible();
    await userEvent.type(canvas.getByRole("combobox"), "emoji");
    await expect(
      canvas.getByRole("option", { name: /Search emoji/ }),
    ).toBeVisible();
    await expect(canvas.queryByRole("option", { name: /Calendar/ })).toBeNull();
  },
};
