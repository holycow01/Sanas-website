import {
  SIZE_CHART_NOTE,
  SIZE_CHART_TITLE,
  SIZE_COLUMNS,
  SIZE_ROWS,
} from "@/lib/size-chart";
import { cn } from "@/lib/utils";

type Props = {
  /** Show the "Short Shirt Size Chart" heading + note above the table. */
  withHeading?: boolean;
  className?: string;
};

export function SizeChart({ withHeading = false, className }: Props) {
  return (
    <div className={className}>
      {withHeading ? (
        <div className="mb-6 text-center">
          <h2 className="font-serif text-2xl text-bayan-text">
            {SIZE_CHART_TITLE}
          </h2>
          <p className="mt-1 font-serif text-sm italic text-bayan-muted">
            {SIZE_CHART_NOTE}
          </p>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-bayan-line">
              <th className="py-3 pr-4 text-[11px] font-medium uppercase tracking-[0.22em] text-bayan-muted">
                Measurement
              </th>
              {SIZE_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="py-3 pr-4 text-[11px] font-medium uppercase tracking-[0.22em] text-bayan-text"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZE_ROWS.map((row, i) => (
              <tr
                key={row.measurement}
                className={cn(
                  "border-b border-bayan-line/60",
                  i % 2 === 1 && "bg-bayan-bg-alt/40",
                )}
              >
                <td className="py-3 pr-4 font-medium text-bayan-text">
                  {row.measurement}
                </td>
                <td className="py-3 pr-4 tabular-nums text-bayan-muted">
                  {row.S}
                </td>
                <td className="py-3 pr-4 tabular-nums text-bayan-muted">
                  {row.M}
                </td>
                <td className="py-3 pr-4 tabular-nums text-bayan-muted">
                  {row.L}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-bayan-muted">
        Measurements may vary slightly (0.5–1 inch) due to manual stitching and
        the nature of the fabric. Unsure of your fit? Message us on WhatsApp and
        we&rsquo;ll help you choose.
      </p>
    </div>
  );
}
