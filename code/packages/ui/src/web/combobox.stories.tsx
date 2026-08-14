import type { Meta, StoryObj } from "@storybook/nextjs-vite";
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
