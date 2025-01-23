import {
  fetchPopularPosts,
  fetchRecentPosts,
  fetchUserPosts,
  searchPosts,
} from '@/actions/posts.actions'
import {
  fetchRandomUsers,
  FetchUserDetails,
  isFollowing,
  searchUsers,
} from '@/actions/users.actions'
import { useUserContext } from '@/context/UserContext'
import { QUERY_KEYS } from '@/graphql/queryKeys'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

export const useFetchRecentPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: fetchRecentPosts,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined,
  })
}

export const useFetchPopularPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_POPULAR_POSTS],
    queryFn: fetchPopularPosts,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined,
  })
}

export const useSearchPosts = (searchTerm: string) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: ({ pageParam }) => searchPosts({ searchTerm, pageParam }),
    enabled: !!searchTerm,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined,
  })
}

export const useFetchRandomUsers = (userId: string) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_RANDOM_USERS, userId],
    queryFn: ({ pageParam }) => fetchRandomUsers({ userId, pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined,
  })
}

export const useSearchUsers = (searchTerm: string) => {
  const {
    user: { id },
  } = useUserContext()

  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.SEARCH_USERS, searchTerm],
    queryFn: ({ pageParam }) => searchUsers({ searchTerm, id, pageParam }),
    enabled: !!searchTerm,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined,
  })
}

export const useIsFollowing = (followerId: string, followeeId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.IS_FOLLOWING, followerId, followeeId],
    queryFn: () => isFollowing({ followerId, followeeId }),
  })
}

export const useFetchUserDetails = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FETCH_USER_DETAILS, userId],
    queryFn: () => FetchUserDetails(userId),
    enabled: !!userId,
    staleTime: 0,
  })
}

export const useFetchUserPosts = (authorId: string) => {
  return useQuery({
    queryKey: ['user-posts', authorId],
    queryFn: () => fetchUserPosts(authorId),
    enabled: !!authorId,
    staleTime: 10 * 60 * 1000,
  })
}
