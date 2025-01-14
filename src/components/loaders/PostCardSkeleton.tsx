const PostCardSkeleton = () => {
  return (
    <div className="bg-dark-secondary rounded-xl border border-dark-muted p-3 lg:p-7 w-full max-w-screen-md flex flex-col gap-3 animate-pulse">
      {/* Author Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-dark-muted size-6"></div>
          <div className="w-24 h-4 bg-dark-muted rounded"></div>
        </div>
      </div>

      {/* Post Content */}
      <div className="w-full h-6 bg-dark-muted rounded"></div>

      {/* Image Placeholder */}
      <div className="h-64 lg:h-[450px] w-full bg-dark-muted rounded"></div>

      {/* Post Stats */}
      <div className="flex gap-4">
        <div className="w-10 h-4 bg-dark-muted rounded"></div>
      </div>
    </div>
  )
}

export default PostCardSkeleton
