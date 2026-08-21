import { useState } from "react";
import { EnvelopeIcon } from "@sanity/icons";
import { Button, Flex, Stack, Text, TextInput } from "@sanity/ui";
import { useClient, type DocumentActionComponent } from "sanity";
import { apiVersion } from "@indiecrafts/packages-web-sanity/env";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * "Envoyer un test" — a document action on the `emailStrings` singleton. Sends a
 * sample of every **enabled** email to a chosen address so an editor can verify
 * mail actually leaves the server and lands in the inbox (subscriber + team).
 *
 * The action forwards the logged-in editor's **Sanity session token**; the
 * `/api/emails/test` route verifies it against the project's `users/me` before
 * sending, so the endpoint is not a public spam relay. If the browser Studio
 * has no readable token (cookie-only auth), the route replies 401 and the toast
 * says so — run `RESEND_API_KEY` sends from a signup instead.
 */
export const sendTestEmailAction: DocumentActionComponent = () => {
  const client = useClient({ apiVersion });
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const send = async () => {
    const to = address.trim();
    if (!EMAIL.test(to)) {
      setStatus("Adresse e-mail invalide.");
      return;
    }
    setSending(true);
    setStatus(null);
    try {
      const token = client.config().token;
      const res = await fetch("/api/emails/test", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ to }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        results?: { label: string; ok: boolean }[];
        error?: string;
      };
      if (!res.ok) {
        setStatus(`Échec : ${data.error ?? `HTTP ${res.status}`}`);
        return;
      }
      const sent = (data.results ?? []).filter((r) => r.ok).length;
      setStatus(
        sent > 0
          ? `${sent} e-mail(s) de test envoyé(s) à ${to}. Vérifiez la boîte de réception.`
          : "Aucun e-mail activé à envoyer — activez au moins un e-mail ci-dessus.",
      );
    } catch (error) {
      setStatus(`Échec : ${String(error)}`);
    } finally {
      setSending(false);
    }
  };

  return {
    label: "Envoyer un test",
    icon: EnvelopeIcon,
    onHandle: () => {
      setOpen(true);
      setStatus(null);
    },
    dialog: open && {
      type: "dialog",
      header: "Envoyer un e-mail de test",
      onClose: () => setOpen(false),
      content: (
        <Stack space={4}>
          <Text size={1} muted>
            Envoie un exemple de chaque e-mail activé à l&apos;adresse
            ci-dessous — pour vérifier qu&apos;ils arrivent bien.
          </Text>
          <TextInput
            type="email"
            placeholder="vous@exemple.com"
            value={address}
            onChange={(e) => setAddress(e.currentTarget.value)}
          />
          {status && (
            <Text size={1} muted>
              {status}
            </Text>
          )}
          <Flex justify="flex-end">
            <Button
              text={sending ? "Envoi…" : "Envoyer le test"}
              tone="primary"
              disabled={sending}
              onClick={send}
            />
          </Flex>
        </Stack>
      ),
    },
  };
};
