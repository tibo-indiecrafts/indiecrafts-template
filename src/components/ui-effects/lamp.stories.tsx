import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { motion } from "motion/react";
import { LampContainer } from "./lamp";

const meta: Meta<typeof LampContainer> = {
  title: "UI Effects/Lamp",
  component: LampContainer,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LampContainer>;

const Title = ({ children }: { children: React.ReactNode }) => (
  <motion.h1
    initial={{ opacity: 0.5, y: 100 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
    className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text py-4 text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
  >
    {children}
  </motion.h1>
);

/**
 * Default — the canonical Aceternity lamp hero. The conic gradients widen on
 * mount via `whileInView`, the cyan glow blooms, and the heading floats up
 * from below.
 */
export const Default: Story = {
  render: () => (
    <LampContainer>
      <Title>
        Build lamps <br /> the right way
      </Title>
    </LampContainer>
  ),
};

/** Single-line title — works equally well with shorter copy. */
export const SingleLineTitle: Story = {
  render: () => (
    <LampContainer>
      <Title>One radiant headline</Title>
    </LampContainer>
  ),
};

/** With subtitle — heading + supporting copy beneath it. */
export const WithSubtitle: Story = {
  render: () => (
    <LampContainer>
      <Title>Indiecrafts</Title>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: "easeInOut" }}
        className="mt-4 max-w-md text-center text-base text-slate-300/80"
      >
        Fork the template, edit a few config files, ship a client site by the
        end of the weekend.
      </motion.p>
    </LampContainer>
  ),
};

/**
 * With CTA — heading + button anchored above the lamp. Useful as a hero
 * section template.
 */
export const WithCTA: Story = {
  render: () => (
    <LampContainer>
      <Title>Light it up</Title>
      <motion.a
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8, ease: "easeInOut" }}
        href="#cta"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-2 text-sm font-medium text-white shadow-lg transition-colors hover:bg-cyan-400"
      >
        Get started →
      </motion.a>
    </LampContainer>
  ),
};
