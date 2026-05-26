/** Humanize Shopify status enums like "PARTIALLY_PAID" → "Partially paid". */
export function humanizeStatus(status: string | null): string {
  if (!status) return "—";
  const words = status.toLowerCase().replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatOrderDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : DATE_FORMAT.format(d);
}
