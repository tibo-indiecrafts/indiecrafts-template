import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PhoneInput } from "./PhoneInput";
import docs from "./PhoneInput.md?raw";

/**
 * A dial-code select + national `type="tel"` input → emits an E.164 string via
 * `onChange` (inert in Storybook). Validation is the caller's job
 * (`@indiecrafts/format/validate`).
 */
const meta = {
  title: "UI Components/PhoneInput",
  component: PhoneInput,
  tags: ["autodocs"],
  parameters: { layout: "padded", docs: { description: { component: docs } } },
  args: { defaultCountry: "FR" },
  argTypes: { defaultCountry: { control: "text" } },
} satisfies Meta<typeof PhoneInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const France: Story = {};
export const UnitedKingdom: Story = { args: { defaultCountry: "GB" } };
export const Prefilled: Story = { args: { defaultCountry: "FR", defaultNational: "6 12 34 56 78" } };
