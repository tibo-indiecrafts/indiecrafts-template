---
title: "Sign-in state machine"
description: "A pure reducer for the sign-in screen's OTP flow, with no Clerk or react-intl imports."
status: stable
---

# Sign-in state machine

> The pure OTP state transitions behind the sign-in screen.

## Purpose

Holds the sign-in screen's OTP state machine as pure state transitions only. `SignInForm` owns every Clerk call and dispatches an action once each call settles; this reducer just computes the next `{ step, mode, busy, error }`. `error` holds an i18n message id, translated by the component at render time.

## Exports

- `Step` — the flow step type (`"email" | "code"`).
- `Mode` — the flow mode type (`"signin" | "signup"`).
- `State` — the reducer state interface.
- `Action` — the discriminated action union.
- `initialState` — the starting state.
- `signInReducer(state, action)` — the pure transition function.

## Usage

```ts
import { useReducer } from "react";
import { signInReducer, initialState } from "@/lib/sign-in-machine";

const [state, dispatch] = useReducer(signInReducer, initialState);
dispatch({ type: "submit" });
```

## Source

`code/projects/mobile/surfaces/main/lib/sign-in-machine.ts`
