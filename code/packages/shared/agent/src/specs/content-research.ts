import type { AgentSpec } from "../index";
import { DEFAULT_MODEL } from "../model";

/**
 * Demo agent — the article's Content Research Agent. Given an audience + topic
 * (the caller's `context`), it returns 5 non-obvious article opportunities as
 * structured data for a human to review. Reason-only (no tools): it thinks and
 * returns a draft, it does not act.
 */
export const CONTENT_RESEARCH: AgentSpec = {
  name: "content-research",
  model: DEFAULT_MODEL,
  goal: "Identify 5 useful, non-obvious article opportunities for the audience and topic the user gives.",
  instructions: [
    "Focus on angles that are NOT the most obvious, already-overdone take on the topic.",
    "If you are not confident a claim is accurate, say so in the `why` field rather than presenting it as fact.",
    "Keep each field concise and concrete.",
  ].join("\n"),
  outputSchema: {
    type: "object",
    properties: {
      ideas: {
        type: "array",
        minItems: 5,
        maxItems: 5,
        items: {
          type: "object",
          properties: {
            topic: { type: "string", description: "The article topic." },
            reader: { type: "string", description: "The target reader." },
            problem: { type: "string", description: "The specific problem it solves for them." },
            intent: { type: "string", description: "Likely search intent — what they're trying to find." },
            headline: { type: "string", description: "A suggested headline." },
            why: { type: "string", description: "Why it's worth writing, in one sentence (flag any uncertainty here)." },
          },
          required: ["topic", "reader", "problem", "intent", "headline", "why"],
        },
      },
    },
    required: ["ideas"],
  },
};
