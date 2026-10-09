/**
 * Sends a sample of every enabled email to an address via a Studio document action.
 *
 * @see docs/reference/packages/web/email/src/sanity/send-test-action.md
 */
import { useState } from "react";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import {
  Button,
  Flex,
  Label,
  Select,
  Stack,
  Text,
  TextInput,
} from "@sanity/ui";
import { useClient, type DocumentActionComponent } from "sanity";
import { localeCodes } from "@indiecrafts/packages-shared-config";
import { apiVersion } from "@indiecrafts/packages-web-sanity/env";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** One group per test, so a test never floods the inbox. */
const GROUPS = [
  {
    value: "site",
    title: "E-mails du site",
    hint: "Contact, liste d'attente, infolettre, document, alertes à l'équipe.",
  },
  {
    value: "service",
    title: "E-mails de service",
    hint: "Effacement des données (lien + confirmation), demande RGPD (accusé + clôture).",
  },
  {
    value: "account",
    title: "E-mails de compte",
    hint: "Les e-mails Clerk (codes, lien de connexion, sécurité, invitation) + bienvenue.",
  },
] as const;
type Group = (typeof GROUPS)[number]["value"];
const ALL = "all";

/**
 * "Envoyer un test" — a document action on the `emailStrings` and `clerkEmails` singletons.
 * Sends a sample of every **enabled** email of one group (site · service · account), in one
 * language or all, to a chosen address so an editor can verify mail actually leaves the
 * server and lands in the inbox. The service and account emails come from the api worker.
 *
 * The action forwards the logged-in editor's **Sanity session token**; the
 * `/api/emails/test` route verifies it against the project's `users/me` before
 * sending, so the endpoint is not a public spam relay. If the browser Studio
 * has no readable token (cookie-only auth), the route replies 401 and the toast
 * says so — run `RESEND_API_KEY` sends from a signup instead.
 */
export const sendTestEmailAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion });
  const [open, setOpen] = useState(false);
  // On the "E-mails Clerk" page, the account emails are what the editor came to test.
  const [group, setGroup] = useState<Group>(
    props.type === "clerkEmails" ? "account" : "site",
  );
  const [language, setLanguage] = useState<string>(localeCodes[0] ?? ALL);
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
        body: JSON.stringify({
          to,
          scope: group,
          locales: language === ALL ? localeCodes : [language],
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        results?: { label: string; ok: boolean }[];
        error?: string;
      };
      if (!res.ok) {
        setStatus(`Échec : ${data.error ?? `HTTP ${res.status}`}`);
        return;
      }
      const results = data.results ?? [];
      const sent = results.filter((r) => r.ok).length;
      const failed = results.filter((r) => !r.ok).map((r) => r.label);
      if (results.length === 0) {
        setStatus(
          "Aucun e-mail activé à envoyer dans ce groupe — activez-en au moins un.",
        );
        return;
      }
      setStatus(
        [
          `${sent} e-mail(s) de test envoyé(s) à ${to}. Vérifiez la boîte de réception.`,
          ...(failed.length
            ? [`Échec pour ${failed.length} : ${failed.join(", ")}.`]
            : []),
        ].join(" "),
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
        <Stack gap={4}>
          <Text size={1} muted>
            Envoie un exemple de chaque e-mail activé du groupe choisi à
            l&apos;adresse ci-dessous, avec des données fictives — pour vérifier
            qu&apos;ils arrivent bien. Aucune copie n&apos;est envoyée au
            support.
          </Text>
          <Stack gap={2}>
            <Label size={1}>Groupe</Label>
            <Select
              value={group}
              onChange={(e) => setGroup(e.currentTarget.value as Group)}
            >
              {GROUPS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.title}
                </option>
              ))}
            </Select>
            <Text size={1} muted>
              {GROUPS.find((g) => g.value === group)?.hint}
            </Text>
          </Stack>
          <Stack gap={2}>
            <Label size={1}>Langue</Label>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.currentTarget.value)}
            >
              {localeCodes.map((code) => (
                <option key={code} value={code}>
                  {code.toUpperCase()}
                </option>
              ))}
              <option value={ALL}>Toutes les langues</option>
            </Select>
          </Stack>
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
