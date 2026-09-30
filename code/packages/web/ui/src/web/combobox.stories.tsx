import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, within } from "storybook/test";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./combobox";
import docs from "./combobox.md?raw";

const FRUITS = ["Apple", "Banana", "Orange", "Mango", "Grape"];

const meta = {
  title: "UI/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    // @debt ACCESSIBILITY - ComboboxInput's built-in trigger button (tabindex -1, pointer-only) has no label prop; the input itself is named.
    a11y: { config: { rules: [{ id: "button-name", enabled: false }] } },
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Combobox items={FRUITS}>
      <ComboboxInput className="w-64" placeholder="Search fruit…" />
      <ComboboxContent>
        <ComboboxEmpty>No fruit found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};

/** Behavior: typing filters the (portalled) option list. */
export const Filters: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // By placeholder: during mount Base UI can expose a second `combobox` node.
    const input = await canvas.findByPlaceholderText("Search fruit…");
    await userEvent.click(input);
    await userEvent.type(input, "Man");
    await expect(
      await screen.findByRole("option", { name: "Mango" }),
    ).toBeVisible();
  },
};
