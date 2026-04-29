import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { FileUpload } from "./file-upload";

const meta: Meta<typeof FileUpload> = {
  title: "UI Effects/FileUpload",
  component: FileUpload,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof FileUpload>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-card mx-auto w-[480px] max-w-full rounded-2xl border border-dashed">
    {children}
  </div>
);

/** Default — drag-and-drop zone with click-to-upload fallback. */
export const Default: Story = {
  render: () => (
    <Frame>
      <FileUpload />
    </Frame>
  ),
};

/**
 * Controlled — capture uploaded files via the `onChange` callback and show
 * a small summary outside the dropzone.
 */
export const Controlled: Story = {
  render: () => {
    const Demo = () => {
      const [files, setFiles] = useState<File[]>([]);
      return (
        <div className="grid w-[480px] gap-3">
          <Frame>
            <FileUpload onChange={(next) => setFiles((prev) => [...prev, ...next])} />
          </Frame>
          <p className="text-muted-foreground text-xs">
            {files.length === 0
              ? "No files yet."
              : `${files.length} file${files.length === 1 ? "" : "s"} uploaded`}
            {files.length > 0 && (
              <>
                : <span className="font-medium">{files.map((f) => f.name).join(", ")}</span>
              </>
            )}
          </p>
        </div>
      );
    };
    return <Demo />;
  },
};

/** Inside a card — typical settings-panel pattern. */
export const InsideCard: Story = {
  render: () => (
    <div className="bg-card w-[520px] max-w-full rounded-2xl border p-6">
      <h3 className="text-lg font-semibold">Profile picture</h3>
      <p className="text-muted-foreground mt-1 mb-4 text-sm">
        Upload a square JPG or PNG. Max 1 MB.
      </p>
      <div className="rounded-xl border border-dashed">
        <FileUpload />
      </div>
    </div>
  ),
};
