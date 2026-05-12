import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect } from "react";
import { SkipLink } from "./index";

const meta: Meta<typeof SkipLink> = {
  title: "Layouts/Shared/SkipLink",
  component: SkipLink,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Visible only when focused. The Focused story auto-focuses the link so the visible state is reviewable.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SkipLink>;

export const Default: Story = {
  render: () => (
    <div className="flex min-h-svh flex-col gap-4 p-6">
      <SkipLink />
      <p className="text-muted-foreground text-sm">
        The skip link is currently hidden (sr-only). Tab into this frame to reveal it.
      </p>
    </div>
  ),
};

function FocusOnMount() {
  useEffect(() => {
    const link = document.querySelector<HTMLAnchorElement>('a[href="#main"]');
    link?.focus();
  }, []);
  return null;
}

export const Focused: Story = {
  render: () => (
    <div className="flex min-h-svh flex-col gap-4 p-6">
      <SkipLink />
      <FocusOnMount />
      <p className="text-muted-foreground mt-16 text-sm">
        The skip link is auto-focused on mount — you should see the pill in the top left.
      </p>
    </div>
  ),
};
