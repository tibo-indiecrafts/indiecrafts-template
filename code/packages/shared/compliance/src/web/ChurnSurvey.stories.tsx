import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChurnSurvey } from "./ChurnSurvey";

/**
 * The optional churn exit-survey shown inside `DeleteAccountSection` — reason (radio) +
 * free-text feedback + who they're switching to. Controlled + copy-injected (no next-intl).
 */
const copy = {
  legend: "Before you go, help us improve (optional)",
  reasonLabel: "What's the main reason you're leaving?",
  reasons: {
    too_expensive: "Too expensive",
    not_using: "Not using it enough",
    missing_feature: "Missing a feature I need",
    found_alternative: "Found a better alternative",
    too_hard: "Too hard to use",
    privacy: "Privacy concerns",
    other: "Other",
  },
  feedbackLabel: "Anything else you'd like to tell us?",
  feedbackPlaceholder: "Your feedback helps us improve…",
  competitorLabel: "Who are you switching to?",
  competitorPlaceholder: "e.g. Acme",
};

const meta = {
  title: "Web/Compliance/ChurnSurvey",
  component: ChurnSurvey,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy,
    idPrefix: "story",
    reason: "",
    feedback: "",
    competitor: "",
    onReason: () => {},
    onFeedback: () => {},
    onCompetitor: () => {},
  },
} satisfies Meta<typeof ChurnSurvey>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A stateful wrapper so the radio + text fields actually update in the gallery. */
export const Interactive: Story = {
  render: (args) => {
    const [reason, setReason] = useState("");
    const [feedback, setFeedback] = useState("");
    const [competitor, setCompetitor] = useState("");
    return (
      <ChurnSurvey
        {...args}
        reason={reason}
        feedback={feedback}
        competitor={competitor}
        onReason={setReason}
        onFeedback={setFeedback}
        onCompetitor={setCompetitor}
      />
    );
  },
};
