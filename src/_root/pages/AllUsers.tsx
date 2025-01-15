import { GridUserList, Header, SearchPeopleSkeleton } from '@/components'
import { Input } from '@/components/ui'
import { useFetchRandomusers, useSearchUsers } from '@/react-query/queries'
import { useEffect, useState } from 'react'

const AllUsers = () => {
  const [inputValue, setInputValue] = useState('') // Immediate input from user
  const [searchValue, setSearchValue] = useState('') // Debounced value
  const [showSearchResults, setShowSearchResults] = useState(false)

  const { data: suggestedUsers, isLoading: isSuggestedUsersLoading } =
    useFetchRandomusers()
  const { data: searchedUsers, isLoading: isSearchedUsersLoading } =
    useSearchUsers(searchValue)

  useEffect(() => {
    if (searchValue.length) {
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }, [searchValue])

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setSearchValue(inputValue.trim())
    }, 500)

    return () => clearTimeout(debounceTimeout)
  }, [inputValue])

  return (
    <div className="flex flex-col flex-1 items-center overflow-scroll py-4 px-4 md:py-8 md:px-8 lg:p-14 scrollbar-styled min-h-[calc(100vh-108px)]">
      <div className="max-w-screen-md flex flex-col items-center w-full gap-6 md:gap-9">
        <Header title="People" iconUrl="/assets/icons/people.svg" />

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
              <GridUserList users={searchedUsers} />
            ) : (
              <p className="text-light-muted text-center text-sm w-full">
                User not found
              </p>
            )
          ) : suggestedUsers?.length ? (
            <GridUserList users={suggestedUsers} />
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
