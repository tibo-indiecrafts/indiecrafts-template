import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NotFoundContent } from "./NotFoundContent";

const meta = {
  title: "System Pages/NotFoundContent",
  component: NotFoundContent,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    eyebrow: "404",
    title: "Page not found",
    description: "This page doesn't exist or has moved.",
    homeLabel: "Go home",
    homeHref: "/",
  },
} satisfies Meta<typeof NotFoundContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const French: Story = {
  args: {
    eyebrow: "404",
    title: "Page introuvable",
    description: "Cette page n'existe pas ou a été déplacée.",
    homeLabel: "Accueil",
    homeHref: "/",
  },
};

/** With the host's configured logo in the `brand` slot (the app's 404 / error screens). */
export const WithBrand: Story = {
  args: {
    brand: (
      <span
        aria-hidden="true"
        className="bg-primary text-primary-foreground inline-flex size-16 items-center justify-center rounded-xl text-2xl font-bold"
      >
        W
      </span>
    ),
  },
};
