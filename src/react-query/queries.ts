import { fetchRecentPosts } from '@/actions/posts.actions'
import { QUERY_KEYS } from '@/graphql/posts/queryKeys'
import { useQuery } from '@tanstack/react-query'

export const useFetchRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: fetchRecentPosts,
    staleTime: 10 * 60 * 1000, // Cache data for 10 minutes
    retry: 3,
  })
}
