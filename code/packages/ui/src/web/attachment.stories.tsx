import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FileTextIcon, XIcon } from "lucide-react";
import {
  Attachment,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
} from "./attachment";
import docs from "./attachment.md?raw";

const meta = {
  title: "UI/Attachment",
  component: Attachment,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Attachment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Attachment>
      <AttachmentMedia variant="icon">
        <FileTextIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>report.pdf</AttachmentTitle>
        <AttachmentDescription>PDF · 248 KB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Remove">
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  ),
};

export const ImageThumbnail: Story = {
  render: () => (
    <Attachment orientation="vertical">
      <AttachmentMedia variant="image">
        <img src="https://picsum.photos/seed/craft/96/96" alt="" />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>cover.jpg</AttachmentTitle>
        <AttachmentDescription>JPG · 1.2 MB</AttachmentDescription>
      </AttachmentContent>
    </Attachment>
  ),
};
