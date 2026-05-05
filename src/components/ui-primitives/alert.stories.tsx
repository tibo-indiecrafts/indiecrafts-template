import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";

const meta: Meta<typeof Alert> = {
  title: "UI Primitives/Alert",
  component: Alert,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Alert>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[460px] max-w-full">{children}</div>
);

/** Default variant — informational tone. */
export const Default: Story = {
  render: () => (
    <Frame>
      <Alert>
        <Info />
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>
          You can add components to your app using the CLI.
        </AlertDescription>
      </Alert>
    </Frame>
  ),
};

/** Destructive variant — for errors and failed actions. */
export const Destructive: Story = {
  render: () => (
    <Frame>
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Could not save</AlertTitle>
        <AlertDescription>Your session expired. Sign in again to retry.</AlertDescription>
      </Alert>
    </Frame>
  ),
};

/** Title-only — description omitted, layout collapses correctly. */
export const TitleOnly: Story = {
  render: () => (
    <Frame>
      <Alert>
        <CheckCircle2 />
        <AlertTitle>Settings saved.</AlertTitle>
      </Alert>
    </Frame>
  ),
};

/** No icon — grid collapses to a single column. */
export const NoIcon: Story = {
  render: () => (
    <Frame>
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>
          The grid switches to single-column when no <code>&lt;svg&gt;</code> direct child
          is present.
        </AlertDescription>
      </Alert>
    </Frame>
  ),
};
