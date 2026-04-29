import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { toast } from "sonner";
import { Button } from "./button";
import { Toaster } from "./sonner";

const meta: Meta<typeof Toaster> = {
  title: "UI Primitives/Sonner",
  component: Toaster,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Toaster>;

const Trigger = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <Button variant="outline" onClick={onClick}>
    {label}
  </Button>
);

/** Default toast — neutral confirmation. */
export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <Trigger
        label="Show toast"
        onClick={() =>
          toast("Settings saved", {
            description: "Your changes are live.",
          })
        }
      />
    </>
  ),
};

/** Severity variants — success / warning / error. */
export const Variants: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-3">
        <Trigger
          label="Success"
          onClick={() => toast.success("Profile updated")}
        />
        <Trigger
          label="Info"
          onClick={() => toast.info("New version available")}
        />
        <Trigger
          label="Warning"
          onClick={() => toast.warning("Session about to expire")}
        />
        <Trigger
          label="Error"
          onClick={() =>
            toast.error("Could not save", {
              description: "Try again or contact support.",
            })
          }
        />
      </div>
    </>
  ),
};

/** With an action button — undo pattern. */
export const WithAction: Story = {
  render: () => (
    <>
      <Toaster />
      <Trigger
        label="Delete with undo"
        onClick={() =>
          toast("Item deleted", {
            action: {
              label: "Undo",
              onClick: () => toast.success("Restored"),
            },
          })
        }
      />
    </>
  ),
};

/** Promise — pending → resolved/rejected lifecycle. */
export const Promise: Story = {
  render: () => (
    <>
      <Toaster />
      <Trigger
        label="Run async task"
        onClick={() => {
          const job = new globalThis.Promise<{ name: string }>((resolve) =>
            setTimeout(() => resolve({ name: "report.pdf" }), 1500),
          );
          toast.promise(job, {
            loading: "Generating report…",
            success: (data) => `${data.name} ready`,
            error: "Generation failed",
          });
        }}
      />
    </>
  ),
};
