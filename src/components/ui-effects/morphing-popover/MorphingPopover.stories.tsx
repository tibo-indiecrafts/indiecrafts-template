import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowLeftIcon } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";

import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";

import { MorphingPopover, MorphingPopoverContent, MorphingPopoverTrigger } from "./index";

const meta: Meta<typeof MorphingPopover> = {
  title: "UI Effects/Modals & Overlays/MorphingPopover",
  component: MorphingPopover,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MorphingPopover>;

function DimensionsForm({ labelId }: { labelId: string }) {
  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <motion.h4
          layoutId={labelId}
          layout="position"
          className="leading-none font-medium"
        >
          Dimensions
        </motion.h4>
        <p className="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
      </div>
      <div className="grid gap-2">
        {[
          { id: "width", label: "Width", value: "100%", autoFocus: true },
          { id: "maxWidth", label: "Max. width", value: "300px" },
          { id: "height", label: "Height", value: "25px" },
          { id: "maxHeight", label: "Max. height", value: "none" },
        ].map((field) => (
          <div key={field.id} className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              defaultValue={field.value}
              className="col-span-2 h-8"
              // eslint-disable-next-line jsx-a11y/no-autofocus -- expected behavior: focus the first field when the popover opens
              autoFocus={field.autoFocus}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export const Basic: Story = {
  render: () => (
    <div className="flex h-[480px] w-[480px] items-center justify-center">
      <MorphingPopover>
        <MorphingPopoverTrigger asChild>
          <Button variant="outline">
            <motion.span layoutId="morphing-popover-basic-label" layout="position">
              Open popover
            </motion.span>
          </Button>
        </MorphingPopoverTrigger>
        <MorphingPopoverContent className="w-80 p-4 shadow-sm">
          <DimensionsForm labelId="morphing-popover-basic-label" />
        </MorphingPopoverContent>
      </MorphingPopover>
    </div>
  ),
};

export const CustomTransitionVariants: Story = {
  render: () => (
    <div className="flex h-[480px] w-[480px] items-center justify-center">
      <MorphingPopover
        variants={{
          initial: { opacity: 0, filter: "blur(10px)" },
          animate: { opacity: 1, filter: "blur(0px)" },
          exit: { opacity: 0, filter: "blur(10px)" },
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <MorphingPopoverTrigger asChild>
          <Button variant="outline">
            <motion.span
              layoutId="morphing-popover-custom-label"
              layout="position"
              className="inline-block"
            >
              Open popover
            </motion.span>
          </Button>
        </MorphingPopoverTrigger>
        <MorphingPopoverContent className="w-80 p-4 shadow-sm">
          <DimensionsForm labelId="morphing-popover-custom-label" />
        </MorphingPopoverContent>
      </MorphingPopover>
    </div>
  ),
};

export const Textarea: Story = {
  render: () => {
    function Demo() {
      const uniqueId = React.useId();
      const [note, setNote] = React.useState("");
      const [isOpen, setIsOpen] = React.useState(false);

      const closeMenu = () => {
        setNote("");
        setIsOpen(false);
      };

      return (
        <div className="flex h-[480px] w-[480px] items-center justify-center">
          <MorphingPopover
            transition={{ type: "spring", bounce: 0.05, duration: 0.3 }}
            open={isOpen}
            onOpenChange={setIsOpen}
          >
            <MorphingPopoverTrigger className="flex h-9 items-center rounded-lg border border-zinc-950/10 bg-white px-3 text-zinc-950 dark:border-zinc-50/10 dark:bg-zinc-700 dark:text-zinc-50">
              <motion.span layoutId={`popover-label-${uniqueId}`} className="text-sm">
                Add Note
              </motion.span>
            </MorphingPopoverTrigger>
            <MorphingPopoverContent className="rounded-xl border border-zinc-950/10 bg-white p-0 shadow-md dark:bg-zinc-700">
              <div className="h-[200px] w-[364px]">
                <form
                  className="flex h-full flex-col"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <motion.span
                    layoutId={`popover-label-${uniqueId}`}
                    aria-hidden="true"
                    style={{ opacity: note ? 0 : 1 }}
                    className="absolute top-3 left-4 text-sm text-zinc-500 select-none dark:text-zinc-400"
                  >
                    Add Note
                  </motion.span>
                  <textarea
                    aria-label="Note"
                    className="h-full w-full resize-none rounded-md bg-transparent px-4 py-3 text-sm outline-hidden"
                    // eslint-disable-next-line jsx-a11y/no-autofocus -- expected behavior: focus the textarea when the popover opens
                    autoFocus
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <div className="flex justify-between py-3 pr-4 pl-2">
                    <button
                      type="button"
                      aria-label="Close popover"
                      onClick={closeMenu}
                      className="flex items-center rounded-lg bg-white px-2 py-1 text-sm text-zinc-950 hover:bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-600"
                    >
                      <ArrowLeftIcon
                        size={16}
                        aria-hidden="true"
                        className="text-zinc-900 dark:text-zinc-100"
                      />
                    </button>
                    <button
                      type="submit"
                      aria-label="Submit note"
                      onClick={closeMenu}
                      className="relative ml-1 flex h-8 shrink-0 items-center justify-center rounded-lg border border-zinc-950/10 bg-transparent px-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:text-zinc-50 dark:hover:bg-zinc-800"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </MorphingPopoverContent>
          </MorphingPopover>
        </div>
      );
    }
    return <Demo />;
  },
};
