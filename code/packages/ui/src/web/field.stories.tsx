import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Field, FieldDescription, FieldError, FieldLabel } from "./field";
import docs from "./field.md?raw";
import { Input } from "./input";

const meta = {
  title: "UI/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field className="w-72">
      <FieldLabel htmlFor="username">Username</FieldLabel>
      <Input id="username" placeholder="ada" />
      <FieldDescription>Choose a unique handle.</FieldDescription>
    </Field>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field className="w-72" data-invalid>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input id="email" aria-invalid defaultValue="not-an-email" />
      <FieldError>Enter a valid email address.</FieldError>
    </Field>
  ),
};
