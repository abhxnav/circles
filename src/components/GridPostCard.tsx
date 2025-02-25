import { PostPopup, PostStats } from '@/components'
import { useUserContext } from '@/context/UserContext'
import { truncateText } from '@/lib/utils'

interface GridPostCardProps {
  post: Post // Post data including content, author, and image
}

const GridPostCard = ({ post }: GridPostCardProps) => {
  const { user } = useUserContext() // Get the current user context

  return (
    <PostPopup post={post} key={post.id}>
      {/* Container for the post card */}
      <div className="relative h-52 md:h-64">
        {/* Display image or text content */}
        <div className="flex rounded-xl border border-dark-muted overflow-hidden cursor-pointer size-full">
          {post.image_url ? (
            <img
              src={post.image_url}
              alt="post"
              className="size-full object-cover"
            />
          ) : (
            <p className="text-start text-light-secondary p-10">
              {truncateText(post.content, 100)}
            </p>
          )}
        </div>

        {/* Overlay with author info and post stats */}
        <div className="flex items-center justify-between absolute bottom-0 p-4 w-full rounded-b-xl border-b border-r border-l border-dark-muted gap-2 bg-gradient-to-t from-dark-primary to-transparent">
          <div className="flex items-center justify-center gap-3">
            <img
              src={
                post?.author?.avatar_url ||
                '/assets/images/avatar-placeholder.png'
              }
              alt={post?.author?.username}
              className="rounded-full size-6"
            />
            <p className="font-medium text-sm lg:text-base lg:font-bold text-light-primary">
              {post?.author?.username}
            </p>
          </div>

          <PostStats post={post} userId={user?.id} />
        </div>
      </div>
    </PostPopup>
  )
}

export default GridPostCard
