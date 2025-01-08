import { Header, PostCard, PostCardSkeleton } from '@/components'
import { useFetchRecentPosts } from '@/react-query/queries'

const Home = () => {
  const { data: posts, isLoading: isPostLoading } = useFetchRecentPosts()

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-4 md:px-8 lg:p-14 scrollbar-styled">
        <div className="max-w-screen-sm flex flex-col items-center w-full gap-6 md:gap-9">
          <Header
            title="Home Feed"
            iconUrl="/assets/icons/home.svg"
            className="hidden md:flex"
          />
          {isPostLoading && !posts ? (
            <ul className="flex flex-col gap-9 w-full">
              {Array.from({ length: 3 }).map((_, index) => (
                <li key={index}>
                  <PostCardSkeleton />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.map((post: Post) => (
                <li key={post.id} className="text-light-primary">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
