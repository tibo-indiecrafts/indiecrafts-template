import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WaitlistForm } from "./WaitlistForm";
import docs from "./Waitlist.md?raw";

/**
 * Stories target the client `<WaitlistForm>` (the visual half). The registered
 * `<Waitlist>` wrapper only adds the `features.waitlist` gate. The submit
 * `fetch("/api/waitlist")` is inert in Storybook — pick a variant to compare
 * layouts; set `namePlaceholder` to show the optional name field.
 */
const meta = {
  title: "UI Components/Waitlist",
  component: WaitlistForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: { description: { component: docs } },
  },
  args: {
    _type: "module.waitlist",
    heading: "Rejoignez l'accès anticipé",
    body: "Soyez les premiers prévenus au lancement.",
    emailPlaceholder: "vous@exemple.com",
    buttonLabel: "Rejoindre la liste",
    consentText:
      "J'accepte d'être contacté·e au sujet de l'accès anticipé et que mon adresse e-mail soit conservée à cette fin.",
    variant: "card",
  },
  argTypes: {
    variant: { control: "radio", options: ["card", "inline", "banner"] },
  },
} satisfies Meta<typeof WaitlistForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {};
export const WithName: Story = { args: { namePlaceholder: "Votre nom" } };
export const Inline: Story = { args: { variant: "inline" } };
export const Banner: Story = { args: { variant: "banner" } };
