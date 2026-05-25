"use server";

/**
 * Contact form handler — stub for now.
 *
 * Logs the message server-side and returns a success result. To deliver real
 * emails later, drop in Resend (or Shopify's contact endpoint) here without
 * touching the form component.
 */

export type ContactState = {
  ok: boolean;
  message: string;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, message: "Please fill in every field." };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, message: "That email doesn't look right." };
  }

  await new Promise((resolve) => setTimeout(resolve, 400));
  console.log(`[contact] ${name} <${email}>: ${message}`);

  return {
    ok: true,
    message: "Thank you — we'll be in touch within one business day.",
  };
}
