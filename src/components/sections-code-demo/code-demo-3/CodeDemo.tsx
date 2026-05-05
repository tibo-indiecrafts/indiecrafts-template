import { LoginPreviewIllustration } from "@/components/ui-illustrations/login-preview-illustration";
import { CodeWithPreview } from "@/components/ui-molecules/code/code-with-preview";
import type { CodeDemoBlock } from "./schema";

export default function CodeDemo(props: Readonly<CodeDemoBlock>) {
  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background @container py-24"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        SDK preview
      </h2>
      <div className="mx-auto w-full max-w-5xl px-6 xl:px-0">
        <CodeWithPreview preview={<LoginPreviewIllustration />} />
      </div>
    </section>
  );
}
