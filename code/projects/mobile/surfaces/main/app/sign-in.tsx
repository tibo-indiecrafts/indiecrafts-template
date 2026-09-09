import { useReducer, useState } from "react";
import { TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useIntl } from "react-intl";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import {
  SignedIn,
  SignedOut,
  useSignIn,
  useSignUp,
  useSSO,
  useAuth,
} from "@clerk/clerk-expo";
import {
  Screen,
  ThemedText,
  Button,
  Card,
  useColor,
} from "@indiecrafts/packages-mobile-ui-native";
import { hasClerk } from "@/lib/auth";
import { logFailedLogin } from "@/lib/session-log";
import { signInReducer, initialState } from "@/lib/sign-in-machine";

// Finish any web-auth session the OS browser left open (the OAuth return).
void WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  // Auth is opt-in; without Clerk mounted its hooks throw, so branch before them.
  if (!hasClerk) return <NotConfigured />;
  return <ClerkAuth />;
}

function NotConfigured() {
  const t = useIntl();
  return (
    <Screen>
      <Card style={{ margin: 24, marginTop: 96 }}>
        <ThemedText variant="title">
          {t.formatMessage({ id: "auth.title" })}
        </ThemedText>
        <ThemedText variant="muted">
          {t.formatMessage({ id: "auth.notConfigured" })}
        </ThemedText>
      </Card>
    </Screen>
  );
}

function ClerkAuth() {
  const t = useIntl();
  return (
    <Screen>
      <Card style={{ margin: 24, marginTop: 96, gap: 12 }}>
        <ThemedText variant="title">
          {t.formatMessage({ id: "auth.title" })}
        </ThemedText>
        <SignedIn>
          <SignedInView />
        </SignedIn>
        <SignedOut>
          <SignInForm />
        </SignedOut>
      </Card>
    </Screen>
  );
}

function SignedInView() {
  const t = useIntl();
  const router = useRouter();
  const { signOut } = useAuth();
  return (
    <>
      <ThemedText variant="muted">
        {t.formatMessage({ id: "auth.signedIn" })}
      </ThemedText>
      <Button
        label={t.formatMessage({ id: "auth.continue" })}
        onPress={() => router.replace("/")}
      />
      <Button
        variant="outline"
        label={t.formatMessage({ id: "account.title" })}
        onPress={() => router.push("/account")}
      />
      <Button
        variant="outline"
        label={t.formatMessage({ id: "auth.signOut" })}
        onPress={() => void signOut()}
      />
    </>
  );
}

function SignInForm() {
  const t = useIntl();
  const border = useColor("border");
  const fg = useColor("foreground");
  const danger = useColor("destructive");
  // Kept un-destructured so Clerk's `isLoaded` discriminated union narrows the
  // resources below (destructuring would drop the narrowing).
  const si = useSignIn();
  const su = useSignUp();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [{ step, mode, busy, error }, dispatch] = useReducer(
    signInReducer,
    initialState,
  );

  const sendCode = async () => {
    if (!si.isLoaded || !su.isLoaded || busy) return;
    dispatch({ type: "submit" });
    try {
      // Existing user → email-code sign-in.
      const attempt = await si.signIn.create({ identifier: email });
      const factor = attempt.supportedFirstFactors?.find(
        (f) => f.strategy === "email_code",
      );
      if (factor && "emailAddressId" in factor) {
        await si.signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: factor.emailAddressId,
        });
        dispatch({ type: "codeSent", mode: "signin" });
        return;
      }
      throw new Error("no_email_code");
    } catch {
      // New user → email-code sign-up.
      try {
        // Carry the app locale so the api webhook mirrors it to user_profiles.locale
        // and the user's auth emails (incl. this verification code) are localized.
        await su.signUp.create({
          emailAddress: email,
          unsafeMetadata: { locale: t.locale },
        });
        await su.signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        dispatch({ type: "codeSent", mode: "signup" });
      } catch {
        dispatch({ type: "failed" });
      }
    }
  };

  const verifyCode = async () => {
    if (!si.isLoaded || !su.isLoaded || busy) return;
    dispatch({ type: "submit" });
    try {
      if (mode === "signin") {
        const res = await si.signIn.attemptFirstFactor({
          strategy: "email_code",
          code,
        });
        if (res.status === "complete" && res.createdSessionId) {
          await si.setActive({ session: res.createdSessionId });
          dispatch({ type: "settled" });
        } else {
          void logFailedLogin(); // wrong OTP → counted at the edge (see session-log)
          dispatch({ type: "failed" });
        }
      } else {
        const res = await su.signUp.attemptEmailAddressVerification({ code });
        if (res.status === "complete" && res.createdSessionId) {
          await su.setActive({ session: res.createdSessionId });
          dispatch({ type: "settled" });
        } else {
          dispatch({ type: "failed" });
        }
      }
    } catch {
      // Clerk throws on an invalid code — the common wrong-OTP path (sign-in only).
      if (mode === "signin") void logFailedLogin();
      dispatch({ type: "failed" });
    }
  };

  const google = async () => {
    if (busy) return;
    dispatch({ type: "submit" });
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: Linking.createURL("/"),
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
      dispatch({ type: "settled" });
    } catch {
      dispatch({ type: "failed" });
    }
  };

  const inputStyle = {
    height: 44,
    borderWidth: 1,
    borderColor: border,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: fg,
  };

  return (
    <>
      {step === "email" ? (
        <>
          <ThemedText variant="muted">
            {t.formatMessage({ id: "auth.emailPrompt" })}
          </ThemedText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder={t.formatMessage({ id: "auth.emailPlaceholder" })}
            placeholderTextColor={border}
            autoCapitalize="none"
            keyboardType="email-address"
            inputMode="email"
            accessibilityLabel={t.formatMessage({
              id: "auth.emailPlaceholder",
            })}
            style={inputStyle}
          />
          <Button
            label={t.formatMessage({ id: "auth.sendCode" })}
            onPress={() => void sendCode()}
            disabled={busy || email.length === 0}
          />
        </>
      ) : (
        <>
          <ThemedText variant="muted">
            {t.formatMessage({ id: "auth.codePrompt" })}
          </ThemedText>
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder={t.formatMessage({ id: "auth.codePlaceholder" })}
            placeholderTextColor={border}
            keyboardType="number-pad"
            accessibilityLabel={t.formatMessage({ id: "auth.codePlaceholder" })}
            style={inputStyle}
          />
          <Button
            label={t.formatMessage({ id: "auth.verify" })}
            onPress={() => void verifyCode()}
            disabled={busy || code.length === 0}
          />
          <Button
            variant="outline"
            label={t.formatMessage({ id: "auth.changeEmail" })}
            onPress={() => dispatch({ type: "changeEmail" })}
            disabled={busy}
          />
        </>
      )}

      <ThemedText variant="muted">
        {t.formatMessage({ id: "auth.or" })}
      </ThemedText>
      <Button
        variant="outline"
        label={t.formatMessage({ id: "auth.google" })}
        onPress={() => void google()}
        disabled={busy}
      />
      {error ? (
        <ThemedText style={{ color: danger }}>
          {t.formatMessage({ id: error })}
        </ThemedText>
      ) : null}
    </>
  );
}
