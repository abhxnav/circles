interface PostStatsProps {
  post: Post
  userId: string
}

const PostStats = ({ post, userId }: PostStatsProps) => {
  return (
    <div className="flex items-center justify-between z-20">
      <div className="flex gap-2 items-center">
        <img src="/assets/icons/like.svg" className="size-4 cursor-pointer" />
        <p className="text-sm font-medium lg:font-base text-light-secondary">
          0
        </p>
      </div>
    </div>
  )
}

export default PostStats
