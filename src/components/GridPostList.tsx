import { GridPostCard } from '@/components'

interface GridPostListProps {
  posts: Post[]
}

const GridPostList = ({ posts }: GridPostListProps) => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 max-w-5xl">
      {posts?.map((post: Post) => (
        <GridPostCard post={post} key={post.id} />
      ))}
    </div>
  )
}

export default GridPostList
