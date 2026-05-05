import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SignupForm } from "./index";

const meta: Meta<typeof SignupForm> = {
  title: "UI Molecules/AuthForm/Signup",
  component: SignupForm,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof SignupForm>;

const FullScreenShell = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-muted/40 flex min-h-screen w-full items-center justify-center p-6">
    <div className="w-full max-w-4xl">{children}</div>
  </div>
);

const sampleIllustration =
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&q=80&auto=format&fit=crop";

export const Default: Story = {
  render: () => (
    <FullScreenShell>
      <SignupForm illustrationSrc={sampleIllustration} />
    </FullScreenShell>
  ),
};

export const PlaceholderArt: Story = {
  name: "Placeholder illustration",
  render: () => (
    <FullScreenShell>
      <SignupForm illustrationSrc="/placeholder.svg" />
    </FullScreenShell>
  ),
};
