import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LeadMagnetForm } from "./LeadMagnetForm";
import docs from "./LeadMagnet.md?raw";

/**
 * Stories target the client `<LeadMagnetForm>` (the visual half). The registered
 * `<LeadMagnet>` wrapper only adds the `features.newsletter` gate. The submit
 * `fetch("/api/newsletter")` is inert in Storybook — pick a variant to compare
 * layouts; the success/already/error states show against the live route.
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
