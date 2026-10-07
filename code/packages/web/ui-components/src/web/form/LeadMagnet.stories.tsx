import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { LeadMagnetForm } from "./LeadMagnetForm";
import docs from "./LeadMagnet.md?raw";

/**
 * Stories target the client `<LeadMagnetForm>` (the visual half). The registered
 * `<LeadMagnet>` wrapper only adds the `features.newsletter` gate. The submit
 * `fetch("/api/newsletter")` is inert in Storybook — pick a variant to compare
 * layouts; the success/error states show against the live route.
 */
const meta = {
  title: "UI Components/LeadMagnet",
  component: LeadMagnetForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: { description: { component: docs } },
  },
  args: {
    _type: "module.lead-magnet",
    heading: "Recevez le guide gratuit",
    body: "Entrez votre e-mail et on vous l'envoie tout de suite.",
    emailPlaceholder: "vous@exemple.com",
    buttonLabel: "Recevoir le document",
    consentText:
      "J'accepte de recevoir ce document et que mon adresse e-mail soit conservée à cette fin.",
    variant: "card",
    magnet: { id: "guide-2026" },
  },
  argTypes: {
    variant: { control: "radio", options: ["card", "inline", "banner"] },
  },
} satisfies Meta<typeof LeadMagnetForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {};
export const Inline: Story = { args: { variant: "inline" } };
export const Banner: Story = { args: { variant: "banner" } };

/** Behavior: submit is gated on consent (no network — the `fetch` is inert). */
export const EnablesOnConsent: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole("button", { name: "Recevoir le document" });
    await expect(submit).toBeDisabled();
    await userEvent.type(canvas.getByRole("textbox"), "reader@example.com");
    await userEvent.click(canvas.getByRole("checkbox"));
    await expect(submit).toBeEnabled();
  },
};
