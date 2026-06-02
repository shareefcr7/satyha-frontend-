export default function Loading() {
  return (
    <div className="max-w-frame mx-auto px-4 xl:px-0 my-[50px] sm:my-[72px]">
      <div className="animate-pulse">
        <div className="h-8 bg-brand/10 rounded w-48 mb-8" />
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
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
