import { signInReducer, initialState, type State } from "./sign-in-machine";

describe("signInReducer", () => {
  it("starts on the email step, signin mode, not busy, no error", () => {
    expect(initialState).toEqual<State>({
      step: "email",
      mode: "signin",
      busy: false,
      error: null,
    });
  });

  it("submit sets busy and clears any prior error", () => {
    const start: State = { ...initialState, error: "auth.error" };
    expect(signInReducer(start, { type: "submit" })).toEqual({
      ...start,
      busy: true,
      error: null,
    });
  });

  it("codeSent (signin) moves to the code step and clears busy", () => {
    const busyState: State = { ...initialState, busy: true };
    expect(
      signInReducer(busyState, { type: "codeSent", mode: "signin" }),
    ).toEqual({ step: "code", mode: "signin", busy: false, error: null });
  });

  it("codeSent (signup) switches mode to signup and moves to the code step", () => {
    const busyState: State = { ...initialState, busy: true };
    expect(
      signInReducer(busyState, { type: "codeSent", mode: "signup" }),
    ).toEqual({ step: "code", mode: "signup", busy: false, error: null });
  });

  it("codeSent clears a stale error from a prior failed attempt", () => {
    const busyState: State = {
      ...initialState,
      busy: true,
      error: "auth.error",
    };
    const next = signInReducer(busyState, { type: "codeSent", mode: "signin" });
    expect(next.error).toBeNull();
  });

  it("settled clears busy without touching step, mode, or error", () => {
    const busyOnCode: State = {
      step: "code",
      mode: "signup",
      busy: true,
      error: null,
    };
    expect(signInReducer(busyOnCode, { type: "settled" })).toEqual({
      ...busyOnCode,
      busy: false,
    });
  });

  it("failed clears busy and sets the auth.error id, leaving step/mode alone", () => {
    const busyOnCode: State = {
      step: "code",
      mode: "signin",
      busy: true,
      error: null,
    };
    expect(signInReducer(busyOnCode, { type: "failed" })).toEqual({
      step: "code",
      mode: "signin",
      busy: false,
      error: "auth.error",
    });
  });

  it("a later submit clears the error a failed attempt set (retry)", () => {
    const failedState: State = {
      step: "code",
      mode: "signin",
      busy: false,
      error: "auth.error",
    };
    const next = signInReducer(failedState, { type: "submit" });
    expect(next.error).toBeNull();
    expect(next.busy).toBe(true);
  });

  it("changeEmail returns to the email step without touching mode/busy/error", () => {
    const onCode: State = {
      step: "code",
      mode: "signup",
      busy: false,
      error: "auth.error",
    };
    expect(signInReducer(onCode, { type: "changeEmail" })).toEqual({
      ...onCode,
      step: "email",
    });
  });

  it("a full signin round trip: submit -> codeSent -> submit -> settled", () => {
    let state = initialState;
    state = signInReducer(state, { type: "submit" });
    expect(state.busy).toBe(true);
    state = signInReducer(state, { type: "codeSent", mode: "signin" });
    expect(state).toEqual({
      step: "code",
      mode: "signin",
      busy: false,
      error: null,
    });
    state = signInReducer(state, { type: "submit" });
    expect(state.busy).toBe(true);
    state = signInReducer(state, { type: "settled" });
    expect(state).toEqual({
      step: "code",
      mode: "signin",
      busy: false,
      error: null,
    });
  });

  it("a signup round trip: submit -> codeSent(signup) -> submit -> failed -> retry", () => {
    let state = initialState;
    state = signInReducer(state, { type: "submit" });
    state = signInReducer(state, { type: "codeSent", mode: "signup" });
    expect(state.mode).toBe("signup");
    state = signInReducer(state, { type: "submit" });
    state = signInReducer(state, { type: "failed" });
    expect(state).toEqual({
      step: "code",
      mode: "signup",
      busy: false,
      error: "auth.error",
    });
    state = signInReducer(state, { type: "submit" });
    expect(state.error).toBeNull();
    expect(state.busy).toBe(true);
  });
});
