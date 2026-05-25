/**
 * Size chart for stitched short-shirt outfits. Supplied by the brand owner.
 * All measurements in inches. Shared by /size-guide and each product page.
 */

export const SIZE_CHART_TITLE = "Short Shirt Size Chart";
export const SIZE_CHART_NOTE = "All measurements are in inches";

export type SizeKey = "S" | "M" | "L";

export const SIZE_COLUMNS: Array<{ key: SizeKey; label: string }> = [
  { key: "S", label: "Small (S)" },
  { key: "M", label: "Medium (M)" },
  { key: "L", label: "Large (L)" },
];

export const SIZE_ROWS: Array<{
  measurement: string;
  S: string;
  M: string;
  L: string;
}> = [
  { measurement: "Shoulder", S: '14.5"', M: '15"', L: '15.5"' },
  { measurement: "Chest", S: '18.5"', M: '20"', L: '22"' },
  { measurement: "Hip", S: '19"', M: '21"', L: '23"' },
  { measurement: "Armhole", S: '9"', M: '10"', L: '11"' },
  { measurement: "Chalk / Slit", S: '20"', M: '20"', L: '20"' },
  { measurement: "Neck", S: '8" Standard', M: '8" Standard', L: '8" Standard' },
];
