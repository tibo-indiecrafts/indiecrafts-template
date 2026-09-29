import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TurnstileWidget } from "./TurnstileWidget";
import docs from "./TurnstileWidget.md?raw";

/**
 * Cloudflare Turnstile widget. In production it reads `NEXT_PUBLIC_TURNSTILE_SITE_KEY`;
 * these stories pass Cloudflare's documented **test** keys via `siteKey` so the widget
 * renders live without a real key. `onToken` is inert here.
 */
const meta = {
  title: "UI Components/TurnstileWidget",
  component: TurnstileWidget,
  tags: ["autodocs"],
  parameters: { layout: "padded", docs: { description: { component: docs } } },
  args: { onToken: () => {} },
} satisfies Meta<typeof TurnstileWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Cloudflare test key `1x…AA` — always passes (visible). */
export const AlwaysPasses: Story = {
  args: { siteKey: "1x00000000000000000000AA" },
};
/** Cloudflare test key `2x…AB` — always blocks. */
export const AlwaysBlocks: Story = {
  args: { siteKey: "2x00000000000000000000AB" },
};
/** Cloudflare test key `3x…FF` — forces an interactive challenge. */
export const Interactive: Story = {
  args: { siteKey: "3x00000000000000000000FF" },
};
/** No key → renders nothing (the default off state; forms submit unchanged). */
export const Disabled: Story = { args: { siteKey: undefined } };
