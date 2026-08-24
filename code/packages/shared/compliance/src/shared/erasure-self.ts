export type ErasureSelfResult = "done" | "partial" | "mismatch" | "error";

/**
 * Pure, testable: the one authenticated POST to the Slice-A erasure worker route.
 */
export async function submitAccountErasure(input: {
  apiUrl: string;
  getToken: () => Promise<string | null>;
  email: string;
}): Promise<ErasureSelfResult> {
  try {
    const token = await input.getToken();
    const res = await fetch(`${input.apiUrl}/v1/erasure/self`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ email: input.email }),
    });
    if (res.status === 200) return "done";
    if (res.status === 207) return "partial"; // still erased; some stores need manual finish
    if (res.status === 400) return "mismatch"; // typed email did not match the account
    return "error";
  } catch {
    return "error";
  }
}
