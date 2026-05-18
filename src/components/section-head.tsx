import { Reveal } from "./reveal";

type Props = {
  eyebrow: string;
  /** Title parts — use `<em>` text by wrapping a string in `{ em: "Arrivals" }`. */
  titleStart: string;
  titleEm?: string;
  titleEnd?: string;
};

export function SectionHead({ eyebrow, titleStart, titleEm, titleEnd }: Props) {
  return (
    <Reveal className="mb-16 text-center">
      <div className="mb-4 text-[11px] font-medium uppercase tracking-[0.32em] text-bayan-accent-deep">
        {eyebrow}
      </div>
      <h2 className="font-serif text-[clamp(32px,4vw,48px)] font-normal leading-[1.15] text-bayan-text">
        {titleStart}
        {titleEm ? (
          <>
            {" "}
            <em className="not-italic font-serif italic text-bayan-primary-dark">
              {titleEm}
            </em>
          </>
        ) : null}
        {titleEnd ?? ""}
      </h2>
      <span className="mt-[18px] inline-block">
        <svg
          viewBox="0 0 80 12"
          width="80"
          height="12"
          fill="none"
          stroke="currentColor"
          className="text-bayan-accent"
        >
          <path
            d="M2 6 L34 6 M40 2 Q44 6 40 10 Q36 6 40 2 M46 6 L78 6"
            strokeWidth={1}
          />
        </svg>
      </span>
    </Reveal>
  );
}
