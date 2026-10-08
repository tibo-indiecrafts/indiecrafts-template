import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { NewsletterForm } from "./NewsletterForm";
import docs from "./Newsletter.md?raw";

/**
 * Stories target the client `<NewsletterForm>` (the visual half). The registered
 * `<Newsletter>` wrapper only adds the `features.newsletter` gate. The submit
 * `fetch("/api/newsletter")` is inert in Storybook — pick a variant to compare
 * layouts; the success/error states show against the live route.
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

/**
 * Behavior: submit is gated on consent (Turnstile is inactive without a site key,
 * so consent alone toggles it). No network — the `fetch` is inert in Storybook.
 */
export const EnablesOnConsent: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole("button", { name: "S'inscrire" });
    await step("submit is disabled until consent is given", async () => {
      await expect(submit).toBeDisabled();
    });
    await userEvent.type(canvas.getByRole("textbox"), "reader@example.com");
    await userEvent.click(canvas.getByRole("checkbox"));
    await step("consent enables submit", async () => {
      await expect(submit).toBeEnabled();
    });
  },
};

/** Copy left empty in Studio falls back to the page language (English here, the Storybook
 *  default) — never to French — and the consent box still shows and gates submit. */
export const FallbackCopy: Story = {
  args: {
    emailPlaceholder: undefined,
    buttonLabel: undefined,
    consentText: undefined,
    successMessage: undefined,
    errorMessage: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole("button", { name: "Subscribe" });
    await expect(submit).toBeDisabled();
    await userEvent.type(
      canvas.getByPlaceholderText("you@example.com"),
      "reader@example.com",
    );
    await userEvent.click(
      canvas.getByRole("checkbox", { name: /receive the newsletter/ }),
    );
    await expect(submit).toBeEnabled();
  },
};
