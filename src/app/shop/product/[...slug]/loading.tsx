export default function ProductLoading() {
  return (
    <div className="max-w-frame mx-auto px-4 xl:px-0 animate-pulse">
      <div className="h-px bg-brand/10 mb-5" />
      <div className="h-4 bg-brand/10 rounded w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col-reverse lg:flex-row lg:space-x-3.5">
          <div className="flex lg:flex-col space-x-3 lg:space-x-0 lg:space-y-3.5 w-full lg:w-fit">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-brand/10 rounded-[13px] w-full max-w-[111px] aspect-square" />
            ))}
          </div>
          <div className="bg-brand/10 rounded-[20px] w-full min-h-[330px] lg:min-h-[530px] mb-3 lg:mb-0" />
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-brand/10 rounded w-3/4" />
          <div className="h-8 bg-brand/10 rounded w-1/4" />
          <div className="h-4 bg-brand/10 rounded w-full" />
          <div className="h-4 bg-brand/10 rounded w-5/6" />
          <div className="h-px bg-brand/10" />
          <div className="h-4 bg-brand/10 rounded w-24" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-10 h-10 bg-brand/10 rounded-full" />
            ))}
          </div>
          <div className="h-px bg-brand/10" />
          <div className="flex gap-3 flex-wrap">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-brand/10 rounded-full w-20" />
            ))}
          </div>
          <div className="h-12 bg-brand/10 rounded-full w-full mt-4" />
        </div>
      </div>
    </div>
  );
}
