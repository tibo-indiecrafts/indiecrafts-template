import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { ContactForm } from "./ContactForm";
import docs from "./Contact.md?raw";

/**
 * Stories target the client `<ContactForm>` (the visual half). The registered
 * `<Contact>` wrapper only adds the `features.contact` gate. The submit
 * `fetch("/api/contact")` is inert in Storybook — pick a variant to compare
 * layouts; set `namePlaceholder` / `subjectPlaceholder` to show those fields.
 */
const meta = {
  title: "Web/UI Components/Contact",
  component: ContactForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: { description: { component: docs } },
  },
  args: {
    _type: "module.contact",
    heading: "Écrivez-nous",
    body: "Une question, un projet ? Nous répondons vite.",
    emailPlaceholder: "vous@exemple.com",
    namePlaceholder: "Votre nom",
    messagePlaceholder: "Votre message…",
    buttonLabel: "Envoyer",
    consentText:
      "J'accepte que mon message et mon adresse e-mail soient utilisés pour me répondre.",
    variant: "card",
  },
  argTypes: {
    variant: { control: "radio", options: ["card", "banner"] },
  },
} satisfies Meta<typeof ContactForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {};
export const WithSubject: Story = { args: { subjectPlaceholder: "Objet" } };
export const Banner: Story = { args: { variant: "banner" } };

/** Behavior: submit is gated on consent (no network — the `fetch` is inert). */
export const EnablesOnConsent: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole("button", { name: "Envoyer" });
    await expect(submit).toBeDisabled();
    await userEvent.type(
      canvas.getByPlaceholderText("vous@exemple.com"),
      "reader@example.com",
    );
    await userEvent.type(
      canvas.getByPlaceholderText("Votre message…"),
      "Bonjour, j'ai une question.",
    );
    await userEvent.click(canvas.getByRole("checkbox"));
    await expect(submit).toBeEnabled();
  },
};
