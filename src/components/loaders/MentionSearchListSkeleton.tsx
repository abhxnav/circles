const MentionSearchListSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 mt-4 shadow-lg h-60 overflow-auto scrollbar-styled">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 cursor-pointer rounded-md bg-dark-secondary p-4"
        >
          <div className="size-10 rounded-full bg-dark-muted animate-pulse"></div>
          <div className="flex flex-col gap-1">
            <div className="w-24 h-4 bg-dark-muted animate-pulse"></div>
            <div className="w-16 h-3 bg-dark-muted animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MentionSearchListSkeleton
