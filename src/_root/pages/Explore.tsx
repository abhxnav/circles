import { GridPostList, Header, SearchResults } from '@/components'
import { Input } from '@/components/ui'
import { useFetchPopularPosts } from '@/react-query/queries'
import { useEffect, useState } from 'react'

const Explore = () => {
  const [searchValue, setSearchValue] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const { data: popularPosts, isLoading: isPostLoading } =
    useFetchPopularPosts()

  useEffect(() => {
    if (searchValue !== '') {
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }, [searchValue])

  return (
    <div className="flex flex-col flex-1 items-center overflow-scroll py-10 px-4 md:px-8 lg:p-14 scrollbar-styled min-h-[calc(100vh-108px)]">
      <div className="max-w-screen-md flex flex-col items-center w-full gap-6 md:gap-9">
        <Header title="Explore" iconUrl="/assets/icons/explore.svg" />
        <div className="flex items-center justify-center gap-1 px-4 md:py-2 w-full rounded-lg bg-dark-secondary">
          <img
            src="/assets/icons/search.svg"
            alt="search"
            className="size-4 md:size-6"
          />
          <Input
            type="text"
            placeholder="Search posts"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-dark-secondary border-none text-sm md:text-base placeholder:text-light-muted text-light-secondary focus-visible:ring-0 focus-visible:ring-offset-0 ring-offset-0"
          />
        </div>

        <div className="flex items-center justify-between w-full max-w-5xl">
          <h3 className="font-bold md:text-2xl text-light-primary">
            Popular Today
          </h3>

          <div className="flex items-center justify-center gap-2 bg-dark-secondary rounded-sm px-2 py-1 md:px-3 md:py-2 md:rounded-md cursor-pointer">
            <p className="text-xs md:text-base font-semibold text-light-muted">
              All
            </p>
            <img
              src="/assets/icons/filter.svg"
              alt="filter"
              className="size-4"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-9 w-full max-w-5xl">
          {showSearchResults ? (
            <SearchResults />
          ) : isPostLoading ? (
            <p className="text-white">Loading</p>
          ) : popularPosts ? (
            <GridPostList posts={popularPosts} />
          ) : (
            <p className="text-light-muted text-center">No posts today</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Explore
