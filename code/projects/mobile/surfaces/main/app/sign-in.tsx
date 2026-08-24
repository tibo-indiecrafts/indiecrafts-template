import { useState } from "react";
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
import {
  DeleteAccountSection,
  type DeleteAccountCopy,
} from "@indiecrafts/packages-shared-compliance/native";
import { hasClerk } from "@/lib/auth";
import { logFailedLogin } from "@/lib/session-log";
import { features } from "@/config";

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
  const { signOut, getToken } = useAuth();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "";
  const copy: DeleteAccountCopy = {
    heading: t.formatMessage({ id: "account.delete.heading" }),
    body: t.formatMessage({ id: "account.delete.body" }),
    emailLabel: t.formatMessage({ id: "account.delete.emailLabel" }),
    emailPlaceholder: t.formatMessage({
      id: "account.delete.emailPlaceholder",
    }),
    confirmButton: t.formatMessage({ id: "account.delete.confirmButton" }),
    pending: t.formatMessage({ id: "account.delete.pending" }),
    success: t.formatMessage({ id: "account.delete.success" }),
    partial: t.formatMessage({ id: "account.delete.partial" }),
    error: t.formatMessage({ id: "account.delete.error" }),
    mismatch: t.formatMessage({ id: "account.delete.mismatch" }),
  };
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
        label={t.formatMessage({ id: "auth.signOut" })}
        onPress={() => void signOut()}
      />
      {features.deleteAccount && apiUrl ? (
        // @debt SECURITY - No beforeConfirm here. @clerk/clerk-expo doesn't export
        // useReverification (unlike clerk-react/nextjs), and even where it exists it only
        // triggers on a `session_reverification_required` error from the wrapped call. The
        // erasure worker doesn't emit that error, so wrapping it would resolve immediately
        // without real re-auth. The server-side JWT + typed-email match is the current
        // protection.
        <DeleteAccountSection
          copy={copy}
          apiUrl={apiUrl}
          getToken={() => getToken()}
          onDeleted={async () => {
            await signOut();
            router.replace("/");
          }}
        />
      ) : null}
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
  const [step, setStep] = useState<"email" | "code">("email");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fail = () => setError(t.formatMessage({ id: "auth.error" }));

  const sendCode = async () => {
    if (!si.isLoaded || !su.isLoaded || busy) return;
    setBusy(true);
    setError(null);
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
        setMode("signin");
        setStep("code");
        return;
      }
      throw new Error("no_email_code");
    } catch {
      // New user → email-code sign-up.
      try {
        await su.signUp.create({ emailAddress: email });
        await su.signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        setMode("signup");
        setStep("code");
      } catch {
        fail();
      }
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async () => {
    if (!si.isLoaded || !su.isLoaded || busy) return;
    setBusy(true);
    setError(null);
    try {
      if (mode === "signin") {
        const res = await si.signIn.attemptFirstFactor({
          strategy: "email_code",
          code,
        });
        if (res.status === "complete" && res.createdSessionId) {
          await si.setActive({ session: res.createdSessionId });
        } else {
          void logFailedLogin(); // wrong OTP → counted at the edge (see session-log)
          fail();
        }
      } else {
        const res = await su.signUp.attemptEmailAddressVerification({ code });
        if (res.status === "complete" && res.createdSessionId) {
          await su.setActive({ session: res.createdSessionId });
        } else {
          fail();
        }
      }
    } catch {
      // Clerk throws on an invalid code — the common wrong-OTP path (sign-in only).
      if (mode === "signin") void logFailedLogin();
      fail();
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: Linking.createURL("/"),
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch {
      fail();
    } finally {
      setBusy(false);
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
            onPress={() => setStep("email")}
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
        <ThemedText style={{ color: danger }}>{error}</ThemedText>
      ) : null}
    </>
  );
}
