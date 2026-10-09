import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { FormFrame, type FormVariant } from "./FormFrame";
import { FormInput, GuardedFields, SubmitButton } from "./GuardedFields";
import { useGuardedSubmit } from "./useGuardedSubmit";
import docs from "./FormFrame.md?raw";

/**
 * A new form, built from the shared parts: its own field, its endpoint, nothing else. The
 * frame, the honeypot, the consent box, Turnstile and the guarded submit come with it.
 * The `fetch("/api/example")` is inert in Storybook.
 */
function ExampleForm({
  variant,
  heading,
  body,
}: {
  variant: FormVariant;
  heading: string;
  body: string;
}) {
  const [email, setEmail] = useState("");
  const guard = useGuardedSubmit("/api/example");
  const banner = variant === "banner";
  return (
    <FormFrame
      variant={variant}
      heading={heading}
      body={body}
      done={guard.status === "success"}
      success="Merci, c'est noté."
    >
      <GuardedFields
        guard={guard}
        onSubmit={() => guard.submit({ email })}
        consentText="J'accepte que mon adresse e-mail soit conservée pour me recontacter."
        errorText="Une erreur s'est produite. Merci de réessayer."
        banner={banner}
        footer={
          <SubmitButton guard={guard} banner={banner} className="w-full">
            Être rappelé
          </SubmitButton>
        }
      >
        <FormInput
          id={`${guard.uid}-email`}
          label="vous@exemple.com"
          banner={banner}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </GuardedFields>
    </FormFrame>
  );
}

const meta = {
  title: "UI Components/FormFrame",
  component: ExampleForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: { description: { component: docs } },
  },
  args: {
    variant: "card",
    heading: "Être rappelé",
    body: "Laissez votre adresse, nous revenons vers vous sous 24 h.",
  },
  argTypes: {
    variant: { control: "radio", options: ["card", "inline", "banner"] },
  },
} satisfies Meta<typeof ExampleForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {};
export const Banner: Story = { args: { variant: "banner" } };

/** The guard comes with the frame: submit stays disabled until consent is ticked. */
export const EnablesOnConsent: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole("button", { name: "Être rappelé" });
    await expect(submit).toBeDisabled();
    await userEvent.click(canvas.getByRole("checkbox"));
    await expect(submit).toBeEnabled();
  },
};
