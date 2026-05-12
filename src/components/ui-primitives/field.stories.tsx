import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox } from "./checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "./field";
import { Input } from "./input";

const meta: Meta<typeof Field> = {
  title: "UI Primitives/Field",
  component: Field,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Field>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[420px]">{children}</div>
);

export const Default: Story = {
  render: () => (
    <Frame>
      <Field>
        <FieldLabel htmlFor="name">Display name</FieldLabel>
        <Input id="name" placeholder="Pedro Duarte" />
        <FieldDescription>Up to 32 characters, public.</FieldDescription>
      </Field>
    </Frame>
  ),
};

export const WithError: Story = {
  render: () => (
    <Frame>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" defaultValue="not-an-email" aria-invalid="true" />
        <FieldError>Enter a valid email address.</FieldError>
      </Field>
    </Frame>
  ),
};

export const Group: Story = {
  render: () => (
    <Frame>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="first">First name</FieldLabel>
          <Input id="first" />
        </Field>
        <Field>
          <FieldLabel htmlFor="last">Last name</FieldLabel>
          <Input id="last" />
        </Field>
        <FieldSeparator>or</FieldSeparator>
        <Field>
          <FieldLabel htmlFor="org">Organisation</FieldLabel>
          <Input id="org" placeholder="Acme Inc." />
        </Field>
      </FieldGroup>
    </Frame>
  ),
};

export const Fieldset: Story = {
  render: () => (
    <Frame>
      <FieldSet>
        <FieldLegend>Notifications</FieldLegend>
        <FieldGroup>
          <Field orientation="horizontal">
            <Checkbox id="n1" defaultChecked />
            <FieldLabel htmlFor="n1">Comments on my posts</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="n2" />
            <FieldLabel htmlFor="n2">Mentions</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="n3" defaultChecked />
            <FieldLabel htmlFor="n3">Direct messages</FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
    </Frame>
  ),
};
