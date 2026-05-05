import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import FileUploadSection from "./FileUpload";
import { fileUpload06Sample } from "./config";

const meta: Meta<typeof FileUploadSection> = {
  title: "Sections/FileUpload/FileUpload06",
  component: FileUploadSection,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="mx-auto flex w-full max-w-5xl justify-center pt-12">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof FileUploadSection>;

export const Default: Story = {
  args: { ...fileUpload06Sample, id: "file-upload-06-default" },
};
