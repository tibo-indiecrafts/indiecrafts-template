import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta: Meta<typeof FormField> = {
  title: "UI Primitives/Form",
  component: FormField,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof FormField>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="border-border bg-card w-[420px] rounded-xl border p-6">
    {children}
  </div>
);

/** Default — `email` + `username` with a `required` validation rule. */
export const Default: Story = {
  render: () => {
    const form = useForm<{ email: string; username: string }>({
      defaultValues: { email: "", username: "" },
    });
    return (
      <Frame>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(() => {})}>
            <FormField
              control={form.control}
              name="email"
              rules={{ required: "Email is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    We never share your address with anyone else.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="indiecrafter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Sign up</Button>
          </form>
        </Form>
      </Frame>
    );
  },
};

/**
 * With validation errors — pre-triggers `form.trigger()` so `FormMessage`
 * renders the required-field errors immediately. Demonstrates the
 * `aria-invalid` styling on `Input`.
 */
export const WithErrors: Story = {
  render: () => {
    const form = useForm<{ email: string; password: string }>({
      defaultValues: { email: "not-an-email", password: "" },
      mode: "all",
    });
    useEffect(() => {
      void form.trigger();
    }, [form]);
    return (
      <Frame>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(() => {})}>
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: { value: /.+@.+\..+/, message: "Enter a valid email" },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Sign in</Button>
          </form>
        </Form>
      </Frame>
    );
  },
};

/** Mixed inputs — `Input`, `Textarea`, `Select`, `Checkbox` all wired through `FormField`. */
export const MixedInputs: Story = {
  render: () => {
    const form = useForm<{
      name: string;
      message: string;
      topic: string;
      consent: boolean;
    }>({
      defaultValues: { name: "", message: "", topic: "", consent: false },
    });
    return (
      <Frame>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(() => {})}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ada Lovelace" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pick a topic" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bug">Bug report</SelectItem>
                      <SelectItem value="feature">Feature request</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormDescription>Markdown is supported.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="consent"
              rules={{ required: "You must accept the terms" }}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(v) => field.onChange(v === true)}
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel>I agree to the terms</FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit">Send</Button>
          </form>
        </Form>
      </Frame>
    );
  },
};

/** Disabled — the entire form is read-only via `disabled` on each input. */
export const Disabled: Story = {
  render: () => {
    const form = useForm<{ name: string; bio: string }>({
      defaultValues: { name: "Jane Doe", bio: "Writes a lot of TypeScript." },
    });
    return (
      <Frame>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(() => {})}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea disabled rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled>
              Save
            </Button>
          </form>
        </Form>
      </Frame>
    );
  },
};
