import { Header, PostCard, PostCardSkeleton } from '@/components'
import { useFetchRecentPosts } from '@/react-query/queries'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef } from 'react'

const Home = () => {
  const observerRef = useRef<HTMLDivElement>(null) // Ref for infinite scrolling

  // Fetch recent posts using a query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFetchRecentPosts()

  const posts = data?.pages.flatMap((page) => page.posts) || [] // Flatten paginated data

  // Intersection observer to trigger fetch for the next page
  useEffect(() => {
    // If the observer reference is not attached to an element,
    // or there are no more pages to fetch, or a fetch is already in progress, exit early.
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return

    // Create an instance of IntersectionObserver to track when the observer element enters the viewport.
    const observer = new IntersectionObserver(
      // The callback function is triggered whenever the observed element's intersection state changes.
      ([entry]) => {
        // Check if the observed element (entry) is fully in view.
        if (entry.isIntersecting) {
          // Trigger the function to fetch the next page of data.
          fetchNextPage()
        }
      },
      {
        // The threshold determines when the callback is executed.
        // A threshold of 1 means the callback is triggered when 100% of the element is visible in the viewport.
        threshold: 1,
      }
    )

    // Attach the observer to the DOM element referenced by observerRef.
    observer.observe(observerRef.current)

    // Cleanup function: Disconnect the observer when the component unmounts
    // or when the dependencies change to avoid memory leaks.
    return () => observer.disconnect()
  }, [
    observerRef.current, // Dependency: Reference to the observed DOM element.
    hasNextPage, // Dependency: Whether there are more pages to fetch.
    isFetchingNextPage, // Dependency: Whether a page fetch is currently in progress.
  ])

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-4 px-4 md:py-8 md:px-8 lg:p-14 scrollbar-styled min-h-[calc(100vh-108px)]">
        <div className="max-w-screen-md flex flex-col items-center w-full gap-6 md:gap-9">
          {/* Page Header */}
          <Header
            title="Home Feed"
            iconUrl="/assets/icons/home.svg"
            className="hidden md:flex"
          />

          {/* Loading State: Show Skeletons */}
          {isLoading && !posts.length ? (
            <ul className="flex flex-col gap-5 lg:gap-7 w-full">
              {Array.from({ length: 3 }).map((_, index) => (
                <li key={index}>
                  <PostCardSkeleton />
                </li>
              ))}
            </ul>
          ) : (
            // Render Posts
            <ul className="flex flex-col flex-1 gap-5 lg:gap-7 w-full">
              {posts.map((post: Post) => (
                <li key={post.id} className="text-light-primary">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}

          {/* Infinite Scrolling Trigger */}
          <div ref={observerRef} />

          {/* Fetching Next Page Indicator */}
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
