import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlusIcon, XIcon } from "lucide-react";

import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from "./index";

const meta: Meta<typeof MorphingDialog> = {
  title: "UI Effects/Modals & Overlays/MorphingDialog",
  component: MorphingDialog,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MorphingDialog>;

const LAMP_IMG =
  "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop";
const BOOK_IMG =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop";
const CITY_IMG =
  "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?q=80&w=1200&auto=format&fit=crop";

export const Card: Story = {
  render: () => (
    <MorphingDialog transition={{ type: "spring", bounce: 0.05, duration: 0.25 }}>
      <MorphingDialogTrigger
        style={{ borderRadius: "12px" }}
        className="flex max-w-[270px] flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900"
      >
        <MorphingDialogImage
          src={LAMP_IMG}
          alt="A vintage double-arm desk lamp"
          className="h-48 w-full object-cover"
        />
        <div className="flex grow flex-row items-end justify-between px-3 py-2">
          <div>
            <MorphingDialogTitle className="text-zinc-950 dark:text-zinc-50">
              EB27
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className="text-zinc-700 dark:text-zinc-400">
              Edouard Wilfrid Buquet
            </MorphingDialogSubtitle>
          </div>
          <span
            aria-hidden="true"
            className="relative ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-zinc-950/10 text-zinc-500 dark:border-zinc-50/10 dark:bg-zinc-900 dark:text-zinc-500"
          >
            <PlusIcon size={12} />
          </span>
        </div>
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent
          style={{ borderRadius: "24px" }}
          className="pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white sm:w-[500px] dark:border-zinc-50/10 dark:bg-zinc-900"
        >
          <MorphingDialogImage
            src={LAMP_IMG}
            alt="A vintage double-arm desk lamp"
            className="h-full w-full"
          />
          <div className="p-6">
            <MorphingDialogTitle className="text-2xl text-zinc-950 dark:text-zinc-50">
              EB27
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className="text-zinc-700 dark:text-zinc-400">
              Edouard Wilfrid Buquet
            </MorphingDialogSubtitle>
            <MorphingDialogDescription
              disableLayoutAnimation
              variants={{
                initial: { opacity: 0, scale: 0.8, y: 100 },
                animate: { opacity: 1, scale: 1, y: 0 },
                exit: { opacity: 0, scale: 0.8, y: 100 },
              }}
            >
              <p className="mt-2 text-zinc-500 dark:text-zinc-500">
                Little is known about the life of Édouard-Wilfrid Buquet. He was born in
                France in 1866, but the time and place of his death is unfortunately a
                mystery.
              </p>
              <p className="text-zinc-500">
                Research conducted in the 1970s revealed that he’d designed the “EB 27”
                double-arm desk lamp in 1925, handcrafting it from nickel-plated brass,
                aluminium and varnished wood.
              </p>
            </MorphingDialogDescription>
          </div>
          <MorphingDialogClose className="text-zinc-50" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  ),
};

export const Book: Story = {
  render: () => (
    <MorphingDialog transition={{ type: "spring", stiffness: 200, damping: 24 }}>
      <MorphingDialogTrigger
        style={{ borderRadius: "4px" }}
        className="border border-gray-200/60 bg-white"
      >
        <div className="flex items-center space-x-3 p-3">
          <MorphingDialogImage
            src={BOOK_IMG}
            alt="Book cover"
            style={{ borderRadius: "4px" }}
            className="h-8 w-8 object-cover object-top"
          />
          <div className="flex flex-col items-start justify-center">
            <MorphingDialogTitle className="text-[10px] font-medium text-black sm:text-xs">
              What I Talk About When I Talk About Running
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className="text-[10px] text-gray-600 sm:text-xs">
              Haruki Murakami
            </MorphingDialogSubtitle>
          </div>
        </div>
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent
          style={{ borderRadius: "12px" }}
          className="relative h-auto w-[500px] border border-gray-100 bg-white"
        >
          <div className="max-h-[90vh] overflow-y-auto">
            <div className="relative p-6">
              <div className="flex justify-center py-10">
                <MorphingDialogImage
                  src={BOOK_IMG}
                  alt="Book cover"
                  className="h-auto w-[200px]"
                />
              </div>
              <MorphingDialogTitle className="text-black">
                What I Talk About When I Talk About Running
              </MorphingDialogTitle>
              <MorphingDialogSubtitle className="font-light text-gray-400">
                Haruki Murakami
              </MorphingDialogSubtitle>
              <div className="mt-4 space-y-4 text-sm text-gray-700">
                <p>
                  In 1982, having sold his jazz bar to devote himself to writing, Murakami
                  began running to keep fit. A year later, he’d completed a solo course
                  from Athens to Marathon.
                </p>
                <p>
                  Equal parts training log, travelogue, and reminiscence, this revealing
                  memoir covers his four-month preparation for the 2005 New York City
                  Marathon.
                </p>
                <p>
                  By turns funny and sobering, playful and philosophical, the book is rich
                  and revelatory.
                </p>
              </div>
            </div>
          </div>
          <MorphingDialogClose className="text-zinc-500" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  ),
};

export const Image: Story = {
  render: () => (
    <MorphingDialog transition={{ duration: 0.3, ease: "easeInOut" }}>
      <MorphingDialogTrigger>
        <MorphingDialogImage
          src={CITY_IMG}
          alt="City at night"
          className="max-w-xs rounded"
        />
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className="relative">
          <MorphingDialogImage
            src={CITY_IMG}
            alt="City at night"
            className="h-auto w-full max-w-[90vw] rounded object-cover lg:h-[90vh]"
          />
        </MorphingDialogContent>
        <MorphingDialogClose
          className="fixed top-6 right-6 h-fit w-fit rounded-full bg-white p-1"
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { delay: 0.3, duration: 0.1 } },
            exit: { opacity: 0, transition: { duration: 0 } },
          }}
        >
          <XIcon className="h-5 w-5 text-zinc-500" aria-hidden="true" />
        </MorphingDialogClose>
      </MorphingDialogContainer>
    </MorphingDialog>
  ),
};
