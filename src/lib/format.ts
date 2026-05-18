const PKR_FORMAT = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

export function formatPrice(amount: string | number, currency = "PKR") {
  const n = typeof amount === "string" ? Number(amount) : amount;
  return `${currency} ${PKR_FORMAT.format(n)}`;
}
