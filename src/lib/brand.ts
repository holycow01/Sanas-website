/**
 * Single source of truth for Bayan's public contact details.
 *
 * Hardcoded (not env-driven) so they're guaranteed identical across every
 * page and on every deployment. Change a value here and it updates everywhere.
 */

const WHATSAPP_NUMBER = "923225658257"; // +92 322 5658257, digits only for wa.me

export const BRAND = {
  name: "Bayan",
  email: "wearbayan@gmail.com",
  instagramHandle: "wearbayan",
  instagramUrl: "https://instagram.com/wearbayan",
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}`,
  /** Build a wa.me link with a prefilled message. */
  whatsapp(message?: string): string {
    return message
      ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
      : `https://wa.me/${WHATSAPP_NUMBER}`;
  },
} as const;
