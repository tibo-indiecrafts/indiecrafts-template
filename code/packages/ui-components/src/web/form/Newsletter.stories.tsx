import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NewsletterForm } from "./NewsletterForm";
import docs from "./Newsletter.md?raw";

/**
 * Stories target the client `<NewsletterForm>` (the visual half). The registered
 * `<Newsletter>` wrapper only adds the `features.newsletter` gate. The submit
 * `fetch("/api/newsletter")` is inert in Storybook — pick a variant to compare
 * layouts; the success/already/error states show against the live route.
 */
const meta = {
  title: "UI Components/Newsletter",
  component: NewsletterForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: { description: { component: docs } },
  },
  args: {
    _type: "module.newsletter",
    heading: "Restez au courant",
    body: "Un e-mail par mois. Les nouveautés, rien de plus.",
    emailPlaceholder: "vous@exemple.com",
    buttonLabel: "S'inscrire",
    consentText:
      "J'accepte de recevoir l'infolettre et que mon adresse e-mail soit conservée à cette fin.",
    variant: "card",
  },
  argTypes: {
    variant: { control: "radio", options: ["card", "inline", "banner"] },
  },
} satisfies Meta<typeof NewsletterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {};
export const Inline: Story = { args: { variant: "inline" } };
export const Banner: Story = { args: { variant: "banner" } };
