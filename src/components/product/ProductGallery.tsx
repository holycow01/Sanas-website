"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Image as ProductImage } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

type Props = {
  images: ProductImage[];
  title: string;
};

export function ProductGallery({ images, title }: Props) {
  const [index, setIndex] = useState(0);
  const [zoomActive, setZoomActive] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const mainRef = useRef<HTMLDivElement>(null);

  const main = images[index] ?? images[0];

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!mainRef.current) return;
    const rect = mainRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={mainRef}
        className="relative aspect-[3/4] overflow-hidden rounded bg-bayan-bg-alt"
        onMouseEnter={() => setZoomActive(true)}
        onMouseLeave={() => setZoomActive(false)}
        onMouseMove={onMove}
      >
        <Image
          src={main.url}
          alt={main.altText ?? title}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={cn(
            "object-cover transition-transform duration-300 ease-out",
            zoomActive ? "scale-[1.6] cursor-zoom-out" : "scale-100 cursor-zoom-in",
          )}
          style={{
            transformOrigin: zoomActive ? `${origin.x}% ${origin.y}%` : "center",
          }}
        />
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              type="button"
              aria-label={`View image ${i + 1} of ${title}`}
              onClick={() => setIndex(i)}
              className={cn(
                "relative aspect-[3/4] overflow-hidden rounded bg-bayan-bg-alt transition-all duration-300",
                index === i
                  ? "ring-1 ring-bayan-primary-dark ring-offset-2 ring-offset-bayan-bg"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={img.url}
                alt={img.altText ?? `${title} ${i + 1}`}
                fill
                sizes="160px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
