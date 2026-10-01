/**
 * Send the data-request receipt and closing emails, in the requester's language.
 *
 * @see docs/reference/shared/api/src/data-request/email.md
 */
import type { MailEnv } from "../erasure/email";

export async function sendDataRequestReceipt(
  _env: MailEnv,
  _input: {
    to: string;
    id: number;
    requestType: string;
    locale: string;
    submittedAt: string;
  },
): Promise<boolean> {
  return false;
}

export async function sendDataRequestClosedEmail(
  _env: MailEnv,
  _input: {
    to: string;
    id: number;
    outcome: "done" | "rejected";
    note: string;
    locale: string;
  },
): Promise<boolean> {
  return false;
}
