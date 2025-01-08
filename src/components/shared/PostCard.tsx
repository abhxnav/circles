import { useUserContext } from '@/context/UserContext'
import { getRelativeTime } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { PostStats } from '@/components'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'

interface PostCardProps {
  post: Post
}

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext()

  if (!post) return null

  return (
    <div className="bg-dark-secondary rounded-xl border border-dark-muted p-3 lg:p-7 w-full max-w-screen-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post?.author?.id}`}>
            <img
              src={
                post?.author?.avatar_url ||
                '/assets/images/avatar-placeholder.png'
              }
              alt={post?.author?.username}
              className="rounded-full size-6"
            />
          </Link>

          <div className="flex items-center gap-1">
            <p className="font-medium text-sm lg:text-base lg:font-bold text-light-primary">
              {post?.author?.username}
            </p>

            {post?.mentionedUsers?.length > 0 && (
              <div className="flex items-center gap-1">
                <p className="font-medium text-xs lg:text-sm lg:font-bold text-light-secondary">
                  and
                </p>
                <Dialog>
                  <DialogTrigger className="p-0 !border-none !outline-none">
                    <p className="font-medium text-xs lg:text-sm lg:font-bold text-light-primary cursor-pointer hover:underline">
                      {post?.mentionedUsers?.length}{' '}
                      {post?.mentionedUsers?.length === 1 ? 'other' : 'others'}
                    </p>
                  </DialogTrigger>
                  <DialogContent className="bg-dark-primary border-dark-muted rounded-md w-[90vw] max-h-[90vh]">
                    <DialogTitle className="text-light-primary">
                      Mentioned in this post
                    </DialogTitle>
                    <DialogDescription className="hidden"></DialogDescription>
                    <ul className="flex flex-col gap-2 mt-4 shadow-lg h-full overflow-auto scrollbar-styled">
                      {post?.mentionedUsers?.map((user: User) => (
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
            )}

            <div className="flex items-center gap-1 text-light-muted">
              <p className="text-xs">&bull;</p>
              <p className="font-semibold text-xs lg:text-sm">
                {getRelativeTime(post?.created_at)}
              </p>
            </div>
          </div>
        </div>
        <Link
          to={`/update-post/${post?.id}`}
          className={`${user?.id !== post?.author?.id && 'hidden'} self-start`}
        >
          <img src="/assets/icons/edit.svg" alt="edit" className="size-4" />
        </Link>
      </div>

      <p className="text-light-primary text-sm lg:text-base">{post?.content}</p>

      {post?.image_url && (
        <Dialog>
          <DialogTrigger className="p-0 !border-none !outline-none">
            <img
              src={post?.image_url}
              className="h-64 lg:h-[450px] w-full object-cover"
            />
          </DialogTrigger>
          <DialogContent className="bg-dark-primary border-dark-muted rounded-md w-[90vw]">
            <DialogTitle className="hidden"></DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
            <img src={post?.image_url} />
          </DialogContent>
        </Dialog>
      )}

      <PostStats post={post} userId={user?.id} />
    </div>
  )
}

export default PostCard
