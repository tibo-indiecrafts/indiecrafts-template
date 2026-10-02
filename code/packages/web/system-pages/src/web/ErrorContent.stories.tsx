import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ErrorContent } from "./ErrorContent";

const meta = {
  title: "System Pages/ErrorContent",
  component: ErrorContent,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    title: "Something went wrong",
    description: "An unexpected error occurred. Please try again.",
    retryLabel: "Try again",
  },
} satisfies Meta<typeof ErrorContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const French: Story = {
  args: {
    title: "Une erreur est survenue",
    description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
    retryLabel: "Réessayer",
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
