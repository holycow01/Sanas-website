export default function ShopLoading() {
  return (
    <section className="px-6 pb-24 pt-12 md:px-9">
      <header className="mx-auto mb-10 max-w-[1400px]">
        <div className="h-3 w-28 rounded bg-bayan-bg-alt" />
        <div className="mt-3 h-12 w-40 rounded bg-bayan-bg-alt" />
      </header>
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 md:grid-cols-[240px_1fr] md:gap-16">
        <aside className="hidden md:block">
          <div className="space-y-6">
            <div className="h-4 w-20 rounded bg-bayan-bg-alt" />
            <div className="h-24 w-full rounded bg-bayan-bg-alt" />
            <div className="h-24 w-full rounded bg-bayan-bg-alt" />
          </div>
        </aside>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4 xl:gap-7">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="mb-[18px] aspect-[3/4] rounded bg-bayan-bg-alt" />
              <div className="h-4 w-2/3 rounded bg-bayan-bg-alt" />
              <div className="mt-2 h-3 w-1/3 rounded bg-bayan-bg-alt" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
