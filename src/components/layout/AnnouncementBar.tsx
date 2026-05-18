const MESSAGES = [
  "Free shipping on orders above PKR 5,000",
  "Eid Collection drop coming soon",
  "Crafted in Pakistan, worn anywhere",
  "50% Advance · 50% on Delivery",
];

export function AnnouncementBar() {
  const loop = [...MESSAGES, ...MESSAGES];
  return (
    <div className="overflow-hidden bg-bayan-bg-dark py-[9px] text-[11px] uppercase tracking-[0.25em] text-bayan-bg">
      <div className="flex w-max gap-20 whitespace-nowrap animate-[marquee_35s_linear_infinite]">
        {loop.map((m, i) => (
          <span key={i} className="flex items-center gap-20">
            {m}
            <em className="not-italic text-bayan-accent">✦</em>
          </span>
        ))}
      </div>
    </div>
  );
}
