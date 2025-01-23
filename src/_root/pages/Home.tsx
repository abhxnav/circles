import { Header, PostCard, PostCardSkeleton } from '@/components'
import { useFetchRecentPosts } from '@/react-query/queries'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef } from 'react'

const Home = () => {
  const observerRef = useRef<HTMLDivElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFetchRecentPosts()
  const posts = data?.pages.flatMap((page) => page.posts) || []

  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage()
        }
      },
      { threshold: 1 }
    )

    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [observerRef.current, hasNextPage, isFetchingNextPage])

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-4 px-4 md:py-8 md:px-8 lg:p-14 scrollbar-styled min-h-[calc(100vh-108px)]">
        <div className="max-w-screen-md flex flex-col items-center w-full gap-6 md:gap-9">
          <Header
            title="Home Feed"
            iconUrl="/assets/icons/home.svg"
            className="hidden md:flex"
          />

          {isLoading && !posts ? (
            <ul className="flex flex-col gap-5 lg:gap-7 w-full">
              {Array.from({ length: 3 }).map((_, index) => (
                <li key={index}>
                  <PostCardSkeleton />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="flex flex-col flex-1 gap-5 lg:gap-7 w-full">
              {posts?.map((post: Post) => (
                <li key={post.id} className="text-light-primary">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}

          <div ref={observerRef} />

          {isFetchingNextPage && (
            <div className="flex items-center justify-center w-full">
              <Loader2
                size={40}
                className="animate-spin text-accent-coral text-center"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
