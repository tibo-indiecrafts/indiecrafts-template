---
title: "Field"
description: "Layout and labelling slots for building accessible form fields."
status: stable
---

# Field

> Composable form-field layout: sets, legends, groups, labels, descriptions, errors, and separators.

## Purpose

The `Field` components build a form field's structure and spacing without owning the input itself. `Field` supports vertical, horizontal, and responsive orientations; `FieldError` renders one message or a de-duplicated bulleted list from an `errors` array. These slots wrap the shared `Label` and `Separator` primitives.

## Exports

- `Field` — one field row; `orientation` is `vertical`, `horizontal`, or `responsive`.
- `FieldLabel` — a label styled for a field; can wrap a nested field for checkbox cards.
- `FieldDescription` — supporting text for a field.
- `FieldError` — an error slot; accepts `children` or an `errors` array of `{ message }`.
- `FieldGroup` — a container-query group of fields.
- `FieldLegend` — a fieldset legend; `variant` is `legend` or `label`.
- `FieldSeparator` — a divider with optional centered content.
- `FieldSet` — a `fieldset` wrapper.
- `FieldContent` — a flex column beside a control.
- `FieldTitle` — a title styled like a label without the `htmlFor` semantics.

## Usage

```tsx
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@indiecrafts/packages-web-ui/web/field";
import { Input } from "@indiecrafts/packages-web-ui/web/input";

export function EmailField() {
  return (
    <Field>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input id="email" type="email" />
      <FieldDescription>We never share it.</FieldDescription>
      <FieldError errors={[{ message: "Required" }]} />
    </Field>
  );
}
```

## Source

`code/packages/web/ui/src/web/field.tsx`
