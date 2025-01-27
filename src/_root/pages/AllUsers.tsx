import { GridUserList, Header, SearchPeopleSkeleton } from '@/components'
import { Input } from '@/components/ui'
import { useUserContext } from '@/context/UserContext'
import { useFetchRandomUsers, useSearchUsers } from '@/react-query/queries'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const AllUsers = () => {
  const { user } = useUserContext() // Get logged-in user context
  const observerRef = useRef<HTMLDivElement>(null) // Ref for intersection observer

  // Input states for search functionality
  const [inputValue, setInputValue] = useState('') // Immediate input value
  const [searchValue, setSearchValue] = useState('') // Debounced input value
  const [showSearchResults, setShowSearchResults] = useState(false) // Toggle between suggested and searched users

  // Fetch random suggested users
  const {
    data: suggestedUsersData,
    isLoading: isSuggestedUsersLoading,
    fetchNextPage: fetchSuggestedNextPage,
    hasNextPage: hasSuggestedNextPage,
    isFetchingNextPage: isFetchingSuggestedNextPage,
  } = useFetchRandomUsers(user?.id)

  const suggestedUsers =
    suggestedUsersData?.pages.flatMap((page: any) => page.users) || []

  // Fetch searched users
  const {
    data: searchedUsersData,
    isLoading: isSearchedUsersLoading,
    fetchNextPage: fetchSearchedNextPage,
    hasNextPage: hasSearchedNextPage,
    isFetchingNextPage: isFetchingSearchedNextPage,
  } = useSearchUsers(searchValue)

  const searchedUsers =
    searchedUsersData?.pages.flatMap((page: any) => page.users) || []

  // Toggle search results based on search value
  useEffect(() => {
    setShowSearchResults(searchValue.length > 0)
  }, [searchValue])

  // Debounce search input to avoid excessive requests
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setSearchValue(inputValue.trim())
    }, 500)

    return () => clearTimeout(debounceTimeout)
  }, [inputValue])

  // Infinite scrolling fetch logic
  const fetchNextPage = () => {
    if (showSearchResults && hasSearchedNextPage) {
      fetchSearchedNextPage()
    } else if (!showSearchResults && hasSuggestedNextPage) {
      fetchSuggestedNextPage()
    }
  }

  // Intersection observer for triggering infinite scrolling
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
  }, [observerRef.current, hasSearchedNextPage, hasSuggestedNextPage])

  return (
    <div className="flex flex-col flex-1 items-center overflow-scroll py-4 px-4 md:py-8 md:px-8 lg:p-14 scrollbar-styled min-h-[calc(100vh-108px)]">
      <div className="max-w-screen-md flex flex-col items-center w-full gap-6 md:gap-9">
        {/* Header */}
        <Header title="People" iconUrl="/assets/icons/people.svg" />

        {/* Search Bar */}
        <div className="flex items-center justify-center gap-1 px-4 md:py-2 w-full rounded-lg bg-dark-secondary">
          <img
            src="/assets/icons/search.svg"
            alt="search"
            className="size-4 md:size-6"
          />
          <Input
            type="text"
            placeholder="Search for people"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-dark-secondary border-none text-sm md:text-base placeholder:text-light-muted text-light-secondary focus-visible:ring-0 focus-visible:ring-offset-0 ring-offset-0"
          />
        </div>

        {/* Display Suggested or Searched Users */}
        {!showSearchResults && (
          <h3 className="w-full max-w-5xl font-bold md:text-2xl text-light-primary">
            Suggested Users
          </h3>
        )}

        <div className="flex flex-wrap gap-9 w-full max-w-5xl">
          {isSuggestedUsersLoading || isSearchedUsersLoading ? (
            <SearchPeopleSkeleton />
          ) : showSearchResults ? (
            searchedUsers?.length ? (
              <>
                <GridUserList users={searchedUsers} />
                {hasSearchedNextPage && <div ref={observerRef} />}
                {isFetchingSearchedNextPage && (
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
                User not found
              </p>
            )
          ) : suggestedUsers?.length ? (
            <>
              <GridUserList users={suggestedUsers} />
              {hasSuggestedNextPage && <div ref={observerRef} />}
              {isFetchingSuggestedNextPage && (
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
              No suggested users
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllUsers
