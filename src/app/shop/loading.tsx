export default function ShopLoading() {
  return (
    <div className="max-w-frame mx-auto px-4 xl:px-0 pb-20 animate-pulse">
      <div className="h-px bg-brand/10 mb-5" />
      <div className="h-4 bg-brand/10 rounded w-32 mb-6" />
      <div className="flex md:space-x-5 items-start">
        <div className="hidden md:block min-w-[295px] max-w-[295px] border border-brand/10 rounded-[20px] p-6 space-y-4">
          <div className="h-5 bg-brand/10 rounded w-20" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 bg-brand/10 rounded w-full" />
          ))}
        </div>
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className="bg-brand/10 rounded-[20px] aspect-square mb-3" />
              <div className="h-4 bg-brand/10 rounded w-3/4 mb-2" />
              <div className="h-3 bg-brand/10 rounded w-1/2 mb-2" />
              <div className="h-5 bg-brand/10 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
