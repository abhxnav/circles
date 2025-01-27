import { useUserContext } from '@/context/UserContext'
import { getRelativeTime, truncateText } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { PostPopup, PostStats } from '@/components'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'
import { useDeletePost } from '@/react-query/mutations'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

interface PostCardProps {
  post: Post // Props for the post data
}

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext() // Access current user data
  const { mutateAsync: deletePost } = useDeletePost() // Mutation for deleting a post
  const { toast } = useToast() // Toast notifications

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false) // State to control the delete confirmation dialog

  // Handle deleting a post
  const handleDeletePost = async () => {
    try {
      await deletePost(post?.id) // Delete post by ID
      toast({
        title: 'Post deleted successfully.',
        description: 'Your post has been deleted.',
      })
      setDeleteDialogOpen(false) // Close the dialog
    } catch (error) {
      console.error('Failed to delete post:', error)
      toast({
        variant: 'destructive',
        title: 'Something went wrong.',
        description: 'Failed to delete post.',
      })
    }
  }

  if (!post) return null // Render nothing if the post is undefined

  return (
    <div className="bg-dark-secondary rounded-xl border border-dark-muted p-3 lg:p-7 w-full max-w-screen-md flex flex-col gap-3">
      {/* Header: User info, mentions, and timestamp */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Author avatar */}
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
            {/* Author username */}
            <Link to={`/profile/${post?.author?.id}`}>
              <p className="font-medium text-sm lg:text-base lg:font-bold text-light-primary hover:underline">
                {post?.author?.username}
              </p>
            </Link>

            {/* Mentioned users */}
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
                    {/* Mentioned users list */}
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

            {/* Post timestamp */}
            <div className="flex items-center gap-1 text-light-muted">
              <p className="text-xs">&bull;</p>
              <p className="font-semibold text-xs lg:text-sm">
                {getRelativeTime(post?.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Delete post dialog trigger (visible only for the post author) */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogTrigger className="p-0 !border-none !outline-none">
            <div
              className={`${
                user?.id !== post?.author?.id && 'hidden'
              } self-start cursor-pointer`}
            >
              <img
                src="/assets/icons/delete.svg"
                alt="delete"
                className="size-4"
              />
            </div>
          </DialogTrigger>
          {/* Delete confirmation dialog */}
          <DialogContent className="bg-dark-primary border-dark-muted rounded-md w-[90vw]">
            <DialogTitle className="text-light-primary">
              Are you sure?
            </DialogTitle>
            <DialogDescription className="text-light-muted">
              You won't be able to restore the post once deleted!
            </DialogDescription>
            <div className="flex gap-2 items-center justify-end">
              <Button
                type="button"
                variant="ghost"
                className="text-light-secondary !border-none !outline-none hover:opacity-70 font-semibold"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="text-light-primary !border-none !outline-none hover:opacity-70 font-semibold bg-red-700"
                onClick={handleDeletePost}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Post content and image */}
      <PostPopup post={post}>
        <div className="flex flex-col gap-4">
          <p className="text-light-primary text-start text-sm lg:text-base">
            {truncateText(post?.content, 150)} {/* Truncated post content */}
          </p>
          {post.image_url && (
            <img
              src={post?.image_url}
              className="h-64 lg:h-[450px] w-full object-cover"
            />
          )}
        </div>
      </PostPopup>

      {/* Post stats (likes, comments, etc.) */}
      <PostStats post={post} userId={user?.id} />
    </div>
  )
}

export default PostCard
