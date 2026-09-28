import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { WaitlistForm } from "./WaitlistForm";
import docs from "./Waitlist.md?raw";

/**
 * Stories target the client `<WaitlistForm>` (the visual half). The registered
 * `<Waitlist>` wrapper only adds the `features.waitlist` gate. The submit
 * `fetch("/api/waitlist")` is inert in Storybook — pick a variant to compare
 * layouts; set `namePlaceholder` to show the optional name field.
 */
const meta = {
  title: "Web/UI Components/Waitlist",
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

/** Behavior: submit is gated on consent (no network — the `fetch` is inert). */
export const EnablesOnConsent: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole("button", { name: "Rejoindre la liste" });
    await expect(submit).toBeDisabled();
    await userEvent.type(canvas.getByRole("textbox"), "reader@example.com");
    await userEvent.click(canvas.getByRole("checkbox"));
    await expect(submit).toBeEnabled();
  },
};
