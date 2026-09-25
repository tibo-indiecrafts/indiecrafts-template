---
title: "Form"
description: "React Hook Form bindings that wire labels, controls, and messages to field state."
status: stable
---

# Form

> Accessible form primitives over React Hook Form, linking each field's label, control, description, and error.

## Purpose

The `Form` components bind React Hook Form to the design-system label and message styling. `FormField` binds one registered field, and `useFormField` reads its state and generates the ids that connect the label, control, description, and message for accessibility. `FormMessage` renders the field's validation error automatically.

## Exports

- `Form` — the provider (alias of React Hook Form `FormProvider`).
- `FormField` — binds a `Controller` for one field and provides its name in context.
- `FormItem` — a field wrapper that generates a stable id.
- `FormLabel` — a label wired to the control and error state.
- `FormControl` — a `Slot` that applies id and `aria-*` attributes to the input.
- `FormDescription` — supporting text linked via `aria-describedby`.
- `FormMessage` — renders the field error, or nothing when valid.
- `useFormField` — a hook returning the field's ids and state; must be used inside `FormField`.

## Usage

```tsx
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@indiecrafts/packages-web-ui/web/form";
import { Input } from "@indiecrafts/packages-web-ui/web/input";
import { useForm } from "react-hook-form";

export function NameForm() {
  const methods = useForm({ defaultValues: { name: "" } });
  return (
    <Form {...methods}>
      <FormField
        control={methods.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}
```

## Source

`code/packages/web/ui/src/web/form.tsx`
