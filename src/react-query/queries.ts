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

// Custom hook to fetch recent posts.
export const useFetchRecentPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS], // Cache key for recent posts.
    queryFn: fetchRecentPosts, // Function to fetch recent posts.
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined, // Determines the next page parameter.
    initialPageParam: null,
  })
}

// Custom hook to fetch popular posts.
export const useFetchPopularPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_POPULAR_POSTS], // Cache key for popular posts.
    queryFn: fetchPopularPosts, // Function to fetch popular posts.
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined, // Determines the next page parameter.
    initialPageParam: null,
  })
}

// Custom hook to search posts by a search term.
export const useSearchPosts = (searchTerm: string) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm], // Cache key including the search term.
    queryFn: ({ pageParam }) => searchPosts({ searchTerm, pageParam }), // Function to search posts.
    enabled: !!searchTerm, // Ensures the query runs only if a search term is provided.
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined, // Determines the next page parameter.
    initialPageParam: null,
  })
}

// Custom hook to fetch random users excluding the current user.
export const useFetchRandomUsers = (userId: string) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_RANDOM_USERS, userId], // Cache key with the current user's ID.
    queryFn: ({ pageParam }) => fetchRandomUsers({ userId, pageParam }), // Function to fetch random users.
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined, // Determines the next page parameter.
    initialPageParam: null,
  })
}

// Custom hook to search users by a search term.
export const useSearchUsers = (searchTerm: string) => {
  const {
    user: { id: userId }, // Extract the current user's ID from the context.
  } = useUserContext()

  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.SEARCH_USERS, searchTerm], // Cache key including the search term.
    queryFn: ({ pageParam }) => searchUsers({ searchTerm, userId, pageParam }), // Function to search users.
    enabled: !!searchTerm, // Ensures the query runs only if a search term is provided.
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined, // Determines the next page parameter.
    initialPageParam: null,
  })
}

// Custom hook to check if a user is following another user.
export const useIsFollowing = (followerId: string, followeeId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.IS_FOLLOWING, followerId, followeeId], // Cache key with follower and followee IDs.
    queryFn: () => isFollowing({ followerId, followeeId }), // Function to check the follow status.
  })
}

// Custom hook to fetch details of a specific user.
export const useFetchUserDetails = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FETCH_USER_DETAILS, userId], // Cache key with the user ID.
    queryFn: () => FetchUserDetails(userId), // Function to fetch user details.
    enabled: !!userId, // Ensures the query runs only if a user ID is provided.
    staleTime: 0, // No stale time; the query will be refetched immediately when invalidated.
  })
}

// Custom hook to fetch posts by a specific user.
export const useFetchUserPosts = (authorId: string) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.USER_POSTS, authorId], // Cache key with the author's ID.
    queryFn: ({ pageParam }) => fetchUserPosts({ authorId, pageParam }), // Function to fetch the user's posts.
    enabled: !!authorId, // Ensures the query runs only if an author ID is provided.
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined, // Determines the next page parameter.
    initialPageParam: null,
  })
}
