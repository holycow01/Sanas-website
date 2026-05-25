import { ImageResponse } from "next/og";
import { getProduct } from "@/lib/shopify";
import { formatPrice } from "@/lib/format";

export const alt = "Bayan product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ProductOgImage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle).catch(() => undefined);
  const title = product?.title ?? "Bayan";
  const price = product
    ? formatPrice(
        product.priceRange.minVariantPrice.amount,
        product.priceRange.minVariantPrice.currencyCode,
      )
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #faf6ec 0%, #f1ead8 100%)",
          color: "#2a2e25",
          padding: 80,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 12, color: "#9d8453" }}>
          BAYAN · ETHNIC WEAR
        </div>
        <div
          style={{
            fontSize: 76,
            marginTop: 28,
            fontWeight: 600,
            maxWidth: 980,
          }}
        >
          {title}
        </div>
        {price ? (
          <div style={{ fontSize: 34, marginTop: 20, color: "#4d5b41" }}>
            {price}
          </div>
        ) : null}
      </div>
    ),
    { ...size },
  );
}
