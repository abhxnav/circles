import { GridPostCard } from '@/components'

interface GridPostListProps {
  posts: Post[]
}

const GridPostList = ({ posts }: GridPostListProps) => {
  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl">
      {posts?.map((post: Post) => (
        <GridPostCard post={post} key={post.id} />
      ))}
    </div>
  )
}

export default GridPostList
