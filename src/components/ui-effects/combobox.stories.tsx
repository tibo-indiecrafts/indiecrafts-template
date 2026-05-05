import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "./combobox";

const meta: Meta<typeof Combobox> = {
  title: "UI Effects/Inputs/Combobox",
  component: Combobox,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Combobox>;

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt", label: "Nuxt" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

/** Single-select combobox with type-ahead filtering. */
export const Default: Story = {
  render: () => (
    <Combobox items={frameworks}>
      <ComboboxTrigger className="w-[260px]">
        <ComboboxValue placeholder="Select a framework…" />
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput placeholder="Search…" />
        <ComboboxList>
          {frameworks.map((f) => (
            <ComboboxItem key={f.value} value={f}>
              {f.label}
            </ComboboxItem>
          ))}
          <ComboboxEmpty>No results.</ComboboxEmpty>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};

/** Pre-selected value via `defaultValue`. */
export const WithDefault: Story = {
  render: () => (
    <Combobox items={frameworks} defaultValue={frameworks[0]}>
      <ComboboxTrigger className="w-[260px]">
        <ComboboxValue />
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput placeholder="Search…" />
        <ComboboxList>
          {frameworks.map((f) => (
            <ComboboxItem key={f.value} value={f}>
              {f.label}
            </ComboboxItem>
          ))}
          <ComboboxEmpty>No results.</ComboboxEmpty>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};
