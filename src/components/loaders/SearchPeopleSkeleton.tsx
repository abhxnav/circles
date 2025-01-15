const SearchPeopleSkeleton = () => {
  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 max-w-5xl">
      {Array.from({ length: 4 }).map((_, index) => (
        // User Card
        <div
          key={index}
          className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dark-muted overflow-hidden cursor-pointer size-full bg-dark-secondary p-6"
        >
          {/* Avatar */}
          <div className="flex items-center justify-between animate-pulse">
            <div className="rounded-full bg-dark-muted size-10"></div>
          </div>

          {/* Username and Name */}
          <div className="flex flex-col items-center justify-center w-full gap-1">
            <div className="w-1/3 h-4 bg-dark-muted rounded animate-pulse"></div>
            <div className="w-1/2 h-4 bg-dark-muted rounded animate-pulse"></div>
          </div>

          {/* Follow Button */}
          <div className="h-9 w-full bg-dark-muted rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  )
}

export default SearchPeopleSkeleton
