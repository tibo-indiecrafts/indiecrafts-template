import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LoginForm } from "./index";

const meta: Meta<typeof LoginForm> = {
  title: "UI Molecules/AuthForm/Login",
  component: LoginForm,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginForm>;

const FullScreenShell = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-muted/40 flex min-h-screen w-full items-center justify-center p-6">
    <div className="w-full max-w-sm">{children}</div>
  </div>
);

export const Default: Story = {
  render: () => (
    <FullScreenShell>
      <LoginForm />
    </FullScreenShell>
  ),
};

export const CustomLinks: Story = {
  render: () => (
    <FullScreenShell>
      <LoginForm
        brandHref="/home"
        signupHref="/auth/signup"
        termsHref="/legal/terms"
        privacyHref="/legal/privacy"
      />
    </FullScreenShell>
  ),
};

export const SplitHero: Story = {
  name: "Side-by-side hero",
  render: () => (
    <div className="grid min-h-screen w-full md:grid-cols-2">
      <div className="bg-muted relative hidden md:block">
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.45_0.18_265)] to-[oklch(0.65_0.20_300)] opacity-90" />
        <div className="text-background relative z-10 flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-2 font-semibold">Acme Inc.</div>
          <blockquote className="space-y-2">
            <p className="text-lg leading-relaxed">
              &ldquo;This template saved our team weeks of foundation work — the auth
              flows alone shipped on day one.&rdquo;
            </p>
            <footer className="text-sm opacity-90">— Sofia Davis, CTO</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  ),
};
