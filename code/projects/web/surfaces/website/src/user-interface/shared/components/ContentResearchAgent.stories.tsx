import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, spyOn, userEvent, waitFor, within } from "storybook/test";
import { ContentResearchAgent } from "./ContentResearchAgent";

/**
 * Demo UI for the shared AI agent — posts a goal to `/api/agent/content-research`
 * via `callAgent` and renders the returned ideas for human review. Exercises the
 * next-intl mock (`agent.*`). `TurnstileWidget` renders nothing here (no public
 * Turnstile site key bound in Storybook), so the submit button only needs a
 * non-empty goal. `fetch` is stubbed in the submit story — no real network call.
 */
const meta = {
  title: "Website/Shared/ContentResearchAgent",
  component: ContentResearchAgent,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof ContentResearchAgent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Idle form. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("AI content research")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Generate ideas" })).toBeDisabled();
  },
};

/** Behavior: submitting posts to the agent and renders the returned ideas. */
export const SubmitsAndShowsIdeas: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            ideas: [
              {
                topic: "Freelance pricing",
                reader: "Freelance designers",
                problem: "Underpricing retainer work",
                intent: "how to price a retainer",
                headline: "A simple retainer pricing formula",
                why: "High search volume, low competition",
              },
            ],
          },
        }),
        { status: 200 },
      ),
    );

    await userEvent.type(
      canvas.getByLabelText("Your goal"),
      "article ideas for freelance designers",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Generate ideas" }));

    await waitFor(() =>
      expect(
        canvas.getByRole("heading", { name: "A simple retainer pricing formula" }),
      ).toBeVisible(),
    );
    fetchSpy.mockRestore();
  },
};
