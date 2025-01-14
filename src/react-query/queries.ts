import {
  fetchPopularPosts,
  fetchRecentPosts,
  searchPosts,
} from '@/actions/posts.actions'
import { QUERY_KEYS } from '@/graphql/posts/queryKeys'
import { useQuery } from '@tanstack/react-query'

export const useFetchRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: fetchRecentPosts,
    retry: 3,
  })
}

export const useFetchPopularPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POPULAR_POSTS],
    queryFn: fetchPopularPosts,
    retry: 3,
  })
}

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  })
}
