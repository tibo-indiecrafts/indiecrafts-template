import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Plane } from "lucide-react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "./animated-modal";

const meta: Meta<typeof Modal> = {
  title: "UI Effects/AnimatedModal",
  component: Modal,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Modal>;

/** Trigger + body composition. Click trigger again to close, or click outside. */
export const Default: Story = {
  render: () => (
    <Modal>
      <ModalTrigger className="bg-foreground text-background flex h-10 items-center rounded-md px-4 text-sm font-medium">
        Open modal
      </ModalTrigger>
      <ModalBody>
        <ModalContent>
          <h3 className="text-2xl font-semibold">Animated modal</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Click the trigger again to close. Click outside the body to dismiss.
          </p>
        </ModalContent>
        <ModalFooter className="gap-2">
          <button className="text-sm">Cancel</button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  ),
};

/**
 * Form composition — illustrates the typical use case: a labelled modal with
 * inputs and a confirm/cancel pair in the footer.
 */
export const Form: Story = {
  render: () => (
    <Modal>
      <ModalTrigger className="bg-foreground text-background flex h-10 items-center gap-2 rounded-md px-4 text-sm font-medium">
        <Plane className="size-4" />
        Book a flight
      </ModalTrigger>
      <ModalBody>
        <ModalContent>
          <h3 className="text-center text-2xl font-semibold">
            Book your trip to Iceland ✈️
          </h3>
          <p className="text-muted-foreground mt-2 text-center text-sm">
            Northern lights await. We&apos;ll have you there before next weekend.
          </p>
          <div className="mt-6 grid gap-3">
            <label className="grid gap-1 text-sm">
              From
              <input
                className="border-input rounded-md border bg-transparent px-3 py-2 text-sm"
                defaultValue="San Francisco (SFO)"
              />
            </label>
            <label className="grid gap-1 text-sm">
              To
              <input
                className="border-input rounded-md border bg-transparent px-3 py-2 text-sm"
                defaultValue="Reykjavik (KEF)"
              />
            </label>
          </div>
        </ModalContent>
        <ModalFooter className="gap-2">
          <button className="rounded-md border px-4 py-2 text-sm">Cancel</button>
          <button className="bg-foreground text-background rounded-md px-4 py-2 text-sm font-medium">
            Book now
          </button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  ),
};

/**
 * Long content — body extends past the visible area; the modal handles
 * scroll internally so the trigger and footer stay anchored.
 */
export const LongContent: Story = {
  render: () => (
    <Modal>
      <ModalTrigger className="bg-foreground text-background flex h-10 items-center rounded-md px-4 text-sm font-medium">
        Read terms
      </ModalTrigger>
      <ModalBody>
        <ModalContent>
          <h3 className="text-2xl font-semibold">Terms of Service</h3>
          {Array.from({ length: 8 }).map((_, i) => (
            <p key={i} className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Section {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          ))}
        </ModalContent>
        <ModalFooter className="gap-2">
          <button className="bg-foreground text-background rounded-md px-4 py-2 text-sm font-medium">
            Accept
          </button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  ),
};
