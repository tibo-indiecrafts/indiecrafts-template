import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Lock, Mail, Search, Send, X } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./input-group";

const meta: Meta<typeof InputGroup> = {
  title: "UI Primitives/InputGroup",
  component: InputGroup,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof InputGroup>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="grid w-[360px] gap-3">{children}</div>
);

/** Leading icon — the canonical search-bar pattern. */
export const Default: Story = {
  render: () => (
    <Frame>
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search…" />
      </InputGroup>
    </Frame>
  ),
};

/** Leading icon + trailing button — submit-style search/email field. */
export const LeadingAndTrailing: Story = {
  render: () => (
    <Frame>
      <InputGroup>
        <InputGroupAddon>
          <Mail />
        </InputGroupAddon>
        <InputGroupInput placeholder="name@example.com" type="email" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="sm">
            <Send />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Frame>
  ),
};

/** Static unit text on the trailing edge — currency/measurement inputs. */
export const WithUnit: Story = {
  render: () => (
    <Frame>
      <InputGroup>
        <InputGroupInput placeholder="0.00" type="number" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </Frame>
  ),
};

/** Textarea variant — addon stacks below the multiline input via `block-end`. */
export const Textarea: Story = {
  render: () => (
    <Frame>
      <InputGroup>
        <InputGroupTextarea placeholder="Write a message…" rows={4} />
        <InputGroupAddon align="block-end">
          <InputGroupText>Markdown supported</InputGroupText>
          <InputGroupButton className="ml-auto" size="sm">
            Send
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Frame>
  ),
};

/** Password field with a lock icon and a clear button. */
export const PasswordWithClear: Story = {
  render: () => (
    <Frame>
      <InputGroup>
        <InputGroupAddon>
          <Lock />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="••••••••••"
          type="password"
          defaultValue="hunter2"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="sm" variant="ghost" aria-label="Clear">
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Frame>
  ),
};

/** Invalid — `aria-invalid` on the input lights up the destructive ring. */
export const Invalid: Story = {
  render: () => (
    <Frame>
      <InputGroup>
        <InputGroupAddon>
          <Mail />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="name@example.com"
          type="email"
          aria-invalid="true"
          defaultValue="not-an-email"
        />
      </InputGroup>
      <p className="text-destructive text-xs">Enter a valid email address.</p>
    </Frame>
  ),
};
