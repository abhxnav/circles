import { fetchRecentPosts } from '@/actions/posts.actions'
import { GridPostList, Header, SearchPostsSkeleton } from '@/components'
import { Input } from '@/components/ui'
import {
  useFetchPopularPosts,
  useFetchRecentPosts,
  useSearchPosts,
} from '@/react-query/queries'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const Explore = () => {
  const observerRef = useRef<HTMLDivElement>(null) // Ref for intersection observer

  // Input states for search functionality
  const [inputValue, setInputValue] = useState('') // Immediate input value
  const [searchValue, setSearchValue] = useState('') // Debounced input value
  const [showSearchResults, setShowSearchResults] = useState(false) // Toggle between popular and searched posts

  // Fetch popular posts
  const {
    data: recentPostsData,
    isLoading: isRecentPostLoading,
    fetchNextPage: fetchRecentNextPage,
    hasNextPage: hasRecentNextPage,
    isFetchingNextPage: isFetchingRecentNextPage,
  } = useFetchRecentPosts()

  const recentPosts = recentPostsData?.pages.flatMap((page) => page.posts) || []

  // Fetch searched posts
  const {
    data: searchedPostsData,
    isLoading: isSearchPostLoading,
    fetchNextPage: fetchSearchedNextPage,
    hasNextPage: hasSearchNextPage,
    isFetchingNextPage: isFetchingSearchNextPage,
  } = useSearchPosts(searchValue)

  const searchedPosts =
    searchedPostsData?.pages.flatMap((page: any) => page.posts) || []

  // Toggle between search and popular results
  useEffect(() => {
    setShowSearchResults(searchValue !== '')
  }, [searchValue])

  // Debounce input for search
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setSearchValue(inputValue)
    }, 500)

    return () => clearTimeout(debounceTimeout)
  }, [inputValue])

  // Infinite scrolling fetch logic
  const fetchNextPage = () => {
    if (showSearchResults && hasSearchNextPage) {
      fetchSearchedNextPage()
    } else if (!showSearchResults && hasRecentNextPage) {
      fetchRecentNextPage()
    }
  }

  // Intersection observer setup
  useEffect(() => {
    if (!observerRef.current) return

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
  }, [observerRef.current, hasSearchNextPage, hasRecentNextPage])

  return (
    <div className="flex flex-col flex-1 items-center overflow-scroll py-4 px-4 md:py-8 md:px-8 lg:p-14 scrollbar-styled min-h-[calc(100vh-108px)]">
      <div className="max-w-screen-md flex flex-col items-center w-full gap-6 md:gap-9">
        {/* Header */}
        <Header title="Explore" iconUrl="/assets/icons/explore.svg" />

        {/* Search Bar */}
        <div className="flex items-center justify-center gap-1 px-4 md:py-2 w-full rounded-lg bg-dark-secondary">
          <img
            src="/assets/icons/search.svg"
            alt="search"
            className="size-4 md:size-6"
          />
          <Input
            type="text"
            placeholder="Search posts"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-dark-secondary border-none text-sm md:text-base placeholder:text-light-muted text-light-secondary focus-visible:ring-0 focus-visible:ring-offset-0 ring-offset-0"
          />
        </div>

        {/* Display Popular or Searched Posts */}
        {!showSearchResults && (
          <h3 className="w-full max-w-5xl font-bold md:text-2xl text-light-primary">
            Popular Today
          </h3>
        )}

        <div className="flex flex-wrap gap-9 w-full max-w-5xl">
          {isRecentPostLoading || isSearchPostLoading ? (
            <SearchPostsSkeleton />
          ) : showSearchResults ? (
            searchedPosts?.length > 0 ? (
              <>
                <GridPostList posts={searchedPosts} />
                {hasSearchNextPage && <div ref={observerRef} />}
                {isFetchingSearchNextPage && (
                  <div className="flex items-center justify-center w-full">
                    <Loader2
                      size={40}
                      className="animate-spin text-accent-coral text-center"
                    />
                  </div>
                )}
              </>
            ) : (
              <p className="text-light-muted text-center text-sm w-full">
                No posts found
              </p>
            )
          ) : recentPosts?.length > 0 ? (
            <>
              <GridPostList posts={recentPosts} />
              {hasRecentNextPage && <div ref={observerRef} className="h-10" />}
              {isFetchingRecentNextPage && (
                <div className="flex items-center justify-center w-full">
                  <Loader2
                    size={40}
                    className="animate-spin text-accent-coral text-center"
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-light-muted text-center text-sm w-full">
              No posts today
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Explore
