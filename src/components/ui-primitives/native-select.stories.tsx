import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "./native-select";

const meta: Meta<typeof NativeSelect> = {
  title: "UI Primitives/NativeSelect",
  component: NativeSelect,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof NativeSelect>;

export const Default: Story = {
  render: () => (
    <NativeSelect defaultValue="en">
      <NativeSelectOption value="en">English</NativeSelectOption>
      <NativeSelectOption value="fr">Français</NativeSelectOption>
      <NativeSelectOption value="es">Español</NativeSelectOption>
      <NativeSelectOption value="de">Deutsch</NativeSelectOption>
    </NativeSelect>
  ),
};

export const Small: Story = {
  render: () => (
    <NativeSelect size="sm" defaultValue="us">
      <NativeSelectOption value="us">United States</NativeSelectOption>
      <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
      <NativeSelectOption value="fr">France</NativeSelectOption>
    </NativeSelect>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <NativeSelect defaultValue="apple">
      <NativeSelectOptGroup label="Fruits">
        <NativeSelectOption value="apple">Apple</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Vegetables">
        <NativeSelectOption value="carrot">Carrot</NativeSelectOption>
        <NativeSelectOption value="kale">Kale</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  ),
};
