/**
 * The sign-in screen's OTP state machine — pure state transitions only, no Clerk or
 * react-intl imports. `SignInForm` (`app/sign-in.tsx`) owns every Clerk call and
 * dispatches an action once each call settles; this reducer just computes the next
 * `{step, mode, busy, error}`. `error` holds an i18n message id (e.g. "auth.error"),
 * translated by the component at render time — not the translated text itself.
 */

export type Step = "email" | "code";
export type Mode = "signin" | "signup";

export interface State {
  step: Step;
  mode: Mode;
  busy: boolean;
  error: string | null;
}

export type Action =
  | { type: "submit" }
  | { type: "codeSent"; mode: Mode }
  | { type: "settled" }
  | { type: "failed" }
  | { type: "changeEmail" };

export const initialState: State = {
  step: "email",
  mode: "signin",
  busy: false,
  error: null,
};

export function signInReducer(state: State, action: Action): State {
  switch (action.type) {
    case "submit":
      return { ...state, busy: true, error: null };
    case "codeSent":
      return {
        ...state,
        step: "code",
        mode: action.mode,
        busy: false,
        error: null,
      };
    case "settled":
      return { ...state, busy: false };
    case "failed":
      return { ...state, busy: false, error: "auth.error" };
    case "changeEmail":
      return { ...state, step: "email" };
    default:
      return state;
  }
}
