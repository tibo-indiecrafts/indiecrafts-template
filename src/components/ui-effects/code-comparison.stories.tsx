import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeComparison } from "./code-comparison";

const meta: Meta<typeof CodeComparison> = {
  title: "UI Effects/Code/CodeComparison",
  component: CodeComparison,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CodeComparison>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full px-6 py-10">{children}</div>
);

const BUTTON_BEFORE = `export function Button({ children }) {
  return (
    <button onClick={() => alert("clicked")}>
      {children}
    </button>
  );
}`;

const BUTTON_AFTER = `import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, children, ...props }: Props) {
  return (
    <button
      type="button"
      className={cn("rounded-md bg-brand px-4 py-2", className)}
      {...props}
    >
      {children}
    </button>
  );
}`;

const PYTHON_BEFORE = `def fetch_user(id):
    user = db.query("SELECT * FROM users WHERE id = " + id)
    return user`;

const PYTHON_AFTER = `def fetch_user(id: int) -> User | None:
    user = db.query("SELECT * FROM users WHERE id = ?", id)
    return user`;

const TS_BEFORE = `function getUser(id) {
  const user = users.find(u => u.id === id);
  if (!user) throw new Error('Not found');
  return user.name.toUpperCase();
}`;

const TS_AFTER = `function getUser(id: string): string {
  const user = users.find((u) => u.id === id);
  if (!user) throw new Error(\`User \${id} not found\`);
  return user.name.toUpperCase();
}`;

/** Default — refactor of an untyped Button into a typed shadcn-style one. */
export const Default: Story = {
  render: () => (
    <Frame>
      <CodeComparison
        beforeCode={BUTTON_BEFORE}
        afterCode={BUTTON_AFTER}
        language="tsx"
        filename="Button.tsx"
        lightTheme="github-light"
        darkTheme="github-dark"
      />
    </Frame>
  ),
};

/**
 * Python diff — exercises a non-TS language and shows a SQL-injection fix
 * with a parameterised query.
 */
export const Python: Story = {
  render: () => (
    <Frame>
      <CodeComparison
        beforeCode={PYTHON_BEFORE}
        afterCode={PYTHON_AFTER}
        language="python"
        filename="users.py"
        lightTheme="github-light"
        darkTheme="github-dark"
      />
    </Frame>
  ),
};

/** Vivid theme pair — `vitesse-light` / `tokyo-night`. */
export const VividThemes: Story = {
  render: () => (
    <Frame>
      <CodeComparison
        beforeCode={TS_BEFORE}
        afterCode={TS_AFTER}
        language="typescript"
        filename="get-user.ts"
        lightTheme="vitesse-light"
        darkTheme="tokyo-night"
      />
    </Frame>
  ),
};

/** Custom highlight color — orange instead of red for the diff sidebar. */
export const CustomHighlightColor: Story = {
  render: () => (
    <Frame>
      <CodeComparison
        beforeCode={BUTTON_BEFORE}
        afterCode={BUTTON_AFTER}
        language="tsx"
        filename="Button.tsx"
        lightTheme="github-light"
        darkTheme="github-dark"
        highlightColor="#f59e0b"
      />
    </Frame>
  ),
};
