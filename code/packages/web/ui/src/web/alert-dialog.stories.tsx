import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "./alert-dialog";
import docs from "./alert-dialog.md?raw";
import { Button } from "./button";

const meta = {
  title: "Web/UI/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes your account and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/** Behavior: trigger opens the alert dialog (portalled), Cancel dismisses it. */
export const Opens: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Delete account" }),
    );
    const dialog = await screen.findByRole("alertdialog");
    await expect(
      within(dialog).getByText("Are you absolutely sure?"),
    ).toBeVisible();
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Cancel" }),
    );
    await waitFor(() =>
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
    );
  },
};
