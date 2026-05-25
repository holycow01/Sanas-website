export default function ProductLoading() {
  return (
    <section className="px-6 pb-16 pt-10 md:px-9 md:pt-14">
      <div className="mx-auto mb-10 h-3 w-48 max-w-[1400px] rounded bg-bayan-bg-alt" />
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
        <div className="flex animate-pulse flex-col gap-4">
          <div className="aspect-[3/4] rounded bg-bayan-bg-alt" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded bg-bayan-bg-alt" />
            ))}
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-3 w-24 rounded bg-bayan-bg-alt" />
          <div className="mt-4 h-12 w-3/4 rounded bg-bayan-bg-alt" />
          <div className="mt-6 h-5 w-28 rounded bg-bayan-bg-alt" />
          <div className="mt-8 h-20 w-full rounded bg-bayan-bg-alt" />
          <div className="mt-8 flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-11 w-14 rounded-full bg-bayan-bg-alt" />
            ))}
          </div>
          <div className="mt-8 h-14 w-full rounded-full bg-bayan-bg-alt" />
        </div>
      </div>
    </section>
  );
}
