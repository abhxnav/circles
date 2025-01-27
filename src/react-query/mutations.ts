import { login, logout, signUpUser } from '@/actions/auth.actions'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createMentions,
  createPost,
  deletePost,
  likePost,
  unlikePost,
} from '@/actions/posts.actions'
import { QUERY_KEYS } from '@/graphql/queryKeys'
import { followUser, unfollowUser } from '@/actions/users.actions'
import { useUserContext } from '@/context/UserContext'
import { useNavigate } from 'react-router-dom'

// Handles user sign-up mutation
export const useSignUpUser = () => {
  return useMutation({
    mutationFn: signUpUser, // Calls the signUpUser function for server interaction
  })
}

// Handles user login mutation
export const useLogin = () => {
  const { checkAuthUser } = useUserContext()

  return useMutation({
    mutationFn: login, // Calls the login function
    onSuccess: async () => {
      // Fetch and update user data immediately after login
      await checkAuthUser()
    },
  })
}

// Handles user logout mutation
export const useLogout = () => {
  return useMutation({
    mutationFn: logout, // Calls the logout function
  })
}

// Manages post creation and refreshes related data after success
export const useCreatePost = () => {
  const queryClient = useQueryClient() // React Query cache manager

  return useMutation({
    mutationFn: createPost, // Calls the createPost action
    onSuccess: () => {
      // Invalidate relevant queries to fetch the latest posts
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POPULAR_POSTS],
      })
    },
  })
}

// Manages mention creation and refreshes post data
export const useCreateMentions = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMentions, // Calls the createMentions action
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POPULAR_POSTS],
      })
    },
  })
}

// Handles post deletion with optimistic updates
export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePost, // Calls the deletePost action
    onMutate: async (postId) => {
      // Cancel ongoing fetches for recent posts
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })

      // Snapshot the previous state of recent posts
      const previousPosts = queryClient.getQueryData([
        QUERY_KEYS.GET_RECENT_POSTS,
      ])

      // Optimistically update the cache by removing the deleted post
      queryClient.setQueryData([QUERY_KEYS.GET_RECENT_POSTS], (oldPosts: any) =>
        oldPosts?.filter((post: any) => post.id !== postId)
      )

      return { previousPosts } // Return the snapshot for rollback
    },
    onError: (error, postId, context) => {
      // Roll back to the previous cache state in case of an error
      queryClient.setQueryData(
        [QUERY_KEYS.GET_RECENT_POSTS],
        context?.previousPosts
      )
      console.error('Error deleting post:', error)
    },
  })
}

// Handles liking a post and refreshing related data
export const useLikePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: likePost, // Calls the likePost action
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] })
    },
  })
}

// Handles unliking a post and refreshing related data
export const useUnlikePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unlikePost, // Calls the unlikePost action
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] })
    },
  })
}

// Handles user follow mutation and refreshes user-related queries
export const useFollowUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: followUser, // Calls the followUser action
    onSuccess: () => {
      // Refresh various user-related queries after following
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FOLLOWERS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FOLLOWING] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RANDOM_USERS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEARCH_USERS] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FETCH_USER_DETAILS],
      })
    },
  })
}

// Handles user unfollow mutation and refreshes user-related queries
export const useUnfollowUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unfollowUser, // Calls the unfollowUser action
    onSuccess: () => {
      // Refresh various user-related queries after unfollowing
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FOLLOWERS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FOLLOWING] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RANDOM_USERS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEARCH_USERS] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FETCH_USER_DETAILS],
      })
    },
  })
}
