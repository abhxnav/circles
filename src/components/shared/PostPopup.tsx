import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'
import { PostStats } from '@/components'
import { useUserContext } from '@/context/UserContext'
import { getRelativeTime } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { deletePost } from '@/actions/posts.actions'
import { useToast } from '@/hooks/use-toast'

interface PostPopupProps {
  post: Post // Post data
  children: React.ReactNode // Trigger for the popup, usually post content or an image
}

const PostPopup = ({ post, children }: PostPopupProps) => {
  const { user } = useUserContext() // Access the current user's context
  const { toast } = useToast() // Toast notifications for feedback

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false) // State for delete confirmation dialog
  const [postDialogOpen, setPostDialogOpen] = useState(false) // State for post popup dialog

  // Handle deleting a post
  const handleDeletePost = async () => {
    try {
      await deletePost(post?.id) // Delete post using its ID
      toast({
        title: 'Post deleted successfully.',
        description: 'Your post has been deleted.',
      })
      setDeleteDialogOpen(false) // Close the delete dialog
      setPostDialogOpen(false) // Close the post popup dialog
    } catch (error) {
      console.error('Failed to delete post:', error)
      toast({
        variant: 'destructive',
        title: 'Something went wrong.',
        description: 'Failed to delete post.',
      })
    }
  }

  return (
    <Dialog open={postDialogOpen} onOpenChange={setPostDialogOpen}>
      {/* Trigger to open the post popup */}
      <DialogTrigger className="p-0 !border-none !outline-none bg-transparent">
        {children}
      </DialogTrigger>

      {/* Post popup content */}
      <DialogContent className="bg-dark-primary border-dark-muted rounded-md w-[90vw] max-h-[90vh] p-4">
        {/* Header: Author info, mentions, and timestamp */}
        <DialogTitle className="text-light-primary flex items-center gap-1">
          <Link to={`/profile/${post?.author?.id}`}>
            <div className="flex items-center gap-3">
              {/* Author avatar and username */}
              <img
                src={
                  post?.author?.avatar_url ||
                  '/assets/images/avatar-placeholder.png'
                }
                alt={post?.author?.username}
                className="rounded-full size-8"
              />
              <p className="text-light-primary hover:underline">
                {post.author.username}
              </p>
            </div>
          </Link>

          {/* Mentioned users */}
          {post?.mentionedUsers?.length > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <p className="font-medium text-sm text-light-secondary">and</p>
              <Dialog>
                <DialogTrigger className="p-0 bg-transparent !border-none !outline-none">
                  <p className="font-medium text-sm text-light-primary cursor-pointer hover:underline">
                    {post?.mentionedUsers?.length}{' '}
                    {post?.mentionedUsers?.length === 1 ? 'other' : 'others'}
                  </p>
                </DialogTrigger>
                {/* List of mentioned users */}
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

          {/* Post creation time */}
          <div className="flex items-center gap-1 text-light-muted mt-1 ml-0.5">
            <p className="text-xs">&bull;</p>
            <p className="font-semibold text-xs lg:text-sm">
              {getRelativeTime(post?.created_at)}
            </p>
          </div>
        </DialogTitle>

        {/* Post content */}
        <DialogDescription className="text-light-secondary mt-1">
          {post.content}
        </DialogDescription>

        {/* Post image */}
        <img src={post?.image_url} className="rounded-md" />

        {/* Footer: Post stats and delete option */}
        <div className="flex items-center justify-between">
          <PostStats post={post} userId={user?.id} />
          {/* Delete post dialog (visible only for the post author) */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger className="p-0 !border-none !outline-none bg-transparent">
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
      </DialogContent>
    </Dialog>
  )
}

export default PostPopup
