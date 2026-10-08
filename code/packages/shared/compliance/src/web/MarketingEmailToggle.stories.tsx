import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { MarketingEmailToggle } from "./MarketingEmailToggle";

const API = "https://api.storybook.test";

/**
 * The account-settings switch for the commercial-email opt-in ("Privacy & consent").
 * It reads and writes `/v1/consent/marketing-email`; the story answers those calls.
 */
const meta = {
  title: "Compliance/MarketingEmailToggle",
  component: MarketingEmailToggle,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    apiUrl: API,
    getToken: async () => "jwt",
    label: "Commercial emails",
    surface: "storybook",
  },
  beforeEach: () => {
    const real = window.fetch;
    let stored = false;
    window.fetch = async (input, init) => {
      if (!String(input).startsWith(API)) return real(input, init);
      if (init?.method === "POST")
        stored = (JSON.parse(String(init.body)) as { granted: boolean })
          .granted;
      return new Response(JSON.stringify({ marketing_email: stored }));
    };
    return () => {
      window.fetch = real;
    };
  },
} satisfies Meta<typeof MarketingEmailToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Behavior: a flip saves and stays on. */
export const SavesOptIn: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = await canvas.findByRole("switch", {
      name: "Commercial emails",
    });
    await waitFor(() => expect(toggle).toBeEnabled());
    await userEvent.click(toggle);
    await waitFor(() => expect(toggle).toHaveAttribute("aria-checked", "true"));
  },
};
