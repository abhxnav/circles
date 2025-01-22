import {
  fetchPopularPosts,
  fetchRecentPosts,
  searchPosts,
} from '@/actions/posts.actions'
import {
  fetchRandomUsers,
  isFollowing,
  searchUsers,
} from '@/actions/users.actions'
import { useUserContext } from '@/context/UserContext'
import { QUERY_KEYS } from '@/graphql/queryKeys'
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

export const useFetchRandomUsers = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RANDOM_USERS, userId],
    queryFn: () => fetchRandomUsers(userId),
    staleTime: 0,
    retry: 3,
  })
}

export const useSearchUsers = (searchTerm: string) => {
  const { user } = useUserContext()

  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_USERS, searchTerm],
    queryFn: () => searchUsers(searchTerm, user?.id),
    enabled: !!searchTerm,
    staleTime: 0,
    retry: 3,
  })
}

export const useIsFollowing = (followerId: string, followeeId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.IS_FOLLOWING, followerId, followeeId],
    queryFn: () => isFollowing({ followerId, followeeId }),
  })
}
