import { useLikePost, useUnlikePost } from '@/react-query/mutations'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'

interface PostStatsProps {
  post: Post
  userId: string
}

const PostStats = ({ post, userId }: PostStatsProps) => {
  const { mutateAsync: likePost } = useLikePost()
  const { mutateAsync: unlikePost } = useUnlikePost()

  const [likesCount, setLikesCount] = useState(post.likes.length)
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like: User) => like.id === userId)
  )

  const handleLike = () => {
    if (!hasLiked) {
      likePost(
        { likeInput: { post_id: post.id, user_id: userId } },
        {
          onSuccess: () => {
            setLikesCount((prev) => prev + 1)
            setHasLiked(true)
          },
        }
      )
    } else {
      unlikePost(
        { filter: { post_id: { eq: post.id }, user_id: { eq: userId } } },
        {
          onSuccess: () => {
            setLikesCount((prev) => prev - 1)
            setHasLiked(false)
          },
        }
      )
    }
  }

  return (
    <div className="flex items-center justify-between z-20">
      <div className="flex gap-2 items-center">
        <img
          src={hasLiked ? '/assets/icons/liked.svg' : '/assets/icons/like.svg'}
          onClick={handleLike}
          className="size-4 cursor-pointer"
        />

        <Dialog>
          <DialogTrigger className="p-0 !border-none !outline-none bg-transparent">
            <p className="text-sm font-medium lg:font-base text-light-secondary">
              {likesCount}
            </p>
          </DialogTrigger>
          <DialogContent className="bg-dark-primary border-dark-muted rounded-md w-[90vw] max-h-[90vh]">
            <DialogTitle className="text-light-primary">Likes</DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
            <ul className="flex flex-col gap-2 mt-4 shadow-lg h-full overflow-auto scrollbar-styled">
              {post?.likes?.map((user: User) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 cursor-pointer rounded-md bg-dark-secondary p-4 hover:opacity-70"
                >
                  <img
                    src={user?.avatar_url}
                    alt={user?.username}
                    className="size-10 rounded-full"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="leading-none text-light-secondary">
                      {user?.name}
                    </p>
                    <p className="text-xs text-light-muted leading-none">
                      @{user?.username}
                    </p>
                  </div>
                </div>
              ))}
            </ul>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default PostStats
