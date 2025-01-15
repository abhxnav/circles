const SearchPostsSkeleton = () => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-7 max-w-5xl">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="relative min-w-64 h-52 md:h-64">
          <div className="flex rounded-xl bg-dark-secondary size-full animate-pulse"></div>

          <div className="flex items-center justify-between absolute bottom-0 p-4 w-full rounded-b-xl gap-2 z-10">
            <div className="flex items-center gap-3 w-full">
              <div className="size-6 rounded-full bg-dark-muted animate-pulse"></div>
              <div className="h-5 w-1/2 bg-dark-muted animate-pulse"></div>
            </div>

            <div className="h-5 w-8 bg-dark-muted animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SearchPostsSkeleton
